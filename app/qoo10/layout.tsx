import { Metadata } from "next"

export const metadata: Metadata = {
  title: "QOO10",
  description: "QOO10 관리 페이지입니다.",
}

export default function QooLayout({
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