import { FastifyInstance, FastifyLoggerInstance, FastifyTypeProviderDefault } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Http2SecureServer, Http2ServerRequest, Http2ServerResponse } from 'http2';

export interface LoginRequest {
  username: string;
  password: string;
}

type AuthRepsonse =
  | {
      decoded: any;
      authenticated: true;
    }
  | {
      authenticated: false;
      message: string;
    };

export interface UserData {
  id: string;
  username: string;
}

export interface LoginResponse {
  token: string;
  user: UserData;
}

type _AppServer = FastifyInstance<
  Http2SecureServer | Server,
  Http2ServerRequest | IncomingMessage,
  Http2ServerResponse | ServerResponse,
  FastifyLoggerInstance,
  FastifyTypeProviderDefault
>;

export type AppServer = _AppServer;

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT: string;
      HOST: string;
      SECRET_KEY: string;
      COOKIE_SECRET_KEY: string;
      CONNECTION_STRING: string;
    }
  }
}
