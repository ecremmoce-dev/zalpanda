'use client'

import * as React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import SupplierSelector from "@/components/supplier-selector";

interface Qoo10Product {
  id: string;
  name: string;
  price: number;
  category: string;
  // 필요한 다른 필드 추가
}

const QOO10listing: React.FC = () => {
  const [products, setProducts] = useState<Qoo10Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);

  const fetchProducts = async (supplyid: string | number, companyid: string) => {
    try {
      const { data, error } = await supabase
        .from('qoo10_products') // 실제 테이블 이름으로 변경
        .select('*')
        .eq('supplyid', supplyid.toString())
        .eq('companyid', companyid);

      if (error) {
        throw error;
      }

      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSupplierSelect = (supplier: any) => {
    setSelectedSupplier(supplier);
    fetchProducts(supplier.id, supplier.companyid);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">QOO10 상품 리스팅</h1>
      <SupplierSelector
        onSupplierSelect={handleSupplierSelect}
        isSupplierTableExpanded={true}
        setIsSupplierTableExpanded={() => {}}
      />
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>상품 ID</TableHead>
              <TableHead>상품명</TableHead>
              <TableHead>가격</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <Button variant="outline">상세보기</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default QOO10listing; 