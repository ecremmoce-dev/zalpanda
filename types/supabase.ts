export type Company = {
  id: string
  parentcompanyid?: string | null
  name?: string
  nameen?: string
  biznum?: string
  biztype?: string
  bizclass?: string
  bizregistnum?: string
  ownername?: string
  post?: string
  addr?: string
  addren?: string
  addr2?: string
  addr2en?: string
  tel?: string
  email?: string
  fax?: string
  website?: string
  managername?: string
  managertel?: string
  managerposition?: string
  manageremail?: string
  memo?: string
  receivingaccount?: string
  receivingbank?: string
  created: string
  updated?: string
  deleted?: string
  platforms?: CompanyPlatform[]
  supplies?: CompanySupply[]
  isExpanded?: boolean
}

export type Platform = 'QOO10' | 'SHOPEE' | 'LAZADA' | 'AMAZON' | 'RAKUTEN' | 'COUPANG'

export type CompanyPlatform = {
  id: string
  companyid: string
  platform: Platform
  sellerid: string | null
  apikey: string | null
  secretkey: string | null
  accesstoken: string | null
  refreshtoken: string | null
  tokenexpirydate: string | null
  isactive: boolean
  lastsyncdate: string | null
  memo: string | null
  created: string
  updated: string
  deleted: string | null
}

export type CompanySupply = {
  id: string
  companyid: string
  supplyname: string
  contact?: string
  address?: string
  businessnumber?: string
  email?: string
  fax?: string
  website?: string
  managername?: string
  managertel?: string
  manageremail?: string
  bankaccount?: string
  bankname?: string
  paymentterms?: string
  currency?: string
  notes?: string
  created: string
  updated: string
} 