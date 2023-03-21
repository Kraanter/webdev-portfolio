'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.groupRoutes = void 0;
const database_1 = require('../database');
const groupCode_1 = require('../tools/groupCode');
async function groupRoutes(fastify) {
  const client = fastify.pg;
  client.connect();
  fastify.get('/groups', async (request, reply) => {
    try {
      const { id } = request.user;
      console.log(id);
      const { rows } = await client.query('SELECT * FROM groups WHERE creator_id = $1', [id]);
      reply.send(rows || []);
    } catch (err) {
      console.error(err);
      reply.send([]);
    }
  });
  fastify.post('/groups', async (request, reply) => {
    const { name } = request.query;
    // generate a random 4-character string using letters and numbers
    const code = await (0, groupCode_1.generateGroupCode)(client);
    const { id: userId } = request.user;
    // create a new group
    const group = await (0, database_1.createGroup)({ name, code, online: 0 }, userId, client);
    if (!group) {
      reply.code(500).send({ error: 'Could not create group' });
      return;
    }
    reply.send(group);
  });
}
exports.groupRoutes = groupRoutes;
//# sourceMappingURL=group.js.map
