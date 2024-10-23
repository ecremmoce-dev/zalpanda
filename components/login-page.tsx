'use client'

import Link from 'next/link'
import { Github } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LoginPageComponent() {
  return (
    <div className="flex min-h-screen">
      {/* Left column */}
      <div className="hidden w-2/5 bg-black text-white lg:block">
        <div className="flex h-full flex-col justify-between p-8">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full border-2 border-white" />
            <span className="text-xl font-bold">Acme Inc</span>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium">
              "This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before."
            </p>
            <p className="font-medium">Sofia Davis</p>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="flex w-full flex-col justify-between p-8 lg:w-3/5">
        <div className="text-right">
          <Link href="/login" className="text-sm font-medium hover:underline">
            Login
          </Link>
        </div>
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-gray-500">
              Enter your email below to create your account
            </p>
          </div>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="name@example.com"
              className="w-full"
            />
            <Button className="w-full">Sign in with Email</Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500">
          By clicking continue, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-gray-900">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-gray-900">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  )
}