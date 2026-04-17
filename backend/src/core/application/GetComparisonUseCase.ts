import { ComparisonResult, RouteComparison } from '../domain/entities/Comparison';
import { IRouteRepository } from '../ports/IRouteRepository';
import { ComplianceCalculator } from '../domain/services/ComplianceCalculator';

export class GetComparisonUseCase {
  constructor(private routeRepository: IRouteRepository) {}

  async execute(): Promise<ComparisonResult> {
    // Get baseline route
    const baseline = await this.routeRepository.findBaseline();
    if (!baseline) {
      throw new Error('No baseline route set. Please set a baseline first.');
    }

    // Get all routes
    const allRoutes = await this.routeRepository.findAll();

    // Filter out the baseline from comparisons
    const comparisonRoutes = allRoutes.filter((r) => r.id !== baseline.id);

    // Get target intensity
    const target = ComplianceCalculator.TARGET_INTENSITY_2025;

    // Calculate comparisons
    const comparisons: RouteComparison[] = comparisonRoutes.map((route) => {
      const percentDiff = ComplianceCalculator.calculatePercentDiff(
        route.ghgIntensity,
        baseline.ghgIntensity
      );
      const compliant = ComplianceCalculator.isCompliant(route.ghgIntensity, target);

      return {
        baseline,
        comparison: route,
        percentDiff,
        compliant,
        target,
      };
    });

    return {
      comparisons,
      target,
    };
  }
}
