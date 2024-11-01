import { NextResponse } from 'next/server'
import sql from 'mssql'

// SQL Server 연결 풀 설정
const poolConfig = {
  user: process.env.TOMS_DATABASE_USER,
  password: process.env.TOMS_DATABASE_PASSWORD,
  server: '192.168.0.135',  // 직접 IP 지정
  database: process.env.TOMS_DATABASE_NAME || 'awesomesqag_cafe',
  options: {
    encrypt: false,  // 로컬 연결은 암호화 비활성화
    trustServerCertificate: true,
    enableArithAbort: true,
    connectTimeout: 15000,  // 연결 타임아웃 15초로 감소
    requestTimeout: 15000,  // 요청 타임아웃 15초로 감소
    pool: {
      max: 10,  // 최대 연결 수
      min: 0,   // 최소 연결 수
      idleTimeoutMillis: 30000  // 유휴 연결 타임아웃
    }
  }
}

// 전역 연결 풀
let pool: sql.ConnectionPool | null = null

// 연결 풀 초기화 함수
async function getPool() {
  try {
    if (pool) {
      // 기존 연결이 있고 연결된 상태면 재사용
      if (pool.connected) {
        return pool
      }
      // 연결이 끊어진 경우 새로 연결
      await pool.connect()
      return pool
    }

    // 새 연결 풀 생성
    pool = await new sql.ConnectionPool(poolConfig).connect()
    console.log('New database connection pool created')
    return pool
  } catch (error) {
    console.error('Failed to create connection pool:', error)
    throw error
  }
}

// GET: 모든 회사 정보 조회 (성능 최적화)
export async function GET() {
  try {
    console.log('Fetching companies...')
    const pool = await getPool()
    
    const result = await pool.request()
      .query(`
        SELECT TOP 100
          Id,
          Name,
          BizNum,
          OwnerName,
          Tel,
          Email,
          ManagerName,
          FORMAT(CreatedAt, 'yyyy-MM-dd') as CreatedAt
        FROM Zal_CompanyInfo WITH (NOLOCK)
        WHERE DeletedAt IS NULL
        ORDER BY CreatedAt DESC
      `)
    
    console.log(`Found ${result.recordset.length} companies`)
    return NextResponse.json(result.recordset)
  } catch (error: any) {
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      state: error.state
    })
    return NextResponse.json(
      { 
        error: 'Failed to fetch companies',
        details: error.message 
      }, 
      { status: 500 }
    )
  }
}

// ... 나머지 코드는 동일 ...