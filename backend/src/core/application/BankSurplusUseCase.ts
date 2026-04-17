import { BankEntry } from '../domain/entities/BankEntry';
import { IBankingRepository } from '../ports/IBankingRepository';
import { IComplianceRepository } from '../ports/IComplianceRepository';

export class BankSurplusUseCase {
  constructor(
    private bankingRepository: IBankingRepository,
    private complianceRepository: IComplianceRepository
  ) {}

  async execute(shipId: string, year: number, amount: number): Promise<BankEntry> {
    // Validate amount is positive
    if (amount <= 0) {
      throw new Error('Banking amount must be positive');
    }

    // Get current compliance balance
    const compliance = await this.complianceRepository.findByShipAndYear(shipId, year);
    if (!compliance) {
      throw new Error(`No compliance data found for ship ${shipId} in year ${year}`);
    }

    // Validate ship has surplus
    if (compliance.cbGco2eq <= 0) {
      throw new Error(`Ship ${shipId} has no surplus to bank (CB: ${compliance.cbGco2eq})`);
    }

    // Validate amount doesn't exceed available surplus
    if (amount > compliance.cbGco2eq) {
      throw new Error(
        `Amount ${amount} exceeds available surplus ${compliance.cbGco2eq}`
      );
    }

    // Create bank entry
    const bankEntry = await this.bankingRepository.create({
      shipId,
      year,
      amountGco2eq: amount,
      isApplied: false,
    });

    // Update compliance balance
    await this.complianceRepository.update(shipId, year, compliance.cbGco2eq - amount);

    return bankEntry;
  }
}
