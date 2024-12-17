import { TimeoutError } from '@auth0/auth0-react';
import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

export async function executeQuery(query: string, parameters?: any[]): Promise<QueryResult<any>> {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(query, parameters);
      client.release();
      return result;
    } catch (error) {
      throw new Error('Wystąpił błąd przy próbie zapytania do bazy danych SQL: ' + error.message);
    }
  } catch (err: any) {
    throw new Error('Nie można się połączyć z bazą danych SQL: ' + err.message);
  }
}