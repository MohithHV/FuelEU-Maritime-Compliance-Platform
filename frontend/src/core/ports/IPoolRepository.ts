import {
  Pool,
  PoolDetails,
  CreatePoolRequest,
  PoolFilters,
  PoolMember
} from '../domain/Pool';

export interface IPoolRepository {
  /**
   * Create a new compliance pool
   * @param request Create pool request with poolName, year, memberShips, and optional notes
   * @returns Promise with created pool
   */
  createPool(request: CreatePoolRequest): Promise<Pool>;

  /**
   * Get all pools with optional filters
   * @param filters Optional filters for year, isActive, and shipId
   * @returns Promise with array of pools
   */
  getAll(filters?: PoolFilters): Promise<Pool[]>;

  /**
   * Get pool details by ID including member information
   * @param poolId Pool identifier
   * @returns Promise with detailed pool information
   */
  getPoolById(poolId: string): Promise<PoolDetails | null>;

  /**
   * Get pool by pool number ID
   * @param id Pool database ID
   * @returns Promise with pool or null if not found
   */
  getById(id: number): Promise<Pool | null>;

  /**
   * Add a ship to an existing pool
   * @param poolId Pool identifier
   * @param shipId Ship identifier to add
   * @returns Promise with updated pool
   */
  addMemberToPool(poolId: string, shipId: string): Promise<Pool>;

  /**
   * Remove a ship from a pool
   * @param poolId Pool identifier
   * @param shipId Ship identifier to remove
   * @returns Promise with updated pool
   */
  removeMemberFromPool(poolId: string, shipId: string): Promise<Pool>;

  /**
   * Get all pools a ship is a member of
   * @param shipId Ship identifier
   * @param year Optional year filter
   * @returns Promise with array of pools
   */
  getPoolsByShip(shipId: string, year?: number): Promise<Pool[]>;

  /**
   * Calculate pool distribution
   * @param poolId Pool identifier
   * @returns Promise with pool members and their allocations
   */
  calculatePoolDistribution(poolId: string): Promise<PoolMember[]>;

  /**
   * Activate or deactivate a pool
   * @param poolId Pool identifier
   * @param isActive Boolean indicating active status
   * @returns Promise with updated pool
   */
  setPoolStatus(poolId: string, isActive: boolean): Promise<Pool>;

  /**
   * Delete a pool
   * @param poolId Pool identifier
   * @returns Promise with boolean indicating success
   */
  deletePool(poolId: string): Promise<boolean>;
}
