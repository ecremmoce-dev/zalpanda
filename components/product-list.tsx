'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  status: string
  created: string
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 임시 데이터로 테스트
    const mockData = [
      {
        id: '1',
        name: '테스트 상품 1',
        price: 10000,
        stock: 100,
        status: '판매중',
        created: '2024-03-20'
      },
      {
        id: '2',
        name: '테스트 상품 2',
        price: 20000,
        stock: 50,
        status: '판매중',
        created: '2024-03-20'
      }
    ]
    setProducts(mockData)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">상품 목록</h2>
        <Button>새 상품 등록</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>상품코드</TableHead>
            <TableHead>상품명</TableHead>
            <TableHead className="text-right">판매가</TableHead>
            <TableHead className="text-right">재고</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>등록일</TableHead>
            <TableHead className="text-right">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className="text-right">{product.price.toLocaleString()}원</TableCell>
              <TableCell className="text-right">{product.stock}</TableCell>
              <TableCell>{product.status}</TableCell>
              <TableCell>{product.created}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">수정</Button>
                <Button variant="ghost" size="sm">삭제</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 