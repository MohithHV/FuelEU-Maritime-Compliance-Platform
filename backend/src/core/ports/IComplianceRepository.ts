import { ShipCompliance } from '../domain/entities/ShipCompliance';

export interface IComplianceRepository {
  findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null>;
  findByYear(year: number): Promise<ShipCompliance[]>;
  create(compliance: Omit<ShipCompliance, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShipCompliance>;
  update(shipId: string, year: number, cbGco2eq: number): Promise<ShipCompliance>;
  upsert(compliance: Omit<ShipCompliance, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShipCompliance>;
}
