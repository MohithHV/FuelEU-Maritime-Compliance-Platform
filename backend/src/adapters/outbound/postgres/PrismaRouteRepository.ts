import { PrismaClient } from '@prisma/client';
import { IRouteRepository } from '../../../core/ports/IRouteRepository';
import { Route, RouteFilters } from '../../../core/domain/entities/Route';

export class PrismaRouteRepository implements IRouteRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(filters?: RouteFilters): Promise<Route[]> {
    const where: Record<string, unknown> = {};

    if (filters?.vesselType) {
      where.vesselType = filters.vesselType;
    }
    if (filters?.fuelType) {
      where.fuelType = filters.fuelType;
    }
    if (filters?.year) {
      where.year = filters.year;
    }

    return await this.prisma.route.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number): Promise<Route | null> {
    return await this.prisma.route.findUnique({
      where: { id },
    });
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    return await this.prisma.route.findUnique({
      where: { routeId },
    });
  }

  async findBaseline(): Promise<Route | null> {
    return await this.prisma.route.findFirst({
      where: { isBaseline: true },
    });
  }

  async setBaseline(routeId: string): Promise<Route> {
    // First, unset all baselines
    await this.prisma.route.updateMany({
      where: { isBaseline: true },
      data: { isBaseline: false },
    });

    // Then set the new baseline
    return await this.prisma.route.update({
      where: { routeId },
      data: { isBaseline: true },
    });
  }

  async create(route: Omit<Route, 'id' | 'createdAt' | 'updatedAt'>): Promise<Route> {
    return await this.prisma.route.create({
      data: route,
    });
  }

  async update(id: number, route: Partial<Route>): Promise<Route> {
    return await this.prisma.route.update({
      where: { id },
      data: route,
    });
  }
}
