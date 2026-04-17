import { PoolMemberInput, PoolValidationResult, PoolMember } from '../entities/Pool';

/**
 * Pooling Service
 * Implements Fuel EU Article 21 – Pooling logic
 */

export class PoolingService {
  /**
   * Validate pool creation rules:
   * 1. Sum(adjustedCB) ≥ 0
   * 2. Deficit ship cannot exit worse
   * 3. Surplus ship cannot exit negative
   */
  static validatePool(members: PoolMemberInput[]): PoolValidationResult {
    const errors: string[] = [];

    if (members.length < 2) {
      errors.push('Pool must have at least 2 members');
    }

    // Calculate total CB
    const poolSum = members.reduce((sum, member) => sum + member.cbBefore, 0);

    // Rule 1: Sum must be >= 0
    if (poolSum < 0) {
      errors.push(`Pool sum is negative (${poolSum.toFixed(2)} gCO₂e). Cannot create pool with deficit.`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      poolSum,
    };
  }

  /**
   * Allocate CB across pool members using greedy algorithm
   * - Sort members desc by CB
   * - Transfer surplus to deficits
   * - Ensure deficit ships don't exit worse
   * - Ensure surplus ships don't exit negative
   */
  static allocatePool(members: PoolMemberInput[]): Omit<PoolMember, 'id' | 'poolId'>[] {
    // Sort members by CB descending (surplus first)
    const sorted = [...members].sort((a, b) => b.cbBefore - a.cbBefore);

    // Separate surplus and deficit members
    const surplusMembers = sorted.filter((m) => m.cbBefore > 0);
    const deficitMembers = sorted.filter((m) => m.cbBefore < 0);

    // If all surplus or all deficit, no redistribution needed
    if (surplusMembers.length === 0 || deficitMembers.length === 0) {
      return members.map((m) => ({
        shipId: m.shipId,
        cbBefore: m.cbBefore,
        cbAfter: m.cbBefore,
      }));
    }

    // Initialize cbAfter values
    const result = members.map((m) => ({
      shipId: m.shipId,
      cbBefore: m.cbBefore,
      cbAfter: m.cbBefore,
    }));

    // Greedy allocation: distribute surplus to cover deficits
    for (const deficit of deficitMembers) {
      const deficitResult = result.find((r) => r.shipId === deficit.shipId);
      if (!deficitResult) continue;

      let remaining = Math.abs(deficitResult.cbAfter); // How much deficit needs to be covered

      for (const surplus of surplusMembers) {
        if (remaining <= 0) break;

        const surplusResult = result.find((r) => r.shipId === surplus.shipId);
        if (!surplusResult || surplusResult.cbAfter <= 0) continue;

        // Transfer as much as possible without making surplus negative
        const transfer = Math.min(surplusResult.cbAfter, remaining);
        surplusResult.cbAfter -= transfer;
        deficitResult.cbAfter += transfer;
        remaining -= transfer;
      }
    }

    // Validate rules
    for (const member of result) {
      const original = members.find((m) => m.shipId === member.shipId);
      if (!original) continue;

      // Deficit ship cannot exit worse
      if (original.cbBefore < 0 && member.cbAfter < original.cbBefore) {
        member.cbAfter = original.cbBefore;
      }

      // Surplus ship cannot exit negative
      if (original.cbBefore > 0 && member.cbAfter < 0) {
        member.cbAfter = 0;
      }
    }

    return result;
  }
}
