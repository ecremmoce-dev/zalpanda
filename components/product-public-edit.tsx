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

// Image 인터페이스 수정
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

// ProductEditPageProps 타입 수정
interface ProductEditPageProps {
  initialData: {
    id?: string;
    variationsku?: string;
    name?: string;
    hscode?: string;
    barcode?: string;
    weight?: number;
    width?: number;
    length?: number;
    height?: number;
    memo?: string;
    thumbnailurl?: string;
    content?: string;
    contenthtml?: string;
    brandname?: string;
    consumerprice?: number;
    status?: string;
    color?: string;
    material?: string;
    noticeinfo?: string;
    size?: string;
    currentstock?: number;
    safetystock?: number;
    producturl?: string;
    customerid?: string;
    customername?: string;
    categorymapid?: string;
    categoryid?: string;
    categorypath?: string;
    groupname?: string;
    groupvalue?: string;
    purchaseprice?: number;
    packageunit?: string;
    weightunit?: string;
    options?: Option[];
  };
  onSave: (data: any) => void;
  onCancel: () => void;
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

// 컴포넌트 상단에 인터페이스 추가
interface NoticeInfo {
  [key: string]: string;
}

// 아이콘 버튼들을 포함하는 공통 컴포넌트 생성
const ImageActionButtons = ({ 
  image,
  onDelete 
}: { 
  image: Image;
  onDelete: () => void;
}) => (
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
      onClick={onDelete}
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
      <ImageActionButtons 
        image={image}
        onDelete={() => handleDeleteImage(image)}
      />
    </div>
  );
};

// Option 인터페이스 수정
interface Option {
  id: string;
  itemid?: string;
  variationsku?: string;
  consumerprice?: number;
  purchaseprice?: number;
  groupname?: string;
  groupvalue?: string;
  color?: string;
  material?: string;
  noticeinfo?: string;
  size?: string;
  voproductid?: string;
  expirationday?: number;
  feature?: string;
  packageunit?: string;
  weightunit?: string;
  createdat?: string;
  updatedat?: string;
  currentstock?: number;
  safetystock?: number;
  code?: string;
  quantity?: number;
  price?: number;
  discountPrice?: number;
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
        <ImageActionButtons 
          image={image}
          onDelete={() => handleDeleteImage(image)}
        />
      </div>
    </div>
  );
});

