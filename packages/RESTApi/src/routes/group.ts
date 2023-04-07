import { AppServer, GroupData, UserData } from '../../types';
import { createGroup } from '../database';
import { generateGroupCode } from '../tools/groupCode';

export async function groupRoutes(fastify: AppServer) {
  const client = fastify.pg;
  client.connect();

  fastify.get('/groups', async (request, reply) => {
    try {
      const { id } = request.user as UserData;
      if (!id) reply.send([]);
      const query = id !== 1 ? 'SELECT * FROM groups WHERE creator_id = $1' : 'SELECT * FROM groups WHERE $1 = $1';
      const { rows } = await client.query(query, [id]);
      reply.send((rows as GroupData[]) || []);
    } catch (err) {
      reply.send([]);
    }
  });

  fastify.get('/groups/:code', async (request, reply) => {
    const { code } = request.params as { code: string };
    const { rows } = await client.query(
      'SELECT count(*) FROM students JOIN sessions ON students.id = sessions.student_id where group_code = $1',
      [code]
    );
    const group = rows[0] as { count: number };

    reply.send({ online: group.count });
  });

  fastify.get('/groups/:code/students', async (request, reply) => {
    const { code } = request.params as { code: string };
    const { rows } = await client.query(
      'SELECT students.username, students.id FROM students JOIN sessions ON students.id = sessions.student_id where group_code = $1',
      [code]
    );

    reply.send(rows);
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
