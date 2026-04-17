import { IRouteRepository } from '../../core/ports/IRouteRepository';
import { IComplianceRepository } from '../../core/ports/IComplianceRepository';
import { IBankingRepository } from '../../core/ports/IBankingRepository';
import { IPoolRepository } from '../../core/ports/IPoolRepository';

import { ApiRouteRepository } from './ApiRouteRepository';
import { ApiComplianceRepository } from './ApiComplianceRepository';
import { ApiBankingRepository } from './ApiBankingRepository';
import { ApiPoolRepository } from './ApiPoolRepository';

/**
 * Repository Factory for creating repository instances
 * This follows the Factory pattern and allows for easy swapping of implementations
 */
export class RepositoryFactory {
  private static routeRepository: IRouteRepository;
  private static complianceRepository: IComplianceRepository;
  private static bankingRepository: IBankingRepository;
  private static poolRepository: IPoolRepository;

  /**
   * Get Route Repository instance (singleton)
   */
  static getRouteRepository(): IRouteRepository {
    if (!this.routeRepository) {
      this.routeRepository = new ApiRouteRepository();
    }
    return this.routeRepository;
  }

  /**
   * Get Compliance Repository instance (singleton)
   */
  static getComplianceRepository(): IComplianceRepository {
    if (!this.complianceRepository) {
      this.complianceRepository = new ApiComplianceRepository();
    }
    return this.complianceRepository;
  }

  /**
   * Get Banking Repository instance (singleton)
   */
  static getBankingRepository(): IBankingRepository {
    if (!this.bankingRepository) {
      this.bankingRepository = new ApiBankingRepository();
    }
    return this.bankingRepository;
  }

  /**
   * Get Pool Repository instance (singleton)
   */
  static getPoolRepository(): IPoolRepository {
    if (!this.poolRepository) {
      this.poolRepository = new ApiPoolRepository();
    }
    return this.poolRepository;
  }

  /**
   * Set custom Route Repository (useful for testing)
   */
  static setRouteRepository(repository: IRouteRepository): void {
    this.routeRepository = repository;
  }

  /**
   * Set custom Compliance Repository (useful for testing)
   */
  static setComplianceRepository(repository: IComplianceRepository): void {
    this.complianceRepository = repository;
  }

  /**
   * Set custom Banking Repository (useful for testing)
   */
  static setBankingRepository(repository: IBankingRepository): void {
    this.bankingRepository = repository;
  }

  /**
   * Set custom Pool Repository (useful for testing)
   */
  static setPoolRepository(repository: IPoolRepository): void {
    this.poolRepository = repository;
  }

  /**
   * Reset all repositories (useful for testing)
   */
  static resetAll(): void {
    this.routeRepository = null as any;
    this.complianceRepository = null as any;
    this.bankingRepository = null as any;
    this.poolRepository = null as any;
  }
}
