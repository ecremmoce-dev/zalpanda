'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, Trash, Split, Plus, Minus, RotateCcw, ArrowUpDown } from 'lucide-react';
import JSZip from 'jszip';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
  visibleArea?: {
    top: number;
    height: number;
  };
}

export function ImageSplitConverter() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isDragging, setIsDragging] = useState<{imageId: string; lineId: number} | null>(null);
  const [dragStartY, setDragStartY] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollableImages, setScrollableImages] = useState<Set<string>>(new Set());
  
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
            splitCount: initialSplitCount,
            visibleArea: {
              top: 0,
              height: 100
            }
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

  const handleDownload = async (imageUrl: string, imageId: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `split-image-${imageId}-${index + 1}.png`;
    link.click();
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    
    for (const image of images) {
      if (image.splitImages.length === 0) continue;
      
      if (image.splitImages.length === 1) {
        const link = document.createElement('a');
        link.href = image.splitImages[0];
        link.download = `split-image-${image.id}-1.png`;
        link.click();
        continue;
      }
      
      const folder = zip.folder(`split-images-${image.id}`);
      if (!folder) continue;

      for (let i = 0; i < image.splitImages.length; i++) {
        const imgData = image.splitImages[i];
        const base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        folder.file(`split-image-${i + 1}.png`, base64Data, { base64: true });
      }
    }

    try {
      const content = await zip.generateAsync({ type: "blob" });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `split-images-${Date.now()}.zip`;
      link.click();
      
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
    } catch (error) {
      console.error('ZIP 파일 생성 중 오류 생:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
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

  const handleImageScroll = (imageId: string, event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const scrollHeight = container.scrollHeight;

    setImages(prev => prev.map(img => {
      if (img.id !== imageId) return img;
      return {
        ...img,
        visibleArea: {
          top: (scrollTop / scrollHeight) * 100,
          height: (containerHeight / scrollHeight) * 100
        }
      };
    }));
  };

  const handleMinimapClick = (imageId: string, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    
    const minimap = e.currentTarget;
    const rect = minimap.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const minimapHeight = rect.height;
    
    setImages(prev => prev.map(image => {
      if (image.id !== imageId) return image;
      
      const positionRatio = clickY / minimapHeight;
      const actualY = Math.round(image.imageSize.height * positionRatio);
      
      const tooClose = image.guideLines.some(line => 
        Math.abs(line.y - actualY) < 20
      );
      
      if (tooClose) return image;
      
      return {
        ...image,
        splitCount: image.splitCount + 1,
        guideLines: [...image.guideLines, {
          id: image.guideLines.length + 1,
          y: actualY
        }].sort((a, b) => a.y - b.y).map((line, idx) => ({
          ...line,
          id: idx + 1
        })),
        isGuidelineModified: true
      };
    }));
  };

  const handleMinimapWheel = (imageId: string, e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const container = document.querySelector(`[data-image-id="${imageId}"]`) as HTMLDivElement;
    if (!container) return;

    const scrollAmount = e.deltaY;
    const currentScroll = container.scrollTop;
    const newScroll = currentScroll + scrollAmount;

    container.scrollTo({
      top: newScroll
    });
  };

  const checkImageScrollable = (imageId: string) => {
    const container = document.querySelector(`[data-image-id="${imageId}"]`);
    if (!container) return false;
    return container.scrollHeight > container.clientHeight;
  };

  const handleImageLoad = (imageId: string) => {
    const isScrollable = checkImageScrollable(imageId);
    setScrollableImages(prev => {
      const newSet = new Set(prev);
      if (isScrollable) {
        newSet.add(imageId);
      } else {
        newSet.delete(imageId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      images.forEach(image => {
        handleImageLoad(image.id);
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [images]);

  const handleAddGuideLine = (imageId: string) => {
    setImages(prev => prev.map(img => {
      if (img.id !== imageId) return img;
      
      const lastLine = [...img.guideLines].sort((a, b) => b.y - a.y)[0];
      const newY = lastLine ? Math.min(lastLine.y + 100, img.imageSize.height - 5) : img.imageSize.height / 2;
      
      return {
        ...img,
        splitCount: img.splitCount + 1,
        guideLines: [...img.guideLines, {
          id: img.guideLines.length + 1,
          y: newY
        }],
        isGuidelineModified: true
      };
    }));
  };

  const handleResetGuideLines = (imageId: string) => {
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

  const handleImageClick = (imageId: string, e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const img = container.querySelector('img');
    if (!img) return;
    
    const imgRect = img.getBoundingClientRect();
    const clickY = e.clientY - imgRect.top;
    const imgHeight = imgRect.height;
    
    setImages(prev => prev.map(image => {
      if (image.id !== imageId) return image;
      
      const positionRatio = clickY / imgHeight;
      const actualY = Math.round(image.imageSize.height * positionRatio);
      
      const tooClose = image.guideLines.some(line => 
        Math.abs(line.y - actualY) < 20
      );
      
      if (tooClose) return image;
      
      return {
        ...image,
        splitCount: image.splitCount + 1,
        guideLines: [...image.guideLines, {
          id: image.guideLines.length + 1,
          y: actualY
        }].sort((a, b) => a.y - b.y).map((line, idx) => ({
          ...line,
          id: idx + 1
        })),
        isGuidelineModified: true
      };
    }));
  };

  const handleDownloadImageSet = async (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image || image.splitImages.length === 0) return;

    if (image.splitImages.length === 1) {
      const link = document.createElement('a');
      link.href = image.splitImages[0];
      link.download = `split-image-${image.id}-1.png`;
      link.click();
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder(`split-images-${image.id}`);
    if (!folder) return;

    for (let i = 0; i < image.splitImages.length; i++) {
      const imgData = image.splitImages[i];
      const base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
      folder.file(`split-image-${i + 1}.png`, base64Data, { base64: true });
    }

    try {
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `split-images-${image.id}-${Date.now()}.zip`;
      link.click();
      
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
    } catch (error) {
      console.error('ZIP 파일 생성 중 오류 발생:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  const handleContainerWheel = (imageId: string, e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const container = document.querySelector(`[data-image-id="${imageId}"]`) as HTMLDivElement;
    if (!container) return;

    const scrollAmount = e.deltaY;
    const currentScroll = container.scrollTop;
    const newScroll = currentScroll + scrollAmount;

    container.scrollTo({
      top: newScroll
    });
  };

  useEffect(() => {
    const preventDefaultScroll = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      const isImageContainer = target.closest('.original-image-container');
      const isMinimap = target.closest('.minimap-container');
      
      if (isImageContainer || isMinimap) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', preventDefaultScroll, { passive: false });
    return () => window.removeEventListener('wheel', preventDefaultScroll);
  }, []);

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="imageInput"
          multiple
        />
        <label htmlFor="imageInput">
          <Button variant="default" asChild>
            <span>이미지 선택 (다중 선택 가능)</span>
          </Button>
        </label>
        {images.some(img => img.splitImages.length > 0) && (
          <Button 
            variant="default" 
            onClick={handleDownloadAll}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            전체 다운로드
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {images.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="relative w-full">
                  <div className="sticky top-4 z-30 flex justify-end gap-2 mb-2">
                    <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-md border">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSplitCountChange(image.id, image.splitCount - 1)}
                        disabled={image.splitCount <= 2}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-3 min-w-[2.5rem] text-center">
                        {image.splitCount}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAddGuideLine(image.id)}
                        disabled={image.splitCount >= 50}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleResetGuideLines(image.id)}
                      title="가이드라인 초기화"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleSplitImage(image.id)}
                      title="분할하기"
                    >
                      <Split className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveImage(image.id)}
                      title="삭제"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <div 
                      className="relative border rounded-lg overflow-hidden bg-muted original-image-container group"
                      style={{ height: 'calc(100vh - 200px)' }}
                      onWheel={(e) => handleContainerWheel(image.id, e)}
                    >
                      <div 
                        className="h-full overflow-y-auto"
                        data-image-id={image.id}
                        onScroll={(e) => handleImageScroll(image.id, e)}
                      >
                        <div className="relative">
                          <img
                            src={image.originalImage}
                            alt="Original"
                            className="w-full h-auto object-contain"
                            onLoad={() => handleImageLoad(image.id)}
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
                              <div className="w-full flex items-center relative">
                                <div className="w-full h-[2px] bg-red-600 opacity-70 group-hover/line:opacity-90" />
                                <div className="absolute left-2 bg-red-600 text-white text-xs px-1 rounded">
                                  {line.id}
                                </div>
                                <div 
                                  className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center cursor-ns-resize"
                                  onMouseDown={(e) => handleMouseDown(e, image.id, line.id)}
                                  style={{ zIndex: 22 }}
                                >
                                  <div className="bg-red-600 rounded p-1 opacity-70 group-hover/line:opacity-90 transition-opacity">
                                    <ArrowUpDown className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {scrollableImages.has(image.id) && (
                        <div 
                          className="absolute right-3 top-3 z-50 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out"
                          style={{ 
                            width: '150px',
                            height: 'calc(100% - 24px)'
                          }}
                        >
                          <div
                            className="relative overflow-hidden cursor-pointer h-full minimap-container"
                            onClick={(e) => handleMinimapClick(image.id, e)}
                            onWheel={(e) => handleMinimapWheel(image.id, e)}
                          >
                            <div className="absolute inset-0">
                              <img
                                src={image.originalImage}
                                alt="Minimap"
                                className="w-full h-full"
                                style={{
                                  maxHeight: '100%',
                                  width: '100%',
                                  objectFit: 'contain',
                                  objectPosition: 'top',
                                  opacity: 0.4
                                }}
                                draggable={false}
                              />
                            </div>
                            {image.guideLines.map((line) => (
                              <div
                                key={line.id}
                                className="absolute left-0 right-0 pointer-events-none"
                                style={{ 
                                  top: `${(line.y / image.imageSize.height) * 100}%`,
                                  width: '100%'
                                }}
                              >
                                <div className="w-full h-[1px] bg-red-500/60" />
                                <div className="absolute left-0 bg-red-500/60 text-white text-[8px] px-0.5">
                                  {line.id}
                                </div>
                              </div>
                            ))}
                            {image.visibleArea && (
                              <div
                                className="absolute left-0 right-0 pointer-events-none"
                                style={{
                                  top: `${image.visibleArea.top}%`,
                                  height: `${image.visibleArea.height}%`,
                                  width: '100%',
                                  background: 'rgba(59, 130, 246, 0.2)',
                                  backdropFilter: 'blur(1px)',
                                  borderTop: '2px solid rgba(59, 130, 246, 0.5)',
                                  borderBottom: '2px solid rgba(59, 130, 246, 0.5)',
                                }}
                              />
                            )}
                            <div 
                              className="absolute inset-0" 
                              style={{
                                background: 'linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2))',
                                pointerEvents: 'none'
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="relative w-full">
                  <div className="sticky top-4 z-30 flex justify-end gap-2 mb-2">
                    {image.splitImages.length > 0 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDownloadImageSet(image.id)}
                        title={image.splitImages.length > 1 ? "ZIP 다운로드" : "다운로드"}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div 
                    className="w-full border rounded-lg overflow-y-auto bg-muted"
                    style={{ height: 'calc(100vh - 200px)' }}
                  >
                    {image.splitImages.length > 0 ? (
                      <div className="p-4 space-y-4">
                        {image.splitImages.map((splitImg, idx) => (
                          <Card key={idx} className="relative overflow-hidden group">
                            <img
                              src={splitImg}
                              alt={`Split ${idx + 1}`}
                              className="w-full h-auto"
                            />
                            <div 
                              className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                              onClick={() => handleDownload(splitImg, image.id, idx)}
                            >
                              <Download className="h-6 w-6" />
                            </div>
                            <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md text-sm">
                              {idx + 1}
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        분할된 이미지가 없습니다
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
} 