// UUID 생성 함수 추가
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export default function ProductEditPage({ initialData, onSave, onCancel }: ProductEditPageProps) {
  // formData 타입 확장
  interface FormData {
    name: string;
    content: string;
    contenthtml: string;
    memo: string;
    weight: number;
    width: number;
    length: number;
    height: number;
    hscode: string;
    barcode: string;
    consumerprice: number;
    status: string;
    size: string;
    color: string;
    material: string;
    brandname: string;
    noticeinfo: string;
    variationsku: string;
    producturl: string;
    purchaseprice: number;
    packageunit: string;
    weightunit: string;
    currentstock?: number;
    safetystock?: number;
  }

  const [formData, setFormData] = React.useState<FormData>({
    name: initialData?.name || '',
    content: initialData?.content || '',
    contenthtml: initialData?.contenthtml || '',
    memo: initialData?.memo || '',
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
    brandname: initialData?.brandname || '',
    noticeinfo: initialData?.noticeinfo || '',
    variationsku: initialData?.variationsku || '',
    producturl: initialData?.producturl || '',
    purchaseprice: initialData?.purchaseprice || 0,
    packageunit: initialData?.packageunit || '',
    weightunit: initialData?.weightunit || '',
    currentstock: initialData?.currentstock || 0,
    safetystock: initialData?.safetystock || 0
  });

  const [isCategoryExpanded, setIsCategoryExpanded] = React.useState(true);

  const toggleCategorySection = () => {
    setIsCategoryExpanded(prev => !prev);
  };

  // 입력 핸들러
  const handleInputChange = (field: string, value: any) => {
    console.log(`Updating ${field}:`, value);
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      console.log('Updated formData:', newData);
      return newData;
    });
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

      // 데이터 변환
      const formattedData = data.map(img => ({
        ...img,
        has_group_alias: img.groupalias !== null
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

        //console.log('Raw Categories:', allCategories); // 디버깅용 로그

        // depth 값을 0부터 시작하도록 수정
        const formattedCategories = allCategories
          .map(category => ({
            ...category,
            depth: category.depth,
            is_leaf: !allCategories.some(c => c.parentcategoryid === category.id)
          }));

        console.log('Formatted Categories:', formattedCategories); // 디버깅용 그

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

  // ��택된 카테고리 표시 부분 수정
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
      return newImages.map((img, index) => ({
        ...img,
        index: index
      }));
    });
  }, []);

  // moveImage 함수
  const moveImage = React.useCallback((dragIndex: number, hoverIndex: number) => {
    setThumbnailImages((prevImages) => {
      const newImages = [...prevImages];
      const draggedImage = newImages[dragIndex];
      newImages.splice(dragIndex, 1);
      newImages.splice(hoverIndex, 0, draggedImage);
      return newImages.map((img, index) => ({
        ...img,
        index: index
      }));
    });
  }, []);

  // 옵션 상태 추기화 수정
  const [options, setOptions] = React.useState<Option[]>(initialData?.options || []);

  // 옵션 추가 함수 수정
  const handleAddOption = () => {
    const newOption: Option = {
      id: generateUUID(), // UUID 사용
      itemid: initialData.id,
      variationsku: '',
      consumerprice: 0,
      purchaseprice: 0,
      groupname: '',
      groupvalue: '',
      color: '',
      material: '',
      size: '',
      currentstock: 0,
      safetystock: 0,
      packageunit: '',
      weightunit: ''
    };
    setOptions([...options, newOption]);
  };

  // 옵션 삭제 함수 수정
  const handleDeleteOption = async (id: string) => {
    try {
      // 삭제 확인
      if (!window.confirm('이 옵션을 삭제하시겠습니까?')) {
        return;
      }

      // 1. item_options 테이블에서 옵션 삭제
      const { error: optionError } = await supabase
        .from('item_options')
        .delete()
        .eq('id', id);

      if (optionError) throw optionError;

      // 2. UI에서 옵션 제거
      setOptions(options.filter(option => option.id !== id));

      // 성공 메시지 표시
      alert('옵션이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete option:', error);
      alert('옵션 삭제에 실패했습니다.');
    }
  };

  // 옵션 수정 함수
  const handleOptionChange = (id: string, field: keyof Option, value: string | number) => {
    setOptions(options.map(option => 
      option.id === id 
        ? { ...option, [field]: value }
        : option
    ));
  };

  // initialData가 변될 때마다 로그 출력
  React.useEffect(() => {
    console.log('Initial Data:', initialData);
    console.log('Initial contenthtml:', initialData?.contenthtml);
  }, [initialData]);

  // ���태 추가 (포넌트 최상단 상태 선언부에 추가)
  const [isContentExpanded, setIsContentExpanded] = React.useState(true);

  // 상 설명 에디터 부분 수정
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <Label>상품 설명</Label>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-blue-500"
        onClick={() => setIsContentExpanded(prev => !prev)}
      >
        {isContentExpanded ? '접기' : '펼치기'}
      </Button>
    </div>
    {isContentExpanded && (
      <Tabs defaultValue="edit" className="w-full">
        <TabsList>
          <TabsTrigger value="edit">문 편집</TabsTrigger>
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
                  console.log('HTML Content Changed:', e.target.value);
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
                    console.log('Current HTML Content:', formData.contenthtml);
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
    )}
  </div>

  // handleApplySingleProduct 함수를 컴포넌트 내부로 이동
  const handleApplySingleProduct = async () => {
    try {
      if (!initialData?.id) {
        alert('상품 ID가 없습니다.');
        return;
      }

      // 1. items 테이블 업데이트 (가격 정보)
      const { error: itemError } = await supabase
        .from('items')
        .update({
          variationsku: formData.variationsku,
          consumerprice: formData.consumerprice,    // 판매가
          purchaseprice: formData.purchaseprice,    // 공급가
          updatedat: new Date().toISOString()
        })
        .eq('id', initialData.id);

      if (itemError) {
        console.error('Failed to update item:', itemError);
        throw itemError;
      }

      // 2. stocks 테이블 업데이트 (재고 정보)
      const stockData = {
        itemid: initialData.id,
        variationsku: formData.variationsku,
        nowstock: formData.currentstock || 0,       // 현재 재고
        safetystock: formData.safetystock || 0,     // 안전 재고
        updatedat: new Date().toISOString()
      };

      // stocks 테이블에 해당 itemid가 있는지 확인
      const { data: existingStock, error: checkError } = await supabase
        .from('stocks')
        .select('id')
        .eq('itemid', initialData.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116는 데이터가 없는 경우
        throw checkError;
      }

      // 기존 재고 데이터가 있으면 update, 없으면 insert
      const { error: stockError } = existingStock
        ? await supabase
            .from('stocks')
            .update({
              nowstock: stockData.nowstock,
              safetystock: stockData.safetystock,
              updatedat: stockData.updatedat
            })
            .eq('itemid', initialData.id)
        : await supabase
            .from('stocks')
            .insert({
              ...stockData,
              id: crypto.randomUUID(),
              createdat: new Date().toISOString()
            });

      if (stockError) {
        console.error('Failed to update stock:', stockError);
        throw stockError;
      }

      alert('상품 정보가 성공적으로 저장되었습니다.');

      // 3. 데이터 새로고침
      const { data: updatedData, error: fetchError } = await supabase
        .from('items')
        .select(`
          *,
          stocks!left (
            nowstock,
            safetystock
          )
        `)
        .eq('id', initialData.id)
        .single();

      if (fetchError) {
        console.error('Failed to fetch updated data:', fetchError);
        throw fetchError;
      }

      // 4. 폼 데이터 업데이트
      if (updatedData) {
        setFormData(prev => ({
          ...prev,
          variationsku: updatedData.variationsku,
          consumerprice: updatedData.consumerprice,
          purchaseprice: updatedData.purchaseprice,
          currentstock: updatedData.stocks?.nowstock || 0,
          safetystock: updatedData.stocks?.safetystock || 0
        }));
      }

    } catch (error) {
      console.error('Failed to update single product:', error);
      alert('상품 정보 저장에 실패했습니다.');
    }
  };

  // 이미지 순서 저장 함수 추가
  const saveImageOrder = async () => {
    try {
      // 썸네일 이미지 순 업데이트
      for (const image of thumbnailImages) {
        const { error: thumbnailError } = await supabase
          .from('item_images')
          .update({ index: image.index })
          .eq('id', image.id);

        if (thumbnailError) throw thumbnailError;
      }

      // 상세 이미지 순서 업데이트
      for (const image of contentImages) {
        const { error: contentError } = await supabase
          .from('item_images')
          .update({ index: image.index })
          .eq('id', image.id);

        if (contentError) throw contentError;
      }

      alert('이미지 순서가 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save image order:', error);
      alert('이미지 순서 저장에 실패했습니다.');
    }
  };

  // 기존 onSave 함수 수정
  const handleSave = async () => {
    try {
      // 이미지 순서 저장
      await saveImageOrder();
      
      // 기존 저장 로직 실행
      onSave(formData);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('저장에 실패했습니다.');
    }
  };

  // 이미지 업로드 핸들러 수정
  const [isUploading, setIsUploading] = React.useState(false);

  // handleThumbnailUpload 함수 수정
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !initialData.variationsku || !initialData.id) return;
    
    try {
      setIsUploading(true);
      const files = Array.from(e.target.files);
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // UUID 생성
        const imageId = generateUUID();
        
        // 파일 크기 체크 (10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert('파일 크기는 10MB를 초과할 수 없습니다.');
          continue;
        }

        // 파일을 Blob으로 변환
        const blob = new Blob([file], { type: file.type });
        
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
          const errorText = await corsResponse.text();
          console.error('CORS Response:', {
            status: corsResponse.status,
            text: errorText
          });
          throw new Error('CORS 설정 실패');
        }
        
        const { token, storageUrl, containerName } = await corsResponse.json();
        
        // KT Cloud에 직접 업로드
        const fileExt = file.name.split('.').pop();
        const fileName = `thumbnail-${initialData.variationsku}-${thumbnailImages.length + i}.${fileExt}`;
        const uploadUrl = `${storageUrl}/${containerName}/${initialData.variationsku}/thumbnails/${fileName}`;
        
        console.log('Uploading to:', uploadUrl);
        
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'X-Auth-Token': token,
            'Content-Type': file.type,
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
        
        // 업로드된 이미지 URL
        const imageUrl = `${storageUrl}/${containerName}/${initialData.variationsku}/thumbnails/${fileName}`;

        // DB에 이미지 정보 저장
        const { error: dbError } = await supabase
          .from('item_images')
          .insert({
            id: imageId,
            itemid: initialData.id,  // variationsku 대신 id 사용
            type: 'THUMBNAIL',
            url: imageUrl,
            index: thumbnailImages.length,
            language: 'ko',
            createdat: new Date().toISOString()
          });

        if (dbError) throw dbError;
      }

      // 이미지 목록 새로고침
      await fetchImageData(initialData.id);
      alert('이미지가 성공적으로 업로드되었습니다.');

    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  // handleContentImageUpload 함수도 동일하게 수정
  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !initialData.variationsku || !initialData.id) return;
    
    try {
      setIsUploading(true);
      const files = Array.from(e.target.files);
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // UUID 생성
        const imageId = generateUUID();
        
        // 파일 크기 체크 (10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert('파일 크기는 10MB를 초과할 수 없습니다.');
          continue;
        }

        // 파일을 Blob으로 변환
        const blob = new Blob([file], { type: file.type });
        
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
          const errorText = await corsResponse.text();
          console.error('CORS Response:', {
            status: corsResponse.status,
            text: errorText
          });
          throw new Error('CORS 설정 실패');
        }
        
        const { token, storageUrl, containerName } = await corsResponse.json();
        
        // KT Cloud에 직접 업로드
        const fileExt = file.name.split('.').pop();
        const fileName = `content-${initialData.variationsku}-${contentImages.length + i}.${fileExt}`;
        const uploadUrl = `${storageUrl}/${containerName}/${initialData.variationsku}/contents/${fileName}`;
        
        console.log('Uploading to:', uploadUrl);
        
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'X-Auth-Token': token,
            'Content-Type': file.type,
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
        
        // 업로드된 이미지 URL
        const imageUrl = `${storageUrl}/${containerName}/${initialData.variationsku}/contents/${fileName}`;

        // DB에 이미지 정보 저장
        const { error: dbError } = await supabase
          .from('item_images')
          .insert({
            id: imageId,
            itemid: initialData.id,  // variationsku 대신 id 사용
            type: 'MAIN_CONTENT',
            url: imageUrl,
            index: contentImages.length,
            language: 'ko',
            createdat: new Date().toISOString()
          });

        if (dbError) throw dbError;
      }

      // 이미지 목록 새로고침
      await fetchImageData(initialData.id);
      alert('이미지가 성공적으로 업로드되었습니다.');

    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  // 옵션 저장 함수를 컴포넌트 내부로 이동
  const handleApplyOption = async (option: Option) => {
    try {
      const isNewOption = option.id.includes('-');

      const optionData = {
        itemid: initialData.id,
        variationsku: option.variationsku || '',
        consumerprice: option.consumerprice || 0,
        purchaseprice: option.purchaseprice || 0,
        groupname: option.groupname || '',
        groupvalue: option.groupvalue || '',
        color: option.color || '',
        material: option.material || '',
        size: option.size || '',
        packageunit: option.packageunit || '',
        weightunit: option.weightunit || '',
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString()
      };

      if (isNewOption) {
        const { data, error: insertError } = await supabase
          .from('item_options')
          .insert(optionData)
          .select()
          .single();

        if (insertError) throw insertError;

        if (data) {
          setOptions(prevOptions => 
            prevOptions.map(opt => 
              opt.id === option.id ? { ...opt, id: data.id } : opt
            )
          );
        }
      } else {
        const { error: updateError } = await supabase
          .from('item_options')
          .update({
            ...optionData,
            createdat: undefined
          })
          .eq('id', option.id);

        if (updateError) throw updateError;
      }

      alert('옵션이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('Failed to update option:', error);
      alert('옵션 저장에 실패했습니다.');
    }
  };

  // 이미지 섹션 수정
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-8">
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>취소</Button>
          <Button onClick={handleSave}>저장</Button>
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
                          <SelectValue placeholder="1차 테고리" />
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
                              //console.log('Checking category:', c, 'against parent:', selectedSecondCategory?.id); // 버깅용 로그
                              return c.depth === 2 && c.parentcategoryid === selectedSecondCategory?.id;
                            })
                            .map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      {/* 4 카테고리 */}
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
                      <Label>선택한 카테고</Label>
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

          {/* 기 정보 섹션 */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">기본 정보</h2>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">상품명</Label>
                <Input 
                  id="title" 
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="상품명을 력하세요" 
                />
              </div>
              
              {/* 세정보 섹션 */}
              <div className="space-y-4">
                {/* 상세정보 헤더 */}
                <div className="flex justify-between items-center border-b pb-2">
                  <h2 className="text-lg font-semibold">상세정보</h2>
                  <Button 
                    variant="link" 
                    className="text-blue-500"
                    onClick={() => setIsContentExpanded(prev => !prev)}
                  >
                    {isContentExpanded ? '접기' : '펼치기'}
                  </Button>
                </div>
                
                {isContentExpanded && (
                  <div className="space-y-4">
                    {/* 상품 설명 */}
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
                                  console.log('HTML Content Changed:', e.target.value);
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
                                    console.log('Current HTML Content:', formData.contenthtml);
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

                    {/* 보완할 방법 */}
                    <div className="space-y-2">
                      <Label>보완할 방법</Label>
                      <Textarea 
                        placeholder="보완할 방법을 입력하세요" 
                        className="min-h-[100px]"
                      />
                    </div>

                    {/* 보완할 내용 */}
                    <div className="space-y-2">
                      <Label>보완할 내용</Label>
                      <Textarea 
                        placeholder="보완할 내용을 입력하세요" 
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 이미지 섹션 */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">상품 이미지</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isUploading}>
                    <ImagePlus className="h-4 w-4 mr-2" />
                    {isUploading ? '업로드 중...' : '이미지 추가'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>이미지 업로드</Label>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <ImagePlus className="w-8 h-8 mb-4 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG (최대 10MB)</p>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              multiple
                              onChange={handleThumbnailUpload}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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

          {/* 상세 이미지 섹션 */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">상세 이미지</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isUploading}>
                    <ImagePlus className="h-4 w-4 mr-2" />
                    {isUploading ? '업로드 중...' : '이미지 추가'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>이미지 업로드</Label>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <ImagePlus className="w-8 h-8 mb-4 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG (최대 10MB)</p>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              multiple
                              onChange={handleContentImageUpload}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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

          {/* 상품 크기 섹션 */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">상품 크기</h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>가로(Length)</Label>
                    <Input 
                      type="number" 
                      value={formData.length}
                      onChange={(e) => handleInputChange('length', Number(e.target.value))}
                      placeholder="0" 
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.packageunit || 'cm'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Label>세로(Width)</Label>
                    <Input 
                      type="number" 
                      value={formData.width}
                      onChange={(e) => handleInputChange('width', Number(e.target.value))}
                      placeholder="0" 
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.packageunit || 'cm'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Label>높이(Height)</Label>
                    <Input 
                      type="number" 
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', Number(e.target.value))}
                      placeholder="0" 
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.packageunit || 'cm'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>무게</Label>
                    <Input 
                      type="number" 
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                      placeholder="0" 
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.weightunit || 'kg'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Label>부피무게</Label>
                    <Input 
                      type="number" 
                      value={(formData.length * formData.width * formData.height) / 6000}
                      disabled 
                    />
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
                    <text x="15" y="60" className="text-xs" style={{ stroke: 'none', fill: '#6B7280' }}>
                      {formData.width}{formData.packageunit || 'cm'}
                    </text>
                    <text x="80" y="140" className="text-xs" style={{ stroke: 'none', fill: '#6B7280' }}>
                      {formData.length}{formData.packageunit || 'cm'}
                    </text>
                    <text x="160" y="60" className="text-xs" style={{ stroke: 'none', fill: '#6B7280' }}>
                      {formData.height}{formData.packageunit || 'cm'}
                    </text>
                  </svg>
                </div>
                <div className="bg-gray-600 text-white p-4 rounded-lg text-sm space-y-4 min-w-[300px]">
                  <div className="flex items-center justify-center gap-2">
                    <span>{formData.length || 0}</span>
                    <span>x</span>
                    <span>{formData.width || 0}</span>
                    <span>x</span>
                    <span>{formData.height || 0}</span>
                    <span>/</span>
                    <span>6,000</span>
                    <span>=</span>
                    <span>{((formData.length * formData.width * formData.height) / 6000).toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-8 text-center">
                    <div>
                      <div className="text-gray-300">무게</div>
                      <div>{formData.weight || 0}{formData.weightunit || 'kg'}</div>
                    </div>
                    <div>
                      <div className="text-gray-300">부피무게</div>
                      <div>
                        {((formData.length * formData.width * formData.height) / 6000).toFixed(2)}
                        {formData.weightunit || 'kg'}
                      </div>
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
                    {(() => {
                      let noticeData: NoticeInfo = {};
                      try {
                        // initialData에서 noticeinfo 파싱
                        noticeData = initialData?.noticeinfo ? JSON.parse(initialData.noticeinfo) : {};
                        console.log('Parsed Notice Data:', noticeData);
                      } catch (e) {
                        console.error('Failed to parse noticeinfo:', e);
                      }

                      // 모든 필드를 표시 (제외할 필드 목록)
                      const excludeFields = ['치수', '색상', '제품소재'];

                      // 모든 항목 표시
                      const entries = Object.entries(noticeData)
                        .filter(([key]) => !excludeFields.includes(key))
                        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

                      return entries.length > 0 ? (
                        entries.map(([key, value], index) => (
                          <div key={index} className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                              {key}
                            </Label>
                            <div className="text-sm font-medium break-words bg-gray-50 p-2 rounded">
                              {value}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center text-muted-foreground">
                          고시정보가 없��니다.
                        </div>
                      );
                    })()}
                  </div>

                  {/* 사이즈, 색상, 소재 입력 필드 */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="size">사이즈</Label>
                      <Input 
                        id="size" 
                        value={formData.size}
                        onChange={(e) => {
                          handleInputChange('size', e.target.value);
                          try {
                            const noticeData = formData.noticeinfo ? JSON.parse(formData.noticeinfo) : {};
                            noticeData['치수'] = e.target.value;
                            handleInputChange('noticeinfo', JSON.stringify(noticeData));
                          } catch (e) {
                            console.error('Failed to update noticeinfo:', e);
                          }
                        }}
                        placeholder="사이즈를 입력하세요" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">색상</Label>
                      <Input 
                        id="color" 
                        value={formData.color}
                        onChange={(e) => {
                          handleInputChange('color', e.target.value);
                          try {
                            const noticeData = formData.noticeinfo ? JSON.parse(formData.noticeinfo) : {};
                            noticeData['색상'] = e.target.value;
                            handleInputChange('noticeinfo', JSON.stringify(noticeData));
                          } catch (e) {
                            console.error('Failed to update noticeinfo:', e);
                          }
                        }}
                        placeholder="색상을 입력하세요" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="material">소재</Label>
                      <Input 
                        id="material" 
                        value={formData.material}
                        onChange={(e) => {
                          handleInputChange('material', e.target.value);
                          try {
                            const noticeData = formData.noticeinfo ? JSON.parse(formData.noticeinfo) : {};
                            noticeData['제품소재'] = e.target.value;
                            handleInputChange('noticeinfo', JSON.stringify(noticeData));
                          } catch (e) {
                            console.error('Failed to update noticeinfo:', e);
                          }
                        }}
                        placeholder="소재를 입력하세요" 
                      />
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
                  {/* 단일 상품 / 옵션 상품 선택 탭 */}
                  <Tabs defaultValue={options.length > 0 ? "option" : "single"}>
                    <TabsList>
                      <TabsTrigger value="single">단일 상품</TabsTrigger>
                      <TabsTrigger value="option">옵션 상품</TabsTrigger>
                    </TabsList>

                    {/* 단일 상품 탭 컨텐츠 */}
                    <TabsContent value="single">
                      <div className="space-y-4">
                        <div className="bg-sky-50/50 p-4 rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>재고</TableHead>
                                <TableHead>안전재고</TableHead>
                                <TableHead>공급가</TableHead>
                                <TableHead>판매가</TableHead>
                                <TableHead>수정</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  <Input 
                                    value={formData.variationsku || ''}
                                    onChange={(e) => handleInputChange('variationsku', e.target.value)}
                                    className="h-8"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input 
                                    type="number"
                                    value={formData.currentstock || 0}
                                    onChange={(e) => handleInputChange('currentstock', Number(e.target.value))}
                                    className="h-8"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input 
                                    type="number"
                                    value={formData.safetystock || 0}
                                    onChange={(e) => handleInputChange('safetystock', Number(e.target.value))}
                                    className="h-8"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input 
                                    type="number"
                                    value={formData.consumerprice || 0}
                                    onChange={(e) => handleInputChange('consumerprice', Number(e.target.value))}
                                    className="h-8" 
                                    placeholder="공급가"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input 
                                    type="number"
                                    value={formData.purchaseprice || 0}
                                    onChange={(e) => handleInputChange('purchaseprice', Number(e.target.value))}
                                    className="h-8" 
                                    placeholder="판매가"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={handleApplySingleProduct}
                                  >
                                    적용
                                  </Button>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>

                        {/* 단일 상품 요약 정보 */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <span className="text-sm text-gray-500">현재 재고</span>
                              <p className="text-lg font-semibold">{formData.currentstock || 0} EA</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">공급가</span>
                              <p className="text-lg font-semibold">{(formData.consumerprice || 0).toLocaleString()} 원</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">판매가</span>
                              <p className="text-lg font-semibold">{(formData.purchaseprice || 0).toLocaleString()} 원</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* 옵션 상품 탭 컨텐츠 */}
                    <TabsContent value="option">
                      <div className="space-y-6">
                        {/* 옵션 추가 버튼 */}
                        <div className="flex justify-end mb-4">
                          <Button onClick={handleAddOption}>
                            옵션 추가 +
                          </Button>
                        </div>

                        {/* 옵션 테이블 */}
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
                                      value={option.groupname || ''} 
                                      onChange={(e) => handleOptionChange(option.id, 'groupname', e.target.value)}
                                      className="h-8" 
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input 
                                      value={option.groupvalue || ''}
                                      onChange={(e) => handleOptionChange(option.id, 'groupvalue', e.target.value)}
                                      className="h-8" 
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input 
                                      value={option.variationsku || ''}
                                      onChange={(e) => handleOptionChange(option.id, 'variationsku', e.target.value)}
                                      className="h-8" 
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input 
                                      type="number"
                                      value={option.currentstock || 0}
                                      onChange={(e) => handleOptionChange(option.id, 'currentstock', Number(e.target.value))}
                                      className="h-8" 
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input 
                                      type="number"
                                      value={option.consumerprice || 0}
                                      onChange={(e) => handleOptionChange(option.id, 'consumerprice', Number(e.target.value))}
                                      className="h-8" 
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input 
                                      type="number"
                                      value={option.purchaseprice || 0}
                                      onChange={(e) => handleOptionChange(option.id, 'purchaseprice', Number(e.target.value))}
                                      className="h-8" 
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="w-full"
                                      onClick={() => handleApplyOption(option)}
                                    >
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

                          {/* 옵션 요약 테이블 */}
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
                                {options.map((option) => (
                                  <TableRow key={option.id}>
                                    <TableCell>{option.groupname}</TableCell>
                                    <TableCell>{option.groupvalue}</TableCell>
                                    <TableCell>{option.variationsku}</TableCell>
                                    <TableCell>{`${option.currentstock} EA`}</TableCell>
                                    <TableCell>{`${option.consumerprice?.toLocaleString()} 원`}</TableCell>
                                    <TableCell>{`${option.purchaseprice?.toLocaleString()} 원`}</TableCell>
                                    <TableCell>수정됨</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </DndProvider>
  )
}

// 이미지 삭제 함수 추가
const handleDeleteImage = async (image: Image) => {
  try {
    if (!window.confirm('이미지를 삭제하시겠습니까?')) {
      return;
    }

    // 1. DB에서 이미지 정보 먼저 삭제
    const { error: dbError } = await supabase
      .from('item_images')
      .delete()
      .eq('id', image.id);

    if (dbError) throw dbError;

    // 2. KT Cloud에서 이미지 파일 삭제
    try {
      const origin = window.location.origin;
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

      // URL에서 파일명 추출
      const urlParts = image.url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const fileType = image.type === 'THUMBNAIL' ? 'thumbnails' : 'contents';
      
      // 삭제할 파일의 전체 경로 구성 (variationsku 사용)
      const deleteUrl = `${storageUrl}/${containerName}/${initialData.variationsku}/${fileType}/${fileName}`;
      
      console.log('Deleting file:', deleteUrl);

      const deleteResponse = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'X-Auth-Token': token,
        },
      });

      // 204: 성공적으로 삭제됨
      // 404: 이미 삭제된 경우
      if (deleteResponse.status !== 204 && deleteResponse.status !== 404) {
        console.error('Delete response:', {
          status: deleteResponse.status,
          statusText: deleteResponse.statusText
        });
        
        if (deleteResponse.status === 401) {
          throw new Error('인증에 실패했습니다');
        } else if (deleteResponse.status === 403) {
          throw new Error('권한이 없습니다');
        } else {
          throw new Error(`파일 삭제에 실패했습니다: ${deleteResponse.status}`);
        }
      }

    } catch (storageError) {
      console.error('Storage deletion failed:', storageError);
      throw storageError;
    }

    // 3. UI 업데이트
    if (image.type === 'THUMBNAIL') {
      setThumbnailImages(prev => prev.filter(img => img.id !== image.id));
    } else if (image.type === 'MAIN_CONTENT') {
      setContentImages(prev => prev.filter(img => img.id !== image.id));
    }

    alert('이미지가 성공적으로 삭제되었습니다.');

  } catch (error) {
    console.error('Failed to delete image:', error);
    alert('이미지 삭제에 실패했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
  }
};
