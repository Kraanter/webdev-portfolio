import { PostgresDb } from '@fastify/postgres';
import { Socket } from 'socket.io';
import { StudentData } from '../../types';
export interface MouseLocation {
    x: number;
    y: number;
}
export declare function puppeteerSocketServer(client: Socket, pgClient: PostgresDb, { id: userId, username, group_code }: StudentData): Promise<void>;
//# sourceMappingURL=puppeteer.d.ts.map