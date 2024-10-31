'use client'

import { ImageTextDetection } from "@/components/image-text-detection"

export default function TextDetectionPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">이미지 텍스트 검출</h2>
      </div>
      <div className="grid gap-4">
        <ImageTextDetection />
      </div>
    </div>
  )
} 