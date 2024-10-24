'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Download, ZoomIn, ZoomOut } from 'lucide-react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import Image from 'next/image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const VMAKE_API_KEY = '66850ffde4b00b4593836252'

interface ImageInfo {
  file: File;
  original: string;
  processed?: string;
  name: string;
  size: string;
  dimensions: string;
  selected: boolean;
}

export default function RemoveBackground() {
  const [images, setImages] = useState<ImageInfo[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => images.forEach(image => URL.revokeObjectURL(image.original))
  }, [images])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new window.Image()
          img.onload = () => {
            const newImage = {
              file,
              original: e.target?.result as string,
              name: file.name,
              size: formatFileSize(file.size),
              dimensions: `${img.width} x ${img.height}`,
              selected: true
            }
            setImages(prev => [...prev, newImage])
          }
          img.src = e.target?.result as string
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const removeBackground = async (index: number) => {
    setLoading(true)
    setError(null)
    try {
      const imageInfo = images[index]
      const processedImage = await processImage(imageInfo.original)
      setImages(prev => prev.map((img, i) => 
        i === index ? { ...img, processed: processedImage } : img
      ))
    } catch (error) {
      console.error('이미지 처리 중 오류 발생:', error)
      setError('이미지 처리 중 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  const processImage = async (imageUrl: string): Promise<string> => {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const base64data = await blobToBase64(blob)
    const base64Image = base64data.split(',')[1]

    const requestUrl = "https://open.vmake.ai/api/v1/image/remove-background"
    const requestBody = { image: base64Image }

    const apiResponse = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': VMAKE_API_KEY
      },
      body: JSON.stringify(requestBody)
    })

    const responseBody = await apiResponse.json()
    const code = responseBody.code
    const message = responseBody.message

    if (code !== 0) {
      throw new Error(message)
    } else {
      return `data:image/png;base64,${responseBody.data.image}`
    }
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const removeBackgroundForSelected = async () => {
    for (let i = 0; i < images.length; i++) {
      if (images[i].selected && !images[i].processed) {
        await removeBackground(i)
      }
    }
  }

  const toggleImageSelection = (index: number) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, selected: !img.selected } : img
    ))
  }

  const toggleAllSelection = (select: boolean) => {
    setImages(prev => prev.map(img => ({ ...img, selected: select })))
  }

  const downloadAllProcessed = async () => {
    const zip = new JSZip()
    images.forEach((image, index) => {
      if (image.processed) {
        zip.file(`processed_image_${index + 1}.png`, image.processed.split(',')[1], {base64: true})
      }
    })
    const content = await zip.generateAsync({type: "blob"})
    saveAs(content, 'processed_images.zip')
  }

  const handleDownload = (imageUrl: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1048576).toFixed(1) + ' MB'
  }

  return (
    <div className="container mx-auto p-4 max-w-full">
      <h1 className="text-2xl font-bold mb-4">배경 제거</h1>
      <div className="mb-6 flex space-x-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
          ref={fileInputRef}
        />
        <Button onClick={handleUploadClick}>이미지 업로드</Button>
        <Button onClick={removeBackgroundForSelected} disabled={loading || !images.some(img => img.selected && !img.processed)}>
          선택한 이미지 배경 제거
        </Button>
        <Button onClick={() => toggleAllSelection(true)}>전체 선택</Button>
        <Button onClick={() => toggleAllSelection(false)}>전체 해제</Button>
        <Button onClick={downloadAllProcessed} disabled={!images.some(img => img.processed)}>
          전체 다운로드
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card key={index} className="flex flex-col">
            <CardContent className="p-4 flex-grow flex flex-col">
              <div className="flex space-x-2 mb-2">
                <div className="relative w-1/2 pt-[50%]">
                  <Image
                    src={image.original}
                    alt={`Original image ${index + 1}`}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div className="relative w-1/2 pt-[50%]">
                  {image.processed ? (
                    <Image
                      src={image.processed || ''}
                      alt={`처리된 이미지 ${index + 1}`}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-100" />
                  )}
                </div>
              </div>
              <div className="mt-2 text-sm">
                <p className="truncate">{image.name}</p>
                <p>크기: {image.size}</p>
                <p>해상도: {image.dimensions}</p>
              </div>
              <div className="mt-2 flex items-center">
                <Checkbox
                  id={`select-${index}`}
                  checked={image.selected}
                  onCheckedChange={(checked: boolean) => toggleImageSelection(index)}
                />
                <label htmlFor={`select-${index}`} className="ml-2 text-sm">선택</label>
              </div>
              <Button 
                onClick={() => removeBackground(index)} 
                disabled={loading || !image.selected || Boolean(image.processed)}
                className="mt-2"
              >
                {loading ? '처리 중...' : '배경 제거'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}
    </div>
  )
}
