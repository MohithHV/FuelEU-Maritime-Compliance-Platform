import { IPoolRepository } from '../../core/ports/IPoolRepository';
import {
  Pool,
  PoolDetails,
  CreatePoolRequest,
  PoolFilters,
  PoolMember
} from '../../core/domain/Pool';
import apiClient from './apiClient';

export class ApiPoolRepository implements IPoolRepository {
  private readonly basePath = '/pools';

  async createPool(request: CreatePoolRequest): Promise<Pool> {
    try {
      const response = await apiClient.post<Pool>(this.basePath, request);
      return response.data;
    } catch (error) {
      console.error('Error creating pool:', error);
      throw error;
    }
  }

  async getAll(filters?: PoolFilters): Promise<Pool[]> {
    try {
      const params = new URLSearchParams();

      if (filters?.year !== undefined) {
        params.append('year', filters.year.toString());
      }
      if (filters?.isActive !== undefined) {
        params.append('isActive', filters.isActive.toString());
      }
      if (filters?.shipId) {
        params.append('shipId', filters.shipId);
      }

      const queryString = params.toString();
      const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;

      const response = await apiClient.get<Pool[]>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching pools:', error);
      throw error;
    }
  }

  async getPoolById(poolId: string): Promise<PoolDetails | null> {
    try {
      const response = await apiClient.get<PoolDetails>(
        `${this.basePath}/${poolId}/details`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching pool details:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Pool | null> {
    try {
      const response = await apiClient.get<Pool>(`${this.basePath}/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching pool by id:', error);
      throw error;
    }
  }

  async addMemberToPool(poolId: string, shipId: string): Promise<Pool> {
    try {
      const response = await apiClient.post<Pool>(
        `${this.basePath}/${poolId}/members`,
        { shipId }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding member to pool:', error);
      throw error;
    }
  }

  async removeMemberFromPool(poolId: string, shipId: string): Promise<Pool> {
    try {
      const response = await apiClient.delete<Pool>(
        `${this.basePath}/${poolId}/members/${shipId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error removing member from pool:', error);
      throw error;
    }
  }

  async getPoolsByShip(shipId: string, year?: number): Promise<Pool[]> {
    try {
      const params = new URLSearchParams();
      params.append('shipId', shipId);

      if (year !== undefined) {
        params.append('year', year.toString());
      }

      const response = await apiClient.get<Pool[]>(
        `${this.basePath}/ship?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching pools by ship:', error);
      throw error;
    }
  }

  async calculatePoolDistribution(poolId: string): Promise<PoolMember[]> {
    try {
      const response = await apiClient.get<PoolMember[]>(
        `${this.basePath}/${poolId}/distribution`
      );
      return response.data;
    } catch (error) {
      console.error('Error calculating pool distribution:', error);
      throw error;
    }
  }

  async setPoolStatus(poolId: string, isActive: boolean): Promise<Pool> {
    try {
      const response = await apiClient.patch<Pool>(
        `${this.basePath}/${poolId}/status`,
        { isActive }
      );
      return response.data;
    } catch (error) {
      console.error('Error setting pool status:', error);
      throw error;
    }
  }

  async deletePool(poolId: string): Promise<boolean> {
    try {
      await apiClient.delete(`${this.basePath}/${poolId}`);
      return true;
    } catch (error) {
      console.error('Error deleting pool:', error);
      return false;
    }
  }
}
