import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

// Define the allowed types for SQL parameters to avoid 'any'
type SQLValue = string | number | boolean | Date | null | undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/**
 * Executes a SQL query.
 * T should be RowDataPacket[] for SELECT or ResultSetHeader for INSERT/UPDATE/DELETE.
 */
export async function query<T>(sql: string, params?: SQLValue[]): Promise<T> {
  // Use 'execute' for prepared statements (security against injection)
  const [result] = await pool.execute(sql, params);
  return result as T;
}

export default pool;