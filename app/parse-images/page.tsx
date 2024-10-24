'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export default function ParseImages() {
  const [url, setUrl] = useState('')
  const [parsedImages, setParsedImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fileName, setFileName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const response = await fetch('/api/parse-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })
      const data = await response.json()
      if (response.ok) {
        setParsedImages(data.parsedImages)
      } else {
        setError(data.error || 'Failed to parse images')
      }
    } catch (error) {
      console.error('Error parsing images:', error)
      setError('An error occurred while parsing images')
    }
  }

  const handleDownload = async () => {
    if (fileName.trim() === '') {
      alert('파일 이름을 입력해주세요.')
      return
    }
    try {
      const response = await fetch('/api/download-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: parsedImages, fileName }),
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `${fileName}.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        throw new Error('Failed to download images')
      }
    } catch (error) {
      console.error('Error downloading images:', error)
      setError('An error occurred while downloading images')
    }
    setIsModalOpen(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">이미지 파싱</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL을 입력하세요"
          required
          className="mb-2"
        />
        <Button type="submit">파싱 시작</Button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {parsedImages.length > 0 && (
        <Button onClick={() => setIsModalOpen(true)} className="mb-4">
          전체 이미지 다운로드
        </Button>
      )}
      <div className="flex flex-col space-y-4">
        {parsedImages.map((img, index) => (
          <div key={index} className="w-full">
            <Image 
              src={img} 
              alt={`Parsed image ${index + 1}`} 
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
              onError={() => {
                console.error(`Failed to load image: ${img}`);
              }}
              unoptimized
            />
          </div>
        ))}
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>이미지 다운로드</DialogTitle>
            <DialogDescription>
              다운로드할 파일의 이름을 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="파일 이름"
          />
          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)}>취소</Button>
            <Button onClick={handleDownload}>다운로드</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
