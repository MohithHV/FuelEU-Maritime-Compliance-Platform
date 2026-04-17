import { IRouteRepository } from '../../core/ports/IRouteRepository';
import { Route, RouteFilters } from '../../core/domain/Route';
import { ComparisonResult } from '../../core/domain/Comparison';
import apiClient from './apiClient';

export class ApiRouteRepository implements IRouteRepository {
  private readonly basePath = '/routes';

  async getAll(filters?: RouteFilters): Promise<Route[]> {
    try {
      const params = new URLSearchParams();

      if (filters?.vesselType) {
        params.append('vesselType', filters.vesselType);
      }
      if (filters?.fuelType) {
        params.append('fuelType', filters.fuelType);
      }
      if (filters?.year !== undefined) {
        params.append('year', filters.year.toString());
      }

      const queryString = params.toString();
      const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;

      const response = await apiClient.get<{ success: boolean; data: Route[]; count: number }>(url);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Route | null> {
    try {
      const response = await apiClient.get<Route>(`${this.basePath}/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching route by id:', error);
      throw error;
    }
  }

  async setBaseline(routeId: string): Promise<Route> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string; data: Route }>(
        `${this.basePath}/${routeId}/baseline`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error setting baseline:', error);
      throw error;
    }
  }

  async getComparison(filters?: RouteFilters): Promise<ComparisonResult> {
    try {
      const params = new URLSearchParams();

      if (filters?.vesselType) {
        params.append('vesselType', filters.vesselType);
      }
      if (filters?.fuelType) {
        params.append('fuelType', filters.fuelType);
      }
      if (filters?.year !== undefined) {
        params.append('year', filters.year.toString());
      }

      const queryString = params.toString();
      const url = queryString
        ? `${this.basePath}/comparison?${queryString}`
        : `${this.basePath}/comparison`;

      interface BackendComparison {
        baseline: Route;
        comparison: Route;
        percentDiff: number;
        compliant: boolean;
        target: number;
      }

      interface BackendComparisonResult {
        comparisons: BackendComparison[];
        target: number;
      }

      const response = await apiClient.get<{ success: boolean; data: BackendComparisonResult }>(url);
      const backendData = response.data.data;

      // Transform backend response to match frontend Comparison interface
      const comparisons = backendData.comparisons.map((item, index) => ({
        id: `${item.comparison.routeId}-${item.baseline.routeId}-${index}`, // Unique identifier
        routeId: item.comparison.routeId,
        baselineRouteId: item.baseline.routeId,
        year: item.comparison.year,
        baselineIntensity: item.baseline.ghgIntensity,
        actualIntensity: item.comparison.ghgIntensity,
        difference: item.comparison.ghgIntensity - item.baseline.ghgIntensity,
        percentChange: item.percentDiff,
        isCompliant: item.compliant,
      }));

      // Calculate summary statistics
      const totalYears = comparisons.length;
      const compliantYears = comparisons.filter((c) => c.isCompliant).length;
      const nonCompliantYears = totalYears - compliantYears;
      const averageImprovement =
        totalYears > 0
          ? comparisons.reduce((sum, c) => sum + c.percentChange, 0) / totalYears
          : 0;

      return {
        comparisons,
        summary: {
          totalYears,
          compliantYears,
          nonCompliantYears,
          averageImprovement,
        },
      };
    } catch (error) {
      console.error('Error fetching comparison:', error);
      throw error;
    }
  }

  async create(route: Omit<Route, 'id' | 'createdAt' | 'updatedAt'>): Promise<Route> {
    try {
      const response = await apiClient.post<Route>(this.basePath, route);
      return response.data;
    } catch (error) {
      console.error('Error creating route:', error);
      throw error;
    }
  }

  async update(id: number, route: Partial<Route>): Promise<Route> {
    try {
      const response = await apiClient.put<Route>(`${this.basePath}/${id}`, route);
      return response.data;
    } catch (error) {
      console.error('Error updating route:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`${this.basePath}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting route:', error);
      return false;
    }
  }
}
