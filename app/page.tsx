'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // localStorage에서 토큰 확인
    const token = localStorage.getItem('token')
    
    // 토큰이 있으면 dashboard로, 없으면 login 페이지로 리다이렉트
    if (token) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  // 리다이렉션 되는 동안 보여줄 빈 페이지
  return null
}
