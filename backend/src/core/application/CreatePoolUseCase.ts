import { Pool, CreatePoolRequest } from '../domain/entities/Pool';
import { IPoolRepository } from '../ports/IPoolRepository';
import { IComplianceRepository } from '../ports/IComplianceRepository';
import { PoolingService } from '../domain/services/PoolingService';

export class CreatePoolUseCase {
  constructor(
    private poolRepository: IPoolRepository,
    private complianceRepository: IComplianceRepository
  ) {}

  async execute(request: CreatePoolRequest): Promise<Pool> {
    // Validate pool
    const validation = PoolingService.validatePool(request.members);

    if (!validation.isValid) {
      throw new Error(`Pool validation failed: ${validation.errors.join(', ')}`);
    }

    // Allocate CB across members
    const allocatedMembers = PoolingService.allocatePool(request.members);

    // Create pool with allocated members
    const pool = await this.poolRepository.create(request.year, allocatedMembers);

    // Update ship compliance records with new CB values
    for (const member of allocatedMembers) {
      await this.complianceRepository.upsert({
        shipId: member.shipId,
        year: request.year,
        cbGco2eq: member.cbAfter,
      });
    }

    return pool;
  }
}
