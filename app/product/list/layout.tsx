import { Metadata } from "next"

export const metadata: Metadata = {
  title: "상품 목록",
  description: "상품 목록을 관리하는 페이지입니다.",
}

export default function ProductListLayout({
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