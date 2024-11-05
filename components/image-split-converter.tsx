'use client';

import { useState, useRef } from 'react';

export function ImageSplitConverter() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [splitImages, setSplitImages] = useState<string[]>([]);
  const [splitCount, setSplitCount] = useState<number>(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
          setImageSize({
            width: img.width,
            height: img.height
          });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSplitImage = () => {
    if (!originalImage) return;

    const img = new Image();
    img.src = originalImage;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const partHeight = Math.floor(img.height / splitCount);
      const results: string[] = [];

      for (let i = 0; i < splitCount; i++) {
        canvas.width = img.width;
        canvas.height = partHeight;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(
          img,
          0, i * partHeight,
          img.width, partHeight,
          0, 0,
          img.width, partHeight
        );

        results.push(canvas.toDataURL('image/png'));
      }

      setSplitImages(results);
    };
  };

  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `split-image-${index + 1}.png`;
    link.click();
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* 왼쪽: 원본 이미지 영역 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
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

          {originalImage && (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden flex items-center justify-center bg-gray-200 h-[600px]">
                <img
                  src={originalImage}
                  alt="Original"
                  className="max-w-full max-h-[600px] object-contain"
                />
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">
                  원본 크기: {imageSize.width} x {imageSize.height}
                </span>
              </div>

              <div className="flex flex-col gap-2 mt-4">
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
                    onChange={(e) => setSplitCount(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="2"
                      max="50"
                      value={splitCount}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 2 && value <= 50) {
                          setSplitCount(value);
                        }
                      }}
                      className="w-16 text-center border rounded px-2 py-1"
                    />
                    <button
                      onClick={() => setSplitCount(Math.min(50, splitCount + 1))}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {originalImage && !splitImages.length && (
                <button
                  onClick={handleSplitImage}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mt-4"
                >
                  {splitCount}등분으로 분할하기
                </button>
              )}
            </div>
          )}
        </div>

        {/* 오른쪽: 분할된 이미지 영역 */}
        <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[800px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">분할된 이미지</h2>
            {splitImages.length > 0 && (
              <button
                onClick={() => setSplitImages([])}
                className="px-4 py-2 text-sm text-red-500 hover:text-red-600 transition-colors"
              >
                초기화
              </button>
            )}
          </div>
          
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
            <div className="aspect-square border border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 h-[600px]">
              <div className="text-center text-gray-500">
                <p className="mb-2">분할된 이미지가 없습니다</p>
                <p className="text-sm">이미지를 선택하고 분할해주세요</p>
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
} 