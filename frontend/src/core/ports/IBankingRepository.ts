import {
  BankEntry,
  BankRequest,
  ApplyBankedRequest,
  BankingSummary
} from '../domain/BankEntry';

export interface IBankingRepository {
  /**
   * Get all bank records for a specific ship and year
   * @param shipId Ship identifier
   * @param year Optional year filter
   * @returns Promise with array of bank entries
   */
  getBankRecords(shipId: string, year?: number): Promise<BankEntry[]>;

  /**
   * Get banking summary for a ship
   * @param shipId Ship identifier
   * @returns Promise with banking summary including totals and entries
   */
  getBankingSummary(shipId: string): Promise<BankingSummary>;

  /**
   * Bank surplus compliance balance
   * @param request Bank request with shipId, year, amount, and optional notes
   * @returns Promise with created bank entry
   */
  bankSurplus(request: BankRequest): Promise<BankEntry>;

  /**
   * Apply banked compliance balance to a deficit year
   * @param request Apply banked request with shipId, year, amount, sourceYear, and optional notes
   * @returns Promise with created bank entry
   */
  applyBanked(request: ApplyBankedRequest): Promise<BankEntry>;

  /**
   * Borrow from future compliance balance
   * @param request Bank request with shipId, year, amount, and optional notes
   * @returns Promise with created bank entry
   */
  borrowFromFuture(request: BankRequest): Promise<BankEntry>;

  /**
   * Get available banked balance for a ship
   * @param shipId Ship identifier
   * @param asOfYear Calculate balance as of this year
   * @returns Promise with available balance amount
   */
  getAvailableBalance(shipId: string, asOfYear: number): Promise<number>;

  /**
   * Get expiring balances
   * @param shipId Ship identifier
   * @param year Year to check for expiring balances
   * @returns Promise with array of expiring bank entries
   */
  getExpiringBalances(shipId: string, year: number): Promise<BankEntry[]>;
}
