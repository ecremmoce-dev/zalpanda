import { Metadata } from "next"

export const metadata: Metadata = {
  title: "이미지 번역",
  description: "이미지의 텍스트를 번역하는 페이지입니다.",
}

export default function TranslationLayout({
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