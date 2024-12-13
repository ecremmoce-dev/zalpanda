export interface Qoo10Category {
  CATE_L_CD: string;
  CATE_L_NM: string;
  CATE_M_CD: string;
  CATE_M_NM: string;
  CATE_S_CD: string;
  CATE_S_NM: string;
}

export interface Qoo10Response {
  ResultObject: Qoo10Category[];
  ResultCode: number;
  ResultMsg: string;
} 