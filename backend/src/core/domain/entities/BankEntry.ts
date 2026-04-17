export interface BankEntry {
  id: number;
  shipId: string;
  year: number;
  amountGco2eq: number;
  isApplied: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BankingRequest {
  shipId: string;
  year: number;
  amount: number;
}

export interface ApplyBankingRequest {
  shipId: string;
  year: number;
  amount: number;
}
