import sql from 'mssql'

const config = {
  user: 'sa',
  password: 'akfkclzls99!',
  server: '192.168.0.135',
  database: 'awesomesqag_cafe',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    instanceName: 'SQLEXPRESS',
    port: 1433
  }
}

async function testConnection() {
  try {
    console.log('Testing database connection...')
    const pool = await sql.connect(config)
    console.log('Connection successful!')
    await pool.close()
  } catch (err) {
    console.error('Connection failed:', err)
  }
}

testConnection() 