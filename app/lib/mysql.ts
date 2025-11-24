import mysql from "mysql2/promise";

declare global {
  // Reuse the pool in dev to avoid exhausting connections on hot reloads
  // eslint-disable-next-line no-var
  var mysqlPool: mysql.Pool | undefined;
}

export function getPool(): mysql.Pool {
  if (!global.mysqlPool) {
    const {
      DATABASE_URL,
      MYSQL_HOST = "localhost",
      MYSQL_PORT = "3306",
      MYSQL_USER = "root",
      MYSQL_PASSWORD = "",
      MYSQL_DATABASE = "",
    } = process.env;

    global.mysqlPool = DATABASE_URL
      ? mysql.createPool(DATABASE_URL)
      : mysql.createPool({
          host: MYSQL_HOST,
          port: Number(MYSQL_PORT),
          user: MYSQL_USER,
          password: MYSQL_PASSWORD,
          database: MYSQL_DATABASE,
          waitForConnections: true,
          connectionLimit: 10,
          namedPlaceholders: true,
        });
  }
  return global.mysqlPool;
}

export async function query<T = any>(sql: string, params: unknown[] = []): Promise<T[]> {
  const pool = getPool();
  const [rows] = await pool.execute<T[]>(sql, params);
  return rows;
}


