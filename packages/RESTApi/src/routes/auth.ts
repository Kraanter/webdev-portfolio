import { compare, hash } from 'bcrypt';
import { AppServer, AuthRepsonse, LoginRequest, LoginResponse, UserData } from '../../types';

async function authRoutes(fastify: AppServer) {
  const client = fastify.pg;
  client.connect();

  fastify.post('/auth', async (request, reply) => {
    const user = request.user as UserData;
    if ('type' in user && user.type === 0) {
      const resp: AuthRepsonse = { decoded: user, authenticated: true };
      reply.send(resp);
      return;
    }
    reply.send({ authenticated: false, message: 'Invalid token' });
  });

  fastify.get('/logout', async (request, reply) => {
    reply.clearCookie('token');
    reply.send();
  });

  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body as LoginRequest;

    const { rows } = await client.query('SELECT * FROM users WHERE username = $1', [username.toLowerCase()]);

    // compare password with hashed password
    const isMatch = await compare(password, rows[0].password_hash);

    // if password matches, generate token and send it back
    if (isMatch) {
      const user: UserData = {
        id: rows[0].id,
        username: rows[0].username,
        token: '',
        type: 0,
      };
      const token = fastify.jwt.sign(user);

      const replyData: LoginResponse = { token, user };

      // add token to cookie
      reply.setCookie('token', token, {
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 2, // 2 hours in milliseconds
      });

      reply.send(replyData);
    } else {
      reply.code(401).send({ message: 'Invalid username or password' });
    }
  });

  fastify.post('/register', async (request, reply) => {
    const { username, password } = request.body as LoginRequest;

    // hash password using bcrypt
    const hashedPassword = await hash(password, 10);

    const { rows } = await client.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username.toLowerCase(), hashedPassword]
    );

    if (rows.length === 0) {
      reply.code(401).send({ message: 'Invalid username or password' });
    } else {
      const token = fastify.jwt.sign(rows[0]);
      const user: UserData = {
        id: rows[0].id,
        username: rows[0].username,
        token: token,
        type: 0,
      };
      const replyData: LoginResponse = { token, user };

      // add token to cookie
      reply.setCookie('token', token, {
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      reply.send(replyData);
    }
  });
}

export default authRoutes;
