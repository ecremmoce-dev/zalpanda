'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, Trash, Split, Plus, Minus } from 'lucide-react';

interface GuideLine {
  id: number;
  y: number;
}

interface ImageItem {
  id: string;
  originalImage: string;
  imageSize: { width: number; height: number };
  guideLines: GuideLine[];
  splitImages: string[];
  isGuidelineModified: boolean;
  splitCount: number;
}

export function ImageSplitConverter() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isDragging, setIsDragging] = useState<{imageId: string; lineId: number} | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgSrc = e.target?.result as string;
        
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
          const imageId = `img-${Date.now()}-${Math.random()}`;
          const newSize = {
            width: img.width,
            height: img.height
          };
          
          const initialSplitCount = 5;
          const partHeight = newSize.height / initialSplitCount;
          const lines: GuideLine[] = [];
          
          for (let i = 1; i < initialSplitCount; i++) {
            const y = Math.round(partHeight * i);
            lines.push({ id: i, y });
          }
          
          setImages(prev => [...prev, {
            id: imageId,
            originalImage: imgSrc,
            imageSize: newSize,
            guideLines: lines,
            splitImages: [],
            isGuidelineModified: false,
            splitCount: initialSplitCount
          }]);
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const initializeGuideLines = (imageId: string) => {
    setImages(prev => prev.map(img => {
      if (img.id !== imageId) return img;
      
      const partHeight = img.imageSize.height / img.splitCount;
      const lines: GuideLine[] = [];
      
      for (let i = 1; i < img.splitCount; i++) {
        const y = Math.round(partHeight * i);
        lines.push({ id: i, y });
      }
      
      return {
        ...img,
        guideLines: lines,
        isGuidelineModified: false
      };
    }));
  };

  const handleSplitImage = (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image || !image.guideLines.length) return;

    const img = new Image();
    img.src = image.originalImage;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const results: string[] = [];
      let prevY = 0;

      [...image.guideLines, { id: image.splitCount, y: image.imageSize.height }].forEach((line) => {
        canvas.width = img.width;
        canvas.height = line.y - prevY;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(
          img,
          0, prevY,
          img.width, line.y - prevY,
          0, 0,
          img.width, line.y - prevY
        );

        results.push(canvas.toDataURL('image/png'));
        prevY = line.y;
      });

      setImages(prev => prev.map(img => {
        if (img.id !== imageId) return img;
        return {
          ...img,
          splitImages: results
        };
      }));
    };
  };

  const handleMouseDown = (e: React.MouseEvent, imageId: string, lineId: number) => {
    e.preventDefault();
    const container = e.currentTarget.closest('.original-image-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    setIsDragging({ imageId, lineId });
    setDragStartY(e.clientY - rect.top);
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const container = document.querySelector(`[data-image-id="${isDragging.imageId}"]`);
    const img = container?.querySelector('img');
    if (!container || !img) return;

    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    
    const imgTop = imgRect.top - containerRect.top;
    const imgHeight = imgRect.height;
    const mouseY = e.clientY - containerRect.top - imgTop;
    
    setImages(prev => prev.map(img => {
      if (img.id !== isDragging.imageId) return img;

      const image = prev.find(i => i.id === isDragging.imageId);
      if (!image) return img;

      const positionRatio = mouseY / imgHeight;
      const actualY = Math.round(image.imageSize.height * positionRatio);

      const newGuideLines = img.guideLines.map(line => {
        if (line.id === isDragging.lineId) {
          const prevLine = img.guideLines.find(l => l.id === line.id - 1);
          const nextLine = img.guideLines.find(l => l.id === line.id + 1);
          const minY = prevLine ? prevLine.y + 5 : 5;
          const maxY = nextLine ? nextLine.y - 5 : image.imageSize.height - 5;
          
          return { ...line, y: Math.max(minY, Math.min(maxY, actualY)) };
        }
        return line;
      });

      return {
        ...img,
        guideLines: newGuideLines,
        isGuidelineModified: true
      };
    }));
  };

  const handleGlobalMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  const handleDownload = (imageUrl: string, imageId: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `split-image-${imageId}-${index + 1}.png`;
    link.click();
  };

  const handleDownloadAll = () => {
    images.forEach(image => {
      image.splitImages.forEach((imgSrc, index) => {
        const link = document.createElement('a');
        link.href = imgSrc;
        link.download = `split-image-${image.id}-${index + 1}.png`;
        link.click();
      });
    });
  };

  const handleSplitCountChange = (imageId: string, newCount: number) => {
    if (newCount < 2 || newCount > 50) return;

    setImages(prev => prev.map(img => {
      if (img.id !== imageId) return img;
      
      const partHeight = img.imageSize.height / newCount;
      const lines: GuideLine[] = [];
      
      for (let i = 1; i < newCount; i++) {
        const y = Math.round(partHeight * i);
        lines.push({ id: i, y });
      }
      
      return {
        ...img,
        splitCount: newCount,
        guideLines: lines,
        isGuidelineModified: false,
        splitImages: []
      };
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="imageInput"
          multiple
        />
        <label
          htmlFor="imageInput"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
        >
          이미지 선택 (다중 선택 가능)
        </label>
        {images.some(img => img.splitImages.length > 0) && (
          <button
            onClick={handleDownloadAll}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            전체 다운로드
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {images.map((image) => (
          <div key={image.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <div className="sticky top-4 z-30 flex justify-end gap-2 mb-2">
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-lg p-1">
                    <button
                      onClick={() => handleSplitCountChange(image.id, image.splitCount - 1)}
                      className="p-1.5 text-white hover:bg-white/20 rounded"
                      disabled={image.splitCount <= 2}
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-white px-3 min-w-[2.5rem] text-center text-lg">
                      {image.splitCount}
                    </span>
                    <button
                      onClick={() => handleSplitCountChange(image.id, image.splitCount + 1)}
                      className="p-1.5 text-white hover:bg-white/20 rounded"
                      disabled={image.splitCount >= 50}
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleSplitImage(image.id)}
                    className="p-2.5 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors"
                    title="분할하기"
                  >
                    <Split size={22} />
                  </button>

                  <button
                    onClick={() => handleRemoveImage(image.id)}
                    className="p-2.5 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors"
                    title="삭제"
                  >
                    <Trash size={22} />
                  </button>
                </div>

                <div 
                  className="relative border rounded-lg overflow-hidden bg-gray-200 original-image-container group"
                  data-image-id={image.id}
                >
                  <div className="relative">
                    <img
                      src={image.originalImage}
                      alt="Original"
                      className="w-full h-auto object-contain"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {image.guideLines.map((line) => (
                      <div
                        key={line.id}
                        className="absolute left-0 right-0 flex items-center justify-center group/line"
                        style={{ 
                          top: `${(line.y / image.imageSize.height) * 100}%`,
                          transform: 'translateY(-50%)',
                          zIndex: 20
                        }}
                      >
                        <div
                          className="absolute w-full h-[20px] cursor-ns-resize"
                          onMouseDown={(e) => handleMouseDown(e, image.id, line.id)}
                          style={{ zIndex: 22 }}
                        />
                        <div 
                          className="absolute w-full flex items-center"
                          style={{ zIndex: 21 }}
                        >
                          <div className="w-full h-[2px] bg-red-600 opacity-70 group-hover/line:opacity-90" />
                          <div className="absolute left-2 bg-red-600 text-white text-xs px-1 rounded">
                            {line.id}
                          </div>
                          <div className="absolute left-1/2 -translate-x-1/2 w-[60px] h-[20px] bg-red-600 opacity-70 group-hover/line:opacity-90" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {image.splitImages.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {image.splitImages.map((splitImg, idx) => (
                      <div 
                        key={idx} 
                        className="relative border rounded-lg overflow-hidden group"
                      >
                        <img
                          src={splitImg}
                          alt={`Split ${idx + 1}`}
                          className="w-full h-auto"
                        />
                        <div 
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                          onClick={() => handleDownload(splitImg, image.id, idx)}
                        >
                          <Download 
                            className="text-white" 
                            size={24}
                          />
                        </div>
                        <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    분할된 이미지가 없습니다
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
} 