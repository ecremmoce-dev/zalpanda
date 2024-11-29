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
import { 
  ArrowUpDown,
  Focus,
  Languages,
  Scissors,
  Trash2,
  ImagePlus, 
  X, 
  ChevronDown, 
} from 'lucide-react'
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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

// 아이콘 버튼들을 포함하는 공통 컴포넌트 생성
const ImageActionButtons = () => (
  <div className="flex justify-center items-center gap-2 py-2">
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-7 w-7 hover:bg-gray-100"
      aria-label="translate"
    >
      <Languages className="h-4 w-4" />
    </Button>
    <span className="text-gray-300">|</span>
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-7 w-7 hover:bg-gray-100"
      aria-label="swap"
    >
      <ArrowUpDown className="h-4 w-4" />
    </Button>
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-7 w-7 hover:bg-gray-100"
      aria-label="focus"
    >
      <Focus className="h-4 w-4" />
    </Button>
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-7 w-7 hover:bg-gray-100"
      aria-label="crop"
    >
      <Scissors className="h-4 w-4" />
    </Button>
    <span className="text-gray-300">|</span>
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-7 w-7 hover:bg-gray-100 text-red-500 hover:text-red-600"
      aria-label="delete"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

// DraggableImage 컴포넌트 수정
const DraggableImage = ({ image, index, moveImage }: {
  image: Image;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'image',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'image',
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div className="space-y-2">
      <div 
        ref={ref}
        className={`relative rounded-lg overflow-hidden cursor-move ${isDragging ? 'opacity-50' : ''}`}
      >
        <img
          src={image.url}
          alt={`상품 이미지 ${index + 1}`}
          className="object-contain w-full h-full"
        />
        <span className="absolute top-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
          {index + 1}
        </span>
      </div>
      <ImageActionButtons />
    </div>
  );
};

// Option 인터페이스 추가
interface Option {
  id: string;
  optionName: string;
  optionValue: string;
  code: string;
  quantity: number;
  price: number;
  discountPrice: number;
}

// DraggableContentImage 컴포넌트 수정
const DraggableContentImage = React.memo(({ image, index, moveImage }: {
  image: Image;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'content-image',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'content-image',
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div className="space-y-1">
      <Dialog>
        <DialogTrigger asChild>
          <div 
            ref={ref}
            className={`relative aspect-[3/4] rounded-lg overflow-hidden cursor-move group max-h-[250px] ${
              isDragging ? 'opacity-50' : ''
            }`}
          >
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
      <div className="bg-gray-50 rounded-md flex justify-center">
        <ImageActionButtons />
      </div>
    </div>
  );
});

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
        // 모든 카테고리 가져오기 (WHERE 절 제거)
        const { data: allCategories, error: categoriesError } = await supabase
          .from('categories')
          .select(`
            id,
            categoryid,
            country,
            depth,
            name,
            parentcategoryid,
            pathname,
            platform
          `)
          .eq('platform', 'SMART_STORE')
          .order('depth')
          .order('pathname')
          .order('name');

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
          return;
        }

        console.log('Raw Categories:', allCategories); // 디버깅용 로그

        // depth 값을 0부터 시작하도록 수정
        const formattedCategories = allCategories
          .map(category => ({
            ...category,
            depth: category.depth,
            is_leaf: !allCategories.some(c => c.parentcategoryid === category.id)
          }));

        console.log('Formatted Categories:', formattedCategories); // 디버깅용 로그

        setCategories(formattedCategories);

        // 현재 카테고리 설정
        if (initialData.categorypath) {
          const pathParts = initialData.categorypath.split('>').map(part => part.trim());
          console.log('Path Parts:', pathParts); // 디버깅용 로그

          // 각 depth별로 카테고리 찾기
          let currentParentId: string | null = null;

          for (let i = 0; i < pathParts.length; i++) {
            const depth = i + 1;
            const name = pathParts[i];
            
            const category = formattedCategories.find(c => 
              c.depth === depth && 
              c.name === name && 
              c.parentcategoryid === currentParentId
            );

            console.log(`Finding category for depth ${depth}:`, category); // 디버깅용 로그

            if (category) {
              currentParentId = category.id;
              switch (depth) {
                case 1:
                  setSelectedFirstCategory(category);
                  break;
                case 2:
                  setSelectedSecondCategory(category);
                  break;
                case 3:
                  setSelectedThirdCategory(category);
                  setSelectedCategory(category);
                  break;
              }
            }
          }
        }
      } catch (error) {
        console.error('Error in fetchCategories:', error);
      }
    };

    fetchCategories();
  }, [initialData.categorypath]);

  // 카테고리 상태 추가
  const [selectedFirstCategory, setSelectedFirstCategory] = React.useState<Category | null>(null);
  const [selectedSecondCategory, setSelectedSecondCategory] = React.useState<Category | null>(null);
  const [selectedThirdCategory, setSelectedThirdCategory] = React.useState<Category | null>(null);
  const [selectedFourthCategory, setSelectedFourthCategory] = React.useState<Category | null>(null);
  const [selectedFifthCategory, setSelectedFifthCategory] = React.useState<Category | null>(null);

  // 선택된 카테고리 표시 부분 수정
  const selectedCategoryPath = React.useMemo(() => {
    if (!selectedCategory) {
      return initialData.categorypath || '';
    }
    return [
      selectedFirstCategory?.name,
      selectedSecondCategory?.name,
      selectedThirdCategory?.name,
      selectedFourthCategory?.name,
      selectedFifthCategory?.name
    ].filter(Boolean).join(' > ');
  }, [selectedCategory, selectedFirstCategory, selectedSecondCategory, selectedThirdCategory, selectedFourthCategory, selectedFifthCategory, initialData.categorypath]);

  // 카테고리 선택 로직 수정
  const handleCategorySelect = (category: Category) => {
    switch (category.depth) {
      case 0:
        setSelectedFirstCategory(category);
        setSelectedSecondCategory(null);
        setSelectedThirdCategory(null);
        setSelectedFourthCategory(null);
        setSelectedFifthCategory(null);
        break;
      case 1:
        const parent0ForDepth1 = categories.find(c => c.id === category.parentcategoryid);
        setSelectedFirstCategory(parent0ForDepth1 || null);
        setSelectedSecondCategory(category);
        setSelectedThirdCategory(null);
        setSelectedFourthCategory(null);
        setSelectedFifthCategory(null);
        break;
      case 2:
        const parent1ForDepth2 = categories.find(c => c.id === category.parentcategoryid);
        const parent0ForDepth2 = parent1ForDepth2 
          ? categories.find(c => c.id === parent1ForDepth2.parentcategoryid)
          : null;
        setSelectedFirstCategory(parent0ForDepth2 || null);
        setSelectedSecondCategory(parent1ForDepth2 || null);
        setSelectedThirdCategory(category);
        setSelectedFourthCategory(null);
        setSelectedFifthCategory(null);
        break;
      case 3:
        const parent2ForDepth3 = categories.find(c => c.id === category.parentcategoryid);
        const parent1ForDepth3 = parent2ForDepth3 
          ? categories.find(c => c.id === parent2ForDepth3.parentcategoryid)
          : null;
        const parent0ForDepth3 = parent1ForDepth3 
          ? categories.find(c => c.id === parent1ForDepth3.parentcategoryid)
          : null;
        setSelectedFirstCategory(parent0ForDepth3 || null);
        setSelectedSecondCategory(parent1ForDepth3 || null);
        setSelectedThirdCategory(parent2ForDepth3 || null);
        setSelectedFourthCategory(category);
        setSelectedFifthCategory(null);
        break;
      case 4:
        const parent3ForDepth4 = categories.find(c => c.id === category.parentcategoryid);
        const parent2ForDepth4 = parent3ForDepth4 
          ? categories.find(c => c.id === parent3ForDepth4.parentcategoryid)
          : null;
        const parent1ForDepth4 = parent2ForDepth4 
          ? categories.find(c => c.id === parent2ForDepth4.parentcategoryid)
          : null;
        const parent0ForDepth4 = parent1ForDepth4 
          ? categories.find(c => c.id === parent1ForDepth4.parentcategoryid)
          : null;
        setSelectedFirstCategory(parent0ForDepth4 || null);
        setSelectedSecondCategory(parent1ForDepth4 || null);
        setSelectedThirdCategory(parent2ForDepth4 || null);
        setSelectedFourthCategory(parent3ForDepth4 || null);
        setSelectedFifthCategory(category);
        break;
    }
    setSelectedCategory(category);
  };

  // moveContentImage 함수
  const moveContentImage = React.useCallback((dragIndex: number, hoverIndex: number) => {
    setContentImages((prevImages) => {
      const newImages = [...prevImages];
      const draggedImage = newImages[dragIndex];
      newImages.splice(dragIndex, 1);
      newImages.splice(hoverIndex, 0, draggedImage);
      return newImages;
    });
  }, []);

  // moveImage 함수
  const moveImage = React.useCallback((dragIndex: number, hoverIndex: number) => {
    setThumbnailImages((prevImages) => {
      const newImages = [...prevImages];
      const draggedImage = newImages[dragIndex];
      newImages.splice(dragIndex, 1);
      newImages.splice(hoverIndex, 0, draggedImage);
      return newImages;
    });
  }, []);

  // 옵션 상태 추가
  const [options, setOptions] = React.useState<Option[]>([
    { 
      id: '1',
      optionName: "색상", 
      optionValue: "베이지", 
      code: "2956993733",
      quantity: 10,
      price: 1000000,
      discountPrice: 1000000
    },
    { 
      id: '2',
      optionName: "색상", 
      optionValue: "화이트", 
      code: "2956993734",
      quantity: 10,
      price: 1000000,
      discountPrice: 1000000
    },
    { 
      id: '3',
      optionName: "사이즈", 
      optionValue: "S", 
      code: "2956993735",
      quantity: 10,
      price: 1000000,
      discountPrice: 1000000
    },
    { 
      id: '4',
      optionName: "사이즈", 
      optionValue: "M", 
      code: "2956993736",
      quantity: 10,
      price: 1000000,
      discountPrice: 1000000
    }
  ]);

  // 옵션 추가 함수
  const handleAddOption = () => {
    const newOption: Option = {
      id: `${Date.now()}`, // 임시 ID 생성
      optionName: "",
      optionValue: "",
      code: "",
      quantity: 0,
      price: 0,
      discountPrice: 0
    };
    setOptions([...options, newOption]);
  };

  // 옵션 삭제 함수
  const handleDeleteOption = (id: string) => {
    setOptions(options.filter(option => option.id !== id));
  };

  // 옵션 수정 함수
  const handleOptionChange = (id: string, field: keyof Option, value: string | number) => {
    setOptions(options.map(option => 
      option.id === id 
        ? { ...option, [field]: value }
        : option
    ));
  };

  // 이미지 섹션 수정
  return (
    <DndProvider backend={HTML5Backend}>
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
                          setSelectedFourthCategory(null);
                          setSelectedFifthCategory(null);
                          setSelectedCategory(null);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="1차 카테고리" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter(c => c.depth === 0)  // depth 0으로 변경
                            .sort((a, b) => a.name.localeCompare(b.name))
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
                          setSelectedFourthCategory(null);
                          setSelectedFifthCategory(null);
                          setSelectedCategory(null);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="2차 카테고리" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter(c => 
                              c.depth === 1 && // depth 1으로 수정
                              c.parentcategoryid === selectedFirstCategory?.id
                            )
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
                          setSelectedFourthCategory(null);
                          setSelectedFifthCategory(null);
                          setSelectedCategory(category || null);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="3차 카테고리" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter(c => {
                              console.log('Checking category:', c, 'against parent:', selectedSecondCategory?.id); // 디버깅용 로그
                              return c.depth === 2 && c.parentcategoryid === selectedSecondCategory?.id;
                            })
                            .map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      {/* 4차 카테고리 */}
                      <Select 
                        value={selectedFourthCategory?.id}
                        disabled={!selectedThirdCategory}
                        onValueChange={(value) => {
                          const category = categories.find(c => c.id === value);
                          setSelectedFourthCategory(category || null);
                          setSelectedFifthCategory(null);
                          setSelectedCategory(category || null);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="4차 카테고리" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter(c => c.parentcategoryid === selectedThirdCategory?.id)
                            .map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      {/* 5차 카테고리 */}
                      <Select 
                        value={selectedFifthCategory?.id}
                        disabled={!selectedFourthCategory}
                        onValueChange={(value) => {
                          const category = categories.find(c => c.id === value);
                          setSelectedFifthCategory(category || null);
                          setSelectedCategory(category || null);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="5차 카테고리" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter(c => c.parentcategoryid === selectedFourthCategory?.id)
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
                                setSelectedFourthCategory(null);
                                setSelectedFifthCategory(null);
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
              
              {/* 상 설명 에디터 */}
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {thumbnailImages.map((image, index) => (
                  <DraggableImage
                    key={image.id}
                    image={image}
                    index={index}
                    moveImage={moveImage}
                  />
                ))}
              </div>
            </section>
          )}

          {contentImages.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">상세 이미지</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {contentImages.map((image, index) => (
                  <DraggableContentImage
                    key={image.id}
                    image={image}
                    index={index}
                    moveImage={moveContentImage}
                  />
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
                    <span>로(Width)</span>
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
                      <div className="text-sm font-medium">상세명참조</div>
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
                      <Input id="color" placeholder="색상을 입력세요" />
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
                    <Button onClick={handleAddOption}>
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
                          <TableHead>옵션</TableHead>
                          <TableHead>제품코드</TableHead>
                          <TableHead>수량</TableHead>
                          <TableHead>판매가격</TableHead>
                          <TableHead>할인가</TableHead>
                          <TableHead className="w-[100px]">적용</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {options.map((option, i) => (
                          <TableRow key={option.id}>
                            <TableCell>
                              <span className="text-sm font-medium">#{i + 1}</span>
                            </TableCell>
                            <TableCell>
                              <Input 
                                value={option.optionName} 
                                onChange={(e) => handleOptionChange(option.id, 'optionName', e.target.value)}
                                className="h-8" 
                              />
                            </TableCell>
                            <TableCell>
                              <Input 
                                value={option.optionValue}
                                onChange={(e) => handleOptionChange(option.id, 'optionValue', e.target.value)}
                                className="h-8" 
                              />
                            </TableCell>
                            <TableCell>
                              <Input 
                                value={option.code}
                                onChange={(e) => handleOptionChange(option.id, 'code', e.target.value)}
                                className="h-8" 
                              />
                            </TableCell>
                            <TableCell>
                              <Input 
                                type="number"
                                value={option.quantity}
                                onChange={(e) => handleOptionChange(option.id, 'quantity', Number(e.target.value))}
                                className="h-8" 
                              />
                            </TableCell>
                            <TableCell>
                              <Input 
                                type="number"
                                value={option.price}
                                onChange={(e) => handleOptionChange(option.id, 'price', Number(e.target.value))}
                                className="h-8" 
                              />
                            </TableCell>
                            <TableCell>
                              <Input 
                                type="number"
                                value={option.discountPrice}
                                onChange={(e) => handleOptionChange(option.id, 'discountPrice', Number(e.target.value))}
                                className="h-8" 
                              />
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline" className="w-full">
                                적용
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleDeleteOption(option.id)}
                              >
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
                          {options.map((option, i) => (
                            <TableRow key={option.id}>
                              <TableCell>{option.optionName}</TableCell>
                              <TableCell>{option.optionValue}</TableCell>
                              <TableCell>{option.code}</TableCell>
                              <TableCell>{`${option.quantity} EA`}</TableCell>
                              <TableCell>{`${option.price.toLocaleString()} 원`}</TableCell>
                              <TableCell>{`${option.discountPrice.toLocaleString()} 원`}</TableCell>
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
    </DndProvider>
  )
}
