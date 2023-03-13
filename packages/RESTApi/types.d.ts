import { FastifyInstance, FastifyLoggerInstance, FastifyTypeProviderDefault } from 'fastify';
import { Http2SecureServer, Http2ServerRequest, Http2ServerResponse } from 'http2';
import { IncomingMessage, Server, ServerResponse } from 'http';

type _AppServer = FastifyInstance<
  Http2SecureServer | Server,
  Http2ServerRequest | IncomingMessage,
  Http2ServerResponse | ServerResponse,
  FastifyLoggerInstance,
  FastifyTypeProviderDefault
>;

export type AppServer = _AppServer

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