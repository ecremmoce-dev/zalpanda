import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // '/' 경로로의 요청을 '/login'으로 리다이렉트
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // 다른 요청은 그대로 진행
  return NextResponse.next()
} 