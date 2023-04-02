import { FastifyInstance, FastifyLoggerInstance, FastifyTypeProviderDefault } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Http2SecureServer, Http2ServerRequest, Http2ServerResponse } from 'http2';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface StudentLoginRequest {
  code: string;
  username: string;
}

export interface SessionData {
  student_id: string | number;
  token: string;
}

type AuthRepsonse =
  | {
      decoded: UserData;
      authenticated: true;
    }
  | {
      authenticated: false;
      message: string;
    };

export enum UserType {
  Docent = 0,
  Student = 1,
}

interface UserDataBase {
  id: string | number;
  username: string;
  type: UserType;
  token: string;
  iat?: number;
}

export interface DocentData extends UserDataBase {
  type: UserType.Docent;
}

export interface StudentData extends UserDataBase {
  type: UserType.Student;
  group_code: string;
}

export type UserData = DocentData | StudentData;

export interface GroupData {
  name: string;
  code: string;
  online: number;
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
