import { Metadata } from "next"

export const metadata: Metadata = {
  title: "공용 상품 상세",
  description: "공용 상품 상세 페이지입니다.",
}

export default function ProductPublicDetailLayout({
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