export interface Company {
  Id: string;
  Name: string;
  BizNum: string;
  OwnerName: string;
  Tel: string;
  Email: string;
  ManagerName: string;
  CreatedAt: string;
  ParentCompanyId?: string | null;
  isExpanded?: boolean;
  platforms?: Platform[];
  suppliers?: Company[];
}

export interface Platform {
  Id: string;
  CompanyId: string;
  Platform: string;
  SellerId: string;
  IsActive: boolean;
  LastSyncDate: string | null;
  CreatedAt: string;
}

// Company 타입을 Supplier로도 사용
export type Supplier = Company; 

export interface CompanySupply {
  id: string;
  companyid: string;
  supplyname: string;
  contact?: string;
  address?: string;
  businessnumber?: string;
  email?: string;
  fax?: string;
  website?: string;
  managername?: string;
  managertel?: string;
  manageremail?: string;
  bankaccount?: string;
  bankname?: string;
  paymentterms?: string;
  currency?: string;
  notes?: string;
  vendproductcd?: string | null;
  created?: string;
  updated?: string;
}