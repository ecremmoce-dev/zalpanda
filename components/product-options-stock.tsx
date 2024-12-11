'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { supabase } from "@/utils/supabase/client"
import { useUserDataStore } from "@/store/modules"
import { useSupplierStore } from "@/store/modules/supplierStore"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ProductDetail from "@/components/product-public-detail"
import { v4 as uuidv4 } from 'uuid'; // uuid 패키지에서 v4 함수 가져오기

interface Product {
  id: string
  variationsku: string
  name: string
  thumbnailurl: string
  stocks: {
    nowstock: number
    safetystock: number
  }
  consumerprice?: number
  purchaseprice?: number
}

type SortingState = {
  id: string;
  desc: boolean;
}[];

type ColumnFiltersState = {
  id: string;
  value: string;
}[];

export function ProductOptionsStock() {
  const [supplierData, setSupplierData] = useState<any[]>([])
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("")
  const { selectedSupplier, setSelectedSupplier } = useSupplierStore()
  const [priceType, setPriceType] = useState("ALL")
  const { user } = useUserDataStore()
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [supplierProducts, setSupplierProducts] = useState<any[]>([])
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([])
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [newStockValue, setNewStockValue] = useState<number | null>(null);
  const [supplyPrice, setSupplyPrice] = useState<number | null>(null);
  const [salePrice, setSalePrice] = useState<number | null>(null);
  const [priceUnit, setPriceUnit] = useState<string>("%"); // 기본값을 %로 설정
  const [priceAdjustmentType, setPriceAdjustmentType] = useState("ALL");
  const [adjustmentValue, setAdjustmentValue] = useState<number | null>(null);

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
  }, [user, selectedSupplier]) // selectedSupplier 의존성 추가

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
    if (!supplierSearchTerm.trim()) {
      fetchSupplierData(user.companyid)
      return
    }
    
    const filteredSuppliers = supplierData.filter(supplier => 
      supplier.supplyname.toLowerCase().includes(supplierSearchTerm.toLowerCase()) ||
      supplier.managername.toLowerCase().includes(supplierSearchTerm.toLowerCase())
    )
    setSupplierData(filteredSuppliers)
  }

  const handleSupplierSelect = async (supplier: any) => {
    if (user && supplier && supplier.id) {
      const { supplyname, id, companyid } = supplier
      setSelectedSupplier({
        id,
        supplyname,
        managername: supplier.managername,
        created: supplier.created,
        companyid
      })
      await fetchProductData(id, user.companyid)
    }
  }

  const fetchProductData = async (supplyid: string | number, companyid: string) => {
    if (!supplyid || !companyid) {
      console.error('Required parameters missing:', { supplyid, companyid })
      return
    }

    try {
      console.log('Fetching products with params:', { supplyid, companyid });
      
      const { data, error } = await supabase
        .from('items')
        .select(`
          id,
          variationsku,
          name,
          thumbnailurl,
          consumerprice,
          purchaseprice,
          stocks (
            nowstock,
            safetystock
          ),
          item_options!left (
            groupvalue
          )
        `)
        .eq('companyid', companyid)
        .eq('supplyid', supplyid.toString())
        .order('createdat', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Fetched products:', data)
      setSupplierProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  }

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId)
    setIsDetailDialogOpen(true)
  }

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
      accessorKey: "index", 
      header: "#",
      cell: ({ row }) => row.index + 1
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
      accessorKey: "variationsku", 
      header: "SKU",
      cell: ({ row }) => (
        <div 
          className="cursor-pointer hover:text-blue-500"
          onClick={() => handleProductClick(row.original.id)}
        >
          {row.original.variationsku || '미등록'}
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
      accessorKey: "item_options",
      header: "옵션값",
      cell: ({ row }) => {
        const options = row.original.item_options
        if (!options || options.length === 0) return '-'
        
        const optionValues = options.map(opt => opt.groupvalue).join(', ')
        
        return (
          <div className="relative group">
            <div className="max-w-[200px]">
              <div className="truncate">
                {optionValues}
              </div>
            </div>
            {/* 툴팁 */}
            {optionValues.length > 0 && (
              <div className="absolute z-50 invisible group-hover:visible bg-black/80 text-white p-2 rounded-md text-sm whitespace-normal min-w-[200px] max-w-[400px] bottom-full left-0 mb-2 break-words">
                {optionValues}
                <div className="absolute w-2 h-2 bg-black/80 transform rotate-45 left-4 -bottom-1"></div>
              </div>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: "stocks",
      header: "재고",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="text-sm">
            현재: {row.original.stocks?.nowstock?.toLocaleString() || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            안전: {row.original.stocks?.safetystock?.toLocaleString() || 0}
          </div>
        </div>
      )
    },
    {
      accessorKey: "consumerprice",
      header: "공급가(₩)",
      cell: ({ row }) => {
        const isEditing = selectedProducts.includes(row.original.id);
        const [price, setPrice] = useState(row.original.consumerprice || 0);

        const handleSave = async () => {
          // Update the product price in the state
          const updatedProducts = supplierProducts.map(product => {
            if (product.id === row.original.id) {
              return { ...product, consumerprice: price };
            }
            return product;
          });
          setSupplierProducts(updatedProducts);

          // Save to database
          try {
            const { error } = await supabase
              .from('items')
              .update({ consumerprice: price })
              .eq('id', row.original.id);
            if (error) throw error;
          } catch (error) {
            console.error('Error saving consumerprice:', error);
          }

          setSelectedProducts([]); // Reset selection
        };

        return isEditing ? (
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            onBlur={handleSave} // Save on blur
            className="w-24"
          />
        ) : (
          <div>
            {price.toLocaleString() || 0}
          </div>
        );
      },
    },
    {
      accessorKey: "purchaseprice",
      header: "판매가(₩)",
      cell: ({ row }) => {
        const isEditing = selectedProducts.includes(row.original.id);
        const [price, setPrice] = useState(row.original.purchaseprice || 0);

        const handleSave = async () => {
          // Update the product price in the state
          const updatedProducts = supplierProducts.map(product => {
            if (product.id === row.original.id) {
              return { ...product, purchaseprice: price };
            }
            return product;
          });
          setSupplierProducts(updatedProducts);

          // Save to database
          try {
            const { error } = await supabase
              .from('items')
              .update({ purchaseprice: price })
              .eq('id', row.original.id);
            if (error) throw error;
          } catch (error) {
            console.error('Error saving purchaseprice:', error);
          }

          setSelectedProducts([]); // Reset selection
        };

        return isEditing ? (
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            onBlur={handleSave} // Save on blur
            className="w-24"
          />
        ) : (
          <div>
            {price.toLocaleString() || 0}
          </div>
        );
      },
    },
    {
      accessorKey: "edit",
      header: "수정",
      cell: ({ row }) => (
        <Button
          variant="outline"
          onClick={() => setSelectedProducts([row.original.id])} // Enable editing
        >
          수정
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data: supplierProducts,
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

  useEffect(() => {
    if (searchQuery && supplierProducts.length > 0) {
      const searchTermLower = searchQuery.toLowerCase()
      
      // 검색어로 상품 필터링
      const filteredProducts = supplierProducts.filter(product => 
        product.name?.toLowerCase().includes(searchTermLower) ||
        product.variationsku?.toLowerCase().includes(searchTermLower)
      )
      
      // 필터링된 결과를 테이블에 반영
      setSupplierProducts(filteredProducts)
    } else if (!searchQuery) {
      // 검색어가 없을 때는 원래 데이터로 복원
      if (selectedSupplier?.id && user?.companyid) {
        fetchProductData(selectedSupplier.id, user.companyid)
      }
    }
  }, [searchQuery])

  const applyStockChange = () => {
    if (newStockValue !== null) {
      const updatedProducts = supplierProducts.map(product => {
        if (selectedProducts.includes(product.id)) {
          return {
            ...product,
            stocks: {
              ...product.stocks,
              nowstock: newStockValue
            }
          };
        }
        return product;
      });
      setSupplierProducts(updatedProducts);
    }
  };

  const saveStockToDatabase = async () => {
    if (selectedProducts.length === 0) {
        alert('상품을 선택해주세요.');
        return;
    }

    try {
        // 가격 업데이트
        if (supplyPrice !== null || salePrice !== null) {
            const { error: priceError } = await supabase
                .from('items')
                .upsert(
                    selectedProducts.map(productId => ({
                        id: productId,
                        consumerprice: supplyPrice !== null ? supplyPrice : undefined,
                        purchaseprice: salePrice !== null ? salePrice : undefined,
                    })),
                    { onConflict: 'id' }
                );

            if (priceError) throw priceError;
        }

        // 재고 업데이트
        if (newStockValue !== null) {
            const { error: stockError } = await supabase
                .from('stocks')
                .upsert(
                    selectedProducts.map(productId => ({
                        id: uuidv4(),
                        variationsku: supplierProducts.find(product => product.id === productId)?.variationsku || '',
                        nowstock: newStockValue,
                        itemid: productId,
                        companyid: user?.companyid,
                        createdat: new Date().toISOString(),
                        updatedat: new Date().toISOString(),
                    })),
                    { onConflict: 'itemid' }
                );

            if (stockError) throw stockError;
        }

        // 성공적으로 저장되면 상품 데이터 다시 불러오기
        if (selectedSupplier?.id && user?.companyid) {
            await fetchProductData(selectedSupplier.id, user.companyid);
        }

        alert('데이터가 성공적으로 저장되었습니다.');
    } catch (error) {
        console.error('Error updating data:', error);
        alert('데이터 저장 중 오류가 발생했습니다.');
    }
  };

  const applyPriceChange = () => {
    if (supplyPrice !== null || salePrice !== null) {
        const updatedProducts = supplierProducts.map(product => {
            if (selectedProducts.includes(product.id)) {
                return {
                    ...product,
                    consumerprice: supplyPrice !== null ? supplyPrice : product.consumerprice,
                    purchaseprice: salePrice !== null ? salePrice : product.purchaseprice,
                };
            }
            return product;
        });
        setSupplierProducts(updatedProducts);
    }
  };

  const applyPriceAdjustment = (isIncrease: boolean) => {
    if (adjustmentValue === null || selectedProducts.length === 0) {
        alert('가격 조정값을 입력하고 상품을 선택해주세요.');
        return;
    }

    const updatedProducts = supplierProducts.map(product => {
        if (selectedProducts.includes(product.id)) {
            let updatedProduct = { ...product };
            
            // 가격 조정 로직
            const adjustPrice = (price: number) => {
                if (priceUnit === '%') {
                    return isIncrease
                        ? price * (1 + adjustmentValue / 100)
                        : price * (1 - adjustmentValue / 100);
                } else {
                    return isIncrease
                        ? price + adjustmentValue
                        : price - adjustmentValue;
                }
            };

            // 선택된 가격 유형에 따라 조정
            if (priceAdjustmentType === 'ALL' || priceAdjustmentType === 'supply') {
                updatedProduct.consumerprice = Math.round(adjustPrice(product.consumerprice || 0));
            }
            if (priceAdjustmentType === 'ALL' || priceAdjustmentType === 'sell') {
                updatedProduct.purchaseprice = Math.round(adjustPrice(product.purchaseprice || 0));
            }

            return updatedProduct;
        }
        return product;
    });

    setSupplierProducts(updatedProducts);
  };

  const savePriceAdjustment = async () => {
    if (selectedProducts.length === 0) {
        alert('상품을 선택해주세요.');
        return;
    }

    try {
        // 선택된 상품들의 현재 가격 정보 가져오기
        const updatedPrices = supplierProducts
            .filter(product => selectedProducts.includes(product.id))
            .map(product => ({
                id: product.id,
                consumerprice: product.consumerprice,
                purchaseprice: product.purchaseprice,
            }));

        // items 테이블 업데이트
        const { error } = await supabase
            .from('items')
            .upsert(updatedPrices, { onConflict: 'id' });

        if (error) throw error;

        // 성공적으로 저장되면 상품 데이터 다시 불러오기
        if (selectedSupplier?.id && user?.companyid) {
            await fetchProductData(selectedSupplier.id, user.companyid);
        }

        alert('가격이 성공적으로 저장되었습니다.');
    } catch (error) {
        console.error('Error saving price adjustments:', error);
        alert('가격 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 space-y-6">
        {/* 공급사 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>공급사</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                placeholder="공급사명을 검색하세요"
                className="max-w-sm"
                value={supplierSearchTerm}
                onChange={(e) => setSupplierSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSupplierSearch()
                  }
                }}
              />
              <Button size="sm" onClick={handleSupplierSearch}>
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
          </CardContent>
        </Card>

        {/* 재고/가격 카드 */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-6">
              {/* 재고 섹션 */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">재고</h2>
                <div className="flex items-center space-x-4">
                  <Input 
                    type="text" 
                    placeholder="재고" 
                    className="w-24 border border-gray-300 rounded-md p-2"
                    value={newStockValue !== null ? newStockValue.toString() : ''}
                    onChange={(e) => setNewStockValue(Number(e.target.value))}
                  />
                  <span>EA</span>
                  <Button 
                    variant="primary" 
                    className="ml-4 bg-blue-500 text-white"
                    onClick={applyStockChange}
                    disabled={selectedProducts.length === 0}
                  >
                    적용
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="ml-2 bg-gray-500 text-white"
                    onClick={saveStockToDatabase}
                    disabled={selectedProducts.length === 0 || (!supplyPrice && !salePrice)}
                  >
                    저장
                  </Button>
                </div>
              </div>

              {/* 가격 섹션 */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">가격</h2>
                <div className="flex items-center space-x-4">
                  <Input 
                    type="text" 
                    placeholder="공급가" 
                    className="w-32 border border-gray-300 rounded-md p-2"
                    value={supplyPrice !== null ? supplyPrice.toString() : ''}
                    onChange={(e) => setSupplyPrice(Number(e.target.value))}
                  />
                  <span>원</span>
                  <Input 
                    type="text" 
                    placeholder="판매가" 
                    className="w-32 border border-gray-300 rounded-md p-2"
                    value={salePrice !== null ? salePrice.toString() : ''}
                    onChange={(e) => setSalePrice(Number(e.target.value))}
                  />
                  <span>원</span>
                  <Button 
                    variant="primary" 
                    className="ml-4 bg-blue-500 text-white"
                    onClick={applyPriceChange}
                    disabled={selectedProducts.length === 0}
                  >
                    적용
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="ml-2 bg-gray-500 text-white"
                    onClick={saveStockToDatabase}
                    disabled={selectedProducts.length === 0 || (!supplyPrice && !salePrice)}
                  >
                    저장
                  </Button>
                </div>
              </div>
            </div>

            {/* 가격 조정 섹션 */}
            <div className="mt-6 space-y-4">
              <h2 className="text-lg font-semibold">가격 조정</h2>
              <div className="flex items-center space-x-6">
                <RadioGroup 
                  value={priceAdjustmentType} 
                  onValueChange={setPriceAdjustmentType} 
                  className="flex items-center space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ALL" id="ALL" />
                    <Label htmlFor="ALL">ALL</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="supply" id="supply" />
                    <Label htmlFor="supply">공급가</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sell" id="sell" />
                    <Label htmlFor="sell">판매가</Label>
                  </div>
                </RadioGroup>

                <div className="flex items-center space-x-2">
                  <Input 
                    type="number" 
                    placeholder="가격" 
                    className="w-24"
                    value={adjustmentValue !== null ? adjustmentValue : ''}
                    onChange={(e) => setAdjustmentValue(Number(e.target.value))}
                  />
                  <Select 
                    value={priceUnit} 
                    onValueChange={setPriceUnit}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue>{priceUnit}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="%">%</SelectItem>
                      <SelectItem value="원">원</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="secondary" 
                    className="bg-blue-500 text-white"
                    onClick={() => applyPriceAdjustment(true)}
                    disabled={selectedProducts.length === 0 || adjustmentValue === null}
                  >
                    인상
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="bg-red-500 text-white"
                    onClick={() => applyPriceAdjustment(false)}
                    disabled={selectedProducts.length === 0 || adjustmentValue === null}
                  >
                    인하
                  </Button>
                  <Button 
                    variant="default" 
                    className="bg-green-500 text-white"
                    onClick={savePriceAdjustment}
                    disabled={selectedProducts.length === 0}
                  >
                    저장
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 상품 목록 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>상품 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="카테리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="category1">카테고리1</SelectItem>
                  <SelectItem value="category2">카테고리2</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="상품명 또는 SKU로 검색"
                className="max-w-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                  }
                }}
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

      {/* Dialog 추가 */}
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