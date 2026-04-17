export interface ShipCompliance {
  id: number;
  shipId: string;
  year: number;
  cbGco2eq: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceBalance {
  shipId: string;
  year: number;
  cbBefore: number;
  applied: number;
  cbAfter: number;
}
