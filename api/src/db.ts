import sql from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

const config: sql.config = {
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  authentication: {
    type: 'azure-active-directory-default', // Usa credenciales de Azure CLI (az login)
  },
  options: {
    encrypt: true,             // Requerido por Azure SQL
    trustServerCertificate: true, // Requerido para pruebas locales
    connectTimeout: 30000,
  },
  pool: {
    max: 20,
    min: 2,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 15000,
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
