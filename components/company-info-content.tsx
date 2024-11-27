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
import { SupplyForm } from './supply-form'
import { Company, Platform, Supplier, CompanySupply } from '@/types'

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
  const [supplyToEdit, setSupplyToEdit] = useState<CompanySupply | null>(null)
  const [isSupplyDialogOpen, setIsSupplyDialogOpen] = useState(false)

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

  const fetchSuppliers = async (companyId: string) => {
    try {
      const response = await fetch(`/api/company/${companyId}/supply`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch suppliers')
      }
      const data = await response.json()
      
      // 데이터가 배열인지 확인하고 처리
      const supplies = Array.isArray(data) ? data : []
      console.log('Fetched supplies:', supplies)  // 디버깅용
      return supplies
    } catch (error) {
      console.error('Failed to fetch suppliers:', error)
      // 오류 발생 시 빈 배열 반환
      return []
    }
  }

  const handleRowClick = async (companyId: string) => {
    setCompanies(companies.map(company => {
      if (company.id === companyId) {
        const newIsExpanded = !company.isExpanded
        if (newIsExpanded) {
          // 플랫폼 정보와 공급업체 정보 모두 로드
          Promise.all([
            fetchPlatforms(companyId),
            fetchSuppliers(companyId)
          ]).then(([platforms, supplies]) => {
            console.log('Loaded supplies:', supplies)  // 디버깅용
            setCompanies(prevCompanies => prevCompanies.map(prevCompany => 
              prevCompany.id === companyId 
                ? { ...prevCompany, platforms, supplies, isExpanded: true }
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
    setSelectedCompany(companies.find(c => c.id === companyId) || null)
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
        company.id === companyId 
          ? { ...company, platforms }
          : company
      ))
    } catch (error) {
      console.error('Failed to delete platform:', error)
    }
  }

  const handleEditCompany = (company: Company) => {
    fetch(`/api/company/${company.id}`)
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
      
      alert('업체 보가 성공적으로 수정되었습니다.');
      
      if (parentCompanyId) {
        const suppliers = await fetchSuppliers(parentCompanyId);
        setCompanies(prevCompanies => prevCompanies.map(company => 
          company.id === parentCompanyId
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

  const handleEditPlatform = (companyId: string, platform: any) => {
    // 서버 데이터의 필드명을 폼 컴포넌트의 필드명으로 변환
    const formattedPlatform = {
      Id: platform.id,
      Platform: platform.platform,
      SellerId: platform.sellerid,
      Password: platform.password,
      ApiKey: platform.apikey,
      SecretKey: platform.secretkey,
      AccessToken: platform.accesstoken,
      RefreshToken: platform.refreshtoken,
      TokenExpiryDate: platform.tokenexpirydate,
      IsActive: platform.isactive,
      Memo: platform.memo
    }
    
    setSelectedCompany(companies.find(c => c.id === companyId) || null)
    setPlatformToEdit(formattedPlatform)
    setIsPlatformDialogOpen(true)
  }

  const handleAddSupply = (companyId: string) => {
    setSelectedCompany(companies.find(c => c.id === companyId) || null);
    setIsSupplyDialogOpen(true);
  };

  const handleEditSupply = (supply: CompanySupply) => {
    setSelectedCompany(companies.find(c => c.id === supply.companyid) || null);
    setSupplyToEdit(supply);
    setIsSupplyDialogOpen(true);
  };

  const handleDeleteSupply = async (companyId: string, supplyId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/company/${companyId}/supply/${supplyId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete supply');

      // 공급업체 목록 새로고침
      const supplies = await fetchSuppliers(companyId);
      setCompanies(prevCompanies => prevCompanies.map(company => 
        company.id === companyId 
          ? { ...company, supplies }
          : company
      ));
    } catch (error) {
      console.error('Failed to delete supply:', error);
      alert('공급업체 삭제에 실패했습니다.');
    }
  };

  const handleNewCompany = () => {
    setSelectedCompany(null);
    setParentCompanyId(null);
    setIsDialogOpen(true);
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
              <React.Fragment key={company.id}>
                <TableRow className="cursor-pointer hover:bg-gray-100">
                  <TableCell onClick={() => handleRowClick(company.id)}>
                    {company.isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(company.id)}>{company.name}</TableCell>
                  <TableCell onClick={() => handleRowClick(company.id)}>{company.biznum}</TableCell>
                  <TableCell onClick={() => handleRowClick(company.id)}>{company.ownername}</TableCell>
                  <TableCell onClick={() => handleRowClick(company.id)}>{company.tel}</TableCell>
                  <TableCell onClick={() => handleRowClick(company.id)}>{company.email}</TableCell>
                  <TableCell onClick={() => handleRowClick(company.id)}>{company.managername}</TableCell>
                  <TableCell onClick={() => handleRowClick(company.id)}>
                    {new Date(company.created).toLocaleDateString()}
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
                        onClick={() => handleDeleteCompany(company.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                     
                    </div>
                  </TableCell>
                </TableRow>
                {company.isExpanded && (
                  <TableRow key={`${company.id}-expanded`}>
                    <TableCell colSpan={9}>
                      <div className="space-y-6">
                        {/* 공급업체 목록 */}
                        <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">공급업체 목록</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddSupply(company.id)}
                            >
                              <PlusCircle className="w-4 h-4 mr-2" />
                              공급업체 추가
                            </Button>
                          </div>
                          
                          {!company.supplies || company.supplies.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              등록된 공급업체가 없습니다
                            </div>
                          ) : (
                            <div className="bg-white rounded-lg border">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-gray-100">
                                    <TableHead>공급업체명</TableHead>
                                    <TableHead>사업자번호</TableHead>
                                    <TableHead>연락처</TableHead>
                                    <TableHead>이메일</TableHead>
                                    <TableHead>담당자</TableHead>
                                    <TableHead>담당자 연락처</TableHead>
                                    <TableHead>결제조건</TableHead>
                                    <TableHead>통화</TableHead>
                                    <TableHead>등록일</TableHead>
                                    <TableHead className="w-[100px] text-right">관리</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {company.supplies?.map((supply) => (
                                    <TableRow 
                                      key={supply.id}
                                      className="hover:bg-gray-50 transition-colors"
                                    >
                                      <TableCell className="font-medium">{supply.supplyname}</TableCell>
                                      <TableCell>{supply.businessnumber || '-'}</TableCell>
                                      <TableCell>{supply.contact || '-'}</TableCell>
                                      <TableCell>{supply.email || '-'}</TableCell>
                                      <TableCell>{supply.managername || '-'}</TableCell>
                                      <TableCell>{supply.managertel || '-'}</TableCell>
                                      <TableCell>{supply.paymentterms || '-'}</TableCell>
                                      <TableCell>{supply.currency || 'KRW'}</TableCell>
                                      <TableCell>
                                        {new Date(supply.created).toLocaleDateString()}
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex justify-end gap-2">
                                          <Button 
                                            variant="ghost" 
                                            size="icon"
                                            className="hover:bg-gray-100"
                                            onClick={() => handleEditSupply(supply)}
                                          >
                                            <Edit className="w-4 h-4 text-gray-600" />
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="icon"
                                            className="hover:bg-red-100"
                                            onClick={() => handleDeleteSupply(company.id, supply.id)}
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

                        {/* 기존 플랫폼 정보 */}
                        <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">플랫폼 정보</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddPlatform(company.id)}
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
                                    <TableHead>API Key</TableHead>
                                    <TableHead>Secret Key</TableHead>
                                    <TableHead>Access Token</TableHead>
                                    <TableHead>Refresh Token</TableHead>
                                    <TableHead>토큰 만료일</TableHead>
                                    <TableHead className="w-[100px]">상태</TableHead>
                                    <TableHead>마지막 동기화</TableHead>
                                    <TableHead>등록일</TableHead>
                                    <TableHead className="w-[100px] text-right">관리</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {company.platforms?.map((platform) => (
                                    <TableRow 
                                      key={platform.id}
                                      className="hover:bg-gray-50 transition-colors"
                                    >
                                      <TableCell className="font-medium">{platform.platform}</TableCell>
                                      <TableCell>{platform.sellerid}</TableCell>
                                      <TableCell>
                                        <div className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap" title={platform.apikey}>
                                          {platform.apikey}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap" title={platform.secretkey}>
                                          {platform.secretkey}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap" title={platform.accesstoken}>
                                          {platform.accesstoken}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap" title={platform.refreshtoken}>
                                          {platform.refreshtoken}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        {platform.tokenexpirydate 
                                          ? new Date(platform.tokenexpirydate).toLocaleString()
                                          : '-'
                                        }
                                      </TableCell>
                                      <TableCell>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                          ${platform.isactive 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-gray-100 text-gray-700'
                                          }`}
                                        >
                                          {platform.isactive ? '활성' : '비활성'}
                                        </span>
                                      </TableCell>
                                      <TableCell>
                                        {platform.lastsyncdate 
                                          ? new Date(platform.lastsyncdate).toLocaleString()
                                          : '-'
                                        }
                                      </TableCell>
                                      <TableCell>
                                        {new Date(platform.created).toLocaleDateString()}
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex justify-end gap-2">
                                          <Button 
                                            variant="ghost" 
                                            size="icon"
                                            className="hover:bg-gray-100"
                                            onClick={() => handleEditPlatform(company.id, platform)}
                                          >
                                            <Edit className="w-4 h-4 text-gray-600" />
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="icon"
                                            className="hover:bg-red-100"
                                            onClick={() => handleDeletePlatform(company.id, platform.id)}
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
            companyId={selectedCompany?.id || ''}
            initialData={platformToEdit}
            onSuccess={() => {
              setIsPlatformDialogOpen(false)
              setPlatformToEdit(null)
              if (selectedCompany) {
                fetchPlatforms(selectedCompany.id).then(platforms => {
                  setCompanies(prevCompanies => prevCompanies.map(company => 
                    company.id === selectedCompany.id 
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
                
                alert(supplierToEdit ? '공급업체 정보가 수정되었습니다.' : '공급업체가 등록되었습니다.');
                
                await fetchCompanies();
              } catch (error) {
                console.error('Failed to refresh after supplier update:', error);
                alert('업체 목록 새로고침에 실패했습니다.');
              }
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isSupplyDialogOpen} onOpenChange={setIsSupplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {supplyToEdit ? '공급업체 정보 수정' : '공급업체 등록'}
            </DialogTitle>
            <DialogDescription>
              {supplyToEdit ? '공급업체 정보를 수정해주세요.' : '새로운 공급업체 정보를 입력해주세요.'}
            </DialogDescription>
          </DialogHeader>
          <SupplyForm 
            companyId={selectedCompany?.id || ''}
            initialData={supplyToEdit}
            onSuccess={async () => {
              try {
                setIsSupplyDialogOpen(false);
                setSupplyToEdit(null);
                
                if (selectedCompany) {
                  const supplies = await fetchSuppliers(selectedCompany.id);
                  setCompanies(prevCompanies => prevCompanies.map(company => 
                    company.id === selectedCompany.id 
                      ? { ...company, supplies }
                      : company
                  ));
                }
                
                alert(supplyToEdit ? '공급업체 정보가 수정되었습니다.' : '공급업체가 등록되었습니다.');
              } catch (error) {
                console.error('Failed to refresh after supply update:', error);
                alert('공급업체 목록 새로고침에 실패했습니다.');
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}