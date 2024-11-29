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
import { supabase } from "@/utils/supabase/client"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

// ProductEditPageProps 타입 정의 추가
interface ProductEditPageProps {
  initialData: {
    name?: string;
    content?: string;
    contenthtml?: string;
    originalcontent?: string;
    weight?: number;
    width?: number;
    length?: number;
    height?: number;
    hscode?: string;
    barcode?: string;
    consumerprice?: number;
    status?: string;
    size?: string;
    color?: string;
    material?: string;
    options?: any[];
    categorypath?: string;
    id?: string;
    supplyname?: string;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
}

// 이미지 인터페이스 수정
interface Image {
  id: string;
  index: number;
  type: string;
  url: string;
  groupseq: number;
  has_group_alias: boolean;
  groupalias: string | null;
  createdat: string;
}

// Category 인터페이스 추가
interface Category {
  id: string;
  categoryid: string;
  country: string;
  depth: number;
  name: string;
  is_leaf: boolean;
  parentcategoryid: string | null;
  pathname: string;
  platform: string;
}

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

  const [thumbnailImages, setThumbnailImages] = React.useState<Image[]>([]);
  const [contentImages, setContentImages] = React.useState<Image[]>([]);

  // 이미지 데이터 조회 함수
  const fetchImageData = async (itemId: string) => {
    try {
      const { data, error } = await supabase
        .from('item_images')
        .select(`
          id,
          index,
          type,
          url,
          groupseq,
          groupalias,
          createdat
        `)
        .eq('itemid', itemId)
        .eq('language', 'ko')
        .order('type')
        .order('index')
        .order('createdat')
        .order('groupseq');

      if (error) throw error;

      // hasGroupAlias 필드 추가하여 데이터 변환
      const formattedData = data.map(img => ({
        ...img,
        hasGroupAlias: img.groupalias !== null
      }));

      // 이미지 타입별로 분류
      const thumbnails = formattedData.filter(img => img.type === 'THUMBNAIL');
      const contents = formattedData.filter(img => img.type === 'MAIN_CONTENT');

      setThumbnailImages(thumbnails);
      setContentImages(contents);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  };

  React.useEffect(() => {
    if (initialData.id) {
      fetchImageData(initialData.id);
    }
  }, [initialData.id]);

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);

