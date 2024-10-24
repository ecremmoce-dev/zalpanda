'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface ImageInfo {
  original: string;
  originalFile: File;
  translated?: string;
  name: string;
  width: number;
  height: number;
  selected: boolean;
}

export default function ImageTranslation() {
  const [images, setImages] = useState<ImageInfo[]>([])
  const [loading, setLoading] = useState<boolean>(false)
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

  useEffect(() => {
    if (typeof window !== 'undefined') {  // 클라이언트 사이드에서만 실행
      images.forEach((image, index) => {
        if (image.width === 0 || image.height === 0) {
          const img = new window.Image()
          img.onload = () => {
            setImages(prev => prev.map((prevImage, i) => 
              i === index ? { ...prevImage, width: img.width, height: img.height } : prevImage
            ))
          }
          img.src = image.original
        }
      })
    }
  }, [images])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const translateImage = async (file: File): Promise<string> => {
    const base64Image = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })

    const response = await fetch('/api/translate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'ko',
        target: 'en',
        image: base64Image,
      }),
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    if (data.originalImage) {
      return data.originalImage; // 원본 이미지 반환 (텍스트가 없는 경우)
    }

    return `data:image/jpeg;base64,${data.translatedImage}`;
  }

  const toggleImageSelection = (index: number) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, selected: !img.selected } : img
    ))
  }

  const toggleAllSelection = (select: boolean) => {
    setImages(prev => prev.map(img => ({ ...img, selected: select })))
  }

  const translateSelectedImages = async () => {
    setLoading(true)
    try {
      const updatedImages = await Promise.all(
        images.map(async (img) => {
          if (img.selected && !img.translated) {
            const translatedImage = await translateImage(img.originalFile)
            return { ...img, translated: translatedImage }
          }
          return img
        })
      )
      setImages(updatedImages)
    } catch (error) {
      console.error('번역 중 오류 발생:', error)
      alert('이미지 번역 중 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  const downloadAllTranslated = async () => {
    const zip = new JSZip()
    const translatedImages = images.filter(img => img.translated)

    if (translatedImages.length === 0) {
      alert('다운로드할 번역된 이미지가 없습니다.')
      return
    }

    translatedImages.forEach((img, index) => {
      const imgData = img.translated!.split(',')[1] // Remove the data URL prefix
      zip.file(`translated_image_${index + 1}.png`, imgData, { base64: true })
    })

    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, 'translated_images.zip')
  }

  const downloadAllImages = () => {
    images.forEach((img, index) => {
      const imageUrl = img.translated || img.original
      fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
          const fileName = `image_${index + 1}.png`
          saveAs(blob, fileName)
        })
        .catch(error => {
          console.error('이미지 다운로드 중 오류 발생:', error)
          alert(`이미지 ${index + 1} 다운로드 중 오류가 발생했습니다.`)
        })
    })
  }

  useEffect(() => {
    const leftColumn = leftColumnRef.current
    const rightColumn = rightColumnRef.current

    if (leftColumn && rightColumn) {
      const handleScroll = () => {
        if (leftColumn.scrollTop !== rightColumn.scrollTop) {
          rightColumn.scrollTop = leftColumn.scrollTop
        }
      }

      leftColumn.addEventListener('scroll', handleScroll)
      rightColumn.addEventListener('scroll', handleScroll)

      return () => {
        leftColumn.removeEventListener('scroll', handleScroll)
        rightColumn.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  return (
    <div className="p-6 flex flex-col h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">이미지 번역</h2>
      
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
        <Button onClick={translateSelectedImages} disabled={loading || !images.some(img => img.selected && !img.translated)}>
          선택한 이미지 번역
        </Button>
        <Button onClick={() => toggleAllSelection(true)}>전체 선택</Button>
        <Button onClick={() => toggleAllSelection(false)}>전체 해제</Button>
        <Button onClick={downloadAllTranslated} disabled={!images.some(img => img.translated)}>
          전체 다운로드
        </Button>
        <Button onClick={downloadAllImages} disabled={images.length === 0}>
          모든 이미지 다운로드
        </Button>
      </div>

      <div className="flex flex-grow overflow-hidden">
        <div ref={leftColumnRef} className="w-1/2 overflow-y-auto pr-2 flex flex-col items-end">
          {images.map((image, index) => (
            <div key={index} className="mb-4">
              <div 
                className={`relative border-2 ${image.selected ? 'border-blue-500' : 'border-gray-300'} cursor-pointer`} 
                style={{ width: image.width, height: image.height }}
                onClick={() => toggleImageSelection(index)}
              >
                <Image
                  src={image.original}
                  alt={`Original image ${index + 1}`}
                  layout="fill"
                  objectFit="contain"
                />
                <div className="absolute top-2 left-2 z-10 flex items-center">
                  <input
                    type="checkbox"
                    checked={image.selected}
                    onChange={() => toggleImageSelection(index)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="ml-2 text-sm">
                    {image.width} x {image.height}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div ref={rightColumnRef} className="w-1/2 overflow-y-auto pl-2 text-left">
          {images.map((image, index) => (
            <div key={index} className="mb-4">
              <div 
                className="relative border-2 border-gray-300" 
                style={{ width: image.width, height: image.height }}
              >
                <Image
                  src={image.translated || image.original}
                  alt={`${image.translated ? 'Translated' : 'Original'} image ${index + 1}`}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
