import { AppServer, StudentLoginRequest } from '../../types';
import { createSession, registerStudent, removeSession } from '../database';

export async function studentRoutes(fastify: AppServer) {
  const client = fastify.pg;
  client.connect();

  fastify.post('/student/login', async (request, reply) => {
    try {
      const body = request.body as StudentLoginRequest;

      const data = await registerStudent(body, client);

      console.log('data', data);

      const token = fastify.jwt.sign(data);

      // create a cookie with studen token
      reply.setCookie('student_token', token, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 1,
      });

      reply.send({ token });
    } catch (err) {
      console.log(err);
      reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  fastify.post('/student/session', async (request, reply) => {
    try {
      // get token from cookie
      const token = request.cookies['student_token'] ?? '';

      // Get student from token
      const session = (await fastify.jwt.verify(token)) as { id: string };

      // Create a new session
      const newSession = await createSession({ token, student_id: session.id }, client);

      if (newSession.token !== token) {
        reply.setCookie('student_token', newSession.token, {
          path: '/',
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 1,
        });
      }

      reply.send(newSession);
    } catch (err) {
      console.log(err);
      reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  fastify.delete('/student/session', async (request, reply) => {
    try {
      const { token } = request.body as { token: string };

      const session = await removeSession(token, client);

      reply.send(session);
    } catch (err) {
      console.log(err);
      reply.status(500).send({ message: 'Internal Server Error' });
    }
  });
}
