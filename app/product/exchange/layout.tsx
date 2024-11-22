import { Metadata } from "next"

export const metadata: Metadata = {
  title: "플랫폼 가격 계산",
  description: "플랫폼별 상품 가격을 계산하는 페이지입니다.",
}

export default function ProductExchangeLayout({
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