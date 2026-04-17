import sql from 'mssql'

const config: sql.config = {
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  options: {
    encrypt: true,             // Requerido por Azure SQL
    trustServerCertificate: false,
  },
   authentication: {
         type: 'azure-active-directory-msi-app-service', // <-- Esto activa la magia
      },
  pool: {
    max: 10,
    min: 0,
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
