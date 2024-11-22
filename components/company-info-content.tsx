'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { PlusCircle, ChevronDown, ChevronRight, Edit, Trash } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { CompanyForm } from './company-form'
import { PlatformForm } from './platform-form'
import { Company, Platform, Supplier } from '@/types'

export function CompanyInfoContent() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPlatformDialogOpen, setIsPlatformDialogOpen] = useState(false)
  const [platformToEdit, setPlatformToEdit] = useState<Platform | null>(null)
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false)
  const [parentCompanyId, setParentCompanyId] = useState<string | null>(null)
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null)

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/company')
      if (!response.ok) {
        throw new Error('Failed to fetch companies')
      }
      const data = await response.json()
      
      // 응답이 배열인지 확인하고 처리
      const companiesData = Array.isArray(data) ? data : []
      setCompanies(companiesData.map((company: Company) => ({ 
        ...company, 
        isExpanded: false 
      })))
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch companies:', error)
      setCompanies([])  // 오류 발생 시 빈 배열로 설정
      setIsLoading(false)
    }
  }

  const fetchPlatforms = async (companyId: string) => {
    try {
      const response = await fetch(`/api/company/${companyId}/platform`)
      if (!response.ok) throw new Error('Failed to fetch platforms')
      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Failed to fetch platforms:', error)
      return []
    }
  }

  const fetchSuppliers = async (parentCompanyId: string) => {
    try {
      const response = await fetch(`/api/company?parentCompanyId=${parentCompanyId}`)
      if (!response.ok) throw new Error('Failed to fetch suppliers')
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to fetch suppliers:', error)
      return []
    }
  }

  const handleRowClick = async (companyId: string) => {
    setCompanies(companies.map(company => {
      if (company.Id === companyId) {
        const newIsExpanded = !company.isExpanded
        if (newIsExpanded) {
          // 플랫폼 정보와 공급업체 정보 모두 로드
          Promise.all([
            fetchPlatforms(companyId),
            fetchSuppliers(companyId)
          ]).then(([platforms, suppliers]) => {
            setCompanies(prevCompanies => prevCompanies.map(prevCompany => 
              prevCompany.Id === companyId 
                ? { ...prevCompany, platforms, suppliers, isExpanded: true }
                : prevCompany
            ))
          })
        }
        return { ...company, isExpanded: newIsExpanded }
      }
      return company
    }))
  }

  const handleAddPlatform = (companyId: string) => {
    setSelectedCompany(companies.find(c => c.Id === companyId) || null)
    setIsPlatformDialogOpen(true)
  }

  const handleDeletePlatform = async (companyId: string, platformId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      await fetch(`/api/company/${companyId}/platform/${platformId}`, {
        method: 'DELETE'
      })
      
      // 플랫폼 목록 새로고침
      const platforms = await fetchPlatforms(companyId)
      setCompanies(prevCompanies => prevCompanies.map(company => 
        company.Id === companyId 
          ? { ...company, platforms }
          : company
      ))
    } catch (error) {
      console.error('Failed to delete platform:', error)
    }
  }

  const handleEditCompany = (company: Company) => {
    fetch(`/api/company/${company.Id}`)
      .then(response => response.json())
      .then(data => {
        setSelectedCompany(data);
        setIsDialogOpen(true);
      })
      .catch(error => {
        console.error('Failed to fetch company details:', error);
        alert('업체 정보를 불러오는데 실패했습니다.');
      });
  };

  const handleEditSuccess = async () => {
    try {
      setIsDialogOpen(false);
      setSelectedCompany(null);
      await fetchCompanies();
      
      alert('업체 정보가 성공적으로 수정되었습니다.');
      
      if (parentCompanyId) {
        const suppliers = await fetchSuppliers(parentCompanyId);
        setCompanies(prevCompanies => prevCompanies.map(company => 
          company.Id === parentCompanyId
            ? { ...company, suppliers }
            : company
        ));
      }
    } catch (error) {
      console.error('Failed to refresh companies:', error);
      alert('업체 목록 새로고침에 실패했습니다.');
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/company/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchCompanies() // 목록 새로고침
      } else {
        console.error('Failed to delete company')
      }
    } catch (error) {
      console.error('Failed to delete company:', error)
    }
  }

  const handleEditPlatform = (companyId: string, platform: Platform) => {
    setSelectedCompany(companies.find(c => c.Id === companyId) || null)
    setPlatformToEdit(platform)
    setIsPlatformDialogOpen(true)
  }

  const handleAddSupplier = (companyId: string) => {
    setParentCompanyId(companyId);
    setIsSupplierDialogOpen(true);
  };

  const handleNewCompany = () => {
    setSelectedCompany(null);
    setParentCompanyId(null);
    setIsDialogOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSupplierToEdit(supplier);
    setIsSupplierDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">업체 목록</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewCompany}>
              <PlusCircle className="w-4 h-4 mr-2" />
              새 업체 등록
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedCompany ? '업체 정보 수정' : '새 업체 등록'}
              </DialogTitle>
            </DialogHeader>
            <CompanyForm 
              initialData={selectedCompany}
              onSuccess={() => {
                setIsDialogOpen(false);
                setSelectedCompany(null);
                fetchCompanies();
                alert(selectedCompany ? '업체 정보가 수정되었습니다.' : '새 업체가 등록되었습니다.');
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]"></TableHead>
              <TableHead>업체명</TableHead>
              <TableHead>사업자번호</TableHead>
              <TableHead>대표자</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>담당자</TableHead>
              <TableHead>등록일</TableHead>
              <TableHead className="w-[100px]">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <React.Fragment key={company.Id}>
                <TableRow className="cursor-pointer hover:bg-gray-100">
                  <TableCell onClick={() => handleRowClick(company.Id)}>
                    {company.isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(company.Id)}>{company.Name}</TableCell>
                  <TableCell onClick={() => handleRowClick(company.Id)}>{company.BizNum}</TableCell>
                  <TableCell onClick={() => handleRowClick(company.Id)}>{company.OwnerName}</TableCell>
                  <TableCell onClick={() => handleRowClick(company.Id)}>{company.Tel}</TableCell>
                  <TableCell onClick={() => handleRowClick(company.Id)}>{company.Email}</TableCell>
                  <TableCell onClick={() => handleRowClick(company.Id)}>{company.ManagerName}</TableCell>
                  <TableCell onClick={() => handleRowClick(company.Id)}>
                    {new Date(company.CreatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();  // 행 클릭 이벤트 전파 방지
                          handleEditCompany(company);
                        }}
                        className="hover:bg-gray-100"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteCompany(company.Id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                     
                    </div>
                  </TableCell>
                </TableRow>
                {company.isExpanded && (
                  <TableRow key={`${company.Id}-expanded`}>
                    <TableCell colSpan={9}>
                      <div className="space-y-6">
                        {/* 공급업체 목록 */}
                        <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">공급업체 목록</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddSupplier(company.Id)}
                            >
                              <PlusCircle className="w-4 h-4 mr-2" />
                              공급업체 추가
                            </Button>
                          </div>
                          
                          {!company.suppliers || company.suppliers.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              등록된 공급업체가 없습니다
                            </div>
                          ) : (
                            <div className="bg-white rounded-lg border">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-gray-100">
                                    <TableHead>업체명</TableHead>
                                    <TableHead>사업자번호</TableHead>
                                    <TableHead>대표자</TableHead>
                                    <TableHead>연락처</TableHead>
                                    <TableHead>이메일</TableHead>
                                    <TableHead>담당자</TableHead>
                                    <TableHead>등록일</TableHead>
                                    <TableHead className="w-[100px] text-right">관리</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {company.suppliers?.map((supplier: Supplier) => (
                                    <TableRow 
                                      key={supplier.Id}
                                      className="hover:bg-gray-50 transition-colors"
                                    >
                                      <TableCell className="font-medium">{supplier.Name}</TableCell>
                                      <TableCell>{supplier.BizNum || '-'}</TableCell>
                                      <TableCell>{supplier.OwnerName || '-'}</TableCell>
                                      <TableCell>{supplier.Tel || '-'}</TableCell>
                                      <TableCell>{supplier.Email || '-'}</TableCell>
                                      <TableCell>{supplier.ManagerName || '-'}</TableCell>
                                      <TableCell>
                                        {new Date(supplier.CreatedAt).toLocaleDateString()}
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex justify-end gap-2">
                                          <Button 
                                            variant="ghost" 
                                            size="icon"
                                            className="hover:bg-gray-100"
                                            onClick={() => handleEditCompany(supplier)}
                                          >
                                            <Edit className="w-4 h-4 text-gray-600" />
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="icon"
                                            className="hover:bg-red-100"
                                            onClick={() => handleDeleteCompany(supplier.Id)}
                                          >
                                            <Trash className="w-4 h-4 text-red-600" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </div>

                        {/* 기존 플���폼 정보 */}
                        <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">플랫폼 정보</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddPlatform(company.Id)}
                            >
                              <PlusCircle className="w-4 h-4 mr-2" />
                              새 플랫폼 추가
                            </Button>
                          </div>
                          
                          {company.platforms?.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              등록된 플랫폼이 없습니다
                            </div>
                          ) : (
                            <div className="bg-white rounded-lg border">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-gray-100">
                                    <TableHead>플랫폼</TableHead>
                                    <TableHead>판매자 ID</TableHead>
                                    <TableHead className="w-[100px]">상태</TableHead>
                                    <TableHead>마지막 동기화</TableHead>
                                    <TableHead>등록일</TableHead>
                                    <TableHead className="w-[100px] text-right">관리</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {company.platforms?.map((platform) => (
                                    <TableRow 
                                      key={platform.Id}
                                      className="hover:bg-gray-50 transition-colors"
                                    >
                                      <TableCell className="font-medium">{platform.Platform}</TableCell>
                                      <TableCell>{platform.SellerId}</TableCell>
                                      <TableCell>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                          ${platform.IsActive 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-gray-100 text-gray-700'
                                          }`}
                                        >
                                          {platform.IsActive ? '활성' : '비활성'}
                                        </span>
                                      </TableCell>
                                      <TableCell>
                                        {platform.LastSyncDate 
                                          ? new Date(platform.LastSyncDate).toLocaleString()
                                          : '-'
                                        }
                                      </TableCell>
                                      <TableCell>
                                        {new Date(platform.CreatedAt).toLocaleDateString()}
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex justify-end gap-2">
                                          <Button 
                                            variant="ghost" 
                                            size="icon"
                                            className="hover:bg-gray-100"
                                            onClick={() => handleEditPlatform(company.Id, platform)}
                                          >
                                            <Edit className="w-4 h-4 text-gray-600" />
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="icon"
                                            className="hover:bg-red-100"
                                            onClick={() => handleDeletePlatform(company.Id, platform.Id)}
                                          >
                                            <Trash className="w-4 h-4 text-red-600" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isPlatformDialogOpen} onOpenChange={setIsPlatformDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {platformToEdit ? 'QOO10 샵정보 수정' : 'QOO10 샵정보 등록'}
            </DialogTitle>
          </DialogHeader>
          <PlatformForm 
            companyId={selectedCompany?.Id || ''}
            initialData={platformToEdit}
            onSuccess={() => {
              setIsPlatformDialogOpen(false)
              setPlatformToEdit(null)
              if (selectedCompany) {
                fetchPlatforms(selectedCompany.Id).then(platforms => {
                  setCompanies(prevCompanies => prevCompanies.map(company => 
                    company.Id === selectedCompany.Id 
                      ? { ...company, platforms }
                      : company
                  ))
                })
              }
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {supplierToEdit ? '공급업체 정보 수정' : '공급업체 등록'}
            </DialogTitle>
            <DialogDescription>
              {supplierToEdit ? '공급업체 정보를 수정해주세요.' : '새로운 공급업체 정보를 입력해주세요.'}
            </DialogDescription>
          </DialogHeader>
          <CompanyForm 
            initialData={supplierToEdit}
            parentCompanyId={parentCompanyId}
            onSuccess={async () => {
              try {
                setIsSupplierDialogOpen(false);
                setSupplierToEdit(null);
                setParentCompanyId(null);
                
                alert(supplierToEdit ? '공급업체 정보가 수정되었습니다.' : '공급업체가 등���되었습니다.');
                
                await fetchCompanies();
              } catch (error) {
                console.error('Failed to refresh after supplier update:', error);
                alert('업체 목록 새로고침에 실패했습니다.');
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}