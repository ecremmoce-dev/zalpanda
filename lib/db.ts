import { Pool } from 'pg';

const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

export const db = {
  query: (text: string, params: any[]) => pool.query(text, params),
}; 