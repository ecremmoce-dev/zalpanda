'use client'

import { Sidebar } from "@/components/sidebar"
import { ProductCategoryMapping } from "@/components/product-category-mapping"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function ProductCategoryMappingPage() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6">
          <Button className="lg:hidden" size="icon" variant="ghost">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
          <h1 className="font-semibold">카테고리 맵핑</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <ProductCategoryMapping />
        </main>
      </div>
    </div>
  )
} 