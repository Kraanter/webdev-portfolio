import { parse } from 'cookie';
import { AppServer } from '../../../types';
import { isDocentToken, isStudentToken } from '../../plugins/jwt-token';
import { puppeteerSocketServer } from '../puppeteer';

export async function socketRoutes(fastify: AppServer) {
  const pgClient = fastify.pg;
  pgClient.connect();

  fastify.io.on('connection', async (client) => {
    const cookies = parse(client.request.headers.cookie ?? '');

    if ('student_token' in cookies) {
      const token = cookies.student_token;
      const decoded = await isStudentToken(token, fastify);
      if (decoded === false) {
        client.disconnect();
        return;
      }
      console.log('👨🏻‍🎓: Student connected', decoded.username, 'to group', decoded);
      client.emit('connected', 'connected');
      puppeteerSocketServer(client, pgClient, decoded);
      return;
    }
    if ('token' in cookies) {
      const token = cookies.token;
      const decoded = await isDocentToken(token, fastify);
      if (decoded === false) {
        client.disconnect();
        return;
      }
      console.log('👨🏻‍🏫: Docent connected', decoded.username);

      client.on('join', async ({ token }) => {
        if (!token) {
          return;
        }

        client.join(token);
        console.log('👨🏻‍🏫: Docent joined room', token);
      });
      return;
    }
    client.disconnect();
    return;
  });
}
