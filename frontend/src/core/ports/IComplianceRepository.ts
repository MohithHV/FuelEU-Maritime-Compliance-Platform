import {
  ComplianceBalance,
  AdjustedComplianceBalance,
  ComplianceBalanceFilters
} from '../domain/ComplianceBalance';

export interface IComplianceRepository {
  /**
   * Get compliance balance for a specific ship and year
   * @param shipId Ship identifier
   * @param year Year for compliance calculation
   * @returns Promise with compliance balance
   */
  getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance>;

  /**
   * Get adjusted compliance balance (after banking/pooling)
   * @param shipId Ship identifier
   * @param year Year for compliance calculation
   * @returns Promise with adjusted compliance balance
   */
  getAdjustedComplianceBalance(
    shipId: string,
    year: number
  ): Promise<AdjustedComplianceBalance>;

  /**
   * Get all compliance balances with optional filters
   * @param filters Optional filters for shipId, year, status
   * @returns Promise with array of compliance balances
   */
  getAll(filters?: ComplianceBalanceFilters): Promise<ComplianceBalance[]>;

  /**
   * Calculate compliance balance for a ship and year
   * @param shipId Ship identifier
   * @param year Year for compliance calculation
   * @returns Promise with calculated compliance balance
   */
  calculate(shipId: string, year: number): Promise<ComplianceBalance>;

  /**
   * Get compliance summary for a ship across multiple years
   * @param shipId Ship identifier
   * @param startYear Start year
   * @param endYear End year
   * @returns Promise with summary data
   */
  getSummary(
    shipId: string,
    startYear: number,
    endYear: number
  ): Promise<{
    years: number[];
    balances: ComplianceBalance[];
    totalSurplus: number;
    totalDeficit: number;
    complianceRate: number;
  }>;
}
