import jwt from '@fastify/jwt';
import { FastifyInstance } from 'fastify';

async function addJWT(fastify: FastifyInstance) {
  fastify.register(jwt, {
    secret: process.env.SECRET_KEY,
  });

  fastify.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
}

export default addJWT;