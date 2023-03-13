import { AppServer } from '../../types';
export interface LoginRequest {
  username: string;
  password: string;
}
declare function authRoutes(fastify: AppServer): Promise<void>;
export default authRoutes;
//# sourceMappingURL=auth.d.ts.map
