import { Metadata } from "next"

export const metadata: Metadata = {
  title: "가격 / 재고 일괄등록",
  description: "상품의 가격과 재고를 일괄 등록하는 페이지입니다.",
}

export default function ProductOptionsStockLayout({
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