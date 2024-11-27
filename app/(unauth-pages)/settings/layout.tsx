import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings",
  description: "설정 페이지입니다.",
}

export default function SettingsLayout({
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