import { Metadata } from "next"

export const metadata: Metadata = {
  title: "공용 상품",
  description: "공용 상품 관리 페이지입니다.",
}

export default function ProductPublicLayout({
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