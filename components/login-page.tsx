'use client'

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageIcon, Zap, Scissors } from "lucide-react"

// 테스트용 임시 계정
const TEST_ACCOUNT = {
  email: 'test@example.com',
  password: 'password123'
}

export function LoginPage() {
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
      // 임시 로그인 로직
      if (email === TEST_ACCOUNT.email && password === TEST_ACCOUNT.password) {
        localStorage.setItem('token', 'dummy_token')
        router.push('/dashboard')
      } else {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      }
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
                <span className="bg-background px-2 text-muted-foreground">Or login with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                Apple
              </Button>
            </div>
          </form>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>
          <div className="text-center text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            {" • "}
            <Link href="/terms" className="hover:underline">
              Terms & Conditions
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