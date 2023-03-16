import { PostgresDb } from '@fastify/postgres';
import { GroupData } from '../types';

type DatabaseClient = PostgresDb;

/*
 * This file contains all the database queries used in the REST API.
 */

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
export function checkGroupCode(code: string, client: DatabaseClient) {
  // Check if the code is already in use in the database
  // This assumes you have a database table called "groups" with a column "code"
  const query = 'SELECT code FROM groups WHERE code = $1';

  try {
    const result = client.query(query, [code]);
    return result?.rows?.length > 0;
  } catch (err) {
    console.log('Query error: ', err);
    return false;
  }
}

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
export async function createGroup({ name, code }: GroupData, userId: number | string, client: DatabaseClient) {
  // Create a new group in the database
  const query = 'INSERT INTO groups (name, code, creator_id) VALUES ($1, $2, $3) RETURNING name, code';

  try {
    const result = await client.query(query, [name, code, userId]);
    return result.rows[0];
  } catch (err) {
    console.log('Query error: ', err);
    return null;
  }
}
