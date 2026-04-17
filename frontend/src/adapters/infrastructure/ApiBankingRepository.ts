import { IBankingRepository } from '../../core/ports/IBankingRepository';
import {
  BankEntry,
  BankRequest,
  ApplyBankedRequest,
  BankingSummary
} from '../../core/domain/BankEntry';
import apiClient from './apiClient';

export class ApiBankingRepository implements IBankingRepository {
  private readonly basePath = '/banking';

  async getBankRecords(shipId: string, year?: number): Promise<BankEntry[]> {
    try {
      const params = new URLSearchParams();
      params.append('shipId', shipId);

      if (year !== undefined) {
        params.append('year', year.toString());
      }

      const response = await apiClient.get<{ success: boolean; data: BankEntry[]; count: number }>(
        `${this.basePath}/records?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching bank records:', error);
      throw error;
    }
  }

  async getBankingSummary(shipId: string): Promise<BankingSummary> {
    try {
      const response = await apiClient.get<BankingSummary>(
        `${this.basePath}/summary`,
        {
          params: { shipId }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching banking summary:', error);
      throw error;
    }
  }

  async bankSurplus(request: BankRequest): Promise<BankEntry> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string; data: BankEntry }>(
        `${this.basePath}/bank`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error('Error banking surplus:', error);
      throw error;
    }
  }

  async applyBanked(request: ApplyBankedRequest): Promise<BankEntry> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string; data: BankEntry }>(
        `${this.basePath}/apply`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error('Error applying banked balance:', error);
      throw error;
    }
  }

  async borrowFromFuture(request: BankRequest): Promise<BankEntry> {
    try {
      const response = await apiClient.post<BankEntry>(
        `${this.basePath}/borrow`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Error borrowing from future:', error);
      throw error;
    }
  }

  async getAvailableBalance(shipId: string, asOfYear: number): Promise<number> {
    try {
      const response = await apiClient.get<{ balance: number }>(
        `${this.basePath}/available-balance`,
        {
          params: { shipId, asOfYear }
        }
      );
      return response.data.balance;
    } catch (error) {
      console.error('Error fetching available balance:', error);
      throw error;
    }
  }

  async getExpiringBalances(shipId: string, year: number): Promise<BankEntry[]> {
    try {
      const response = await apiClient.get<BankEntry[]>(
        `${this.basePath}/expiring`,
        {
          params: { shipId, year }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching expiring balances:', error);
      throw error;
    }
  }
}
