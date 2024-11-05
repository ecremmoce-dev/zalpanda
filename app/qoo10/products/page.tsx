'use client'

import { Sidebar } from "@/components/sidebar"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { ProductManagementContent } from "@/components/product-management-content"

const checkAuth = () => {
  const token = localStorage.getItem('token')
  return !!token
}

export default function ProductsPage() {
  const router = useRouter()

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6">
          <Button className="lg:hidden" size="icon" variant="ghost">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
          <h1 className="font-semibold">QOO10 상품관리</h1>
        </header>
        <main className="flex flex-1 flex-col">
          <ProductManagementContent />
        </main>
      </div>
    </div>
  )
} 