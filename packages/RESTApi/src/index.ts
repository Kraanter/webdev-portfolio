import fastifyCookie from '@fastify/cookie';
import fastifyPostgres from '@fastify/postgres';
import { config } from 'dotenv';
import Fastify from 'fastify';
import fastifySocketIO from 'fastify-socket.io';
import { ServerOptions } from 'socket.io';
import { UserData } from '../types';
import addJWT from './plugins/jwt-token';
import authRoutes from './routes/auth';
import { groupRoutes } from './routes/group';
import { socketRoutes } from './routes/socket';
import { studentRoutes } from './routes/student';
import { puppeteerSocketServer } from './utils/puppeteer';
config();

const fastify = Fastify({
  // only log info
  // logger: {
  //   level: 'info',
  // },
  // logger: {
  //   serializers: {
  //     req: (req) => ({
  //       method: req.method,
  //       url: req.url,
  //       headers: req.headers,
  //     }),
  //     res: (res) => ({
  //       statusCode: res.statusCode,
  //     }),
  //   },
  // },
  logger: true,
});

function socketOptions(): Partial<ServerOptions> {
  const opts: Partial<ServerOptions> = {
    path: '/browser-streamer',
  };

  opts.cors = {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  };

  opts.cookie = {
    name: 'student_token',
    domain: '/',
    httpOnly: true,
  };

  return opts;
}

fastify.register(fastifySocketIO, socketOptions());
fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET_KEY,
  hook: 'onRequest',
});

// initialize fastifyPostgres
fastify.register(fastifyPostgres, {
  connectionString: process.env.CONNECTION_STRING,
});

addJWT(fastify);

fastify.register(authRoutes);

fastify.register(groupRoutes);

fastify.register(studentRoutes);

fastify.register(socketRoutes);

fastify.addHook('preHandler', async (request) => {
  // add user data to request
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { token, student_token } = request.cookies;
  try {
    const decoded = (await fastify.jwt.verify(student_token ?? token ?? '')) as UserData;
    console.log('decoded', decoded);
    decoded.token = token ?? '';
    request.user = decoded;
  } catch (err) {
    // do nothing
  }
});

fastify.ready().then(() => {
  puppeteerSocketServer(fastify);
});

const PORT = parseInt(process.env.PORT ?? '3000');

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
