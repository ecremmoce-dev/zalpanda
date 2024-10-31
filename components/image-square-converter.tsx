'use client';

import { useState, useRef } from 'react';

interface TextDetectionResult {
  hasText: boolean;
  confidence: number;
  detectedTexts: string[];
}

export function ImageSquareConverter() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [processedSize, setProcessedSize] = useState({ width: 0, height: 0 });
  const [isSquare, setIsSquare] = useState(false);
  const [colorDistribution, setColorDistribution] = useState<{ color: string; percentage: number; }[]>([]);
  const [imageAreaPercentage, setImageAreaPercentage] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgSrc = e.target?.result as string;
        setOriginalImage(imgSrc);
        setProcessedImage(null);

        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
          setImageSize({
            width: img.width,
            height: img.height
          });
          setIsSquare(img.width === img.height);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    if (!originalImage) return;

    const img = new Image();
    img.src = originalImage;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 정사각형 크기 계산
      const size = Math.max(img.width, img.height);
      canvas.width = size;
      canvas.height = size;

      // 흰색 배경 그리기
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, size, size);

      // 이미지를 중앙에 그리기
      const x = (size - img.width) / 2;
      const y = (size - img.height) / 2;
      ctx.drawImage(img, x, y);

      // 색상 분포 분석
      analyzeColors(ctx, size);
      
      // 이미지 영역 비율 계산
      calculateImageArea(ctx, size);

      // 처리된 이미지 URL 생성 및 크기 설정
      const processedImageUrl = canvas.toDataURL('image/png');
      setProcessedImage(processedImageUrl);
      setProcessedSize({ width: size, height: size });
    };
  };

  const analyzeColors = (ctx: CanvasRenderingContext2D, size: number) => {
    const imageData = ctx.getImageData(0, 0, size, size);
    const pixels = imageData.data;
    const colorCounts: { [key: string]: number } = {};
    const totalPixels = (pixels.length / 4);

    for (let i = 0; i < pixels.length; i += 4) {
      const r = Math.floor(pixels[i] / 32) * 32;
      const g = Math.floor(pixels[i + 1] / 32) * 32;
      const b = Math.floor(pixels[i + 2] / 32) * 32;
      const colorKey = `rgb(${r},${g},${b})`;
      colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
    }

    let allColors = Object.entries(colorCounts)
      .map(([color, count]) => ({
        color,
        percentage: (count / totalPixels) * 100
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const topColors = allColors.slice(0, 9);
    const otherPercentage = allColors
      .slice(9)
      .reduce((sum, item) => sum + item.percentage, 0);

    if (otherPercentage > 0) {
      topColors.push({
        color: 'others',
        percentage: otherPercentage
      });
    }

    setColorDistribution(topColors);
  };

  const calculateImageArea = (ctx: CanvasRenderingContext2D, size: number) => {
    const imageData = ctx.getImageData(0, 0, size, size);
    const pixels = imageData.data;
    let nonWhitePixels = 0;
    const totalPixels = size * size;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      if (!(r === 255 && g === 255 && b === 255)) {
        nonWhitePixels++;
      }
    }

    const percentage = (nonWhitePixels / totalPixels) * 100;
    setImageAreaPercentage(percentage);
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'squared-image.png';
      link.click();
    }
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
              <div className={`aspect-auto border rounded-lg overflow-hidden flex items-center justify-center bg-gray-200 h-[400px]
                ${isSquare ? 'border-red-500 border-2' : ''}`}
              >
                <img
                  src={originalImage}
                  alt="Original"
                  className="max-w-full max-h-[400px] object-contain"
                />
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">
                  원본 크기: {imageSize.width} x {imageSize.height}
                </span>
                {isSquare && (
                  <span className="text-red-500 font-medium">
                    이미 정사각형 이미지입니다
                  </span>
                )}
              </div>

              {colorDistribution.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2">색상 분포</h3>
                  <div className="space-y-2">
                    {colorDistribution.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {item.color !== 'others' ? (
                          <div 
                            className="w-6 h-6 rounded border border-gray-200"
                            style={{ backgroundColor: item.color }}
                          />
                        ) : (
                          <div className="w-6 h-6 rounded border border-gray-200 bg-gradient-to-r from-gray-200 to-gray-400" />
                        )}
                        <div className="flex-1 h-4 bg-gray-200 rounded">
                          <div 
                            className="h-full bg-blue-500 rounded"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 min-w-[60px]">
                          {item.percentage.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                    
                    <div className="pt-2 mt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">전체 색상 합계</span>
                        <span className="text-gray-600">
                          {colorDistribution.reduce((sum, item) => sum + item.percentage, 0).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        * 상위 9개 색상과 기타 색상의 분포를 표시
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 오른쪽: 처리된 이미지 영역 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-lg font-semibold flex-1">처리된 이미지</h2>
            {!isSquare && !processedImage && originalImage && (
              <button
                onClick={processImage}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                변환하기
              </button>
            )}
            {processedImage && (
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                다운로드
              </button>
            )}
          </div>

          {processedImage ? (
            <div className="space-y-4">
              <div className="aspect-square border rounded-lg overflow-hidden flex items-center justify-center bg-gray-200 h-[400px]">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-w-full max-h-[400px] object-contain"
                />
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  처리된 이미지: {processedSize.width} x {processedSize.height}
                </div>
                <div className="text-sm text-gray-600">
                  이미지 영역 비율: {imageAreaPercentage.toFixed(1)}%
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${imageAreaPercentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  * 전체 정사각형 영역 중 실제 이미지가 차지하는 비율
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-square border border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 h-[400px]">
              <div className="text-center text-gray-500">
                <p className="mb-2">처리된 이미지가 없습니다</p>
                <p className="text-sm">이미지를 선택하고 변환해주세요</p>
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