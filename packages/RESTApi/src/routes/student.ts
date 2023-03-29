import { AppServer, AuthRepsonse, StudentLoginRequest, UserData } from 'types';
import { createSession, registerStudent, removeSession } from '../database';

export async function studentRoutes(fastify: AppServer) {
  const client = fastify.pg;
  client.connect();

  fastify.post('/student/auth', async (request, reply) => {
    const user = request.user as UserData;
    if (user && 'type' in user && user.type === 1) {
      const resp: AuthRepsonse = { decoded: user, authenticated: true };
      reply.send(resp);
      return;
    }
    reply.send({ authenticated: false, message: 'Invalid token' });
  });

  fastify.post('/student/login', async (request, reply) => {
    try {
      const body = request.body as StudentLoginRequest;

      const data = await registerStudent(body, client);

      const token = fastify.jwt.sign({
        ...data,
        type: 1,
        token: '',
      } as UserData);

      // create a cookie with studen token
      reply.setCookie('student_token', token, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 1,
      });

      const response = {
        authenticated: true,
        decoded: {
          ...data,
          type: 1,
          token,
        },
      } as AuthRepsonse;
      reply.send(response);
    } catch (err) {
      console.log(err);
      reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  fastify.post('/student/session', async (request, reply) => {
    const token = request.cookies['student_token'];
    if (!token) {
      reply.status(401).send({ message: 'Unauthorized' });
      return;
    }
    try {
      // Get student from token
      const { id } = request.user as UserData;

      // Create a new session
      const newSession = await createSession({ token, student_id: id }, client);

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
