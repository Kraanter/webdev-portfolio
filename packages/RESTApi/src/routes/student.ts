import { AppServer, AuthRepsonse, StudentLoginRequest, UserData } from 'types';
import { createSession, registerStudent } from '../database';

export async function studentRoutes(fastify: AppServer) {
  const client = fastify.pg;
  client.connect();

  fastify.post('/student/auth', async (request, reply) => {
    const user = request.user as UserData;
    if (user && 'type' in user && user.type === 1) {
      const resp: AuthRepsonse = { decoded: user, authenticated: true };
      // check if student is in database
      const { rows } = await client.query('SELECT * FROM students WHERE id = $1', [user.id]);
      if (rows.length !== 0) {
        reply.send(resp);
        return;
      }
    }
    reply.clearCookie('student_token');
    reply.send({ authenticated: false, message: 'Invalid token' });
  });

  fastify.get('/student/logout', async (request, reply) => {
    reply.clearCookie('student_token');
    reply.send();
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
      const message = (err as Error).message ?? 'Internal Server Error';
      reply.status(500).send({ message });
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
}
