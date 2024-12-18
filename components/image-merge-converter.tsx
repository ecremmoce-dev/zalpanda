'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, Trash, GripVertical, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getKTCloudToken } from '@/lib/ktcloud/token';
import { uploadImageToKTCloud } from '@/lib/ktcloud/upload';

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

interface SortableImageItemProps {
  image: ImageItem;
  index: number;
  onRemove: (id: string) => void;
}

// 정렬 가능한 이미지 아이템 컴포넌트
function SortableImageItem({ image, index, onRemove }: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative border rounded-lg p-4 ${
        isDragging ? 'border-primary bg-accent' : 'border-border'
      }`}
    >
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
        <span className="truncate flex-1" title={image.file.name}>
          {image.file.name}
        </span>
      </div>
      
      <div className="flex items-center gap-4 w-full">
        <button
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent rounded"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-shrink-0 w-24 h-24 border rounded-md overflow-hidden">
          <img
            src={image.preview}
            alt={`Preview ${index + 1}`}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-grow" />
        <Button
          onClick={() => onRemove(image.id)}
          variant="destructive"
          size="icon"
          className="flex-shrink-0"
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function ImageMergeConverter() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewMergedImage, setPreviewMergedImage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [itemCode, setItemCode] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length < 2) {
      alert('2장 이상의 이미지를 선택해주세요.');
      return;
    }

    const newImages: ImageItem[] = [];
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          newImages.push({
            id: `img-${Date.now()}-${Math.random()}`,
            file,
            preview: reader.result as string
          });
          if (newImages.length === files.length) {
            setImages(newImages);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const mergeAndDownload = async () => {
    if (images.length < 2) {
      alert('2장 이상의 이미지를 선택해주세요.');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 이미지 로드 및 크기 계산을 위한 Promise 배열
    const loadedImages = await Promise.all(
      images.map(
        (img) =>
          new Promise<{ element: HTMLImageElement; width: number; height: number }>(
            (resolve) => {
              const imgElement = new Image();
              imgElement.onload = () => {
                resolve({
                  element: imgElement,
                  width: imgElement.width,
                  height: imgElement.height
                });
              };
              imgElement.src = img.preview;
            }
          )
      )
    );

    // 캔버스 크기 설정
    const maxWidth = Math.max(...loadedImages.map(img => img.width));
    const totalHeight = loadedImages.reduce((sum, img) => sum + img.height, 0);

    canvas.width = maxWidth;
    canvas.height = totalHeight;

    // 배경을 흰색으로 설정
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 이미지 그리기
    let currentY = 0;
    loadedImages.forEach((img) => {
      // 이미지를 캔버스 가운데 정렬
      const x = (maxWidth - img.width) / 2;
      ctx.drawImage(img.element, x, currentY);
      currentY += img.height;
    });

    // 다운로드
    const link = document.createElement('a');
    link.download = `merged-image-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // 미리기 이미지 생성 함수
  const generatePreview = async () => {
    if (images.length < 2) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loadedImages = await Promise.all(
      images.map(
        (img) =>
          new Promise<{ element: HTMLImageElement; width: number; height: number }>(
            (resolve) => {
              const imgElement = new Image();
              imgElement.onload = () => {
                resolve({
                  element: imgElement,
                  width: imgElement.width,
                  height: imgElement.height
                });
              };
              imgElement.src = img.preview;
            }
          )
      )
    );

    const maxWidth = Math.max(...loadedImages.map(img => img.width));
    const totalHeight = loadedImages.reduce((sum, img) => sum + img.height, 0);

    canvas.width = maxWidth;
    canvas.height = totalHeight;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let currentY = 0;
    loadedImages.forEach((img) => {
      const x = (maxWidth - img.width) / 2;
      ctx.drawImage(img.element, x, currentY);
      currentY += img.height;
    });

    setPreviewMergedImage(canvas.toDataURL('image/png'));
  };

  // 이미지가 변경될 때마다 미리보기 업데이트
  useEffect(() => {
    generatePreview();
  }, [images]);

  // 정렬 함수 추가
  const handleSort = (direction: 'asc' | 'desc') => {
    setImages(prev => {
      const sorted = [...prev].sort((a, b) => {
        const nameA = a.file.name.toLowerCase();
        const nameB = b.file.name.toLowerCase();
        return direction === 'asc' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
      return sorted;
    });
  };

  const uploadToCloud = async () => {
    if (!canvasRef.current || !itemCode.trim()) return;
    
    try {
      setIsUploading(true);
      
      // origin 추가
      const origin = window.location.origin;
      
      // CORS 설정 적용 및 토큰 가져오기
      const corsResponse = await fetch('/api/ktcloud/container-cors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ origin })
      });
      
      if (!corsResponse.ok) {
        throw new Error('CORS 설정 실패');
      }
      
      const { token, storageUrl, containerName } = await corsResponse.json();
      
      // 캔버스를 Blob으로 변환
      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current?.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });
      
      // KT Cloud에 직접 업로드
      const fileName = `merged-${Date.now()}.png`;
      const uploadUrl = `${storageUrl}/${containerName}/${itemCode}/${fileName}`;
      
      console.log('Uploading to:', uploadUrl);
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'X-Auth-Token': token,
          'Content-Type': 'image/png',
          'Content-Length': blob.size.toString(),
          'X-Object-Meta-Width': 'auto',
          'X-Object-Meta-Height': 'auto'
        },
        body: blob
      });
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Upload failed:', {
          status: uploadResponse.status,
          headers: Object.fromEntries(uploadResponse.headers.entries()),
          body: errorText
        });
        throw new Error(`이미지 업로드 실패: ${uploadResponse.status} - ${errorText}`);
      }
      
      // 업로드된 이미지 URL 설정
      const imageUrl = `${storageUrl}/${containerName}/${itemCode}/${fileName}`;
      setUploadedUrl(`<img src="${imageUrl}" alt="merged image" />`);
      setShowUrlDialog(true);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uploadedUrl);
    alert('클립보드에 복사되었습니다.');
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-[calc(100vh-120px)]">
      {/* 왼쪽: 원본 이미지 목록 */}
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="imageInput"
              multiple
              onChange={handleImageUpload}
            />
            <label htmlFor="imageInput">
              <Button asChild>
                <span>이미지 선택 (2장 이상)</span>
              </Button>
            </label>

            {images.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    파일명으로 정렬
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleSort('asc')}>
                    오름차순 (A → Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('desc')}>
                    내림차순 (Z → A)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto">
          {images.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={images}
                strategy={verticalListSortingStrategy}
              >
                {images.map((image, index) => (
                  <SortableImageItem
                    key={image.id}
                    image={image}
                    index={index}
                    onRemove={removeImage}
                  />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            <div className="border rounded-lg p-6">
              <div className="h-[calc(100vh-300px)] flex items-center justify-center text-muted-foreground">
                2장 이상의 이미지를 선택해주세요
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 오른쪽: 미리보기 */}
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">미리보기</h2>
          {images.length >= 2 && (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                placeholder="itemCode 입력"
                className="h-10 px-3 rounded-md border border-input bg-background"
              />
              <Button 
                onClick={uploadToCloud} 
                disabled={isUploading || !itemCode.trim()}
                variant="secondary"
              >
                {isUploading ? '업로드 중...' : '클라우드 업로드'}
              </Button>
              <Button onClick={mergeAndDownload}>
                <Download className="w-4 h-4 mr-2" />
                이미지 다운로드
              </Button>
            </div>
          )}
        </div>

        <div className="border rounded-lg h-full overflow-auto">
          <div className="p-4">
            {previewMergedImage ? (
              <div className="flex justify-center">
                <img
                  src={previewMergedImage}
                  alt="미리보기"
                  className="max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                이미지를 선택하면 미리보기가 표시됩니다
              </div>
            )}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>이미지 URL</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-muted p-4 rounded-md">
              <code className="text-sm break-all">{uploadedUrl}</code>
            </div>
            <Button 
              onClick={copyToClipboard} 
              className="mt-4 w-full"
            >
              클립보드에 복사
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 