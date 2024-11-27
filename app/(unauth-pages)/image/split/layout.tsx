import { Metadata } from "next"

export const metadata: Metadata = {
  title: "이미지 분할",
  description: "이미지를 분할하는 페이지입니다.",
}

export default function ImageSplitLayout({
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