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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"

export default function CategoryMapping() {
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
                  <Select>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="스마트 스토어" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smartstore">스마트 스토어</SelectItem>
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
                  4,810 results found | 0 selected
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
                    {Array.from({length: 10}).map((_, i) => (
                      <TableRow key={i} className="h-16">
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>50003307</TableCell>
                        <TableCell>가구{'>'}인테리어{'>'}DIY자재/용품{'>'}가구부속품{'>'}가구다리</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>

            {/* Mapping Button */}
            <div className="flex items-center justify-center">
              <Button variant="secondary" className="gap-2">
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
                      <SelectValue placeholder="Lazada" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lazada">Lazada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <span className="text-sm">국가 선택</span>
                  <Select>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="말레이시아" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="malaysia">말레이시아</SelectItem>
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
                    {Array.from({length: 10}).map((_, i) => (
                      <TableRow key={i} className="h-16">
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>10100391</TableCell>
                        <TableCell>Audio{'>'}DJ Equipment{'>'}DJ Controllers</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="maplist" className="space-y-4">
          <div className="flex items-end gap-4 my-4">
            <div className="grid gap-2">
              <span className="text-sm">Inbound 플랫폼 선택</span>
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="스마트 스토어" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smartstore">스마트 스토어</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <span className="text-sm">Outbound 플랫폼 선택</span>
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Lazada" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lazada">Lazada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <span className="text-sm">국가 선택</span>
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="말레이시아" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="malaysia">말레이시아</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              18 results found | 0 selected
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="h-16">
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
                <TableRow className="h-16">
                  <TableCell><Checkbox /></TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>50000221</TableCell>
                  <TableCell>홈/인테리어{'>'}보드/보드게임</TableCell>
                  <TableCell>10541</TableCell>
                  <TableCell>Board Games</TableCell>
                </TableRow>
                <TableRow className="h-16">
                  <TableCell><Checkbox /></TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>50000286</TableCell>
                  <TableCell>화장품/미용{'>'}바디케어{'>'}바디스크럽</TableCell>
                  <TableCell>1470</TableCell>
                  <TableCell>Body Scrubs</TableCell>
                </TableRow>
                <TableRow className="h-16">
                  <TableCell><Checkbox /></TableCell>
                  <TableCell>3</TableCell>
                  <TableCell>50000323</TableCell>
                  <TableCell>화장품/미용{'>'}선성화장품{'>'}에센스</TableCell>
                  <TableCell>1514</TableCell>
                  <TableCell>Tinted Moisturizer</TableCell>
                </TableRow>
                <TableRow className="h-16">
                  <TableCell><Checkbox /></TableCell>
                  <TableCell>4</TableCell>
                  <TableCell>50000329</TableCell>
                  <TableCell>화장품/미용{'>'}선성화장품{'>'}스크럽/필링</TableCell>
                  <TableCell>1470</TableCell>
                  <TableCell>Body Scrubs</TableCell>
                </TableRow>
                <TableRow className="h-16">
                  <TableCell><Checkbox /></TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>50000403</TableCell>
                  <TableCell>화장품/미용{'>'}네일케어{'>'}네일아트</TableCell>
                  <TableCell>1542</TableCell>
                  <TableCell>Nail Polish</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </TabsContent>
      </Tabs>
    </div>
  )
}

