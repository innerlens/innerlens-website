import { connectAndQuery } from '../config/dbConfig.js';

export async function findUserById(id) {
  const result = await connectAndQuery('SELECT * FROM users WHERE google_id = $1', [id]);

  if (result.rows.length != 0) {
    return result.rows[0];
  }
  else {
    return null;
  }
}

export async function createUser(id, name, email) {
  const result = await connectAndQuery(
    'INSERT INTO users (google_id, username, email) VALUES ($1, $2, $3) RETURNING *',
    [id, name, email]
  );

  if (result.rows.length != 0) {
    return result.rows[0];
  }
  else {
    return null;
  }
}
