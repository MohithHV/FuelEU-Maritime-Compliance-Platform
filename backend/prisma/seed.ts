import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.poolMember.deleteMany();
  await prisma.pool.deleteMany();
  await prisma.bankEntry.deleteMany();
  await prisma.shipCompliance.deleteMany();
  await prisma.route.deleteMany();

  // Seed routes with provided KPIs data
  const routes = [
    {
      routeId: 'R001',
      vesselType: 'Container',
      fuelType: 'HFO',
      year: 2024,
      ghgIntensity: 91.0,
      fuelConsumption: 5000,
      distance: 10000,
      totalEmissions: 5000 * 3.114, // Approximate CO2 factor for HFO
      isBaseline: true, // Set R001 as baseline
    },
    {
      routeId: 'R002',
      vesselType: 'BulkCarrier',
      fuelType: 'LNG',
      year: 2024,
      ghgIntensity: 88.0,
      fuelConsumption: 4800,
      distance: 9500,
      totalEmissions: 4800 * 2.75, // Approximate CO2 factor for LNG
      isBaseline: false,
    },
    {
      routeId: 'R003',
      vesselType: 'Tanker',
      fuelType: 'MGO',
      year: 2024,
      ghgIntensity: 93.5,
      fuelConsumption: 5100,
      distance: 10500,
      totalEmissions: 5100 * 3.206, // Approximate CO2 factor for MGO
      isBaseline: false,
    },
    {
      routeId: 'R004',
      vesselType: 'RoRo',
      fuelType: 'HFO',
      year: 2025,
      ghgIntensity: 89.2,
      fuelConsumption: 4900,
      distance: 9800,
      totalEmissions: 4900 * 3.114,
      isBaseline: false,
    },
    {
      routeId: 'R005',
      vesselType: 'Container',
      fuelType: 'LNG',
      year: 2025,
      ghgIntensity: 90.5,
      fuelConsumption: 4950,
      distance: 10200,
      totalEmissions: 4950 * 2.75,
      isBaseline: false,
    },
  ];

  for (const route of routes) {
    await prisma.route.create({
      data: route,
    });
  }

  console.log('✓ Seeded 5 routes');

  // Seed ship compliance data for the ships
  const shipComplianceData = [
    { shipId: 'SHIP001', year: 2024, cbGco2eq: 150000 }, // Surplus
    { shipId: 'SHIP002', year: 2024, cbGco2eq: -80000 }, // Deficit
    { shipId: 'SHIP003', year: 2024, cbGco2eq: 200000 }, // Surplus
    { shipId: 'SHIP004', year: 2025, cbGco2eq: -50000 }, // Deficit
  ];

  for (const compliance of shipComplianceData) {
    await prisma.shipCompliance.create({
      data: compliance,
    });
  }

  console.log('✓ Seeded ship compliance data');

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
