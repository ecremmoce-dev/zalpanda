'use client'

import * as React from "react"
import { Search, ChevronRight } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react";
import { Category } from '@/types/category';
import { supabase } from "@/utils/supabase/client"
import { Qoo10Category, Qoo10Response } from '@/types/qoo10'

interface CategoryMap {
  id: string;
  inboundcategoryid: string;
  inboundplatform: string;
  outboundcategoryid: string;
  outboundplatform: string;
  outboundcountry: string;
  createdat: string;
  updatedat: string | null;
  companyid: string | null;
}

interface CategoryMapList {
  id: string;
  inboundcategoryid: string;
  inbound_pathname: string;
  inboundplatform: string;
  outboundcategoryid: string;
  outboundplatform: string;
  outboundcountry: string;
}

export default function CategoryMapping() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [qoo10Categories, setQoo10Categories] = useState<Qoo10Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedInboundCategories, setSelectedInboundCategories] = useState<Category[]>([]);
  const [selectedOutboundCategories, setSelectedOutboundCategories] = useState<Qoo10Category[]>([]);
  const [mappedCategories, setMappedCategories] = useState<CategoryMapList[]>([]);
  const [selectedInboundPlatform, setSelectedInboundPlatform] = useState<string>('SMART_STORE');
  const [selectedOutboundPlatform, setSelectedOutboundPlatform] = useState<string>('QOO10');
  const [selectedCountry, setSelectedCountry] = useState<string>('JP');

  const fetchTest = async (platform?: string) => {
    try {
      const query = supabase
        .from('items')
        .select(`
          id,
          variationsku,
          item_category_maps!inner (
            categories!inner (
              id,
              categoryid,
              name,
              platform,
              pathname
            )
          )
        `)
        .order('id', { ascending: false });

      if (platform) {
        query.eq('item_category_maps.categories.platform', platform);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }

      const transformedData = data?.filter(item => 
        item.item_category_maps && 
        item.item_category_maps.length > 0 && 
        item.item_category_maps[0].categories
      ).map(item => ({
        categoryid: item.item_category_maps[0].categories.categoryid,
        category_name: item.item_category_maps[0].categories.name,
        category_path: item.item_category_maps[0].categories.pathname
      }));

      const uniqueCategories = Array.from(new Map(
        transformedData?.map(item => [item.categoryid, item])
      ).values());

      console.log('Fetched categories:', uniqueCategories);
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error in fetchTest:", error);
    }
  };

  const fetchPlatforms = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('platform')
        .not('platform', 'is', null)
        .order('platform');

      if (error) {
        console.error("Error fetching platforms:", error);
        return;
      }

      const uniquePlatforms = [...new Set(data.map(item => item.platform))];
      console.log('Fetched platforms:', uniquePlatforms);
      setPlatforms(uniquePlatforms);
    } catch (error) {
      console.error("Error in fetchPlatforms:", error);
    }
  };

  const getQoo10ApiKey = async () => {
    try {
      const { data, error } = await supabase
        .from('company_platform')
        .select('apikey')
        .eq('platform', 'QOO10')
        .eq('isactive', true)
        .single();

      if (error) throw error;
      if (!data?.apikey) throw new Error('QOO10 API key not found');
      
      return data.apikey;
    } catch (error) {
      console.error("Error fetching QOO10 API key:", error);
      return null;
    }
  };

  const fetchQoo10Categories = async () => {
    try {
      setLoading(true);
      const apiKey = await getQoo10ApiKey();
      
      if (!apiKey) {
        throw new Error('QOO10 API key not found');
      }

      const response = await fetch('https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'QAPIVersion': '1.0',
          'GiosisCertificationKey': apiKey,
        },
        body: new URLSearchParams({
          'method': 'CommonInfoLookup.GetCatagoryListAll',
          'lang_cd': 'ja'
        })
      });

      const data: Qoo10Response = await response.json();
      
      if (data.ResultCode === 0) {
        setQoo10Categories(data.ResultObject);
      } else {
        console.error("Error fetching QOO10 categories:", data.ResultMsg);
      }
    } catch (error) {
      console.error("Error fetching QOO10 categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const paginateQoo10Categories = (categories: Qoo10Category[]) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return categories.slice(indexOfFirstItem, indexOfLastItem);
  };

  const saveMapping = async () => {
    try {
      if (selectedInboundCategories.length === 0 || selectedOutboundCategories.length === 0) {
        alert('카테고리를 선택해주세요.');
        return;
      }

      const mappings = selectedInboundCategories.map(inbound => 
        selectedOutboundCategories.map(outbound => ({
          id: crypto.randomUUID(),
          inboundcategoryid: inbound.categoryid,
          inboundplatform: selectedPlatform,
          outboundcategoryid: outbound.CATE_S_CD || outbound.CATE_M_CD || outbound.CATE_L_CD,
          outboundplatform: 'QOO10',
          outboundcountry: 'JP',
          createdat: new Date().toISOString(),
          updatedat: null,
          companyid: null
        }))
      ).flat();

      const { error } = await supabase
        .from('category_maps')
        .insert(mappings);

      if (error) throw error;

      alert('맵핑이 저장되었습니다.');
      
      setSelectedInboundCategories([]);
      setSelectedOutboundCategories([]);
    } catch (error) {
      console.error('Error saving category mapping:', error);
      alert('맵핑 저장 중 오류가 발생했습니다.');
    }
  };

  const handleInboundSelection = (category: Category, checked: boolean) => {
    if (checked) {
      setSelectedInboundCategories(prev => [...prev, category]);
    } else {
      setSelectedInboundCategories(prev => 
        prev.filter(c => c.categoryid !== category.categoryid)
      );
    }
  };

  const handleOutboundSelection = (category: Qoo10Category, checked: boolean) => {
    if (checked) {
      setSelectedOutboundCategories(prev => [...prev, category]);
    } else {
      setSelectedOutboundCategories(prev => 
        prev.filter(c => 
          c.CATE_L_CD !== category.CATE_L_CD ||
          c.CATE_M_CD !== category.CATE_M_CD ||
          c.CATE_S_CD !== category.CATE_S_CD
        )
      );
    }
  };

  const fetchMappedCategories = async () => {
    try {
      // 먼저 category_maps 데이터를 가져옵니다
      const { data: mapData, error: mapError } = await supabase
        .from('category_maps')
        .select('*')
        .eq('inboundplatform', selectedInboundPlatform)
        .eq('outboundplatform', selectedOutboundPlatform)
        .eq('outboundcountry', selectedCountry);

      if (mapError) {
        console.error('Error fetching mapped categories:', mapError);
        throw mapError;
      }

      // 가져온 맵 데이터의 inboundcategoryid를 사용하여 categories 테이블에서 pathname을 조회합니다
      const categoryPromises = mapData.map(async (map) => {
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('pathname')
          .eq('categoryid', map.inboundcategoryid)
          .single();

        if (categoryError) {
          console.error('Error fetching category:', categoryError);
          return {
            ...map,
            inbound_pathname: ''
          };
        }

        return {
          id: map.id,
          inboundcategoryid: map.inboundcategoryid,
          inbound_pathname: categoryData?.pathname || '',
          inboundplatform: map.inboundplatform,
          outboundcategoryid: map.outboundcategoryid,
          outboundplatform: map.outboundplatform,
          outboundcountry: map.outboundcountry
        };
      });

      const transformedData = await Promise.all(categoryPromises);
      console.log('Fetched mapped categories:', transformedData);
      setMappedCategories(transformedData);
    } catch (error) {
      console.error('Error in fetchMappedCategories:', error);
    }
  };

  useEffect(() => {
    if (selectedPlatform) {
      fetchTest(selectedPlatform);
    }
  }, [selectedPlatform]);

  useEffect(() => {
    fetchPlatforms();
    fetchQoo10Categories();
  }, []);

  useEffect(() => {
    if (selectedInboundPlatform && selectedOutboundPlatform && selectedCountry) {
      fetchMappedCategories();
      // QOO10 카테고리도 함께 로드
      if (!qoo10Categories.length) {
        fetchQoo10Categories();
      }
    }
  }, [selectedInboundPlatform, selectedOutboundPlatform, selectedCountry]);

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="mapping" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="mapping">카테고리 맵핑</TabsTrigger>
          <TabsTrigger value="maplist">카테고리 MAPLIST</TabsTrigger>
        </TabsList>

        <TabsContent value="mapping">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
            {/* Left Table */}
            <div className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="grid gap-2">
                  <span className="text-sm">플랫폼 선택</span>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="플랫폼 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <div className="grid gap-2">
                      <span className="text-sm">카테고리 검색</span>
                      <Input className="" placeholder="카테고리 검색" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {categories.length} results found | 0 selected
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>카테고리 ID</TableHead>
                      <TableHead>카테고리명</TableHead>
                      <TableHead>카테고리 경로</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category, index) => (
                      <TableRow key={category.categoryid} className="h-16">
                        <TableCell>
                          <Checkbox 
                            checked={selectedInboundCategories.some(c => c.categoryid === category.categoryid)}
                            onCheckedChange={(checked) => handleInboundSelection(category, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{category.categoryid}</TableCell>
                        <TableCell>{category.category_name}</TableCell>
                        <TableCell>{category.category_path}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Mapping Button */}
            <div className="flex items-center justify-center">
              <Button 
                variant="secondary" 
                className="gap-2"
                onClick={saveMapping}
                disabled={selectedInboundCategories.length === 0 || selectedOutboundCategories.length === 0}
              >
                맵핑하기 <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Right Table */}
            <div className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="grid gap-2">
                  <span className="text-sm">플랫폼 선택</span>
                  <Select>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="플랫폼선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lazada">QOO10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <span className="text-sm">국가 선택</span>
                  <Select>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="국가선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jp">JP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <div className="grid gap-2">
                      <span className="text-sm">카테고리 검색</span>
                      <Input className="" placeholder="카테고리 검색" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  4,433 results found | 0 selected
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>카테고리 ID</TableHead>
                      <TableHead>카테고리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">로딩 중...</TableCell>
                      </TableRow>
                    ) : paginateQoo10Categories(qoo10Categories).map((category, index) => (
                      <TableRow key={`${category.CATE_L_CD}-${category.CATE_M_CD}-${category.CATE_S_CD}`} className="h-16">
                        <TableCell>
                          <Checkbox 
                            checked={selectedOutboundCategories.some(c => 
                              c.CATE_L_CD === category.CATE_L_CD &&
                              c.CATE_M_CD === category.CATE_M_CD &&
                              c.CATE_S_CD === category.CATE_S_CD
                            )}
                            onCheckedChange={(checked) => handleOutboundSelection(category, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell>{category.CATE_S_CD || category.CATE_M_CD || category.CATE_L_CD}</TableCell>
                        <TableCell>
                          {category.CATE_L_NM} 
                          {category.CATE_M_NM && ` > ${category.CATE_M_NM}`}
                          {category.CATE_S_NM && ` > ${category.CATE_S_NM}`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex items-center justify-between px-4 py-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Total {qoo10Categories.length} items
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm">
                      Page {currentPage} of {Math.ceil(qoo10Categories.length / itemsPerPage)}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => 
                        Math.min(Math.ceil(qoo10Categories.length / itemsPerPage), prev + 1)
                      )}
                      disabled={currentPage === Math.ceil(qoo10Categories.length / itemsPerPage)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="maplist" className="space-y-4">
          <div className="flex items-end gap-4 my-4">
            <div className="grid gap-2">
              <span className="text-sm">Inbound 플랫폼 선택</span>
              <Select value={selectedInboundPlatform} onValueChange={setSelectedInboundPlatform}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="플랫폼 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SMART_STORE">스마트 스토어</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <span className="text-sm">Outbound 플랫폼 선택</span>
              <Select value={selectedOutboundPlatform} onValueChange={setSelectedOutboundPlatform}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="플랫폼 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QOO10">QOO10</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <span className="text-sm">국가 선택</span>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="국가 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JP">JP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {mappedCategories.length} results found
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Inbound Category ID</TableHead>
                  <TableHead>Inbound Category Name</TableHead>
                  <TableHead>Outbound Category ID</TableHead>
                  <TableHead>Outbound Category Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappedCategories.map((category, index) => (
                  <TableRow key={category.id} className="h-16">
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{category.inboundcategoryid}</TableCell>
                    <TableCell>{category.inbound_pathname}</TableCell>
                    <TableCell>{category.outboundcategoryid}</TableCell>
                    <TableCell>
                      {qoo10Categories.find(c => 
                        (c.CATE_S_CD || c.CATE_M_CD || c.CATE_L_CD) === category.outboundcategoryid
                      )?.CATE_S_NM || 
                      qoo10Categories.find(c => 
                        (c.CATE_S_CD || c.CATE_M_CD || c.CATE_L_CD) === category.outboundcategoryid
                      )?.CATE_M_NM ||
                      qoo10Categories.find(c => 
                        (c.CATE_S_CD || c.CATE_M_CD || c.CATE_L_CD) === category.outboundcategoryid
                      )?.CATE_L_NM}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

