'use client';

import { useState, useRef, useEffect } from 'react';

interface GuideLine {
  id: number;
  y: number;
}

export function ImageSplitConverter() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [splitImages, setSplitImages] = useState<string[]>([]);
  const [splitCount, setSplitCount] = useState<number>(5);
  const [guideLines, setGuideLines] = useState<GuideLine[]>([]);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [dragStartY, setDragStartY] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [initialGuidePositions, setInitialGuidePositions] = useState<number[]>([]);
  const [isGuidelineModified, setIsGuidelineModified] = useState<boolean>(false);

  const initializeGuideLines = () => {
    if (!imageSize.height || splitCount <= 1) return;
    
    const partHeight = imageSize.height / splitCount;
    const lines: GuideLine[] = [];
    const positions: number[] = [];
    
    for (let i = 1; i < splitCount; i++) {
      const y = Math.round(partHeight * i);
      lines.push({ id: i, y });
      positions.push(y);
    }
    
    setGuideLines(lines);
    setInitialGuidePositions(positions);
    setIsGuidelineModified(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgSrc = e.target?.result as string;
        setOriginalImage(imgSrc);
        setSplitImages([]);

        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
          const newSize = {
            width: img.width,
            height: img.height
          };
          setImageSize(newSize);
          
          const partHeight = newSize.height / splitCount;
          const lines: GuideLine[] = [];
          const positions: number[] = [];
          
          for (let i = 1; i < splitCount; i++) {
            const y = Math.round(partHeight * i);
            lines.push({ id: i, y });
            positions.push(y);
          }
          
          setGuideLines(lines);
          setInitialGuidePositions(positions);
          setIsGuidelineModified(false);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSplitImage = () => {
    if (!originalImage || !guideLines.length) return;

    const img = new Image();
    img.src = originalImage;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const results: string[] = [];
      let prevY = 0;

      [...guideLines, { id: splitCount, y: imageSize.height }].forEach((line) => {
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

      setSplitImages(results);
    };
  };

  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `split-image-${index + 1}.png`;
    link.click();
  };

  const handleMouseDown = (e: React.MouseEvent, lineId: number) => {
    e.preventDefault();
    const container = document.querySelector('.original-image-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    setIsDragging(lineId);
    setDragStartY(e.clientY - rect.top);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging === null) return;
    
    const imgElement = e.currentTarget.querySelector('img');
    if (!imgElement) return;

    const rect = imgElement.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const imgScale = imageSize.height / rect.height;
    
    setGuideLines(prev => {
      const newLines = prev.map(line => {
        if (line.id === isDragging) {
          const newY = Math.max(0, Math.min(imageSize.height, mouseY * imgScale));
          return { ...line, y: newY };
        }
        return line;
      });

      const isModified = newLines.some((line, index) => {
        return Math.abs(line.y - initialGuidePositions[index]) > 1;
      });
      setIsGuidelineModified(isModified);

      return newLines;
    });
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const handleDownloadAll = () => {
    splitImages.forEach((imgSrc, index) => {
      handleDownload(imgSrc, index);
    });
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (isDragging === null) return;
    
    const container = document.querySelector('.original-image-container');
    const img = container?.querySelector('img');
    if (!container || !img) return;

    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    
    const imgTop = imgRect.top - containerRect.top;
    const imgHeight = imgRect.height;
    const mouseY = e.clientY - containerRect.top - imgTop;
    
    const positionRatio = mouseY / imgHeight;
    const actualY = Math.round(imageSize.height * positionRatio);
    
    setGuideLines(prev => {
      const newLines = prev.map(line => {
        if (line.id === isDragging) {
          const prevLine = prev.find(l => l.id === line.id - 1);
          const nextLine = prev.find(l => l.id === line.id + 1);
          const minY = prevLine ? prevLine.y + 5 : 5;
          const maxY = nextLine ? nextLine.y - 5 : imageSize.height - 5;
          
          return { ...line, y: Math.max(minY, Math.min(maxY, actualY)) };
        }
        return line;
      });

      const isModified = newLines.some((line, index) => {
        return Math.abs(line.y - initialGuidePositions[index]) > 1;
      });
      setIsGuidelineModified(isModified);

      return newLines;
    });
  };

  const handleGlobalMouseUp = () => {
    setIsDragging(null);
  };

  const handleSplitCountChange = (newCount: number) => {
    if (newCount >= 2 && newCount <= 50) {
      setSplitCount(newCount);
      if (guideLines.length > 0) {
        initializeGuideLines();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, imageSize.height, initialGuidePositions]);

  return (
    <div className="h-screen p-6">
      <div className="grid grid-cols-2 gap-6 h-full">
        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
          <div className="flex-none">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">분할 설정</h2>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">분할 개수: {splitCount}등분</label>
                  <span className="text-xs text-gray-500">(2~50개 설정 가능)</span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="2"
                    max="50"
                    value={splitCount}
                    onChange={(e) => handleSplitCountChange(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSplitCountChange(Math.max(2, splitCount - 1))}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="2"
                      max="50"
                      value={splitCount}
                      onChange={(e) => handleSplitCountChange(Number(e.target.value))}
                      className="w-16 text-center border rounded px-2 py-1"
                    />
                    <button
                      onClick={() => handleSplitCountChange(Math.min(50, splitCount + 1))}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">원본 이미지</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="imageInput"
            />
            <label
              htmlFor="imageInput"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
            >
              이미지 선택
            </label>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {originalImage && (
              <div 
                className="relative border rounded-lg overflow-hidden bg-gray-200 original-image-container"
                style={{
                  height: 'calc(100vh - 250px)',
                  maxWidth: '100%'
                }}
              >
                <div className="absolute inset-0 overflow-y-auto">
                  <div className="relative min-h-full flex items-center justify-center">
                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full h-auto object-contain"
                      style={{
                        maxWidth: '100%'
                      }}
                    />
                    {guideLines.map((line) => (
                      <div
                        key={line.id}
                        className="absolute left-[-30px] right-[-30px] flex items-center justify-center group"
                        style={{ 
                          top: `${(line.y / imageSize.height) * 100}%`,
                          transform: 'translateY(-50%)',
                          zIndex: 10
                        }}
                      >
                        {/* 가이드라인 선택 영역 - 직사각형 클릭 영역 */}
                        <div
                          className="absolute w-[60px] h-[20px] cursor-ns-resize bg-red-600 opacity-70 group-hover:opacity-90 transition-opacity"
                          style={{ 
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 30
                          }}
                          onMouseDown={(e) => handleMouseDown(e, line.id)}
                        />
                        
                        {/* 가이드라인 위쪽 영역 */}
                        <div
                          className="absolute w-full h-[5px] bg-red-200 opacity-40 transition-opacity"
                          style={{ 
                            bottom: '1px',
                            zIndex: 20
                          }}
                        />
                        
                        {/* 메인 가이드라인 */}
                        <div
                          className="absolute w-full h-[1px] bg-red-600 opacity-70 group-hover:opacity-90 transition-opacity"
                          style={{ zIndex: 20 }}
                        />
                        
                        {/* 가이드라인 아래쪽 영역 */}
                        <div
                          className="absolute w-full h-[5px] bg-red-200 opacity-40 transition-opacity"
                          style={{ 
                            top: '1px',
                            zIndex: 20
                          }}
                        />
                        
                        {/* 라인 번호 표시 */}
                        <div 
                          className="absolute left-[-40px] bg-red-600 text-white text-xs px-1 rounded opacity-70 group-hover:opacity-90"
                          style={{ 
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 30
                          }}
                        >
                          {line.id}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-none mt-4">
            {guideLines.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={initializeGuideLines}
                  disabled={!isGuidelineModified}
                  className={`flex-1 px-4 py-2 text-white rounded-md transition-colors ${
                    isGuidelineModified 
                      ? 'bg-gray-500 hover:bg-gray-600' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  가이드라인 초기화
                </button>
                <button
                  onClick={handleSplitImage}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  최종 분할하기
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
          <div className="flex-none">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">분할된 이미지</h2>
              <div className="flex gap-2">
                {splitImages.length > 0 && (
                  <>
                    <button
                      onClick={handleDownloadAll}
                      className="px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      전체 다운로드
                    </button>
                    <button
                      onClick={() => setSplitImages([])}
                      className="px-4 py-2 text-sm text-red-500 hover:text-red-600 transition-colors"
                    >
                      초기화
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {splitImages.length > 0 ? (
              <div className="space-y-6">
                {splitImages.map((imgSrc, index) => (
                  <div key={index} className="space-y-2">
                    <div className="border rounded-lg overflow-hidden flex items-center justify-center bg-gray-200 h-[280px]">
                      <img
                        src={imgSrc}
                        alt={`Split ${index + 1}`}
                        className="max-w-full max-h-[280px] object-contain"
                      />
                    </div>
                    <button
                      onClick={() => handleDownload(imgSrc, index)}
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      분할 이미지 {index + 1} 다운로드
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full border border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                  <p className="mb-2">분할된 이미지가 없습니다</p>
                  <p className="text-sm">이미지를 선택하고 분할해주세요</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
} 