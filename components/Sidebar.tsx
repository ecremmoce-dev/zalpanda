'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HomeIcon, UsersIcon, ImageIcon, BarChart2, EraserIcon, LinkIcon, WandIcon, ImagePlusIcon, TrendingUpIcon } from 'lucide-react'
import SidebarItem from './SidebarItem'

export default function Sidebar() {
  const router = useRouter()

  return (
    <aside className="w-64 bg-[#f8fafc] border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#6366f1]">Extej</h1>
      </div>
      <nav className="mt-6">
        <Link href="/dashboard">
          <SidebarItem icon={HomeIcon} label="대시보드" />
        </Link>
        <SidebarItem icon={UsersIcon} label="회원 관리">
          <SidebarItem icon={UsersIcon} label="회원 목록" />
          <SidebarItem icon={UsersIcon} label="회원 등급" />
        </SidebarItem>
        <SidebarItem icon={ImageIcon} label="이미지처리">
          <Link href="/remove-background">
            <SidebarItem icon={EraserIcon} label="배경 지우기" />
          </Link>
          <Link href="/parse-images">
            <SidebarItem icon={LinkIcon} label="URL 이미지 파싱" />
          </Link>
          <SidebarItem icon={WandIcon} label="AI 이미지 생성" />
          <SidebarItem icon={ImagePlusIcon} label="화질 개선" />
          <Link href="/image-translation">
            <SidebarItem icon={WandIcon} label="이미지 번역하기" />
          </Link>
        </SidebarItem>
        <SidebarItem icon={BarChart2} label="통계">
          <SidebarItem icon={TrendingUpIcon} label="월별 플피먼트 누적주문수량" />
          <SidebarItem icon={TrendingUpIcon} label="월별 OMO 누적주문수량" />
        </SidebarItem>
      </nav>
    </aside>
  )
}
