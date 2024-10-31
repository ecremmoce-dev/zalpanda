import { Metadata } from "next"

export const metadata: Metadata = {
  title: "이미지 사이즈 변경",
  description: "이미지의 크기를 변경하는 페이지입니다.",
}

export default function ImageResizeLayout({
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