export interface Option {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
  Flag: string;
  Id: string;
  Name1: string | null;
  Value1: string | null;
  Name2: string | null;
  Value2: string | null;
  Name3: string | null;
  Value3: string | null;
  Name4: string | null;
  Value4: string | null;
  Name5: string | null;
  Value5: string | null;
  Price: number;
  Qty: number;
  ItemTypeCode: string | null;
}

export interface DetailProduct {
  id: string;
  ItemCode: string;
  CompanyId: string;
  PlatformId: string;
  SellerId: string;
  SellerAuthKey: string;
  Flag: string;
  SellerCode: string;
  ItemStatus: string;
  ItemTitle: string;
  ItemSeriesName: string;
  Weight: number;
  AttributeInfo: string;
  RetailPrice: number;
  TaxRate: number;
  SettlePrice: number;
  OptionMainimage: string;
  OptionType: string;
  ItemDescription: string;
  MainCatCd: string;
  MainCatNm: string;
  FirstSubCatCd: string;
  FirstSubCatNm: string;
  SecondSubCatCd: string;
  SecondSubCatNm: string;
  ImageUrl: string;
  BrandNo: string;
  ItemPrice: number;
  ShippingNo: string;
  OriginType: string;
  OriginCountryId: string;
  SeasonType: string;
  Keyword: string;
  Options: Option[];
  ItemQty: number;
  ItemDetail: string;
  ExpireDate: string;
  OptionSubimage: string;
  OptionQty: string;
  PromotionName: string;
  IndustrialCodeType: string;
  IndustrialCode: string;
  ManufacturerDate: string;
  ModelNM: string;
  Material: string;
  ProductionPlaceType: string;
  ProductionPlace: string;
  AdultYN: string;
  ContactInfo: string;
  AvailableDateType: string;
  AvailableDateValue: string;
  DesiredShippingDate: number;
  CreatedAt: string;
  LastFetchDate: string;
}

export interface ProductState {
  items: DetailProduct[];
  isDetailDialogOpen: boolean;
  isEditDialogOpen: boolean;
  selectedTab: string;
  isSyncing: boolean;
  selectedProduct: DetailProduct | null;
} 