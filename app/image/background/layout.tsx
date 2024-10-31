import { Metadata } from "next"

export const metadata: Metadata = {
  title: "이미지 배경 제거",
  description: "이미지의 배경을 제거하는 페이지입니다.",
}

export default function BackgroundRemoveLayout({
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