import { Route } from '../domain/entities/Route';
import { IRouteRepository } from '../ports/IRouteRepository';

export class SetBaselineRouteUseCase {
  constructor(private routeRepository: IRouteRepository) {}

  async execute(routeId: string): Promise<Route> {
    // Verify route exists
    const route = await this.routeRepository.findByRouteId(routeId);
    if (!route) {
      throw new Error(`Route with ID ${routeId} not found`);
    }

    // Set as baseline (repository handles clearing other baselines)
    return await this.routeRepository.setBaseline(routeId);
  }
}
