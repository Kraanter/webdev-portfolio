/* eslint-disable indent */
import jwt from '@fastify/jwt';
// import { FastifyInstance } from 'fastify';
import { AppServer, UserData } from '../../types';

export async function addJWT(fastify: any) {
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
  const decoded = (await fastify.jwt.verify(token)) as UserData;

  // const query = (function () {
  //   switch (type) {
  //     case 0:
  //       return 'SELECT * FROM users WHERE id = $1';
  //     case 1:
  //       return 'SELECT * FROM students WHERE id = $1';
  //     default:
  //       throw new Error('Invalid type');
  //   }
  // })();

  // const pgClient = fastify.pg;
  // pgClient.connect();
  // const { rows } = await pgClient.query(query, [decoded.id]);
  // console.log(rows);
  // if (rows.length === 0 || decoded.type !== type) {
  if (decoded.type !== type) {
    return false;
  }
  return decoded;
}

export async function isStudentToken(token: string, fastify: AppServer) {
  const decoded = await isTokenOfType(token, fastify, 1);
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
