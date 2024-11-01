'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { createWorker } from 'tesseract.js'
import { Progress } from "@/components/ui/progress"

export function ImageTextDetection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [detectedText, setDetectedText] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setDetectedText("")
      setProgress(0)
    }
  }

  const handleDetectText = async () => {
    if (!selectedFile) return
    
    setIsProcessing(true)
    setProgress(0)
    
    try {
      const worker = await createWorker()
      
      worker.logger = (m) => {
        if (m.status === 'recognizing text') {
          setProgress(m.progress * 100)
        }
      }

      // 한국어와 영어 모두 인식하도록 설정
      await worker.loadLanguage('kor+eng')
      await worker.initialize('kor+eng')
      
      const { data: { text } } = await worker.recognize(selectedFile)
      setDetectedText(text)
      
      await worker.terminate()
    } catch (error) {
      console.error('텍스트 검출 중 오류 발생:', error)
      setDetectedText('텍스트 검출 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
      setProgress(100)
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">이미지 업로드</h3>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
        </div>
        
        {previewUrl && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">이미지 미리보기</h3>
            <div className="max-w-md">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        )}
        
        {selectedFile && (
          <div>
            <Button 
              onClick={handleDetectText} 
              disabled={isProcessing}
            >
              {isProcessing ? '텍스트 검출 중...' : '텍스트 검출하기'}
            </Button>
          </div>
        )}
        
        {isProcessing && (
          <div className="space-y-2">
            <div className="text-sm text-gray-500">
              처리 중... {Math.round(progress)}%
            </div>
            <Progress value={progress} />
          </div>
        )}
        
        {detectedText && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">검출된 텍스트</h3>
            <div className="p-4 bg-muted rounded-lg">
              <pre className="whitespace-pre-wrap">{detectedText}</pre>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
} 