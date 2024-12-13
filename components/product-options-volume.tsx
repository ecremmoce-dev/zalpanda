'use client'

import * as React from 'react'
import { ChevronDown, ChevronUp, Search, ChevronRight, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import { Checkbox } from '@/components/ui/checkbox'
import { useState, useEffect } from 'react'
import { supabase } from "@/utils/supabase/client"
import { useUserDataStore } from "@/store/modules"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ProductDetail from "@/components/product-public-detail"
import { useSupplierStore } from "@/store/modules/supplierStore"

interface Product {
  id: string
  variationsku: string
  name: string
  thumbnailurl: string
  weight: string | number
  length: string | number
  width: string | number
  height: string | number
  stocks?: {
    nowstock: number
  }[]
}

export default function ProductOptionsVolume() {
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([])
  const { selectedSupplier, setSelectedSupplier } = useSupplierStore()
  const [selectedCategory, setSelectedCategory] = React.useState<string>("")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [supplierProducts, setSupplierProducts] = useState<Product[]>([])
  const [supplierData, setSupplierData] = useState<any[]>([])
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("")
  const [isSupplierTableExpanded, setIsSupplierTableExpanded] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [weight, setWeight] = useState<string>("")
  const [length, setLength] = useState<string>("")
  const [width, setWidth] = useState<string>("")
  const [height, setHeight] = useState<string>("")
  const [tempWeights, setTempWeights] = useState<{ [key: string]: number }>({})
  const [tempSizes, setTempSizes] = useState<{ [key: string]: { length: number, width: number, height: number } }>({})
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: 'weight' | 'length' | 'width' | 'height' | null;
    value: string;
  } | null>(null);

  const { user } = useUserDataStore()

  useEffect(() => {
    const initializeData = async () => {
      if (user) {
        await fetchSupplierData(user.companyid)
        // 선택된 공급사가 있으면 상품 데이터 로드
        if (selectedSupplier?.id) {
          await fetchProductData(selectedSupplier.id, user.companyid)
        }
      }
    }
    
    initializeData()
  }, [user])

  const fetchSupplierData = async (companyid: string) => {
    try {
      const { data, error } = await supabase.from('company_supply')
        .select('*')
        .eq('companyid', companyid)

      if (error) throw error
      setSupplierData(data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSupplierSearch = () => {
    console.log("Searching for:", supplierSearchTerm)
  }

  const products = [
    { id: '1', sku: 'st11111', name: '청상추, 로즈마드 RC 팜채 녹황색 청상추, 야채 자루형 청상추, 신선한 수삼 6년', category: '식품', weight: '1 kg', packageWeight: '1.38 kg', length: '25 cm', width: '15 cm', height: '22 cm' },
    { id: '2', sku: '707202249', name: '전자레인지 UA 프로젝스 제습히트 & 숨쉬트롤 - 온동물 먹이서비스', category: '가전', weight: '미등록', packageWeight: '제산 불가', length: '미등록', width: '미등록', height: '미등록' },
    { id: '3', sku: '123456789', name: '고급 면 티셔츠', category: '의류', weight: '0.2 kg', packageWeight: '0.3 kg', length: '30 cm', width: '20 cm', height: '5 cm' },
    { id: '4', sku: '987654321', name: '스마트폰 케이스', category: '전자기기', weight: '0.05 kg', packageWeight: '0.1 kg', length: '15 cm', width: '8 cm', height: '1 cm' },
    { id: '5', sku: '456789123', name: '유기농 사과 주스', category: '식품', weight: '1.2 kg', packageWeight: '1.5 kg', length: '20 cm', width: '10 cm', height: '10 cm' },
  ]

  const categories = Array.from(new Set(products.map(product => product.category)))

  const handleSupplierSelect = async (supplier: any) => {
    if (user && supplier && supplier.id) {
      const supplierInfo = {
        id: supplier.id,
        supplyname: supplier.supplyname,
        managername: supplier.managername,
        created: supplier.created,
        companyid: supplier.companyid
      }
      
      // 로딩 상태 표시를 위해 빈 배열로 초기화
      setSupplierProducts([])
      
      // 데이터 로드
      await fetchProductData(supplier.id, user.companyid)
      
      // 데이터 로드 후 supplier 정보 설정
      setSelectedSupplier(supplierInfo)
    }
  }

  const handleProductSelect = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    )
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  }

  const filteredProducts = React.useMemo(() => {
    return supplierProducts.filter(product => 
      (selectedCategory === "" || selectedCategory === "all" || product.category === selectedCategory) &&
      (searchQuery === "" || product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [supplierProducts, selectedCategory, searchQuery])

  const fetchProductData = async (itemCustomerId: string, companyid: string) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          id,
          variationsku,
          name,
          thumbnailurl,
          weight,
          width,
          length,
          height,
          stocks (
            nowstock
          )
        `)
        .eq('companyid', companyid)
        .eq('supplyid', itemCustomerId.toString())
        .order('createdat', { ascending: false })

      if (error) throw error
      
      setSupplierProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setSupplierProducts([])
    }
  }

  const calculateVolumeWeight = (length: number, width: number, height: number) => {
    return (length * width * height) / 6000
  }

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId)
    setIsDetailDialogOpen(true)
  }

  const handleCellEdit = async (id: string, field: string, value: string) => {
    try {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return;

      // 먼저 UI 업데이트
      const updatedProducts = supplierProducts.map(product => {
        if (product.id === id) {
          return {
            ...product,
            [field]: numValue
          };
        }
        return product;
      });
      setSupplierProducts(updatedProducts);

      // DB 업데이트
      const { error } = await supabase
        .from('items')
        .update({ [field]: numValue })
        .eq('id', id);

      if (error) {
        console.error('Error updating database:', error);
        // DB 업데이트 실패 시 UI 롤백
        setSupplierProducts(supplierProducts);
        return;
      }

      setEditingCell(null);
    } catch (error) {
      console.error('Error updating cell:', error);
    }
  };

  const columns = [
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
      accessorKey: "variationsku", 
      header: "SKU",
      cell: ({ row }) => {
        const sku = row.original.variationsku || '미등록'
        
        const handleCopy = (e: React.MouseEvent) => {
          e.stopPropagation() // 상 다이얼로그가 열리는 것을 방지
          if (sku === '미등록') return
          
          navigator.clipboard.writeText(sku)
            .then(() => {
              // 복사 성공 시 시각적 피드백
              const target = e.currentTarget
              target.classList.add('text-green-500')
              setTimeout(() => {
                target.classList.remove('text-green-500')
              }, 500)
            })
            .catch(err => console.error('Failed to copy:', err))
        }

        return (
          <div className="flex items-center space-x-2">
            <div 
              className="cursor-pointer hover:text-blue-500"
              onClick={() => handleProductClick(row.original.id)}
            >
              {sku}
            </div>
            {sku !== '미등록' && (
              <Copy 
                className="h-4 w-4 cursor-pointer hover:text-blue-500 transition-colors"
                onClick={handleCopy}
              />
            )}
          </div>
        )
      }
    },
    { 
      accessorKey: "name", 
      header: "상품명",
      cell: ({ row }) => (
        <div 
          className="max-w-[200px] cursor-pointer hover:text-blue-500"
          onClick={() => handleProductClick(row.original.id)}
        >
          <div className="truncate">
            {row.original.name}
          </div>
        </div>
      )
    },
    {
      accessorKey: "thumbnailurl",
      header: "이미지",
      cell: ({ row }) => (
        <div 
          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded cursor-pointer"
          onClick={() => handleProductClick(row.original.id)}
        >
          {row.original.thumbnailurl ? (
            <img 
              src={row.original.thumbnailurl} 
              alt={row.original.name}
              className="w-10 h-10 object-cover rounded hover:opacity-80 transition-opacity"
              onError={(e) => {
                e.currentTarget.src = "/images/no-image.png"
                e.currentTarget.onerror = null
              }}
            />
          ) : (
            <div className="text-xs text-gray-400">No Image</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "weight",
      header: "무게",
      cell: ({ row }) => {
        const id = row.original.id;
        const value = row.original.weight?.toString() || '';
        const isEditing = editingCell?.id === id && editingCell?.field === 'weight';
        
        if (isEditing) {
          return (
            <Input
              type="number"
              step="0.01"
              value={editingCell.value}
              onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
              onBlur={() => handleCellEdit(id, 'weight', editingCell.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCellEdit(id, 'weight', editingCell.value);
                } else if (e.key === 'Escape') {
                  setEditingCell(null);
                }
              }}
              className="w-20"
              autoFocus
            />
          );
        }

        return (
          <div
            className="cursor-pointer hover:bg-gray-100 p-1 rounded"
            onClick={() => setEditingCell({ id, field: 'weight', value: value })}
          >
            {value ? `${parseFloat(value).toFixed(2)} kg` : '미등록'}
          </div>
        );
      }
    },
    {
      accessorKey: "length",
      header: "가",
      cell: ({ row }) => {
        const id = row.original.id;
        const value = row.original.length || '';
        const isEditing = editingCell?.id === id && editingCell?.field === 'length';
        
        if (isEditing) {
          return (
            <Input
              type="number"
              step="0.1"
              value={editingCell.value}
              onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
              onBlur={() => handleCellEdit(id, 'length', editingCell.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCellEdit(id, 'length', editingCell.value);
                } else if (e.key === 'Escape') {
                  setEditingCell(null);
                }
              }}
              className="w-20"
              autoFocus
            />
          );
        }

        return (
          <div
            className="cursor-pointer hover:bg-gray-100 p-1 rounded"
            onClick={() => setEditingCell({ id, field: 'length', value })}
          >
            {value || '미등록'} {value && 'cm'}
          </div>
        );
      }
    },
    {
      accessorKey: "width",
      header: "세로",
      cell: ({ row }) => {
        const id = row.original.id;
        const value = row.original.width || '';
        const isEditing = editingCell?.id === id && editingCell?.field === 'width';
        
        if (isEditing) {
          return (
            <Input
              type="number"
              step="0.1"
              value={editingCell.value}
              onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
              onBlur={() => handleCellEdit(id, 'width', editingCell.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCellEdit(id, 'width', editingCell.value);
                } else if (e.key === 'Escape') {
                  setEditingCell(null);
                }
              }}
              className="w-20"
              autoFocus
            />
          );
        }

        return (
          <div
            className="cursor-pointer hover:bg-gray-100 p-1 rounded"
            onClick={() => setEditingCell({ id, field: 'width', value })}
          >
            {value || '미등록'} {value && 'cm'}
          </div>
        );
      }
    },
    {
      accessorKey: "height",
      header: "높이",
      cell: ({ row }) => {
        const id = row.original.id;
        const value = row.original.height || '';
        const isEditing = editingCell?.id === id && editingCell?.field === 'height';
        
        if (isEditing) {
          return (
            <Input
              type="number"
              step="0.1"
              value={editingCell.value}
              onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
              onBlur={() => handleCellEdit(id, 'height', editingCell.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCellEdit(id, 'height', editingCell.value);
                } else if (e.key === 'Escape') {
                  setEditingCell(null);
                }
              }}
              className="w-20"
              autoFocus
            />
          );
        }

        return (
          <div
            className="cursor-pointer hover:bg-gray-100 p-1 rounded"
            onClick={() => setEditingCell({ id, field: 'height', value })}
          >
            {value || '미등록'} {value && 'cm'}
          </div>
        );
      }
    },
    {
      id: "volumeWeight",
      header: "부피 무게",
      cell: ({ row }) => {
        const { length, width, height } = row.original
        if (!length || !width || !height) return '미등록'
        const volumeWeight = calculateVolumeWeight(
          parseFloat(length),
          parseFloat(width),
          parseFloat(height)
        )
        const weight = parseFloat(row.original.weight) || 0;
        const isOverweight = volumeWeight > weight;
        return (
          <span className={isOverweight ? 'text-red-500' : ''}>
            {volumeWeight.toFixed(2)} kg
          </span>
        );
      }
    }
  ]

  const table = useReactTable({
    data: filteredProducts,
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
    },
  })

  useEffect(() => {
    const selectedRows = table.getSelectedRowModel().rows
    const selectedIds = selectedRows.map(row => row.original.id)
    setSelectedProducts(selectedIds)
  }, [table.getSelectedRowModel().rows])

  const handleWeightApply = () => {
    if (!weight || selectedProducts.length === 0) return
    
    const newTempWeights = { ...tempWeights }
    selectedProducts.forEach(id => {
      newTempWeights[id] = parseFloat(weight)
    })
    setTempWeights(newTempWeights)
    
    // 그리드 데이터 업데이트
    const updatedProducts = supplierProducts.map(product => {
      if (selectedProducts.includes(product.id)) {
        return {
          ...product,
          weight: weight
        }
      }
      return product
    })
    setSupplierProducts(updatedProducts)
  }

  const handleWeightSave = async () => {
    if (Object.keys(tempWeights).length === 0) return
    
    try {
      const { error } = await supabase
        .from('items')
        .update({ weight: weight })
        .in('id', Object.keys(tempWeights))

      if (error) throw error
      
      // 저장 성공 시 임시 데이터 초기화
      setTempWeights({})
      
      // 상품 목록 새로고침
      if (user && selectedSupplier) {
        fetchProductData(selectedSupplier, user.companyid)
      }
    } catch (error) {
      console.error('Error saving weights:', error)
    }
  }

  const handleSizeApply = () => {
    if (!length || !width || !height || selectedProducts.length === 0) return
    
    const newTempSizes = { ...tempSizes }
    selectedProducts.forEach(id => {
        newTempSizes[id] = {
            length: parseFloat(length),
            width: parseFloat(width),
            height: parseFloat(height)
        }
    })
    setTempSizes(newTempSizes)
    
    // 그리드 데이터 업데이트 - 크기만 업데이트
    const updatedProducts = supplierProducts.map(product => {
        if (selectedProducts.includes(product.id)) {
            return {
                ...product,
                length,
                width,
                height
                // weight는 업데이트하지 않음 (기존 값 유지)
            }
        }
        return product
    })
    setSupplierProducts(updatedProducts)
  }

  const handleSizeSave = async () => {
    if (Object.keys(tempSizes).length === 0) return
    
    try {
        // 각 상품별로 크기만 업데이트
        const updates = Object.entries(tempSizes).map(([id, sizes]) => {
            return supabase
                .from('items')
                .update({
                    length: sizes.length,
                    width: sizes.width,
                    height: sizes.height
                    // weight는 업데이트하지 않음
                })
                .eq('id', id)
        })

        await Promise.all(updates)
        
        // 저장 성공 시 임시 데이터 초기화
        setTempSizes({})
        
        // 상품 목록 새로고침 - selectedSupplier.id를 전달
        if (user && selectedSupplier?.id) {
            await fetchProductData(selectedSupplier.id, user.companyid)
        }
    } catch (error) {
        console.error('Error saving sizes:', error)
    }
  }

  return (
    <>
      <div className="container mx-auto py-6 space-y-6">
        {/* Supplier Selection Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>공급사</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSupplierTableExpanded(!isSupplierTableExpanded)}
            >
              {isSupplierTableExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            {isSupplierTableExpanded && (
              <>
                <div className="flex items-center space-x-2 mb-4">
                  <Input
                    placeholder="공급사명을 검색하세요"
                    className="max-w-sm"
                    value={supplierSearchTerm}
                    onChange={(e) => setSupplierSearchTerm(e.target.value)}
                  />
                  <Button size="sm" onClick={handleSupplierSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    검색
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>회사명</TableHead>
                      <TableHead>담당자</TableHead>
                      <TableHead>등록일</TableHead>
                      <TableHead>선택</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplierData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          표시할 공급사가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      supplierData.map((supplier) => (
                        <TableRow key={supplier.id}>
                          <TableCell>{supplier.supplyname}</TableCell>
                          <TableCell>{supplier.managername}</TableCell>
                          <TableCell>{supplier.created}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => handleSupplierSelect(supplier)}
                              variant={selectedSupplier?.id === supplier.id ? "default" : "outline"}
                            >
                              선택
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>

        {/* Weight and Size Edit Card */}
        <Card>
          <CardHeader>
            <CardTitle>무게 / 크기 {selectedProducts.length > 0 && `(${selectedProducts.length}개 선택)`}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-6">
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-medium">무게</h3>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="무게"
                    className="w-24"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    disabled={selectedProducts.length === 0}
                  />
                  <span>kg</span>
                  <Button 
                    onClick={handleWeightApply}
                    disabled={selectedProducts.length === 0 || !weight}
                  >
                    무게 적용
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleWeightSave}
                    disabled={Object.keys(tempWeights).length === 0}
                  >
                    무게 저장
                  </Button>
                </div>
                {selectedProducts.length === 0 && (
                  <p className="text-sm text-muted-foreground">상품을 선택해주세요.</p>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-medium">크기</h3>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="가로"
                    className="w-20"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    disabled={selectedProducts.length === 0}
                  />
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="세로"
                    className="w-20"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    disabled={selectedProducts.length === 0}
                  />
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="높이"
                    className="w-20"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    disabled={selectedProducts.length === 0}
                  />
                  <span>cm</span>
                  <Button 
                    onClick={handleSizeApply}
                    disabled={selectedProducts.length === 0 || !length || !width || !height}
                  >
                    크기 적용
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleSizeSave}
                    disabled={Object.keys(tempSizes).length === 0}
                  >
                    크기 저장
                  </Button>
                </div>
                {selectedProducts.length === 0 && (
                  <p className="text-sm text-muted-foreground">상품을 선택해주세요.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product List Card */}
        <Card>
          <CardHeader>
            <CardTitle>상품 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="상품명으로 검색"
                className="max-w-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button size="sm">
                <Search className="h-4 w-4 mr-2" />
                검색
              </Button>
            </div>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      {supplierProducts.length === 0 ? "공급사를 선택해주세요." : "표시할 상품이 없습니다."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  이전
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  다음
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
    </>
  )
}

