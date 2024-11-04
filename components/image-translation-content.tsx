'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ImageInfo {
  original: string;
  originalFile: File;
  translated?: string;
  name: string;
  width: number;
  height: number;
  selected: boolean;
  isTranslationSuccessful?: boolean;
}

interface LanguageOption {
  value: string;
  label: string;
}

const LANGUAGES: LanguageOption[] = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: '영어' },
  { value: 'ja', label: '일본어' },
  { value: 'zh-CN', label: '중국어(간체)' },
  { value: 'zh-TW', label: '중국어(번체)' },
  { value: 'vi', label: '베트남어' },
  { value: 'id', label: '인도네시아어' },
  { value: 'th', label: '태국어' },
  { value: 'de', label: '독일어' },
  { value: 'ru', label: '러시아어' },
  { value: 'es', label: '스페인어' },
  { value: 'it', label: '이탈리아어' },
  { value: 'fr', label: '프랑스어' }
]

export default function ImageTranslationContent() {
  const { toast } = useToast()
  const [images, setImages] = useState<ImageInfo[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [sourceLanguage, setSourceLanguage] = useState('ko')
  const [targetLanguage, setTargetLanguage] = useState('en')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const leftColumnRef = useRef<HTMLDivElement>(null)
  const rightColumnRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map(file => ({
        original: URL.createObjectURL(file),
        originalFile: file,
        name: file.name,
        width: 0,
        height: 0,
        selected: false
      }))
      setImages(prev => [...prev, ...newImages])
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const toggleImageSelection = (index: number) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, selected: !img.selected } : img
    ))
  }

  const toggleAllSelection = (select: boolean) => {
    setImages(prev => prev.map(img => ({ ...img, selected: select })))
  }

  const translateImage = async (file: File): Promise<string> => {
    const base64Image = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })

    try {
      const response = await fetch('/api/translate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          source: sourceLanguage,
          target: targetLanguage
        }),
      })

      if (!response.ok) {
        console.error('Translation request failed:', response.status)
        return base64Image  // 실패 시 원본 이미지 반환
      }

      const data = await response.json()
      
      // API 응답에서 번역된 이미지 또는 원본 이미지 반환
      if (data.translatedImage) {
        return `data:image/png;base64,${data.translatedImage}`
      } else if (data.originalImage) {
        return data.originalImage
      }
      
      // 예상치 못한 응답 형식인 경우 원본 이미지 반환
      console.error('Unexpected API response format:', data)
      return base64Image

    } catch (error) {
      console.error('Translation error:', error)
      return base64Image  // 오류 발생 시 원본 이미지 반환
    }
  }

  const translateSelectedImages = async () => {
    setLoading(true)
    try {
      const translationPromises = images.map(async (img, index) => {
        if (!img.selected || img.translated) {
          return img;
        }

        try {
          const translatedImage = await translateImage(img.originalFile)
          console.log(`Image ${index + 1} translation completed`)
          // 번역 결과가 원본과 다른 경우에만 translated 플래그 설정
          const isTranslated = translatedImage !== img.original
          return { 
            ...img, 
            translated: translatedImage,
            isTranslationSuccessful: isTranslated  // 번역 성공 여부 표시
          }
        } catch (error) {
          console.error(`Failed to translate image ${index + 1}:`, error)
          return { 
            ...img, 
            translated: img.original,  // 실패 시 원본 이미지 사용
            isTranslationSuccessful: false
          }
        }
      })

      const updatedImages = await Promise.allSettled(translationPromises)
      
      const newImages = updatedImages.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value
        }
        console.error(`Image ${index + 1} translation rejected:`, result.reason)
        return {
          ...images[index],
          translated: images[index].original,  // 실패 시 원본 이미지 사용
          isTranslationSuccessful: false
        }
      })

      setImages(newImages)
      toast({
        description: "번역 작업이 완료되었습니다."
      })
    } catch (error) {
      console.error('Translation process error:', error)
      toast({
        variant: "destructive",
        title: "오류",
        description: "일부 이미지 번역 중 오류가 발생했습니다."
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadAllTranslated = async () => {
    const zip = new JSZip()
    
    const selectedImages = images.filter(img => img.selected)

    if (selectedImages.length === 0) {
      toast({
        variant: "destructive",
        description: "다운로드할 이미지가 없습니다."
      })
      return
    }

    selectedImages.forEach((img, index) => {
      const imageData = (img.translated || img.original).split(',')[1]
      const fileName = img.translated 
        ? `translated_${img.name}`
        : `original_${img.name}`
      
      zip.file(fileName, imageData, { base64: true })
    })

    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, 'translated_images.zip')
    
    toast({
      description: "이미지 다운로드가 완료되었습니다."
    })
  }

  return (
    <div className="p-6 flex flex-col h-screen">
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">원본 언어:</span>
            <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">번역할 언어:</span>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex space-x-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            ref={fileInputRef}
          />
          <Button onClick={handleUploadClick}>이미지 업로드</Button>
          <Button 
            onClick={translateSelectedImages} 
            disabled={loading || !images.some(img => img.selected && !img.translated)}
          >
            {loading ? '번역 중...' : '선택한 이미지 번역'}
          </Button>
          <Button onClick={() => toggleAllSelection(true)}>전체 선택</Button>
          <Button onClick={() => toggleAllSelection(false)}>전체 해제</Button>
          <Button 
            onClick={downloadAllTranslated} 
            disabled={!images.some(img => img.translated)}
          >
            번역된 이미지 다운로드
          </Button>
        </div>
      </div>

      <div className="flex flex-grow overflow-hidden">
        <div ref={leftColumnRef} className="w-1/2 overflow-y-auto pr-2">
          {images.map((image, index) => (
            <div key={`original-${index}`} className="mb-4">
              <div 
                className={`relative border-2 ${image.selected ? 'border-blue-500' : 'border-gray-300'} cursor-pointer`}
                onClick={() => toggleImageSelection(index)}
              >
                <Image
                  src={image.original}
                  alt={`Original ${index + 1}`}
                  width={500}
                  height={500}
                  className="w-full h-auto"
                  unoptimized
                />
                <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded">
                  <input
                    type="checkbox"
                    checked={image.selected}
                    onChange={() => toggleImageSelection(index)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="ml-2 text-sm">원본</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div ref={rightColumnRef} className="w-1/2 overflow-y-auto pl-2">
          {images.map((image, index) => (
            <div key={`translated-${index}`} className="mb-4">
              {image.selected && (
                <div className="relative border-2 border-gray-300">
                  <Image
                    src={image.translated || image.original}  // 번역된 이미지 또는 원본 이미지
                    alt={`Translated ${index + 1}`}
                    width={500}
                    height={500}
                    className="w-full h-auto"
                    unoptimized
                  />
                  <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded">
                    <span className="text-sm">
                      {image.translated ? (
                        image.isTranslationSuccessful ? 
                          '번역 완료' : 
                          '번역 실패 (원본 표시)'
                      ) : '번역 대기중'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
          {!images.some(img => img.selected) && (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>이미지를 선택해주세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}