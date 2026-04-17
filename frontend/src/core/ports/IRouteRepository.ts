import { Route, RouteFilters } from '../domain/Route';
import { ComparisonResult } from '../domain/Comparison';

export interface IRouteRepository {
  /**
   * Get all routes with optional filters
   * @param filters Optional filters for vessel type, fuel type, and year
   * @returns Promise with array of routes
   */
  getAll(filters?: RouteFilters): Promise<Route[]>;

  /**
   * Get a single route by ID
   * @param id Route ID
   * @returns Promise with route or null if not found
   */
  getById(id: number): Promise<Route | null>;

  /**
   * Set a route as the baseline
   * @param routeId The route identifier to set as baseline
   * @returns Promise with updated route
   */
  setBaseline(routeId: string): Promise<Route>;

  /**
   * Get comparison between baseline and actual routes
   * @param filters Optional filters for the comparison
   * @returns Promise with comparison results
   */
  getComparison(filters?: RouteFilters): Promise<ComparisonResult>;

  /**
   * Create a new route
   * @param route Route data (without id, createdAt, updatedAt)
   * @returns Promise with created route
   */
  create(route: Omit<Route, 'id' | 'createdAt' | 'updatedAt'>): Promise<Route>;

  /**
   * Update an existing route
   * @param id Route ID
   * @param route Partial route data to update
   * @returns Promise with updated route
   */
  update(id: number, route: Partial<Route>): Promise<Route>;

  /**
   * Delete a route
   * @param id Route ID
   * @returns Promise with boolean indicating success
   */
  delete(id: number): Promise<boolean>;
}
