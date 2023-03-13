import { AppServer } from '../../types';
import { hash, compare } from 'bcrypt';

export interface LoginRequest {
  username: string;
  password: string;
}

type AuthRepsonse = {
  decoded: any;
  authenticated: true;
} | {
  authenticated: false;
  message: string;
}

interface UserData {
  id: string;
  username: string;
}

interface LoginResponse {
  token: string;
  user: UserData;
}

async function authRoutes(fastify: AppServer) {
  const client = fastify.pg;
  client.connect();

  fastify.post('/auth', async (request, reply) => {
    const { token } = request.cookies;

    try {
      const decoded = await fastify.jwt.verify(token ?? '');
      reply.send({ decoded, authenticated: true });
    } catch (err) {
      reply.send({ authenticated: false, message: 'Invalid token' });
    }
  });

  fastify.get('/logout', async (request, reply) => {
    reply.clearCookie('token');
    reply.send();
  });

  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body as LoginRequest;

    const { rows } = await client.query(
      'SELECT * FROM users WHERE username = $1',
      [username.toLowerCase()]
    );

    // compare password with hashed password
    const isMatch = await compare(password, rows[0].password_hash);

    // if password matches, generate token and send it back
    if (isMatch) {
      const token = fastify.jwt.sign({ username });

      const user: UserData = {
        id: rows[0].id,
        username: rows[0].username,
      };
      const replyData: LoginResponse = { token, user };

      // add token to cookie
      reply.setCookie('token', token, {
        secure: true,
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
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
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *',
      [username.toLowerCase(), hashedPassword]
    );

    if (rows.length === 0) {
      reply.code(401).send({ message: 'Invalid username or password' });
    } else {
      const token = fastify.jwt.sign({ username });
      const user: UserData = {
        id: rows[0].id,
        username: rows[0].username,
      };
      const replyData: LoginResponse = { token, user };

      // add token to cookie
      reply.setCookie('token', token, {
        secure: true,
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      reply.send(replyData);
    }
  });
}

export default authRoutes;