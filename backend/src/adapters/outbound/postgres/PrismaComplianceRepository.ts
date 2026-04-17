import { PrismaClient } from '@prisma/client';
import { IComplianceRepository } from '../../../core/ports/IComplianceRepository';
import { ShipCompliance } from '../../../core/domain/entities/ShipCompliance';

export class PrismaComplianceRepository implements IComplianceRepository {
  constructor(private prisma: PrismaClient) {}

  async findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null> {
    return await this.prisma.shipCompliance.findUnique({
      where: {
        shipId_year: {
          shipId,
          year,
        },
      },
    });
  }

  async findByYear(year: number): Promise<ShipCompliance[]> {
    return await this.prisma.shipCompliance.findMany({
      where: { year },
    });
  }

  async create(
    compliance: Omit<ShipCompliance, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ShipCompliance> {
    return await this.prisma.shipCompliance.create({
      data: compliance,
    });
  }

  async update(shipId: string, year: number, cbGco2eq: number): Promise<ShipCompliance> {
    return await this.prisma.shipCompliance.update({
      where: {
        shipId_year: {
          shipId,
          year,
        },
      },
      data: { cbGco2eq },
    });
  }

  async upsert(
    compliance: Omit<ShipCompliance, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ShipCompliance> {
    return await this.prisma.shipCompliance.upsert({
      where: {
        shipId_year: {
          shipId: compliance.shipId,
          year: compliance.year,
        },
      },
      update: {
        cbGco2eq: compliance.cbGco2eq,
      },
      create: compliance,
    });
  }
}
