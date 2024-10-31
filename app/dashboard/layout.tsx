import { Metadata } from "next"

export const metadata: Metadata = {
  title: "대시보드",
  description: "대시보드 페이지입니다.",
}

export default function DashboardLayout({
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