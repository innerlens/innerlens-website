import { Pool } from 'pg'

console.log(`user: ${process.env.DATABASE_USER}`);
console.log(`host: ${process.env.DATABASE_HOST?.split(":")[0]}`);
console.log(`database: ${process.env.DATABASE_NAME}`);
console.log(`password: ${process.env.DATABASE_PASSWORD}`);

const db = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST?.split(":")[0],
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function queryDb(queryString, values) {

  console.log(`
    Executing DB Query:
    ------------------------------------------------------------------------------
    ${queryString.trim()}
    ------------------------------------------------------------------------------
    Values : [${values}]
    ______________________________________________________________________________
    `);

  const res = await db.query(queryString, values);
  return res;
}