  // 카테고리 데이터 가져오기
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Mock 카테고리 데이터 확장
        const mockCategories: Category[] = [
          // 패션의류와 하위 카테고리
          {
            id: "1",
            categoryid: "50000000",
            country: "KR",
            depth: 1,
            name: "패션의류",
            is_leaf: false,
            parentcategoryid: null,
            pathname: "/fashion/clothes",
            platform: "SMART_STORE"
          },
          {
            id: "1-1",
            categoryid: "50000167",
            country: "KR",
            depth: 2,
            name: "여성의류",
            is_leaf: false,
            parentcategoryid: "1",
            pathname: "/fashion/clothes/women",
            platform: "SMART_STORE"
          },
          {
            id: "1-1-1",
            categoryid: "50000168",
            country: "KR",
            depth: 3,
            name: "원피스",
            is_leaf: true,
            parentcategoryid: "1-1",
            pathname: "/fashion/clothes/women/dress",
            platform: "SMART_STORE"
          },
          {
            id: "1-1-2",
            categoryid: "50000169",
            country: "KR",
            depth: 3,
            name: "블라우스/셔츠",
            is_leaf: true,
            parentcategoryid: "1-1",
            pathname: "/fashion/clothes/women/blouse",
            platform: "SMART_STORE"
          },
          {
            id: "1-2",
            categoryid: "50000170",
            country: "KR",
            depth: 2,
            name: "남성의류",
            is_leaf: false,
            parentcategoryid: "1",
            pathname: "/fashion/clothes/men",
            platform: "SMART_STORE"
          },
          {
            id: "1-2-1",
            categoryid: "50000171",
            country: "KR",
            depth: 3,
            name: "티셔츠",
            is_leaf: true,
            parentcategoryid: "1-2",
            pathname: "/fashion/clothes/men/tshirt",
            platform: "SMART_STORE"
          },
          {
            id: "1-2-2",
            categoryid: "50000172",
            country: "KR",
            depth: 3,
            name: "셔츠",
            is_leaf: true,
            parentcategoryid: "1-2",
            pathname: "/fashion/clothes/men/shirt",
            platform: "SMART_STORE"
          },

          // 패션잡화와 하위 카테고리
          {
            id: "2",
            categoryid: "50000173",
            country: "KR",
            depth: 1,
            name: "패션잡화",
            is_leaf: false,
            parentcategoryid: null,
            pathname: "/fashion/accessories",
            platform: "SMART_STORE"
          },
          {
            id: "2-1",
            categoryid: "50000174",
            country: "KR",
            depth: 2,
            name: "여성신발",
            is_leaf: false,
            parentcategoryid: "2",
            pathname: "/fashion/accessories/women-shoes",
            platform: "SMART_STORE"
          },
          {
            id: "2-1-1",
            categoryid: "50000175",
            country: "KR",
            depth: 3,
            name: "단화/플랫",
            is_leaf: true,
            parentcategoryid: "2-1",
            pathname: "/fashion/accessories/women-shoes/flat",
            platform: "SMART_STORE"
          },
          {
            id: "2-1-2",
            categoryid: "50000176",
            country: "KR",
            depth: 3,
            name: "힐/펌프스",
            is_leaf: true,
            parentcategoryid: "2-1",
            pathname: "/fashion/accessories/women-shoes/heels",
            platform: "SMART_STORE"
          }
        ];
        setCategories(mockCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // 카테고리 상태 추가
  const [selectedFirstCategory, setSelectedFirstCategory] = React.useState<Category | null>(null);
  const [selectedSecondCategory, setSelectedSecondCategory] = React.useState<Category | null>(null);
  const [selectedThirdCategory, setSelectedThirdCategory] = React.useState<Category | null>(null);

  // 초기 카테고리 설정을 위한 useEffect
  React.useEffect(() => {
    if (initialData.categorypath) {
      const pathParts = initialData.categorypath.split('/').filter(Boolean);
      
      // 카테고리가 로드된 후에 초기 카테고리 설정
      const setInitialCategories = () => {
        const firstCategory = categories.find(c => c.depth === 1 && c.pathname.includes(pathParts[0]));
        if (firstCategory) {
          setSelectedFirstCategory(firstCategory);
          
          const secondCategory = categories.find(
            c => c.depth === 2 && 
            c.parentcategoryid === firstCategory.id && 
            c.pathname.includes(pathParts[1])
          );
          if (secondCategory) {
            setSelectedSecondCategory(secondCategory);
            
            const thirdCategory = categories.find(
              c => c.depth === 3 && 
              c.parentcategoryid === secondCategory.id && 
              c.pathname.includes(pathParts[2])
            );
            if (thirdCategory) {
              setSelectedThirdCategory(thirdCategory);
              setSelectedCategory(thirdCategory);
            }
          }
        }
      };

      if (categories.length > 0) {
        setInitialCategories();
      }
    }
  }, [categories, initialData.categorypath]);

  // 선택된 카테고리 표시 부분 수정
  const selectedCategoryPath = React.useMemo(() => {
    if (!selectedCategory) {
      return initialData.categorypath || '';
    }
    return [
      selectedFirstCategory?.name,
      selectedSecondCategory?.name,
      selectedThirdCategory?.name
    ].filter(Boolean).join(' > ');
  }, [selectedCategory, selectedFirstCategory, selectedSecondCategory, selectedThirdCategory, initialData.categorypath]);

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
                    <TabsTrigger value="all">전체 카테고리</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="recent">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        {/* 1차 카테고리 */}
                        <Select 
                          value={selectedFirstCategory?.id}
                          onValueChange={(value) => {
                            const category = categories.find(c => c.id === value);
                            setSelectedFirstCategory(category || null);
                            setSelectedSecondCategory(null);
                            setSelectedThirdCategory(null);
                            setSelectedCategory(null);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="1차 카테고리" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .filter(c => c.depth === 1)
                              .map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>

                        {/* 2차 카테고리 */}
                        <Select 
                          value={selectedSecondCategory?.id}
                          disabled={!selectedFirstCategory}
                          onValueChange={(value) => {
                            const category = categories.find(c => c.id === value);
                            setSelectedSecondCategory(category || null);
                            setSelectedThirdCategory(null);
                            setSelectedCategory(null);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="2차 카테고리" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .filter(c => c.parentcategoryid === selectedFirstCategory?.id)
                              .map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>

                        {/* 3차 카테고리 */}
                        <Select 
                          value={selectedThirdCategory?.id}
                          disabled={!selectedSecondCategory}
                          onValueChange={(value) => {
                            const category = categories.find(c => c.id === value);
                            setSelectedThirdCategory(category || null);
                            setSelectedCategory(category || null);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="3차 카테고리" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .filter(c => c.parentcategoryid === selectedSecondCategory?.id)
                              .map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>선택한 카테고리</Label>
                        <div className="flex flex-wrap gap-2">
                          {(selectedCategory || initialData.categorypath) && (
                            <Badge variant="secondary" className="px-3 py-1">
                              {selectedCategoryPath}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-4 w-4 ml-1 hover:bg-transparent"
                                onClick={() => {
                                  setSelectedFirstCategory(null);
                                  setSelectedSecondCategory(null);
                                  setSelectedThirdCategory(null);
                                  setSelectedCategory(null);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="all">
                    <div className="space-y-4">
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>카테고리명</TableHead>
                              <TableHead>경로</TableHead>
                              <TableHead>깊이</TableHead>
                              <TableHead className="w-[100px]">선택</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {categories.map((category) => (
                              <TableRow 
                                key={category.id}
                                className={selectedCategory?.id === category.id ? "bg-muted" : ""}
                              >
                                <TableCell>
                                  <div className="flex items-center">
                                    <span 
                                      style={{ 
                                        marginLeft: `${(category.depth - 1) * 20}px`,
                                        display: 'flex',
                                        alignItems: 'center'
                                      }}
                                    >
                                      {category.depth > 1 && (
                                        <span className="text-muted-foreground mr-2">└</span>
                                      )}
                                      {category.name}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>{category.pathname}</TableCell>
                                <TableCell>{category.depth}차</TableCell>
                                <TableCell>
                                  <Button
                                    variant={selectedCategory?.id === category.id ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => {
                                      if (selectedCategory?.id === category.id) {
                                        setSelectedCategory(null);
                                      } else {
                                        setSelectedCategory(category);
                                      }
                                    }}
                                    disabled={!category.is_leaf}
                                  >
                                    {selectedCategory?.id === category.id ? "선택됨" : "선택"}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      
                      {/* 선택 카테고리 표시 */}
                      <div className="space-y-2">
                        <Label>선택한 카테고리</Label>
                        <div className="flex flex-wrap gap-2">
                          {(selectedCategory || initialData.categorypath) && (
                            <Badge variant="secondary" className="px-3 py-1">
                              {selectedCategoryPath}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-4 w-4 ml-1 hover:bg-transparent"
                                onClick={() => {
                                  setSelectedFirstCategory(null);
                                  setSelectedSecondCategory(null);
                                  setSelectedThirdCategory(null);
                                  setSelectedCategory(null);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          )}
                        </div>
                      </div>
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

        {/* 이미지 섹션 */}
        {thumbnailImages.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">상품 이미지</h2>
            <Carousel className="w-full max-w-xl mx-auto">
              <CarouselContent>
                {thumbnailImages.map((image, index) => (
                  <CarouselItem key={image.id}>
                    <div className="p-1">
                      <div className="relative aspect-square overflow-hidden rounded-lg">
                        <img
                          src={image.url}
                          alt={`상품 이미지 ${index + 1}`}
                          className="object-contain w-full h-full max-h-[300px]"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        )}

        {contentImages.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">상세 이미지</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {contentImages.map((image, index) => (
                <Dialog key={image.id}>
                  <DialogTrigger asChild>
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group max-h-[250px]">
                      <img
                        src={image.url}
                        alt={`상세 이미지 ${index + 1}`}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm">클릭하여 확대</span>
                      </div>
                      <span className="absolute top-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
                        {index + 1}
                      </span>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <div className="relative aspect-[3/4] max-h-[600px]">
                      <img
                        src={image.url}
                        alt={`상세 이미지 ${index + 1}`}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </section>
        )}

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
                    <Label className="text-sm font-medium text-muted-foreground">상품태</Label>
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
                          <TableHead>옵션</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>재고</TableHead>
                          <TableHead>판매가</TableHead>
                          <TableHead>공급가</TableHead>
                          <TableHead>수정</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { optionName: "색", optionValue: "베이지", sku: "2956993733", stock: "10 EA", price: "1,000,000 원", supply: "1,000,000 원" },
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
