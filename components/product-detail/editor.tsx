import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useState } from 'react'

interface EditorProps {
  content: string
  isEditing: boolean
  onContentChange: (content: string) => void
  flag: 'MOVE' | 'NONE'
}

export function ProductEditor({ content, isEditing, onContentChange, flag }: EditorProps) {
  const [isHtmlSourceOpen, setIsHtmlSourceOpen] = useState(false)
  const [htmlSource, setHtmlSource] = useState('')

  // HTML을 QOO10 형식으로 변환하는 함수
  const convertHtmlToQoo10Format = (html: string) => {
    return html
      .replace(/<p class="ql-align-center"><img([^>]*)><\/p>/g, '<div style="text-align: center;"><img$1></div>')
      .replace(/<p><img([^>]*)><\/p>/g, '<div><img style="display: block; margin-left: auto; margin-right: auto;"$1></div>')
      .replace(/<p class="ql-align-center">(.*?)<\/p>/g, '<div style="text-align: center;">$1</div>')
      .replace(/<p>(.*?)<\/p>/g, '<div>$1</div>')
      .replace(/<p><br><\/p>/g, '')
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-500">
        <p>텍스트 사용량: {content?.length || 0}B/1024KB (1MB)</p>
        <p>이미지 사용량: 0% 177KB/40960KB (40MB)</p>
        <p className="text-xs mt-1">
          [권장 이미지] 사이즈: 가로 최대 820px / 용량: 한 장당 1MB / 형식: JPG, JPEG, PNG, GIF
        </p>
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <div className="border rounded-lg">
            <CKEditor
              editor={ClassicEditor}
              data={content || ''}
              config={{
                toolbar: [
                  'heading',
                  '|',
                  'bold',
                  'italic',
                  'link',
                  'bulletedList',
                  'numberedList',
                  '|',
                  'outdent',
                  'indent',
                  '|',
                  'imageUpload',
                  'blockQuote',
                  'insertTable',
                  'mediaEmbed',
                  'undo',
                  'redo',
                  '|',
                  'alignment',
                  'sourceEditing'
                ],
                language: 'ko',
                image: {
                  toolbar: [
                    'imageTextAlternative',
                    'imageStyle:inline',
                    'imageStyle:block',
                    'imageStyle:side'
                  ]
                }
              }}
              onChange={(event, editor) => {
                const data = editor.getData()
                onContentChange(data)
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!content) return
                const convertedHtml = convertHtmlToQoo10Format(content)
                onContentChange(convertedHtml)
              }}
            >
              QOO10 형식으로 변환
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!content) return
                setHtmlSource(content)
                setIsHtmlSourceOpen(true)
              }}
            >
              HTML 소스 보기/편집
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className="border rounded-lg p-4 min-h-[200px] bg-white"
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
      )}

      {/* HTML 소스보기/편집 모달 */}
      <Dialog open={isHtmlSourceOpen} onOpenChange={setIsHtmlSourceOpen}>
        <DialogContent className="max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>HTML 소스 보기/편집</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              value={htmlSource}
              onChange={(e) => setHtmlSource(e.target.value)}
              className="w-full h-[500px] font-mono text-sm p-4 border rounded-lg"
              spellCheck={false}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHtmlSourceOpen(false)}>
              취소
            </Button>
            <Button onClick={() => {
              onContentChange(htmlSource)
              setIsHtmlSourceOpen(false)
            }}>
              적용
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 