
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.Qoo10NormalProductScalarFieldEnum = {
  id: 'id',
  itemCode: 'itemCode',
  companyId: 'companyId',
  platformId: 'platformId',
  sellerId: 'sellerId',
  sellerAuthKey: 'sellerAuthKey',
  flag: 'flag',
  sellerCode: 'sellerCode',
  itemStatus: 'itemStatus',
  itemTitle: 'itemTitle',
  promotionName: 'promotionName',
  mainCatCd: 'mainCatCd',
  mainCatNm: 'mainCatNm',
  firstSubCatCd: 'firstSubCatCd',
  firstSubCatNm: 'firstSubCatNm',
  secondSubCatCd: 'secondSubCatCd',
  secondSubCatNm: 'secondSubCatNm',
  drugType: 'drugType',
  productionPlaceType: 'productionPlaceType',
  productionPlace: 'productionPlace',
  industrialCodeType: 'industrialCodeType',
  industrialCode: 'industrialCode',
  retailPrice: 'retailPrice',
  itemPrice: 'itemPrice',
  taxRate: 'taxRate',
  settlePrice: 'settlePrice',
  itemQty: 'itemQty',
  expireDate: 'expireDate',
  shippingNo: 'shippingNo',
  modelNM: 'modelNM',
  manufacturerDate: 'manufacturerDate',
  brandNo: 'brandNo',
  material: 'material',
  adultYN: 'adultYN',
  contactInfo: 'contactInfo',
  itemDetail: 'itemDetail',
  imageUrl: 'imageUrl',
  videoURL: 'videoURL',
  keyword: 'keyword',
  listedDate: 'listedDate',
  changedDate: 'changedDate',
  lastFetchDate: 'lastFetchDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  availableDateType: 'availableDateType',
  availableDateValue: 'availableDateValue',
  desiredShippingDate: 'desiredShippingDate',
  weight: 'weight',
  optionShippingNo1: 'optionShippingNo1',
  optionShippingNo2: 'optionShippingNo2'
};

exports.Prisma.Qoo10MoveProductScalarFieldEnum = {
  id: 'id',
  itemCode: 'itemCode',
  companyId: 'companyId',
  platformId: 'platformId',
  sellerId: 'sellerId',
  sellerAuthKey: 'sellerAuthKey',
  flag: 'flag',
  adultYN: 'adultYN',
  attributeInfo: 'attributeInfo',
  availableDateValue: 'availableDateValue',
  brandNo: 'brandNo',
  buyLimitType: 'buyLimitType',
  buyLimitDate: 'buyLimitDate',
  buyLimitQty: 'buyLimitQty',
  contactInfo: 'contactInfo',
  desiredShippingDate: 'desiredShippingDate',
  expirationDateType: 'expirationDateType',
  expirationDateMFD: 'expirationDateMFD',
  expirationDatePAO: 'expirationDatePAO',
  expirationDateEXP: 'expirationDateEXP',
  expireDate: 'expireDate',
  imageOtherUrl: 'imageOtherUrl',
  industrialCode: 'industrialCode',
  industrialCodeType: 'industrialCodeType',
  itemDescription: 'itemDescription',
  itemPrice: 'itemPrice',
  itemSeriesName: 'itemSeriesName',
  keyword: 'keyword',
  manufactureDate: 'manufactureDate',
  materialInfo: 'materialInfo',
  materialNumber: 'materialNumber',
  modelNM: 'modelNM',
  optionMainimage: 'optionMainimage',
  optionQty: 'optionQty',
  optionSubimage: 'optionSubimage',
  optionType: 'optionType',
  originCountryId: 'originCountryId',
  originRegionId: 'originRegionId',
  originOthers: 'originOthers',
  originType: 'originType',
  promotionName: 'promotionName',
  retailPrice: 'retailPrice',
  seasonType: 'seasonType',
  secondSubCat: 'secondSubCat',
  sellerCode: 'sellerCode',
  shippingNo: 'shippingNo',
  sizetableType1: 'sizetableType1',
  sizetableType1Value: 'sizetableType1Value',
  sizetableType2: 'sizetableType2',
  sizetableType2Value: 'sizetableType2Value',
  sizetableType3: 'sizetableType3',
  sizetableType3Value: 'sizetableType3Value',
  styleNumber: 'styleNumber',
  tpoNumber: 'tpoNumber',
  videoNumber: 'videoNumber',
  washinginfoFit: 'washinginfoFit',
  washinginfoLining: 'washinginfoLining',
  washinginfoSeethrough: 'washinginfoSeethrough',
  washinginfoStretch: 'washinginfoStretch',
  washinginfoThickness: 'washinginfoThickness',
  washinginfoWashing: 'washinginfoWashing',
  weight: 'weight',
  taxRate: 'taxRate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lastFetchDate: 'lastFetchDate'
};

exports.Prisma.NormalOptionScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  name1: 'name1',
  value1: 'value1',
  name2: 'name2',
  value2: 'value2',
  name3: 'name3',
  value3: 'value3',
  name4: 'name4',
  value4: 'value4',
  name5: 'name5',
  value5: 'value5',
  price: 'price',
  qty: 'qty',
  itemTypeCode: 'itemTypeCode',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MoveOptionScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  color: 'color',
  size: 'size',
  qty: 'qty',
  itemTypeCode: 'itemTypeCode',
  price: 'price',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};


exports.Prisma.ModelName = {
  Qoo10NormalProduct: 'Qoo10NormalProduct',
  Qoo10MoveProduct: 'Qoo10MoveProduct',
  NormalOption: 'NormalOption',
  MoveOption: 'MoveOption'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
