import { PostgresDb } from '@fastify/postgres';
import { GroupData, SessionData, StudentData, StudentLoginRequest } from '../types';

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

export async function registerStudent({ username, code }: StudentLoginRequest, client: DatabaseClient) {
  const { rows } = await client.query('SELECT code FROM groups WHERE code = $1', [code]);
  if (rows.length === 0) throw new Error('Group does not exist');

  const { rows: studentRows } = await client.query('SELECT * FROM students WHERE username = $1 AND group_code = $2', [
    username,
    rows[0].code,
  ]);
  if (studentRows.length > 0) {
    throw new Error('Student already exists');
  }

  // Insert student into database if it doesn't exist
  const { rows: insertRows } = await client.query(
    'INSERT INTO students (username, group_code) VALUES ($1, $2) RETURNING *',
    [username, rows[0].code]
  );
  return insertRows[0] as StudentData;
}

export async function createSession({ student_id, token }: SessionData, client: DatabaseClient) {
  const { rows } = await client.query('SELECT * FROM sessions WHERE student_id = $1', [student_id]);
  if (rows.length > 0) {
    // Update session
    const { rows: updateRows } = await client.query(
      'UPDATE sessions SET token = $1, last_updated = now() WHERE student_id = $2 RETURNING *',
      [token, student_id]
    );
    return updateRows[0] as SessionData;
  }
  const { rows: insertRows } = await client.query(
    'INSERT INTO sessions (student_id, token) VALUES ($1, $2) RETURNING *',
    [student_id, token]
  );
  return insertRows[0] as SessionData;
}

export async function getSession(token: string, client: DatabaseClient) {
  const { rows } = await client.query('SELECT * FROM sessions WHERE token = $1', [token]);
  if (rows.length === 0) return null;
  return rows[0] as SessionData;
}

export async function removeSession(token: string, client: DatabaseClient) {
  const resp = await client.query('DELETE FROM sessions WHERE token = $1 RETURNING *', [token]);
  const { rows } = resp;
  if (rows.length === 0) return null;
  const { rows: studentRows } = await client.query('DELETE FROM students WHERE id = $1 RETURNING *', [
    rows[0].student_id,
  ]);

  return { session: rows[0], student: studentRows[0] };
}
