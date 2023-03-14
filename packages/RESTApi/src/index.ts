import fastifyCookie from '@fastify/cookie';
import fastifyPostgres from '@fastify/postgres';
import { config } from 'dotenv';
import Fastify from 'fastify';
import addJWT from './plugins/jwt-token';
import authRoutes from './routes/auth';
config();

const fastify = Fastify({
  // only log info
  logger: {
    level: 'info',
  },
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
  // }
});

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
