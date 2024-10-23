'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Download, ZoomIn, ZoomOut } from 'lucide-react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

interface ImageItem {
  file: File;
  preview: string;
  checked: boolean;
  name: string;
  size: string;
  result: string | null;
  resultSize: string | null;
}

export default function RemoveBackground() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => images.forEach(image => URL.revokeObjectURL(image.preview))
  }, [images])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      checked: true,
      name: file.name,
      size: `${file.width || 0}x${file.height || 0}`,
      result: null,
      resultSize: null
    }))
    setImages(prev => [...prev, ...newImages])
  }

  const toggleCheck = (index: number) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? {...img, checked: !img.checked} : img
    ))
  }

  const removeBackground = async (index?: number) => {
    const imagesToProcess = index !== undefined 
      ? [images[index]].filter(img => img.checked)
      : images.filter(img => img.checked)

    if (imagesToProcess.length === 0) return

    setIsLoading(true)
    setError(null)

    for (const image of imagesToProcess) {
      const formData = new FormData()
      formData.append('image', image.file)

      try {
        const response = await fetch('/api/remove-background', {
          method: 'POST',
          body: formData,
        })

        const responseBody = await response.json()
        console.log('API Response:', responseBody)

        if (!response.ok) {
          throw new Error(`서버 오류: ${response.status} ${response.statusText}`)
        }

        if (responseBody.error) {
          throw new Error(responseBody.error)
        }

        if (!responseBody.resultImageUrl) {
          throw new Error('응답에 이미지 URL이 없습니다.')
        }

        // Get the size of the result image
        const img = new Image()
        img.onload = () => {
          setImages(prev => prev.map(img => 
            img === image ? {
              ...img, 
              result: responseBody.resultImageUrl,
              resultSize: `${img.width}x${img.height}`
            } : img
          ))
        }
        img.src = responseBody.resultImageUrl

      } catch (error) {
        console.error('Error removing background:', error)
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
      }
    }

    setIsLoading(false)
  }

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">배경 제거</h1>
      <Input type="file" onChange={handleImageUpload} accept="image/*" multiple className="mb-4" />
      <div className="space-y-4">
        {images.map((image, index) => (
          <div key={index} className="flex items-start space-x-4">
            <Checkbox
              checked={image.checked}
              onCheckedChange={() => toggleCheck(index)}
            />
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <img src={image.preview} alt={`Preview ${index + 1}`} className="w-32 h-32 object-cover" />
                {image.result && (
                  <div className="relative">
                    <TransformWrapper
                      initialScale={1}
                      initialPositionX={0}
                      initialPositionY={0}
                    >
                      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                        <>
                          <TransformComponent>
                            <img src={image.result} alt={`Result ${index + 1}`} className="w-32 h-32 object-cover" />
                          </TransformComponent>
                          <div className="absolute top-0 right-0 flex space-x-1">
                            <Button size="sm" variant="outline" onClick={() => zoomIn()}>
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => zoomOut()}>
                              <ZoomOut className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDownload(image.result!, `result_${image.name}`)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </TransformWrapper>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <p>{image.name}</p>
                <p>원본 크기: {image.size}</p>
                {image.resultSize && <p>결과 크기: {image.resultSize}</p>}
              </div>
            </div>
            <Button onClick={() => removeBackground(index)} disabled={isLoading || !image.checked}>
              배경 제거
            </Button>
          </div>
        ))}
      </div>
      <Button onClick={() => removeBackground()} disabled={isLoading || images.filter(img => img.checked).length === 0} className="mt-4">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            처리 중...
          </>
        ) : (
          '선택된 이미지 배경 제거'
        )}
      </Button>
      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}
    </div>
  )
}
