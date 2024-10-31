'use client'

import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Save } from "lucide-react"
import { prisma } from '@/lib/db'

interface ImageData {
  name: string
  thumbnail: string
  processed?: string
}

export function ImageResizeConverter() {
  const [data, setData] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      
      const json = XLSX.utils.sheet_to_json<{ 네임: string; 썸네일: string }>(sheet, {
        raw: false,
        defval: ''
      })

      const parsedData = json.filter(row => row.네임 && row.썸네일).map(row => ({
        name: row.네임.trim(),
        thumbnail: row.썸네일.trim()
      }))

      setData(parsedData)
    }
    reader.readAsArrayBuffer(file)
  }

  const processImages = async () => {
    setLoading(true)
    try {
      const processedImages = await Promise.all(data.map(async (item) => {
        try {
          const response = await fetch(item.thumbnail)
          const blob = await response.blob()
          const base64data = await blobToBase64(blob)
          const base64Image = base64data.split(',')[1]

          const apiResponse = await fetch("/api/resize-image", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              image: base64Image,
              name: item.name
            })
          })

          if (!apiResponse.ok) {
            throw new Error(`Failed to process image: ${item.name}`)
          }

          const responseData = await apiResponse.json()
          
          return { 
            ...item, 
            processed: `data:image/png;base64,${responseData.image}`
          }
        } catch (error) {
          console.error(`Error processing image ${item.name}:`, error)
          return item
        }
      }))

      setData(processedImages)
    } catch (error) {
      console.error('이미지 처리 중 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadAllProcessed = async () => {
    const zip = new JSZip()
    data.forEach((item) => {
      if (item.processed) {
        zip.file(`${item.name}.png`, item.processed.split(',')[1], { base64: true })
      }
    })
    const content = await zip.generateAsync({ type: "blob" })
    saveAs(content, 'processed_images.zip')
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const handleSaveToDatabase = async () => {
    setIsSaving(true)
    try {
      const processedItems = data.filter(item => item.processed)
      
      for (const item of processedItems) {
        await fetch('/api/images/save-product', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ProductName: item.name
          })
        })
      }
      
      alert('이미지 정보가 성공적으로 저장되었습니다.')
    } catch (error) {
      console.error('저장 중 오류 발생:', error)
      alert('이미지 정보 저장 중 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">이미지 사이즈 조절기</h1>
      <div className="flex gap-4 mb-6">
        <input 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <Button 
          onClick={processImages} 
          disabled={loading || data.length === 0}
          className="min-w-[120px]"
        >
          {loading ? '처리중...' : '이미지 처리'}
        </Button>
        <Button 
          onClick={downloadAllProcessed}
          disabled={!data.some(item => item.processed)}
          className="min-w-[120px]"
        >
          다운로드
        </Button>
        <Button 
          variant="outline"
          onClick={handleSaveToDatabase}
          disabled={!data.some(item => item.processed) || isSaving}
          className="min-w-[140px]"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? '저장중...' : '이미지정보저장'}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 flex flex-col items-center">
            <div className="relative w-full h-48 mb-2">
              <Image
                src={item.processed || item.thumbnail}
                alt={item.name || `Image ${index + 1}`}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <p className="text-sm font-medium text-center break-all">
              {item.name || `Image ${index + 1}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
} 