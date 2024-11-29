'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { ImagePlus, X, ChevronDown } from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function ProductEditPage({ initialData, onSave, onCancel }: ProductEditPageProps) {
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    content: initialData?.content || '',
    contenthtml: initialData?.contenthtml || '',
    originalcontent: initialData?.originalcontent || '',
    weight: initialData?.weight || 0,
    width: initialData?.width || 0,
    length: initialData?.length || 0,
    height: initialData?.height || 0,
    hscode: initialData?.hscode || '',
    barcode: initialData?.barcode || '',
    consumerprice: initialData?.consumerprice || 0,
    status: initialData?.status || '',
    size: initialData?.size || '',
    color: initialData?.color || '',
    material: initialData?.material || '',
    options: initialData?.options || []
  });

  const [isCategoryExpanded, setIsCategoryExpanded] = React.useState(true);

  const toggleCategorySection = () => {
    setIsCategoryExpanded(prev => !prev);
  };

  // 입력 핸들러
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>취소</Button>
        <Button onClick={() => onSave(formData)}>저장</Button>
      </div>

      <div className="space-y-6">
        {/* 카테고리 섹션 */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">카테고리</h2>
            <Button variant="link" className="text-blue-500" onClick={toggleCategorySection}>
              {isCategoryExpanded ? '접기' : '펼치기'}
            </Button>
          </div>
          {isCategoryExpanded && (
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="recent" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="recent">최근 검색</TabsTrigger>
                    <TabsTrigger value="favorites">즐겨찾기</TabsTrigger>
                  </TabsList>
                  <TabsContent value="recent">
                    <div className="space-y-4">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="1차 카테고리" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="category1">카테고리 1</SelectItem>
                          <SelectItem value="category2">카테고리 2</SelectItem>
                          <SelectItem value="category3">카테고리 3</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="space-y-2">
                        <Label>선택한 카테고리</Label>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="px-3 py-1">
                            선택된 카테고리
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-4 w-4 ml-1 hover:bg-transparent"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="favorites">
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      즐겨찾기한 카테고리가 없습니다
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </section>

        {/* 기본 정보 섹션 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">기본 정보</h2>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">상품명</Label>
              <Input 
                id="title" 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="상품명을 입력하세요" 
              />
            </div>
            
            {/* 상품 설명 에디터 */}
            <div className="space-y-2">
              <Label>상품 설명</Label>
              <Tabs defaultValue="edit" className="w-full">
                <TabsList>
                  <TabsTrigger value="edit">본문 편집</TabsTrigger>
                  <TabsTrigger value="original">본문 원본</TabsTrigger>
                  <TabsTrigger value="html">본문 HTML</TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                  <div className="space-y-4">
                    <Textarea 
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      className="min-h-[200px]"
                      placeholder="상품 설명을 입력하세요"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="original">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg min-h-[200px] whitespace-pre-wrap">
                      {formData.content}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="html">
                  <div className="space-y-4">
                    <div className="relative">
                      <Textarea 
                        value={formData.contenthtml}
                        onChange={(e) => {
                          handleInputChange('contenthtml', e.target.value);
                        }}
                        className="min-h-[200px] font-mono text-sm"
                        placeholder="HTML 코드를 입력하세요"
                      />
                      <div className="absolute top-2 right-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const previewWindow = window.open('', '_blank');
                            previewWindow?.document.write(formData.contenthtml);
                          }}
                        >
                          미리보기
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: formData.contenthtml }}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* 보완할 방법을 입력하세요 */}
            <div className="space-y-2">
              <Label>보완할 방법</Label>
              <Textarea 
                placeholder="보완할 방법을 입력하세요" 
                className="min-h-[100px]"
              />
            </div>

            {/* 보완할 내용을 입력하세요 */}
            <div className="space-y-2">
              <Label>보완할 내용</Label>
              <Textarea 
                placeholder="보완할 내용을 입력하세요" 
                className="min-h-[100px]"
              />
            </div>
          </div>
        </section>

        {/* 이미지 업로드 섹션 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">이미지</h2>
          <div className="space-y-4">
            <div>
              <Label>메인 이미지</Label>
              <div className="grid grid-cols-5 gap-3 mt-2"> {/* Updated grid layout */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="relative">
                    <CardContent className="p-1.5"> {/* Updated padding */}
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                        <ImagePlus className="h-6 w-6 text-muted-foreground" /> {/* Updated icon size */}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <Label>추가 이미지</Label>
              <div className="grid grid-cols-5 gap-3 mt-2"> {/* Updated grid layout */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="relative">
                    <CardContent className="p-1.5"> {/* Updated padding */}
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                        <ImagePlus className="h-6 w-6 text-muted-foreground" /> {/* Updated icon size */}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 상품 크기 섹션 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">상품 크기</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>가로(Length)</Label>
                  <Input type="number" placeholder="0" />
                  <span className="text-sm text-muted-foreground">cm</span>
                </div>
                <div className="space-y-2">
                  <Label>세로(Width)</Label>
                  <Input type="number" placeholder="0" />
                  <span className="text-sm text-muted-foreground">cm</span>
                </div>
                <div className="space-y-2">
                  <Label>높이(Height)</Label>
                  <Input type="number" placeholder="0" />
                  <span className="text-sm text-muted-foreground">cm</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>무게</Label>
                  <Input type="number" placeholder="0" />
                  <span className="text-sm text-muted-foreground">kg</span>
                </div>
                <div className="space-y-2">
                  <Label>부피무게</Label>
                  <Input type="number" placeholder="0" disabled />
                  <span className="text-sm text-muted-foreground">kg</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative w-56 h-56">
                <svg 
                  viewBox="0 0 200 150" 
                  className="w-full h-full"
                  style={{ 
                    stroke: '#4F46E5',
                    strokeWidth: '1',
                    fill: 'none',
                    strokeLinejoin: 'round'
                  }}
                >
                  {/* Front face */}
                  <path d="M 50,40 L 150,40 L 150,120 L 50,120 Z" />
                  {/* Back face */}
                  <path d="M 30,20 L 130,20 L 130,100 L 30,100 Z" />
                  {/* Connecting lines */}
                  <path d="M 50,40 L 30,20" />
                  <path d="M 150,40 L 130,20" />
                  <path d="M 150,120 L 130,100" />
                  <path d="M 50,120 L 30,100" />
                  
                  {/* Labels */}
                  <text x="15" y="60" className="text-xs" style={{ stroke: 'none', fill: '#6B7280' }}>width</text>
                  <text x="80" y="140" className="text-xs" style={{ stroke: 'none', fill: '#6B7280' }}>length</text>
                  <text x="160" y="60" className="text-xs" style={{ stroke: 'none', fill: '#6B7280' }}>height</text>
                </svg>
              </div>
              <div className="bg-gray-600 text-white p-4 rounded-lg text-sm space-y-4 min-w-[300px]">
                <div className="flex items-center justify-center gap-2">
                  <span>가로(Length)</span>
                  <span>x</span>
                  <span>세로(Width)</span>
                  <span>x</span>
                  <span>높이(Height)</span>
                  <span>/</span>
                  <span>6,000</span>
                  <span>=</span>
                </div>
                <div className="grid grid-cols-2 gap-8 text-center">
                  <div>
                    <div className="text-gray-300">무게</div>
                    <div>0kg</div>
                  </div>
                  <div>
                    <div className="text-gray-300">부피무게</div>
                    <div>0kg</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 고시정보 섹션 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">고시정보</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">상품코드</Label>
                    <div className="text-sm font-medium">612999506</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">상품상태</Label>
                    <div className="text-sm font-medium">신상</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">원산지</Label>
                    <div className="text-sm font-medium">국내산(자체 가공품)</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">제조연월</Label>
                    <div className="text-sm font-medium">상세설명참조</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">제조자(수입자)</Label>
                    <div className="text-sm font-medium">상세설명참조</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">취급시 주의사항</Label>
                    <div className="text-sm font-medium">상세설명참조</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">품질보증기준</Label>
                    <div className="text-sm font-medium">상세설명참조</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">A/S 책임자와 전화번호</Label>
                    <div className="text-sm font-medium">상세설명참조 (000)</div>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="size">사이즈</Label>
                    <Input id="size" placeholder="사이즈를 입력하세요" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">색상</Label>
                    <Input id="color" placeholder="색상을 입력하세요" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="material">소재</Label>
                    <Input id="material" placeholder="소재를 입력하세요" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 가격과 재고 섹션 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">가격과 재고</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* 옵션 추가 버튼 */}
                <div className="flex justify-end mb-4">
                  <Button onClick={() => {
                    // This function would add a new row to the table
                    console.log("Add new option row");
                  }}>
                    옵션 추가 +
                  </Button>
                </div>

                {/* 가격 입력 테이블 */}
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>옵션명</TableHead>
                        <TableHead>옵션값</TableHead>
                        <TableHead>제품코드</TableHead>
                        <TableHead>수량</TableHead>
                        <TableHead>판매가격</TableHead>
                        <TableHead>할인가</TableHead>
                        <TableHead className="w-[100px]">적용</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { optionName: "색상", optionValue: "베이지", code: "2956993733" },
                        { optionName: "색상", optionValue: "화이트", code: "2956993734" },
                        { optionName: "사이즈", optionValue: "S", code: "2956993735" },
                        { optionName: "사이즈", optionValue: "M", code: "2956993736" }
                      ].map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <span className="text-sm font-medium">#{i + 1}</span>
                          </TableCell>
                          <TableCell>
                            <Input defaultValue={item.optionName} className="h-8" />
                          </TableCell>
                          <TableCell>
                            <Input defaultValue={item.optionValue} className="h-8" />
                          </TableCell>
                          <TableCell>
                            <Input defaultValue={item.code} className="h-8" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" defaultValue="10" className="h-8" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" defaultValue="1000000" className="h-8" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" defaultValue="1000000" className="h-8" />
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="w-full">
                              적용
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Summary Table */}
                  <div className="bg-sky-50/50 p-4 rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>옵션명</TableHead>
                          <TableHead>옵션���</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>재고</TableHead>
                          <TableHead>판매가</TableHead>
                          <TableHead>공급가</TableHead>
                          <TableHead>수정</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { optionName: "색상", optionValue: "베이지", sku: "2956993733", stock: "10 EA", price: "1,000,000 원", supply: "1,000,000 원" },
                          { optionName: "색상", optionValue: "화이트", sku: "2956993734", stock: "10 EA", price: "1,000,000 원", supply: "1,000,000 원" },
                          { optionName: "사이즈", optionValue: "S", sku: "2956993735", stock: "10 EA", price: "1,000,000 원", supply: "1,000,000 원" },
                          { optionName: "사이즈", optionValue: "M", sku: "2956993736", stock: "10 EA", price: "1,000,000 원", supply: "1,000,000 원" }
                        ].map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>{item.optionName}</TableCell>
                            <TableCell>{item.optionValue}</TableCell>
                            <TableCell>{item.sku}</TableCell>
                            <TableCell>{item.stock}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>{item.supply}</TableCell>
                            <TableCell>수정됨</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
