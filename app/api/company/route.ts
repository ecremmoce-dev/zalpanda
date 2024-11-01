import { NextResponse } from 'next/server'
import sql from 'mssql'

const config = {
  user: process.env.TOMS_DATABASE_USER,
  password: process.env.TOMS_DATABASE_PASSWORD,
  server: process.env.TOMS_DATABASE_URL?.split(';')[0] || '',
  database: process.env.TOMS_DATABASE_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    connectionTimeout: 30000,
    requestTimeout: 30000
  }
}

// 데이터베이스 연결 함수
async function connectDB() {
  try {
    console.log('Attempting to connect to database...')
    console.log('Connection config:', {
      server: config.server,
      database: config.database,
      user: config.user,
      options: config.options
    })
    
    // 연결 전에 설정 유효성 검사
    if (!config.server || !config.database || !config.user || !config.password) {
      throw new Error('Missing database configuration. Please check your environment variables.')
    }

    // SQL Server 포트가 포함된 경우 처리
    if (config.server.includes(':')) {
      const [host, port] = config.server.split(':')
      config.server = host
      config.options.port = parseInt(port)
    }
    
    const pool = await sql.connect(config)
    console.log('Database connected successfully')
    return pool
  } catch (error: any) {
    console.error('Database connection error:', {
      error: error.message,
      code: error.code,
      originalError: error.originalError
    })
    throw new Error(`Database connection failed: ${error.message}`)
  }
}

// GET: 모든 회사 정보 조회
export async function GET() {
  let pool
  try {
    pool = await connectDB()
    
    console.log('Executing SELECT query...')
    const result = await pool.request().query(`
      SELECT 
        Id,
        Name,
        BizNum,
        OwnerName,
        Tel,
        Email,
        ManagerName,
        FORMAT(CreatedAt, 'yyyy-MM-dd') as CreatedAt
      FROM Zal_CompanyInfo
      WHERE DeletedAt IS NULL
      ORDER BY CreatedAt DESC
    `)
    
    console.log(`Query executed successfully. Found ${result.recordset.length} records`)
    return NextResponse.json(result.recordset)
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      state: error.state
    })
    return NextResponse.json(
      { 
        error: 'Failed to fetch companies',
        details: error.message,
        code: error.code 
      }, 
      { status: 500 }
    )
  } finally {
    if (pool) {
      try {
        await pool.close()
        console.log('Database connection closed')
      } catch (error) {
        console.error('Error closing database connection:', error)
      }
    }
  }
}

// POST: 새 회사 정보 추가
export async function POST(request: Request) {
  let pool
  try {
    const body = await request.json()
    pool = await connectDB()
    
    console.log('Creating new company with data:', body)
    
    // NEWID() 함수를 사용하여 GUID 생성
    const result = await pool.request()
      .input('Name', sql.NVarChar, body.Name)
      .input('BizNum', sql.NVarChar, body.BizNum)
      .input('OwnerName', sql.NVarChar, body.OwnerName)
      .input('Tel', sql.NVarChar, body.Tel)
      .input('Email', sql.NVarChar, body.Email)
      .input('ManagerName', sql.NVarChar, body.ManagerName)
      .input('CreatedAt', sql.DateTime2, new Date())
      .input('UpdatedAt', sql.DateTime2, new Date())
      .query(`
        DECLARE @NewId uniqueidentifier = NEWID();
        
        INSERT INTO Zal_CompanyInfo (
          Id, Name, BizNum, OwnerName, Tel, Email, ManagerName, CreatedAt, UpdatedAt
        )
        VALUES (
          @NewId, @Name, @BizNum, @OwnerName, @Tel, @Email, @ManagerName, @CreatedAt, @UpdatedAt
        );
        
        SELECT @NewId as Id;
      `)
    
    console.log('Company created successfully with ID:', result.recordset[0].Id)
    return NextResponse.json({ id: result.recordset[0].Id })
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      state: error.state
    })
    return NextResponse.json(
      { 
        error: 'Failed to create company',
        details: error.message,
        code: error.code 
      }, 
      { status: 500 }
    )
  } finally {
    if (pool) {
      try {
        await pool.close()
        console.log('Database connection closed')
      } catch (error) {
        console.error('Error closing database connection:', error)
      }
    }
  }
} 