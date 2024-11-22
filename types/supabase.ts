export type CompanyRow = {
  Id: string
  ParentCompanyId: string | null
  Name: string | null
  NameEn: string | null
  BizNum: string | null
  BizType: string | null
  BizClass: string | null
  BizRegistNum: string | null
  OwnerName: string | null
  Post: string | null
  Addr: string | null
  AddrEn: string | null
  Addr2: string | null
  Addr2En: string | null
  Tel: string | null
  Email: string | null
  Fax: string | null
  WebSite: string | null
  ManagerName: string | null
  ManagerTel: string | null
  ManagerPosition: string | null
  ManagerEmail: string | null
  Memo: string | null
  ReceivingAccount: string | null
  ReceivingBank: string | null
  CreatedAt: string
  UpdatedAt: string | null
  DeletedAt: string | null
}

export type PlatformRow = {
  Id: string
  CompanyId: string
  Platform: string
  SellerId: string | null
  ApiKey: string | null
  SecretKey: string | null
  AccessToken: string | null
  RefreshToken: string | null
  TokenExpiryDate: string | null
  IsActive: boolean
  LastSyncDate: string | null
  Memo: string | null
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: string | null
} 