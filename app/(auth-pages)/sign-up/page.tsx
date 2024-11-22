'use client'

import Link from "next/link"
import { useState } from "react"
import { Scissors, Zap, Scale } from 'lucide-react'
import { supabase } from "@/utils/supabase/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Component() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    testValue: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            test: formData.testValue
          }
        }
      })
  
      if (error) {
        setError(error.message)
      }
    } catch (error) {
      console.error('Login failed:', error)
      setError('로그인 중 오류가 발생했습니다.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">환계를 잊고, 꿈을 현실로</h1>
            <p className="text-sm text-muted-foreground">
              Enter your information below to create your account
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testValue">Test Value</Label>
              <Input
                id="testValue"
                name="testValue"
                type="text"
                required
                value={formData.testValue}
                onChange={handleChange}
              />
            </div>
            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-black lg:block">
        <div className="flex h-full flex-col items-center justify-center space-y-6 px-8 text-white">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold">이커머스 이미지 최적화 솔루션</h2>
            <p className="text-zinc-400">
              어떠한 이미지도 알맞은 주제로, 사이즈 조정, 화질 개선, 이미지 분할 등 모든 처리를 한 번에 해결해 드립니다.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-4">
            <div className="flex items-center space-x-4 rounded-lg bg-zinc-800 p-4">
              <Scissors className="h-5 w-5" />
              <div>
                <h3 className="font-medium">이미지 사이즈 조정</h3>
                <p className="text-sm text-zinc-400">다양한 플랫폼에 맞는 이미지 크기로 자동 조정</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 rounded-lg bg-zinc-800 p-4">
              <Zap className="h-5 w-5" />
              <div>
                <h3 className="font-medium">이미지 화질 개선</h3>
                <p className="text-sm text-zinc-400">AI 기술로 손실없는 이미지 선명하게 개선</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 rounded-lg bg-zinc-800 p-4">
              <Scale className="h-5 w-5" />
              <div>
                <h3 className="font-medium">이미지 분할</h3>
                <p className="text-sm text-zinc-400">많은 이미지를 자동으로 분할하여 다양하게 활용</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}