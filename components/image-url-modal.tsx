import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface ImageUrlModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (urls: string[]) => void
}

export function ImageUrlModal({ isOpen, onClose, onUpload }: ImageUrlModalProps) {
  const [urlText, setUrlText] = useState('')
  const { toast } = useToast()

  const handleUpload = () => {
    // URL 추출을 위한 정규식
    const urlRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp))/gi
    const urls = urlText.match(urlRegex)

    if (!urls || urls.length === 0) {
      toast({
        variant: "destructive",
        description: "유효한 이미지 URL을 찾을 수 없습니다."
      })
      return
    }

    onUpload(urls)
    setUrlText('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>이미지 URL 입력</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="이미지 URL을 입력하세요 (여러 URL은 줄바꿈으로 구분)"
            value={urlText}
            onChange={(e) => setUrlText(e.target.value)}
            className="min-h-[200px]"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>취소</Button>
            <Button onClick={handleUpload}>업로드</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 