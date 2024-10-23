'use client'

import Link from 'next/link'
import { Github } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempt with email:', email)
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Left column */}
      <div className="hidden w-2/5 bg-[#1e293b] text-white lg:block">
        <div className="flex h-full flex-col justify-between p-8">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full border-2 border-white" />
            <span className="text-xl font-bold">Extej</span>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium">
              "이 서비스는 이미지 처리 작업을 훨씬 더 쉽고 빠르게 만들어 주었습니다."
            </p>
            <p className="font-medium">홍길동</p>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="flex w-full flex-col justify-between p-8 lg:w-3/5">
        <div className="text-right">
          <Link href="/" className="text-sm font-medium hover:underline">
            홈으로
          </Link>
        </div>
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">로그인</h1>
            <p className="text-gray-500">
              계정에 로그인하려면 이메일을 입력하세요
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="name@example.com"
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full bg-[#f43f5e] hover:bg-[#e11d48]">이메일로 로그인</Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  또는 계속하기
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Github className="mr-2 h-4 w-4" />
              GitHub로 로그인
            </Button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-500">
          계속 진행하면 당사의{' '}
          <Link href="/terms" className="underline hover:text-gray-900">
            서비스 약관
          </Link>{' '}
          및{' '}
          <Link href="/privacy" className="underline hover:text-gray-900">
            개인정보 처리방침
          </Link>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  )
}
