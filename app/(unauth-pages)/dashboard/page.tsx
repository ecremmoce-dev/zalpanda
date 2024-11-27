'use client'

import { Dashboard } from "@/components/dashboard"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

// 임시 로그인 체크 함수
const checkAuth = () => {
  // 여기에 실제 인증 로직 구현
  // 예: localStorage나 쿠키에서 토큰 확인
  const token = localStorage.getItem('token')
  return !!token
}

export default function DashboardPage() {
  return <Dashboard />
} 