import { ShipCompliance, ComplianceBalance } from '../domain/entities/ShipCompliance';
import { IComplianceRepository } from '../ports/IComplianceRepository';
import { IBankingRepository } from '../ports/IBankingRepository';
import { ComplianceCalculator } from '../domain/services/ComplianceCalculator';

export class ComputeComplianceBalanceUseCase {
  constructor(
    private complianceRepository: IComplianceRepository,
    private bankingRepository: IBankingRepository
  ) {}

  /**
   * Compute and return CB for a ship/year
   * This would typically calculate based on actual route data,
   * but for this assignment we'll use the seeded compliance data
   */
  async execute(shipId: string, year: number): Promise<ComplianceBalance> {
    // Get or create compliance record
    let compliance = await this.complianceRepository.findByShipAndYear(shipId, year);

    if (!compliance) {
      // In a real system, we'd calculate this from route data
      // For now, return a default zero balance
      compliance = await this.complianceRepository.create({
        shipId,
        year,
        cbGco2eq: 0,
      });
    }

    const cbBefore = compliance.cbGco2eq;

    return {
      shipId,
      year,
      cbBefore,
      applied: 0,
      cbAfter: cbBefore,
    };
  }

  /**
   * Get adjusted CB (after banking applications)
   */
  async executeAdjusted(shipId: string, year: number): Promise<ComplianceBalance> {
    const baseCb = await this.execute(shipId, year);

    // Get applied banking entries
    const bankEntries = await this.bankingRepository.findByShipAndYear(shipId, year);
    const applied = bankEntries
      .filter((entry) => entry.isApplied)
      .reduce((sum, entry) => sum + entry.amountGco2eq, 0);

    return {
      ...baseCb,
      applied,
      cbAfter: baseCb.cbBefore + applied,
    };
  }
}
