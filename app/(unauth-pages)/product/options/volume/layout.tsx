import { Metadata } from "next"

export const metadata: Metadata = {
  title: "무게 / 크기 일괄등록",
  description: "상품의 무게와 크기를 일괄 등록하는 페이지입니다.",
}

export default function ProductOptionsVolumeLayout({
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