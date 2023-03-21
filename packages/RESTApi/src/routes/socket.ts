import { AppServer, UserData } from '../../types';

export async function socketRoutes(fastify: AppServer) {
  const client = fastify.pg;
  client.connect();

  fastify.get('/socket', { websocket: true }, async (connection, req) => {
    console.log('connected');

    // Get the user id from the cookie
    const { id } = (req.user as UserData) || { id: 0 };

    console.log(id);

    connection.socket.on('open', () => console.log('opened'));

    connection.socket.on('message', async (message: string) => {
      console.log(message);
      const { id } = JSON.parse(message);
      console.log(id);
      try {
        // const { rows } = await client.query('SELECT * FROM groups WHERE creator_id = $1', [id]);
        // connection.socket.send(JSON.stringify((rows as GroupData[]) || []));
        connection.socket.send(JSON.stringify([]));
      } catch (err) {
        connection.socket.send(JSON.stringify([]));
      }
    });
  });
}
