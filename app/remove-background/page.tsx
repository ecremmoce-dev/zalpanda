'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RemoveBackground() {
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeBackground = async () => {
    if (!image) return

    setIsLoading(true)
    try {
      const base64Image = image.split(',')[1]
      const response = await fetch('https://open.vmake.ai/api/v1/image/remove-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_VMAKE_API_KEY || '',
        },
        body: JSON.stringify({ image: base64Image })
      })

      const responseBody = await response.json()

      if (responseBody.code !== 0) {
        throw new Error(responseBody.message)
      }

      setResult(`data:image/png;base64,${responseBody.data.image}`)
    } catch (error) {
      console.error('Error removing background:', error)
      alert('배경 제거 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">배경 제거</h1>
      <Input type="file" onChange={handleImageUpload} accept="image/*" className="mb-4" />
      {image && (
        <div className="mb-4">
          <img src={image} alt="Original" className="max-w-sm mb-2" />
          <Button onClick={removeBackground} disabled={isLoading}>
            {isLoading ? '처리 중...' : '배경 제거'}
          </Button>
        </div>
      )}
      {result && (
        <div>
          <h2 className="text-xl font-semibold mb-2">결과</h2>
          <img src={result} alt="Result" className="max-w-sm" />
        </div>
      )}
    </div>
  )
}
