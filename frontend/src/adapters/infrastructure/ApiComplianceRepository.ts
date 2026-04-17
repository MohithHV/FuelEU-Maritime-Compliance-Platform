import { IComplianceRepository } from '../../core/ports/IComplianceRepository';
import {
  ComplianceBalance,
  AdjustedComplianceBalance,
  ComplianceBalanceFilters
} from '../../core/domain/ComplianceBalance';
import apiClient from './apiClient';

export class ApiComplianceRepository implements IComplianceRepository {
  private readonly basePath = '/compliance';

  async getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance> {
    try {
      const response = await apiClient.get<{ success: boolean; data: ComplianceBalance }>(
        `${this.basePath}/cb`,
        {
          params: { shipId, year }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching compliance balance:', error);
      throw error;
    }
  }

  async getAdjustedComplianceBalance(
    shipId: string,
    year: number
  ): Promise<AdjustedComplianceBalance> {
    try {
      const response = await apiClient.get<{ success: boolean; data: AdjustedComplianceBalance }>(
        `${this.basePath}/adjusted-cb`,
        {
          params: { shipId, year }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching adjusted compliance balance:', error);
      throw error;
    }
  }

  async getAll(filters?: ComplianceBalanceFilters): Promise<ComplianceBalance[]> {
    try {
      const params = new URLSearchParams();

      if (filters?.shipId) {
        params.append('shipId', filters.shipId);
      }
      if (filters?.year !== undefined) {
        params.append('year', filters.year.toString());
      }
      if (filters?.status) {
        params.append('status', filters.status);
      }

      const queryString = params.toString();
      const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;

      const response = await apiClient.get<ComplianceBalance[]>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance balances:', error);
      throw error;
    }
  }

  async calculate(shipId: string, year: number): Promise<ComplianceBalance> {
    try {
      const response = await apiClient.post<ComplianceBalance>(
        `${this.basePath}/calculate`,
        { shipId, year }
      );
      return response.data;
    } catch (error) {
      console.error('Error calculating compliance balance:', error);
      throw error;
    }
  }

  async getSummary(
    shipId: string,
    startYear: number,
    endYear: number
  ): Promise<{
    years: number[];
    balances: ComplianceBalance[];
    totalSurplus: number;
    totalDeficit: number;
    complianceRate: number;
  }> {
    try {
      const response = await apiClient.get(
        `${this.basePath}/summary`,
        {
          params: { shipId, startYear, endYear }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance summary:', error);
      throw error;
    }
  }
}
