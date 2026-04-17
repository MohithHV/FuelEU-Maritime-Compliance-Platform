export interface ComplianceBalance {
  shipId: string;
  year: number;
  baselineGHGIntensity: number;
  actualGHGIntensity: number;
  targetGHGIntensity: number;
  complianceBalance: number;
  status: 'surplus' | 'deficit' | 'compliant';
  penaltyAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdjustedComplianceBalance {
  shipId: string;
  year: number;
  originalCB: number;
  borrowedAmount: number;
  bankedAmount: number;
  poolContribution: number;
  adjustedCB: number;
  finalStatus: 'surplus' | 'deficit' | 'compliant';
  penaltyAmount?: number;
}

export interface ComplianceBalanceFilters {
  shipId?: string;
  year?: number;
  status?: 'surplus' | 'deficit' | 'compliant';
}
