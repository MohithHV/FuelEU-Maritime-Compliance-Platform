export interface BankEntry {
  id: number;
  shipId: string;
  year: number;
  transactionType: 'bank' | 'borrow' | 'apply';
  amount: number;
  remainingBalance: number;
  expiryYear?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankRequest {
  shipId: string;
  year: number;
  amount: number;
  notes?: string;
}

export interface ApplyBankedRequest {
  shipId: string;
  year: number;
  amount: number;
  sourceYear: number;
  notes?: string;
}

export interface BankingSummary {
  shipId: string;
  totalBanked: number;
  totalBorrowed: number;
  totalApplied: number;
  currentBalance: number;
  entries: BankEntry[];
}
