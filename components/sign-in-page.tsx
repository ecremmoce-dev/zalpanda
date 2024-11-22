'use client'

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageIcon, Zap, Scissors } from "lucide-react"
import { supabase } from "@/utils/supabase/client";

// 테스트용 임시 계정
const TEST_ACCOUNT = {
  email: 'test@example.com',
  password: 'password123'
}

export function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) {
        setError(error.message)
      }

      router.refresh()
    } catch (error) {
      console.error('Login failed:', error)
      setError('로그인 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-8 py-12">
        <div className="mx-auto w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">한계를 잊고, 꿈을 현실로</h1>
            <p className="text-sm text-muted-foreground">Enter your username and password to continue.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" 
                required 
              />
              <button 
                type="button" 
                onClick={togglePassword}
                className="text-sm text-gray-500"
              >
                {showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
              </button>
            </div>
            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password
              </Link>
            </div>
            <Button className="w-full" type="submit">
              Sign In
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
          </form>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-zinc-900 lg:block">
        <div className="flex h-full flex-col items-center justify-center space-y-6 px-8">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-white">이커머스 이미지 최적화 솔루션</h2>
            <p className="mx-auto max-w-[600px] text-zinc-400">
              어떠한 이미지도 맡겨만 주세요. 사이즈 조정, 화질 개선, 이미지 분할 등 모든 처리를 한 번에 해결해 드립니다.
            </p>
          </div>
          <div className="grid w-full max-w-md gap-4">
            <div className="rounded-lg bg-zinc-800 p-4">
              <div className="flex items-center gap-4">
                <ImageIcon className="h-6 w-6 text-white" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none text-white">이미지 사이즈 조정</p>
                  <p className="text-sm text-zinc-400">다양한 플랫폼에 맞는 이미지 크기로 자동 조정</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-zinc-800 p-4">
              <div className="flex items-center gap-4">
                <Zap className="h-6 w-6 text-white" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none text-white">이미지 화질 개선</p>
                  <p className="text-sm text-zinc-400">AI 기술로 저화질 이미지를 선명하게 개선</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-zinc-800 p-4">
              <div className="flex items-center gap-4">
                <Scissors className="h-6 w-6 text-white" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none text-white">이미지 분할</p>
                  <p className="text-sm text-zinc-400">상품 이미지를 자동으로 분할하여 다양한 뷰 제공</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}