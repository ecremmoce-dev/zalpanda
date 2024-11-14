import { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Category {
  CATE_L_CD: string
  CATE_L_NM: string
  CATE_M_CD: string
  CATE_M_NM: string
  CATE_S_CD: string
  CATE_S_NM: string
}

interface CategorySelectorProps {
  onSelect: (category: {
    mainCatCd: string
    mainCatNm: string
    firstSubCatCd: string
    firstSubCatNm: string
    secondSubCatCd: string
    secondSubCatNm: string
  }) => void
  sellerAuthKey: string
}

export default function CategorySelector({ onSelect, sellerAuthKey }: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  console.log("CategorySelector", isLoading);
  // 검색 결과를 메모이제이션
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    console.log("filteredCategories", isLoading);
    const searchLower = searchTerm.toLowerCase();
    return categories.filter(cat => 
      cat.CATE_L_NM.toLowerCase().includes(searchLower) ||
      cat.CATE_M_NM.toLowerCase().includes(searchLower) ||
      cat.CATE_S_NM.toLowerCase().includes(searchLower)
    );
  }, [categories, searchTerm]);

  // 카테고리 데이터 로드 - 캐시 적용
  const fetchCategories = async () => {
    console.log("fetchCategories 시작", sellerAuthKey);

    setIsLoading(true);
    try {
      // QOO10 API에서 카테고리 정보 조회
      const response = await fetch(`/api/qoo10/category?key=${sellerAuthKey}`);
      console.log("API 응답 상태:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 에러:', errorText);
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      console.log("API 데이터:", data);
      
      if (data.ResultObject && Array.isArray(data.ResultObject)) {
        setCategories(data.ResultObject);
        // 세션 스토리지에 캐시
        sessionStorage.setItem(`categories_${sellerAuthKey}`, JSON.stringify(data.ResultObject));
      } else {
        console.error('Invalid data format:', data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect 수정
  useEffect(() => {
    console.log("useEffect 실행", sellerAuthKey);
    if (sellerAuthKey) {
      // 세션 스토리지에서 캐시된 데이터 확인
      const cached = sessionStorage.getItem(`categories_${sellerAuthKey}`);
      if (cached) {
        console.log("캐시된 데이터 사용");
        setCategories(JSON.parse(cached));
      } else {
        console.log("API 호출 시작");
        fetchCategories();
      }
    }
  }, [sellerAuthKey]); // sellerAuthKey 의존성 추가

  // 실시간 검색 처리
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-4">
      {/* 검색 영역 */}
      <div className="flex gap-2">
        <Input
          placeholder="카테고리명 검색..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-1"
        />
      </div>

      {/* 카테고리 목록 */}
      <div className="border rounded-lg overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="w-[180px]">대분류</TableHead>
                <TableHead className="w-[180px]">중분류</TableHead>
                <TableHead className="w-[180px]">소분류</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    카테고리 정보를 불러오는 중...
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    {searchTerm ? '검색 결과가 없습니다.' : '카테고리 정보가 없습니다.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.slice(0, 100).map((category, index) => (  // 한 번에 100개만 표시
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="max-w-[180px]">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">{category.CATE_L_CD}</span>
                        <span className="truncate">{category.CATE_L_NM}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[180px]">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">{category.CATE_M_CD}</span>
                        <span className="truncate">{category.CATE_M_NM}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[180px]">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">{category.CATE_S_CD}</span>
                        <span className="truncate">{category.CATE_S_NM}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const mainCatNm = category.CATE_L_NM.split('(')[0].trim();
                          const firstSubCatNm = category.CATE_M_NM.split('(')[0].trim();
                          const secondSubCatNm = category.CATE_S_NM.split('(')[0].trim();

                          onSelect({
                            mainCatCd: category.CATE_L_CD,
                            mainCatNm: mainCatNm,
                            firstSubCatCd: category.CATE_M_CD,
                            firstSubCatNm: firstSubCatNm,
                            secondSubCatCd: category.CATE_S_CD,
                            secondSubCatNm: secondSubCatNm
                          })
                        }}
                      >
                        선택
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
} 