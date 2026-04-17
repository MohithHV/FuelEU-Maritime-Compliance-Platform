import { ComplianceBalance } from '../domain/entities/ShipCompliance';
import { IBankingRepository } from '../ports/IBankingRepository';
import { IComplianceRepository } from '../ports/IComplianceRepository';

export class ApplyBankedSurplusUseCase {
  constructor(
    private bankingRepository: IBankingRepository,
    private complianceRepository: IComplianceRepository
  ) {}

  async execute(shipId: string, year: number, amount: number): Promise<ComplianceBalance> {
    // Validate amount is positive
    if (amount <= 0) {
      throw new Error('Apply amount must be positive');
    }

    // Get available banked balance
    const unapplied = await this.bankingRepository.findUnapplied(shipId);
    const availableBalance = unapplied.reduce((sum, entry) => sum + entry.amountGco2eq, 0);

    if (availableBalance < amount) {
      throw new Error(
        `Insufficient banked balance. Available: ${availableBalance}, Requested: ${amount}`
      );
    }

    // Get current compliance
    const compliance = await this.complianceRepository.findByShipAndYear(shipId, year);
    if (!compliance) {
      throw new Error(`No compliance data found for ship ${shipId} in year ${year}`);
    }

    const cbBefore = compliance.cbGco2eq;

    // Apply banked amount
    let remaining = amount;
    for (const entry of unapplied) {
      if (remaining <= 0) break;

      if (entry.amountGco2eq <= remaining) {
        await this.bankingRepository.markAsApplied(entry.id);
        remaining -= entry.amountGco2eq;
      } else {
        // Partial application - in a real system we'd split the entry
        // For simplicity, we'll apply the whole entry if it fits
        break;
      }
    }

    const applied = amount - remaining;

    // Update compliance balance
    const cbAfter = cbBefore + applied;
    await this.complianceRepository.update(shipId, year, cbAfter);

    return {
      shipId,
      year,
      cbBefore,
      applied,
      cbAfter,
    };
  }
}
