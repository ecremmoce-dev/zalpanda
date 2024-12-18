"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronRight, Search, Download, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/utils/supabase/client";
import { useUserDataStore } from "@/store/modules";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import ProductDetail from "@/components/product-public-detail"
import { useSupplierStore } from "@/store/modules/supplierStore"
import { useRouter } from 'next/navigation'
import { SupplierSelector } from "@/components/supplier-selector"

interface Supplier {
  id: number
  code: string
  company: string
  website: string
  brand: string
  registrationDate: string
}

interface Product {
  id: string
  variationsku: string
  thumbnailurl: string
  name: string
  originalname: string
  content: string
  contenthtml: string
  originalcontent: string
  updatedat: string
  createdat: string
  category?: string
  stocks: {
    nowstock: number
  }
  orginurl?: string
  ecsku?: string
  sellersku?: string
}

const categories = ['전체', '의류', '식품', '전자제품', '가구', '화장품', '사무용품']
const DEFAULT_IMAGE = 'https://via.placeholder.com/150'

export default function SupplierProductManagement() {
  const [userData, setUserData] = useState<any>(null)
  const [supplierData, setSupplierData] = useState<any[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [supplierSearch, setSupplierSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [editingContent, setEditingContent] = useState<string>('')
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("")
  const [isReplaceDialogOpen, setIsReplaceDialogOpen] = useState(false);
  const [replaceFrom, setReplaceFrom] = useState('');
  const [replaceTo, setReplaceTo] = useState('');

  const { user } = useUserDataStore();
  const { selectedSupplier, setSelectedSupplier } = useSupplierStore();
  const router = useRouter()

  useEffect(() => {
    const initializeData = async () => {
      if (user) {
        await initializeSupplierData(user.companyid)
        if (selectedSupplier?.id) {
          await fetchProductData(selectedSupplier.id, user.companyid)
        }
      }
    }
    
    initializeData()
  }, [user, selectedSupplier])

  const fetchSupplierData = async (companyid: string) => {
    try {
      const { data, error } = await supabase.from('company_supply')
        .select('*')
        .eq('companyid', companyid)

      if (error) throw error;
      
      setSupplierData(data)
    } catch (error) {
      console.log(error);
    }
  }

  const fetchProductData = async (supplyid: string | number, companyid: string) => {
    try {
      console.log('Fetching products with params:', { supplyid, companyid });
      
      const { data, error } = await supabase
        .from('items')
        .select(`
          id,
          variationsku,
          thumbnailurl,
          name,
          originalname,
          content,
          contenthtml,
          originalcontent,
          updatedat,
          createdat,
          stocks (
            nowstock
          ),
          orginurl,
          ecsku,
          sellersku
        `)
        .eq('companyid', companyid)
        .eq('supplyid', supplyid.toString())
        .order('createdat', { ascending: false })

      if (error) throw error;

      const formattedData = data.map(item => ({
        ...item,
        contenthtml: item.contenthtml || '',
        stocks: item.stocks ? (item.stocks[0] || { nowstock: 0 }) : { nowstock: 0 }
      }));

      console.log('Formatted data:', formattedData);
      setProducts(formattedData);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      alert('상품 목록을 불러오는데 실패했습니다.');
    }
  }

  const handleSupplierSelect = async (supplier: any) => {
    setSelectedSupplier(supplier);
    if (user && supplier && supplier.id) {
      await fetchProductData(supplier.id, user.companyid)
    }
  }

  const handleEditContent = async (productId: string, newContent: string, newContentHtml: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .update({ 
          content: newContent,
          contenthtml: newContentHtml
        })
        .eq('id', productId)

      if (error) throw error;

      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, content: newContent, contenthtml: newContentHtml }
          : product
      ))
      
      setEditingProductId(null)
      setEditingContent('')
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Failed to update content:', error)
      alert('본문 수정에 실패했습니다.')
    }
  }

  const handleProductSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductSearch(event.target.value);
  };

  const filteredProducts = products.filter(product => {
    const searchTerm = productSearch.toLowerCase();
    const nameMatch = product.name ? product.name.toLowerCase().includes(searchTerm) : false;
    const skuMatch = product.variationsku ? product.variationsku.toLowerCase().includes(searchTerm) : false;
    return nameMatch || skuMatch;
  });

  const handleSupplierSearch = () => {
    if (!supplierSearchTerm) {
      initializeSupplierData(user.companyid);
      return;
    }

    const filteredData = supplierData.filter(supplier =>
      supplier.supplyname.includes(supplierSearchTerm) ||
      supplier.managername.includes(supplierSearchTerm)
    );
    setSupplierData(filteredData);
  }

  // Supplier columns
  const supplierColumns: ColumnDef<typeof supplierData[0]>[] = [
    { accessorKey: "supplyname", header: "회사명" },
    { accessorKey: "managername", header: "담당자" },
    { accessorKey: "created", header: "등록일" },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          onClick={() => handleSupplierSelect(row.original)}
          variant={selectedSupplier?.id === row.original.id ? "default" : "outline"}
          className={selectedSupplier?.id === row.original.id ? "bg-blue-500 text-white" : ""}
        >
          선택
        </Button>
      ),
    },
  ]

  const productColumns: ColumnDef<Product>[] = [
    { 
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (value) {
              const allIds = table.getRowModel().rows.map(row => row.original.id);
              setSelectedProducts(allIds);
            } else {
              setSelectedProducts([]);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            const productId = row.original.id;
            if (value) {
              setSelectedProducts(prev => [...prev, productId]);
            } else {
              setSelectedProducts(prev => prev.filter(id => id !== productId));
            }
          }}
          aria-label="Select row"
        />
      ),
    },
    {
      id: "number",
      header: "번호",
      cell: ({ row }) => (
        <div className="text-center">
          {row.index + 1}
        </div>
      )
    },
    { 
      accessorKey: "ecsku",
      header: "EC SKU",
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.ecsku || '-'}
        </div>
      )
    },
    { 
      accessorKey: "sellersku",
      header: "Seller SKU",
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.sellersku || '-'}
        </div>
      )
    },
    {
      accessorKey: "thumbnailurl",
      header: "이미지",
      cell: ({ row }) => (
        <div 
          className="flex items-center justify-center cursor-pointer"
          onClick={() => handleProductClick(row.original.id)}
        >
          <img
            src={row.original.thumbnailurl || DEFAULT_IMAGE}
            alt={row.original.name || '상품 이미지'}
            className="w-16 h-16 object-cover rounded hover:opacity-80 transition-opacity"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_IMAGE;
            }}
          />
        </div>
      ),
    },
    { 
      accessorKey: "originalname",
      header: "원본 상품명",
      cell: ({ row }) => (
        <div 
          className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:text-blue-500"
          title={row.original.originalname}
          onClick={() => handleProductClick(row.original.id)}
        >
          {row.original.originalname || '-'}
        </div>
      )
    },
    { 
      accessorKey: "name",
      header: "보정 상품명",
      cell: ({ row }) => (
        <div 
          className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:text-blue-500" 
          title={row.original.name}
          onClick={() => handleProductClick(row.original.id)}
        >
          {row.original.name || '-'}
        </div>
      )
    },
    { 
      accessorKey: "updatedat",
      header: "마지막 수정일",
      cell: ({ row }) => {
        const date = row.original.updatedat || row.original.createdat
        return date ? new Date(date).toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).replace(',', '').replace(/\//g, '.').replace(' ', ' ') : '-'
      }
    },
    { 
      id: "edit",
      header: "수정",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditingProductId(row.original.id)
            setEditingContent(row.original.content || '')
            setIsEditDialogOpen(true)
          }}
        >
          수정
        </Button>
      )
    },
    { 
      id: "view-original",
      header: "원문보기",
      cell: ({ row }) => {
        const orginurl = row.original.orginurl;
        return orginurl ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(orginurl, '_blank', 'noopener,noreferrer')}
          >
            원문보기
          </Button>
        ) : null;
      },
    },
  ]

  const productDescriptionColumns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      id: "number",
      header: "번호",
      cell: ({ row }) => (
        <div className="text-center">
          {row.index + 1}
        </div>
      )
    },
    { 
      accessorKey: "ecsku",
      header: "EC SKU",
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.ecsku || '-'}
        </div>
      )
    },
    { 
      accessorKey: "sellersku",
      header: "Seller SKU",
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.sellersku || '-'}
        </div>
      )
    },
    {
      accessorKey: "thumbnailurl",
      header: "이미지",
      cell: ({ row }) => (
        <div 
          className="flex items-center justify-center cursor-pointer"
          onClick={() => handleProductClick(row.original.id)}
        >
          <img
            src={row.original.thumbnailurl || DEFAULT_IMAGE}
            alt={row.original.name || '상품 이미지'}
            className="w-16 h-16 object-cover rounded hover:opacity-80 transition-opacity"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_IMAGE;
            }}
          />
        </div>
      ),
    },
    {
      accessorKey: "originalcontent",
      header: "원본 본문",
      cell: ({ row }) => (
        <div className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap" title={row.original.originalcontent}>
          {row.original.originalcontent || '-'}
        </div>
      )
    },
    { 
      accessorKey: "content",
      header: "보정 본문",
      cell: ({ row }) => (
        <div className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap" title={row.original.content}>
          {row.original.content || '-'}
        </div>
      )
    },
    { 
      accessorKey: "updatedat",
      header: "마지막 수정일",
      cell: ({ row }) => {
        const date = row.original.updatedat || row.original.createdat
        return date ? new Date(date).toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).replace(',', '').replace(/\//g, '.').replace(' ', ' ') : '-'
      }
    },
    { 
      id: "edit",
      header: "수정",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditingProductId(row.original.id)
            setEditingContent(row.original.content || '')
            setIsEditDialogOpen(true)
          }}
        >
          수정
        </Button>
      )
    }
  ]

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsDetailDialogOpen(true);
  };

  const handleOptionSelect = (option: string) => {
    switch (option) {
      case 'moveCorrection':
        // 원본 상품명을 보정 상품명으로 옮기기
        setProducts(products.map(product => {
          if (selectedProducts.includes(product.id)) {
            return { ...product, name: product.originalname };
          }
          return product;
        }));
        break;

      case 'organize':
        // 문장 정리하기
        setProducts(products.map(product => {
          if (selectedProducts.includes(product.id)) {
            let cleanedContent = product.name
              .replace(/\s+/g, ' ')  // 여러 개의 공백을 하나로
              .trim()  // 앞뒤 공백 제거
              .replace(/[^a-zA-Z0-9가-힣\s]/g, ' ')  // 특수문자 제거
              .replace(/\s+/g, ' ');  // 다시 한번 공백 정리
            return { ...product, name: cleanedContent };
          }
          return product;
        }));
        break;

      case 'undo':
        // 보정 상품명 초기화
        setProducts(products.map(product => {
          if (selectedProducts.includes(product.id)) {
            return { ...product, name: '' };
          }
          return product;
        }));
        break;

      case 'replace':
        // Replace 다이얼로그 열기
        setIsReplaceDialogOpen(true);
        break;

      default:
        break;
    }
  };

  // Replace 실행 함수
  const handleReplace = () => {
    if (!replaceFrom) return;

    setProducts(products.map(product => {
      if (selectedProducts.includes(product.id)) {
        const newName = product.name.replace(new RegExp(replaceFrom, 'g'), replaceTo);
        return { ...product, name: newName };
      }
      return product;
    }));

    // 다이얼로그 닫기 및 상태 초기화
    setIsReplaceDialogOpen(false);
    setReplaceFrom('');
    setReplaceTo('');
  };

  // 저장 함수 추가
  const handleSave = async () => {
    try {
      // 선택된 상품들만 필터링
      const productsToUpdate = products.filter(product => 
        selectedProducts.includes(product.id)
      );

      if (productsToUpdate.length === 0) {
        alert('저장할 항목을 선택해주세요.');
        return;
      }

      // 각 상품에 대해 업데이트 수행
      const updatePromises = productsToUpdate.map(async (product) => {
        const { error } = await supabase
          .from('items')
          .update({ 
            name: product.name,
            content: product.content,
            contenthtml: product.contenthtml,
            updatedat: new Date().toISOString()
          })
          .eq('id', product.id);

        if (error) throw error;
      });

      // 모든 업데이트 완료 대기
      await Promise.all(updatePromises);

      alert('저장이 완료되었습니다.');
      
      // 선택 초기화
      setSelectedProducts([]);
      
      // 데이터 새로고침
      if (selectedSupplier?.id && user) {
        await fetchProductData(selectedSupplier.id, user.companyid);
      }

    } catch (error) {
      console.error('Failed to save products:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const handleAddWordToCorrection = (position: 'front' | 'back') => {
    if (position === 'front') {
      setProducts(products.map(product => {
        if (selectedProducts.includes(product.id)) {
          return { ...product, name: `${replaceFrom} ${product.name}` }; // 맨 앞에 추가
        }
        return product;
      }));
    } else if (position === 'back') {
      setProducts(products.map(product => {
        if (selectedProducts.includes(product.id)) {
          return { ...product, name: `${product.name} ${replaceFrom}` }; // 맨 뒤에 추가
        }
        return product;
      }));
    }
  };

  const initializeSupplierData = async (companyid: string) => {
    try {
      const { data, error } = await supabase.from('company_supply')
        .select('*')
        .eq('companyid', companyid);

      if (error) throw error;
      setSupplierData(data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDownloadList = () => {
    console.log("Downloading list")
    // 실제 다운로드 로직 구현
  }

  const handleProductRegistration = (method: string) => {
    router.push(`/product/public/new?type=${method}`)
  }

  return (
    <>
      <div className="container mx-auto p-4 space-y-8">
        <SupplierSelector 
          onSupplierSelect={handleSupplierSelect}
          onDownloadList={handleDownloadList}
          onProductRegistration={handleProductRegistration}
        />
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              {selectedSupplier ? `${selectedSupplier.supplyname} 상품 목록` : '상품 목록'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="product-name-correction" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList className="grid w-auto grid-cols-2">
                  <TabsTrigger value="product-name-correction">상품명 보정</TabsTrigger>
                  <TabsTrigger value="product-description-correction">상품 본문 보정</TabsTrigger>
                </TabsList>
                <div className="flex space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        disabled={selectedProducts.length === 0}
                      >
                        Options
                        <MoreHorizontal className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleOptionSelect('moveCorrection')}>
                        원문 {`>`} 보정 옮기기
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOptionSelect('organize')}>
                        정리하기
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOptionSelect('undo')}>
                        되돌리기
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOptionSelect('replace')}>
                        Replace
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    variant="default"
                    onClick={handleSave}
                    disabled={selectedProducts.length === 0}
                  >
                    저장
                  </Button>
                </div>
              </div>

              <TabsContent value="product-name-correction">
                <DataTable 
                  columns={productColumns}
                  data={filteredProducts}
                  searchTerm={productSearch}
                  onSearchTermChange={setProductSearch}
                  showActionButtons={true}
                  selectedSupplier={selectedSupplier}
                />
              </TabsContent>
              <TabsContent value="product-description-correction">
                <DataTable 
                  columns={productDescriptionColumns}
                  data={products}
                  searchTerm={productSearch}
                  onSearchTermChange={setProductSearch}
                  showActionButtons={true}
                  selectedSupplier={selectedSupplier}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[1200px] h-[800px] flex flex-col">
          <DialogHeader>
            <DialogTitle>보정 본문 수정</DialogTitle>
          </DialogHeader>
          <div className="flex-1 grid grid-cols-2 gap-6 py-4 overflow-hidden">
            <div className="flex flex-col h-full">
              <label className="text-sm font-medium mb-2">원본 본문</label>
              <div className="flex-1 p-4 bg-gray-50 rounded-md overflow-y-auto whitespace-pre-wrap">
                {products.find(p => p.id === editingProductId)?.originalcontent || '-'}
              </div>
            </div>
            <div className="flex flex-col h-full">
              <label className="text-sm font-medium mb-2">보정 본문</label>
              <textarea
                defaultValue={editingContent}
                onChange={(e) => {
                  e.currentTarget.value = e.currentTarget.value
                  setEditingContent(e.currentTarget.value)
                }}
                className="flex-1 p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ 
                  minHeight: '600px',
                  lineHeight: '1.5',
                  fontSize: '16px'
                }}
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setEditingProductId(null)
                setEditingContent('')
              }}
            >
              취소
            </Button>
            <Button 
              onClick={() => editingProductId && handleEditContent(editingProductId, editingContent, '')}
            >
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-[1600px] max-h-[95vh] overflow-y-auto p-8">
          <DialogHeader>
            <DialogTitle>상품 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedProductId && (
            <ProductDetail 
              productId={selectedProductId} 
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isReplaceDialogOpen} onOpenChange={setIsReplaceDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Find and Replace Text</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <Input
                id="replaceFrom"
                placeholder="단어를 입력해주세요."
                value={replaceFrom}
                onChange={(e) => setReplaceFrom(e.target.value)}
                className="w-full"
              />
              <Input
                id="replaceTo"
                placeholder="변경할 단어를 입력해주세요."
                value={replaceTo}
                onChange={(e) => setReplaceTo(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex justify-between space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAddWordToCorrection('front')} // 맨 앞에 추가
              >
                맨 앞에 추가
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAddWordToCorrection('back')} // 맨 뒤에 추가
              >
                맨 뒤에 추가
              </Button>
            </div>
          </div>
          <DialogFooter>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsReplaceDialogOpen(false);
                  setReplaceFrom('');
                  setReplaceTo('');
                }}
              >
                취소
              </Button>
              <Button 
                variant="default"
                onClick={handleReplace}
                className="bg-blue-500"
              >
                REPLACE
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchTerm?: string
  onSearchTermChange?: (term: string) => void
  onSearch?: () => void
  showActionButtons: boolean
  selectedSupplier?: any
}

function DataTable<TData, TValue>({
  columns,
  data,
  searchTerm,
  onSearchTermChange,
  onSearch,
  showActionButtons,
  selectedSupplier,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  })

  return (
    <div className="w-full">
      {showActionButtons && (
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center w-full">
            <Input
              placeholder="SKU 또는 상품명을 입력하세요"
              value={searchTerm}
              onChange={(event) => onSearchTermChange?.(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onSearch?.();
                }
              }}
              className="max-w-full mr-2"
            />
            <Button onClick={onSearch}>
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
          </div>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`
                    ${row.getIsSelected() ? "bg-blue-50" : ""} 
                    ${selectedSupplier?.id === (row.original as any)?.id ? "bg-blue-100" : ""}
                    hover:bg-gray-50 transition-colors
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newPage = table.getState().pagination.pageIndex - 1;
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="mx-2">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newPage = table.getState().pagination.pageIndex + 1;
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}