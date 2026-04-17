import { Route, RouteFilters } from '../domain/entities/Route';
import { IRouteRepository } from '../ports/IRouteRepository';

export class GetAllRoutesUseCase {
  constructor(private routeRepository: IRouteRepository) {}

  async execute(filters?: RouteFilters): Promise<Route[]> {
    return await this.routeRepository.findAll(filters);
  }
}
