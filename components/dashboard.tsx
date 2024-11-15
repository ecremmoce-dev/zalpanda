'use client'

import { Menu, ChevronDown, Package, Globe, ShoppingCart, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"

const qoo10SubMenus = [
  {
    title: '상품관리',
    href: '/qoo10/cosmos',
    icon: Globe
  },
  {
    title: '주문관리',
    href: '/qoo10/orders',
    icon: ShoppingCart
  },
  {
    title: '문의관리',
    href: '/qoo10/inquiries',
    icon: MessageSquare
  }
]

export function Dashboard() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6">
          <Button className="lg:hidden" size="icon" variant="ghost">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
          <div className="flex items-center gap-4">
            <h1 className="font-semibold">Manage Widgets</h1>
          </div>
          <Button className="ml-auto" variant="default">
            Customize Widgets
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <Tabs defaultValue="all-widgets">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all-widgets">All Widgets</TabsTrigger>
                <TabsTrigger value="installed">Installed</TabsTrigger>
                <TabsTrigger value="uninstalled">Uninstalled</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-4">
                <Input placeholder="Search Widgets..." />
                <Button variant="outline">
                  Short by
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Tabs>
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-semibold">Sales & Financial Insights</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Sales Refenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$5,832</div>
                      <p className="text-xs text-muted-foreground">
                        Your revenue decreased by $621
                      </p>
                      <div className="mt-4 h-[80px]">
                        {/* Chart would go here */}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Revenue Forecast</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$3,850</div>
                      <p className="text-xs text-muted-foreground">
                        Your estimated revenue this month is about around $4,500
                      </p>
                      <div className="mt-4 h-[80px]">
                        {/* Chart would go here */}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Customer Segmentation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2,758</div>
                      <div className="mt-4 h-[80px]">
                        {/* Pie chart would go here */}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Conversion Rates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="text-sm font-medium">75.3%</div>
                            <div className="text-xs text-muted-foreground">12,465 Visitor</div>
                          </div>
                          <Progress className="w-[60px]" value={75} />
                        </div>
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="text-sm font-medium">24.7%</div>
                            <div className="text-xs text-muted-foreground">3,417 Product sales</div>
                          </div>
                          <Progress className="w-[60px]" value={25} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Goals & Tasks Tracking</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Closed Won</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$11,680</div>
                      <p className="text-xs text-muted-foreground">
                        This month total closed won increased from last month around +$6,450
                      </p>
                      <div className="mt-4 h-[80px]">
                        {/* Chart would go here */}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Task Completion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">92%</div>
                      <p className="text-xs text-muted-foreground">
                        Almost all assigned tasks completed on time
                      </p>
                      <Progress className="mt-4" value={92} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Sales Targets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3,415 / 4,000</div>
                      <p className="text-xs text-muted-foreground">
                        Less than 20% of your sales target will be achieved
                      </p>
                      <Progress  className="mt-4" value={80} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Top Country Sales Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">64,450</div>
                      <p className="text-xs text-muted-foreground">
                        Most of customers complete their jobs on time
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center">
                          <span className="w-12 text-xs">USA</span>
                          <Progress className="flex-1" value={75} />
                        </div>
                        <div className="flex items-center">
                          <span className="w-12 text-xs">Germany</span>
                          <Progress className="flex-1" value={65} />
                        </div>
                        <div className="flex items-center">
                          <span className="w-12 text-xs">Italy</span>
                          <Progress className="flex-1" value={55} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  )
}