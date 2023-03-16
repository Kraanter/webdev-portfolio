import { AppServer, GroupData, UserData } from '../../types';
import { createGroup } from '../database';
import { generateGroupCode } from '../tools/groupCode';

export async function groupRoutes(fastify: AppServer) {
  const client = fastify.pg;
  client.connect();

  fastify.get('/groups', async (request, reply) => {
    try {
      const { id } = request.user as UserData;
      const { rows } = await client.query('SELECT * FROM groups WHERE creator_id = $1', [id]);
      reply.send((rows as GroupData[]) || []);
    } catch (err) {
      reply.send([]);
    }
  });

  fastify.post('/groups', async (request, reply) => {
    const { name } = request.query as GroupData;

    // generate a random 4-character string using letters and numbers
    const code = await generateGroupCode(client);
    const { id: userId } = request.user as UserData;

    // create a new group
    const group = await createGroup({ name, code, online: 0 }, userId, client);
    if (!group) {
      reply.code(500).send({ error: 'Could not create group' });
      return;
    }
    reply.send(group);
  });
}
