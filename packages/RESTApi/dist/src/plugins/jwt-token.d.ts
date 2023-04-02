import { FastifyInstance } from 'fastify';
import { AppServer } from '../../types';
export declare function addJWT(fastify: FastifyInstance): Promise<void>;
export declare function isStudentToken(token: string, fastify: AppServer): Promise<false | import("../../types").StudentData>;
export declare function isDocentToken(token: string, fastify: AppServer): Promise<false | import("../../types").DocentData>;
//# sourceMappingURL=jwt-token.d.ts.map