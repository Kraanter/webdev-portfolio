import fastifyCookie from '@fastify/cookie';
import fastifyPostgres from '@fastify/postgres';
import fastifySocket from '@fastify/websocket';
import { config } from 'dotenv';
import Fastify from 'fastify';
import { UserData } from '../types';
import addJWT from './plugins/jwt-token';
import authRoutes from './routes/auth';
import { groupRoutes } from './routes/group';
import { socketRoutes } from './routes/socket';
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
});

fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET_KEY,
  hook: 'onRequest',
});

// initialize fastifyPostgres
fastify.register(fastifyPostgres, {
  connectionString: process.env.CONNECTION_STRING,
});

fastify.register(fastifySocket, {
  options: {
    maxPayload: 1048576,
  },
});

addJWT(fastify);

fastify.register(authRoutes);

fastify.register(groupRoutes);

fastify.register(studentRoutes);

fastify.register(socketRoutes);

fastify.addHook('preHandler', async (request) => {
  // add user data to request
  const { token } = request.cookies;
  try {
    const decoded = (await fastify.jwt.verify(token ?? '')) as UserData;
    request.user = decoded;
  } catch (err) {
    // do nothing
  }
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
