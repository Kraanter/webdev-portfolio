/* eslint-disable indent */
import jwt from '@fastify/jwt';
import { FastifyInstance } from 'fastify';
import { AppServer, UserData } from '../../types';

export async function addJWT(fastify: FastifyInstance) {
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

async function isTokenOfType(token: string, fastify: AppServer, type: number) {
  const pgClient = fastify.pg;
  pgClient.connect();
  const decoded = (await fastify.jwt.verify(token)) as UserData;

  const query = (function () {
    switch (type) {
      case 0:
        return 'SELECT * FROM users WHERE id = $1';
      case 1:
        return 'SELECT * FROM students WHERE id = $1';
      default:
        throw new Error('Invalid type');
    }
  })();

  const { rows } = await pgClient.query(query, [decoded.id]);
  if (rows.length === 0 || decoded.type !== type) {
    return false;
  }
  return decoded;
}

export async function isStudentToken(token: string, fastify: AppServer) {
  const decoded = await isTokenOfType(token, fastify, 1);
  console.log(decoded);
  if (decoded === false || decoded.type !== 1) {
    return false;
  }
  return decoded;
}

export async function isDocentToken(token: string, fastify: AppServer) {
  const decoded = await isTokenOfType(token, fastify, 0);
  if (decoded === false || decoded.type !== 0) {
    return false;
  }
  return decoded;
}
