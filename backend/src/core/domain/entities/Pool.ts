export interface Pool {
  id: number;
  year: number;
  createdAt: Date;
  members: PoolMember[];
}

export interface PoolMember {
  id: number;
  poolId: number;
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface CreatePoolRequest {
  year: number;
  members: PoolMemberInput[];
}

export interface PoolMemberInput {
  shipId: string;
  cbBefore: number;
}

export interface PoolValidationResult {
  isValid: boolean;
  errors: string[];
  poolSum: number;
}
