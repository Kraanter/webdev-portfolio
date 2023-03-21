import { PostgresDb } from '@fastify/postgres';
import { GroupData, SessionData, StudentData, StudentLoginRequest } from '../types';
type DatabaseClient = PostgresDb;
/**
 * Check if a group code is already in use in the database
 * @param code The group code to check
 * @param client The database client
 * @returns True if the code is already in use, false otherwise
 * @example
 * checkGroupCode('abc', client).then((result) => {
 *  if (result) {
 *   // The code is already in use
 * } else {
 *  // The code is not in use
 * }
 * });
 **/
export declare function checkGroupCode(code: string, client: DatabaseClient): boolean;
/**
 * Create a new group in the database
 * @param {GroupData} group The group data to create.
 * @param {DatabaseClient} client The database client
 * @returns {GroupData} The group data that was created
 * @example
 * createGroup({ name: 'My Group', code: 'abc' }, client).then((group) => {
 * if (group) {
 * // The group was created successfully
 * } else {
 * // There was an error creating the group
 * }
 * });
 **/
export declare function createGroup(
  { name, code }: GroupData,
  userId: number | string,
  client: DatabaseClient
): Promise<any>;
export declare function registerStudent(
  { name, code }: StudentLoginRequest,
  client: DatabaseClient
): Promise<StudentData>;
export declare function createSession({ student_id, token }: SessionData, client: DatabaseClient): Promise<SessionData>;
export declare function getSession(token: string, client: DatabaseClient): Promise<SessionData | null>;
export declare function removeSession(token: string, client: DatabaseClient): Promise<any>;
export {};
//# sourceMappingURL=database.d.ts.map
