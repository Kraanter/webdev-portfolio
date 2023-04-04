import fastifyCookie from '@fastify/cookie';
import fastifyPostgres from '@fastify/postgres';
import { config } from 'dotenv';
import Fastify from 'fastify';
import fastifySocketIO from 'fastify-socket.io';
import { ServerOptions } from 'socket.io';
import { UserData } from '../types';
import { addJWT } from './plugins/jwt-token';
import authRoutes from './routes/auth';
import { groupRoutes } from './routes/group';
import { socketRoutes } from './routes/socket/socket';
import { studentRoutes } from './routes/student';
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
  // https: {
  //   key: readFileSync('./certs/privkey.pem'),
  //   cert: readFileSync('./certs/fullchain.pem')
  // }
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

const JWTTOKENTIME = 60 * 60 * 2;

fastify.addHook('onRequest', async (request, response) => {
  // add user data to request
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { token: docent_token, student_token } = request.cookies;
  if (!docent_token && !student_token) {
    request.user = {};
  } else {
    try {
      const isStudent = request.url.toLowerCase().indexOf('/student') !== -1;
      const token = (isStudent ? student_token : docent_token) ?? '';
      if (token) {
        const decoded = (await fastify.jwt.verify(token)) as UserData;
        if ((decoded.iat ?? 0) < Date.now() / 1000 - JWTTOKENTIME) {
          console.log('Token expired');
          request.user = {};
          response.clearCookie(isStudent ? 'student_token' : 'token');
        } else {
          request.user = decoded;
        }
      }
    } catch (err) {
      // do nothing
      console.log('err', err);
      response.clearCookie('token');
      request.user = {};
    }
  }
});

fastify.ready().then(() => {
  socketRoutes(fastify);
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
