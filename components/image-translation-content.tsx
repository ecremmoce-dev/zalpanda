'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUrlModal } from "@/components/image-url-modal"

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
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false)

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
        throw new Error(`Translation failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        console.error('Translation error:', data.error)
        throw new Error(data.error)
      }

      if (data.translatedImage) {
        return `data:image/png;base64,${data.translatedImage}`
      }

      throw new Error('No translation result')
    } catch (error) {
      console.error('Translation error:', error)
      throw error
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
    
    const downloadTargetImages = images.filter(img => 
      img.selected && (img.translated !== undefined)
    )

    if (downloadTargetImages.length === 0) {
      toast({
        variant: "destructive",
        description: "다운로드할 이미지가 없습니다. 이미지를 선택하고 번역을 시도해주세요."
      })
      return
    }

    let successCount = 0
    let failCount = 0

    await Promise.all(downloadTargetImages.map(async (img, index) => {
      let imageData: string;
      
      if (img.isTranslationSuccessful && img.translated) {
        // 번역 성공한 이미지
        imageData = img.translated.split(',')[1]
      } else {
        // 번역 실패한 경우 원본 파일을 비동기적으로 읽기
        imageData = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            const result = reader.result as string
            resolve(result.split(',')[1])
          }
          reader.readAsDataURL(img.originalFile)
        })
      }

      // 파일명 형식 수정
      const fileName = img.isTranslationSuccessful 
        ? `${String(index + 1).padStart(3, '0')}-translated_image.png`
        : `${String(index + 1).padStart(3, '0')}-original_image.png`
      
      zip.file(fileName, imageData, { base64: true })

      if (img.isTranslationSuccessful) {
        successCount++
      } else {
        failCount++
      }
    }))

    try {
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, 'translated_images.zip')
      
      toast({
        description: `다운로드 완료 (총 ${downloadTargetImages.length}개)
          ${successCount > 0 ? `\n- 번역 성공: ${successCount}개` : ''}
          ${failCount > 0 ? `\n- 번역 실패 (원본 다운로드): ${failCount}개` : ''}`
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        variant: "destructive",
        description: "이미지 다운로드 중 오류가 발생했습니다."
      })
    }
  }

  const handleUrlUpload = async (urls: string[]) => {
    try {
      const loadingToast = toast({
        description: "이미지 로딩 중...",
      })

      // 유효한 URL만 필터링
      const validUrls = urls.filter(url => {
        try {
          new URL(url)
          return true
        } catch {
          return false
        }
      })

      const results = await Promise.allSettled(
        validUrls.map(async (url) => {
          try {
            // 먼저 직접 이미지 가져오기 시도
            const response = await fetch(url)
            const blob = await response.blob()
            const fileName = url.split('/').pop()?.split('?')[0] || `image-${Date.now()}.png`
            const file = new File([blob], fileName, { type: blob.type })
            const dataUrl = URL.createObjectURL(blob)

            return {
              original: dataUrl,
              originalFile: file,
              name: fileName,
              width: 0,
              height: 0,
              selected: false
            }
          } catch (error) {
            // CORS 오류 등이 발생하면 프록시 서버를 통해 재시도
            const proxyResponse = await fetch('/api/proxy-image', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ url }),
            })

            if (!proxyResponse.ok) {
              throw new Error('Proxy fetch failed')
            }

            const { image: dataUrl } = await proxyResponse.json()
            
            // base64 데이터 URL을 Blob으로 변환
            const response = await fetch(dataUrl)
            const blob = await response.blob()
            const fileName = url.split('/').pop()?.split('?')[0] || `image-${Date.now()}.png`
            const file = new File([blob], fileName, { type: blob.type })

            return {
              original: dataUrl,
              originalFile: file,
              name: fileName,
              width: 0,
              height: 0,
              selected: false
            }
          }
        })
      )

      loadingToast.dismiss()

      // 성공한 결과만 필터링
      const successfulUploads = results
        .filter((result): result is PromiseFulfilledResult<ImageInfo> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value)

      const failedCount = results.filter(result => result.status === 'rejected').length

      // 상태 업데이트
      if (successfulUploads.length > 0) {
        setImages(prev => [...prev, ...successfulUploads])
        toast({
          description: `${successfulUploads.length}개의 이미지가 추가되었습니다.${
            failedCount > 0 ? ` (${failedCount}개 실패)` : ''
          }`,
        })
      }

      if (failedCount > 0) {
        toast({
          variant: "destructive",
          description: `${failedCount}개의 이미지 업로드에 실패했습니다.`,
        })
      }

    } catch (error) {
      console.error('URL 이미지 로딩 실패:', error)
      toast({
        variant: "destructive",
        description: "이미지 URL 처리 중 오류가 발생했습니다.",
      })
    }
  }

  useEffect(() => {
    const leftColumn = leftColumnRef.current
    const rightColumn = rightColumnRef.current

    if (!leftColumn || !rightColumn) return

    const handleScroll = (event: Event) => {
      const target = event.target as HTMLDivElement
      if (target === leftColumn) {
        rightColumn.scrollTop = leftColumn.scrollTop
      } else if (target === rightColumn) {
        leftColumn.scrollTop = rightColumn.scrollTop
      }
    }

    leftColumn.addEventListener('scroll', handleScroll)
    rightColumn.addEventListener('scroll', handleScroll)

    return () => {
      leftColumn.removeEventListener('scroll', handleScroll)
      rightColumn.removeEventListener('scroll', handleScroll)
    }
  }, [])

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
          <Button onClick={() => setIsUrlModalOpen(true)}>링크 업로드</Button>
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
        <div 
          ref={leftColumnRef} 
          className="w-1/2 overflow-y-auto pr-2"
          style={{ scrollbarGutter: 'stable' }}
        >
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
        <div 
          ref={rightColumnRef} 
          className="w-1/2 overflow-y-auto pl-2"
          style={{ scrollbarGutter: 'stable' }}
        >
          {images.map((image, index) => (
            <div key={`translated-${index}`} className="mb-4">
              <div className="relative">
                <div className={`relative border-2 border-gray-300`}>
                  <Image
                    src={image.translated || image.original}
                    alt={`Translated ${index + 1}`}
                    width={500}
                    height={500}
                    className="w-full h-auto"
                    unoptimized
                  />
                  {!image.selected && (
                    <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="text-white bg-gray-900/70 px-4 py-2 rounded-md">
                        미선택 이미지
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded">
                    <span className="text-sm">
                      {image.selected ? (
                        image.translated ? (
                          image.isTranslationSuccessful ? 
                            '번역 완료' : 
                            '역 실패 (원본 표시)'
                        ) : '번역 대기중'
                      ) : '미선택'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>이미지를 업로드해주세요</p>
            </div>
          )}
        </div>
      </div>

      <ImageUrlModal 
        isOpen={isUrlModalOpen}
        onClose={() => setIsUrlModalOpen(false)}
        onUpload={handleUrlUpload}
      />
    </div>
  )
}