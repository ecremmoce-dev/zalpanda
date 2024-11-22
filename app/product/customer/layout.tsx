import { Metadata } from "next"

export const metadata: Metadata = {
  title: "공급사 관리",
  description: "상품 공급사를 관리하는 페이지입니다.",
}

export default function ProductCustomerLayout({
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