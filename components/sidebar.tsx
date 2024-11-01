'use client'

import { ChevronDown, ChevronRight, HelpCircle, Image, Package2, Settings, Square, Eraser, Scissors, LayoutDashboard } from "lucide-react"
import NextImage from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function Sidebar() {
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false)

  const toggleImageMenu = () => {
    setIsImageMenuOpen(!isImageMenuOpen)
  }

  return (
    <div className="hidden border-r bg-gray-100/40 lg:block">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
            <Package2 className="h-6 w-6" />
            <span>ecremmoce</span>
          </Link>
          <Button className="ml-auto h-8 w-8" size="icon" variant="ghost">
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </div>
        <div className="flex-1 px-4">
          <div className="space-y-1 p-2">
            <Input className="h-9" placeholder="Search..." />
          </div>
          <nav className="grid gap-1 px-2 py-4">
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              href="/dashboard"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="font-semibold">대시보드</span>
            </Link>
            <div>
              <button
                onClick={toggleImageMenu}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <div className="flex items-center gap-3">
                  <Image className="h-4 w-4" />
                  <span className="font-semibold">이미지</span>
                </div>
                {isImageMenuOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {isImageMenuOpen && (
                <div className="ml-6 mt-2 space-y-1">
                  <Link
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 transition-all hover:text-gray-900"
                    href="/image/square"
                  >
                    <Square className="h-4 w-4" />
                    이미지 정사각형 변경
                  </Link>
                  <Link
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 transition-all hover:text-gray-900"
                    href="/image/resize"
                  >
                    <Image className="h-4 w-4" />
                    이미지 사이즈 변경
                  </Link>
                  <Link
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 transition-all hover:text-gray-900"
                    href="/image/background"
                  >
                    <Eraser className="h-4 w-4" />
                    이미지 배경 제거
                  </Link>
                  <Link
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 transition-all hover:text-gray-900"
                    href="/image/split"
                  >
                    <Scissors className="h-4 w-4" />
                    이미지 분할
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <nav className="grid gap-1">
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              href="/settings"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              href="/help"
            >
              <HelpCircle className="h-4 w-4" />
              Help & Center
            </Link>
          </nav>
          <Separator className="my-4" />
          <div className="flex items-center gap-3 px-3">
            <NextImage
              alt="Avatar"
              className="rounded-full"
              height="32"
              src="/placeholder.svg"
              style={{
                aspectRatio: "32/32",
                objectFit: "cover",
              }}
              width="32"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Richard Brown</span>
            </div>
            <Button className="ml-auto h-8 w-8" size="icon" variant="ghost">
              <ChevronDown className="h-4 w-4" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 