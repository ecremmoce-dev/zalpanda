import { Metadata } from "next"

export const metadata: Metadata = {
  title: "카테고리 맵핑",
  description: "카테고리 맵핑 관리 페이지입니다.",
}

export default function ProductCategoryMappingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
} 