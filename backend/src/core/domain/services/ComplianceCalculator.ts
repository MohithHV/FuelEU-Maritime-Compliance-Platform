/**
 * Compliance Calculator Service
 * Implements Fuel EU Maritime compliance formulas
 */

export class ComplianceCalculator {
  // Target Intensity for 2025 = 89.3368 gCO₂e/MJ (2% below 91.16)
  public static readonly TARGET_INTENSITY_2025 = 89.3368;

  // Energy conversion factor: ~41,000 MJ/ton of fuel
  public static readonly ENERGY_CONVERSION_FACTOR = 41000;

  /**
   * Calculate Compliance Balance (CB)
   * Formula: CB = (Target - Actual) × Energy in scope
   * Positive CB → Surplus; Negative → Deficit
   */
  static calculateComplianceBalance(
    actualGhgIntensity: number,
    fuelConsumption: number,
    targetIntensity: number = ComplianceCalculator.TARGET_INTENSITY_2025
  ): number {
    const energyInScope = fuelConsumption * ComplianceCalculator.ENERGY_CONVERSION_FACTOR;
    const cb = (targetIntensity - actualGhgIntensity) * energyInScope;
    return cb;
  }

  /**
   * Calculate percent difference between comparison and baseline
   * Formula: percentDiff = ((comparison / baseline) − 1) × 100
   */
  static calculatePercentDiff(comparisonIntensity: number, baselineIntensity: number): number {
    if (baselineIntensity === 0) {
      throw new Error('Baseline intensity cannot be zero');
    }
    return ((comparisonIntensity / baselineIntensity) - 1) * 100;
  }

  /**
   * Check if a route is compliant
   * Compliant if ghgIntensity <= target
   */
  static isCompliant(ghgIntensity: number, target: number): boolean {
    return ghgIntensity <= target;
  }

  /**
   * Get target intensity for a given year
   */
  static getTargetIntensity(year: number): number {
    // For this assignment, we'll use the 2025 target
    // In a real implementation, this would vary by year
    if (year >= 2025) {
      return ComplianceCalculator.TARGET_INTENSITY_2025;
    }
    // Default to a higher baseline for earlier years
    return 91.16; // 2024 baseline
  }

  /**
   * Calculate energy in scope
   */
  static calculateEnergyInScope(fuelConsumption: number): number {
    return fuelConsumption * ComplianceCalculator.ENERGY_CONVERSION_FACTOR;
  }
}
