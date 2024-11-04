export interface Company {
  Id: string;
  Name: string | null;
  NameEn: string | null;
  BizNum: string | null;
  BizType: string | null;
  BizClass: string | null;
  OwnerName: string | null;
  Tel: string | null;
  Email: string | null;
  ManagerName: string | null;
  CreatedAt: string;
  platforms?: Platform[];
  isExpanded?: boolean;
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