import { parse } from 'cookie';
import { AppServer } from '../../../types';
import { isStudentToken } from '../../plugins/jwt-token';
import { puppeteerSocketServer } from '../puppeteer';

export async function socketRoutes(fastify: AppServer) {
  const pgClient = fastify.pg;
  pgClient.connect();

  fastify.io.on('connection', async (client) => {
    const cookies = parse(client.request.headers.cookie ?? '');

    if (!('x-role' in client.request.headers) && 'student_token' in cookies) {
      const token = cookies.student_token;
      const decoded = await isStudentToken(token, fastify);
      if (decoded === false) {
        client.disconnect();
        return;
      }
      client.emit('connected', 'connected');
      puppeteerSocketServer(client, pgClient, decoded);
    } else if ('token' in cookies) {
      // const token = cookies.token;
      // const decoded = await isDocentToken(token, fastify);
      // if (decoded === false) {
      // client.disconnect();
      // return;
      // }
      client.emit('connected', 'connected');

      client.on('join', async ({ token }) => {
        if (!token) {
          return;
        }

        client.join(token);
      });

      client.on('view', async ({ id }) => {
        client.rooms.forEach((i) => {
          client.leave(i);
        });
        const { rows } = await pgClient.query('SELECT * FROM sessions WHERE student_id = $1', [id]);
        if (rows.length === 0) {
          return;
        }
        const { token } = rows[0];
        client.join(token);
      });
    }
  });
}
