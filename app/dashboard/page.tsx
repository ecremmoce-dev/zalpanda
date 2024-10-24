'use client'

import { useState } from 'react'
import { Bell, ChevronDown, Search, Settings, BarChart2, ChevronRight, Image, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const lineChartData = [
  { name: 'Jan', volume: 2000 },
  { name: 'Feb', volume: 3000 },
  { name: 'Mar', volume: 2800 },
  { name: 'Apr', volume: 3500 },
  { name: 'May', volume: 3200 },
  { name: 'Jun', volume: 3800 },
]

const pieChartData = [
  { name: '배경 지우기', value: 30 },
  { name: 'AI 이미지 생성', value: 40 },
  { name: '화질 개선', value: 30 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function Dashboard() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-[#f43f5e]">Extej</h1>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <h2 className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">이미지처리</h2>
              <Link href="/remove-background" className="flex items-center px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                <Image className="mr-3 h-4 w-4" />
                <span>배경 제거</span>
              </Link>
              <Link href="/parse-images" className="flex items-center px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                <LinkIcon className="mr-3 h-4 w-4" />
                <span>URL 이미지 파싱</span>
              </Link>
              <Link href="#" className="flex items-center px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                <Image className="mr-3 h-4 w-4" />
                <span>AI 이미지 생성</span>
              </Link>
              <Link href="#" className="flex items-center px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                <Image className="mr-3 h-4 w-4" />
                <span>화질 개선</span>
              </Link>
            </li>
            <li>
              <h2 className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">통계</h2>
              <Link href="#" className="flex items-center px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                <BarChart2 className="mr-3 h-4 w-4" />
                <span>월별 플피먼트 누적주문수량</span>
              </Link>
              <Link href="#" className="flex items-center px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                <BarChart2 className="mr-3 h-4 w-4" />
                <span>월별 OMO 누적주문수량</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="flex h-16 items-center justify-between bg-[#1e293b] px-6 text-white">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-4 text-white lg:hidden">
              <ChevronRight className="h-6 w-6" />
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 w-64 bg-[#2d3a4f] text-white placeholder-gray-400 border-none focus:ring-0"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-white">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">사용자</span>
                <span className="text-xs text-gray-400">관리자</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8fafc] p-6">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">대시보드</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {['배경 지우기', 'AI 이미지 생성', '화질 개선'].map((feature) => (
              <Card key={feature}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{feature}</CardTitle>
                  <Image className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">처리된 이미지 수</p>
                  <div className="mt-4 h-[80px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineChartData}>
                        <Line type="monotone" dataKey="volume" stroke="#f43f5e" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>월별 처리 이미지 수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="volume" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>이미지 처리 유형 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <div className="h-[300px] w-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          onMouseEnter={(_, index) => setActiveIndex(index)}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col justify-center space-y-2">
                    {pieChartData.map((entry, index) => (
                      <div key={`legend-${index}`} className={`flex items-center ${index === activeIndex ? 'font-bold' : ''}`}>
                        <div className="w-4 h-4 mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span>{entry.name}: {entry.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
