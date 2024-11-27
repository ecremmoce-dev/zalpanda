import { Metadata } from "next"

export const metadata: Metadata = {
  title: "상품 번역",
  description: "상품 번역 관리 페이지입니다.",
}

export default function ProductTranslationNamesLayout({
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