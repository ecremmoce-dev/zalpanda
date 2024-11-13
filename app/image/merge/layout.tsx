import { Metadata } from "next"

export const metadata: Metadata = {
  title: "이미지 합치기",
  description: "이미지를 합치는 페이지입니다.",
}

export default function ImageMergeLayout({
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