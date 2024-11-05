import { Metadata } from "next"

export const metadata: Metadata = {
  title: "이미지 정사각형 변경",
  description: "이미지를 정사각형으로 변환하는 페이지입니다.",
}

export default function ImageSquareLayout({
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