import { PostgresDb } from '@fastify/postgres';
import randomstring from 'randomstring';
import { checkGroupCode } from '../database';

export async function generateGroupCode(client: PostgresDb): Promise<string> {
  // Generate a random 4-character string using letters and numbers
  const code = randomstring.generate({
    length: 4,
    charset: 'alphanumeric',
  });

  // Check if the code is already in use in the database
  // If it is, generate a new code recursively
  const check = await checkGroupCode(code, client);
  if (check) {
    return await generateGroupCode(client);
  }
  return code;
}
