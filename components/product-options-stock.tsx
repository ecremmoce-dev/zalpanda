'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
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

interface Product {
  id: string
  variationsku: string
  name: string
  thumbnailurl: string
  stock?: {
    nowstock: number
  }[]
  consumerprice?: number
  purchaseprice?: number
}

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
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})

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
    console.log("Searching for:", supplierSearchTerm)
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
            nowstock
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
        <div className="max-w-[200px]">
          <div className="truncate">
            {row.original.name}
          </div>
        </div>
      )
    },
    { 
      accessorKey: "variationsku", 
      header: "SKU"
    },
    {
      accessorKey: "thumbnailurl",
      header: "이미지",
      cell: ({ row }) => (
        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded">
          {row.original.thumbnailurl ? (
            <img 
              src={row.original.thumbnailurl} 
              alt={row.original.name}
              className="w-10 h-10 object-cover rounded"
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
      accessorKey: "options",
      header: "옵션값",
    },
    {
      accessorKey: "stock",
      header: "재고",
      cell: ({ row }) => row.original.stocks?.[0]?.nowstock || 0
    },
    {
      accessorKey: "consumerprice",
      header: "공급가(₩)",
      cell: ({ row }) => row.original.consumerprice?.toLocaleString() || 0
    },
    {
      accessorKey: "purchaseprice",
      header: "판매가(₩)",
      cell: ({ row }) => row.original.purchaseprice?.toLocaleString() || 0
    }
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

  return (
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
                  className="w-24"
                />
                <span>EA</span>
                <Input 
                  type="text" 
                  placeholder="추가" 
                  className="w-24"
                />
                <Button variant="outline">차감</Button>
              </div>
            </div>

            {/* 가격 섹션 */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">가격</h2>
              <div className="flex items-center space-x-4">
                <Input 
                  type="text" 
                  placeholder="공급가" 
                  className="w-32"
                />
                <span>원</span>
                <Input 
                  type="text" 
                  placeholder="판매가" 
                  className="w-32"
                />
                <span>원</span>
              </div>
            </div>
          </div>

          {/* 가격 조정 섹션 */}
          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold">가격 조정</h2>
            <div className="flex items-center space-x-6">
              <RadioGroup defaultValue="ALL" className="flex items-center space-x-4">
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
                  type="text" 
                  placeholder="가격" 
                  className="w-24"
                />
                <span>%</span>
                <Button variant="secondary">인상</Button>
                <Button variant="secondary">인하</Button>
                <Button variant="default">저장</Button>
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
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="category1">카테고리1</SelectItem>
                <SelectItem value="category2">카테고리2</SelectItem>
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
  )
} 