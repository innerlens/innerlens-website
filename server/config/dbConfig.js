import { Pool } from 'pg'

const db = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

export async function connectAndQuery(queryString, values) {
  const res = await db.query(queryString, values);
  return res;
}