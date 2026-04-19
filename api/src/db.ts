import sql from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

const config: sql.config = {
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  options: {
    encrypt: true,             // Requerido por Azure SQL
    trustServerCertificate: true, // Requerido para pruebas locales
    connectTimeout: 30000,
  },
  pool: {
    max: 50,
    min: 5,
    idleTimeoutMillis: 30000,
  },
}

let pool: sql.ConnectionPool

export async function initDb(): Promise<void> {
  pool = await new sql.ConnectionPool(config).connect()
  console.log('Azure SQL connected')
}

export function getDb(): sql.ConnectionPool {
  return pool
}
