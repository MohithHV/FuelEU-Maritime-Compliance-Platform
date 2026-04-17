# FuelEU Maritime - Quick Reference Card

## Import Paths

```typescript
// Domain entities
import {
  Route, RouteFilters,
  Comparison, ComparisonResult,
  ComplianceBalance, AdjustedComplianceBalance,
  BankEntry, BankRequest, ApplyBankedRequest, BankingSummary,
  Pool, PoolMember, CreatePoolRequest, PoolDetails
} from '@/core/domain';

// Port interfaces
import {
  IRouteRepository,
  IComplianceRepository,
  IBankingRepository,
  IPoolRepository
} from '@/core/ports';

// Infrastructure
import {
  apiClient,
  RepositoryFactory,
  ApiRouteRepository,
  ApiComplianceRepository,
  ApiBankingRepository,
  ApiPoolRepository
} from '@/adapters/infrastructure';
```

## Get Repository Instances

```typescript
import { RepositoryFactory } from '@/adapters/infrastructure';

const routeRepo = RepositoryFactory.getRouteRepository();
const complianceRepo = RepositoryFactory.getComplianceRepository();
const bankingRepo = RepositoryFactory.getBankingRepository();
const poolRepo = RepositoryFactory.getPoolRepository();
```

## Common Operations

### Routes

```typescript
// Get all routes
const routes = await routeRepo.getAll();

// Get routes with filters
const routes = await routeRepo.getAll({
  vesselType: 'Container Ship',
  year: 2024
});

// Get single route
const route = await routeRepo.getById(1);

// Set baseline
const route = await routeRepo.setBaseline('ROUTE-001');

// Get comparison
const comparison = await routeRepo.getComparison({ year: 2024 });

// Create route
const newRoute = await routeRepo.create({
  routeId: 'ROUTE-001',
  vesselType: 'Container Ship',
  fuelType: 'HFO',
  year: 2024,
  ghgIntensity: 91.5,
  fuelConsumption: 1000,
  distance: 5000,
  totalEmissions: 50000,
  isBaseline: false
});

// Update route
const updated = await routeRepo.update(1, { ghgIntensity: 90.0 });

// Delete route
const success = await routeRepo.delete(1);
```

### Compliance

```typescript
// Get compliance balance
const cb = await complianceRepo.getComplianceBalance('SHIP-001', 2024);

// Get adjusted compliance balance
const adjustedCb = await complianceRepo.getAdjustedComplianceBalance('SHIP-001', 2024);

// Get all compliance balances
const balances = await complianceRepo.getAll();

// Get with filters
const balances = await complianceRepo.getAll({
  shipId: 'SHIP-001',
  status: 'deficit'
});

// Calculate compliance balance
const cb = await complianceRepo.calculate('SHIP-001', 2024);

// Get summary
const summary = await complianceRepo.getSummary('SHIP-001', 2020, 2024);
```

### Banking

```typescript
// Get bank records
const records = await bankingRepo.getBankRecords('SHIP-001');
const records2024 = await bankingRepo.getBankRecords('SHIP-001', 2024);

// Get banking summary
const summary = await bankingRepo.getBankingSummary('SHIP-001');

// Bank surplus
const entry = await bankingRepo.bankSurplus({
  shipId: 'SHIP-001',
  year: 2024,
  amount: 50.5,
  notes: 'Banking 2024 surplus'
});

// Apply banked balance
const entry = await bankingRepo.applyBanked({
  shipId: 'SHIP-001',
  year: 2025,
  amount: 30.0,
  sourceYear: 2024,
  notes: 'Applying 2024 surplus to 2025 deficit'
});

// Borrow from future
const entry = await bankingRepo.borrowFromFuture({
  shipId: 'SHIP-001',
  year: 2024,
  amount: 20.0,
  notes: 'Borrowing from 2025'
});

// Get available balance
const balance = await bankingRepo.getAvailableBalance('SHIP-001', 2024);

// Get expiring balances
const expiring = await bankingRepo.getExpiringBalances('SHIP-001', 2026);
```

### Pools

```typescript
// Create pool
const pool = await poolRepo.createPool({
  poolName: 'Fleet Alpha Pool 2024',
  year: 2024,
  memberShips: ['SHIP-001', 'SHIP-002', 'SHIP-003'],
  notes: 'Main fleet pool'
});

// Get all pools
const pools = await poolRepo.getAll();

// Get pools with filters
const pools = await poolRepo.getAll({
  year: 2024,
  isActive: true
});

// Get pool details
const details = await poolRepo.getPoolById('POOL-001');

// Get pool by database ID
const pool = await poolRepo.getById(1);

// Add member to pool
const pool = await poolRepo.addMemberToPool('POOL-001', 'SHIP-004');

// Remove member from pool
const pool = await poolRepo.removeMemberFromPool('POOL-001', 'SHIP-004');

// Get pools by ship
const pools = await poolRepo.getPoolsByShip('SHIP-001');
const pools2024 = await poolRepo.getPoolsByShip('SHIP-001', 2024);

// Calculate distribution
const distribution = await poolRepo.calculatePoolDistribution('POOL-001');

// Set pool status
const pool = await poolRepo.setPoolStatus('POOL-001', false);

// Delete pool
const success = await poolRepo.deletePool('POOL-001');
```

## React Component Template

```typescript
import React, { useState, useEffect } from 'react';
import { RepositoryFactory } from '@/adapters/infrastructure';
import { Route } from '@/core/domain';

export const MyComponent: React.FC = () => {
  const [data, setData] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const repo = RepositoryFactory.getRouteRepository();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await repo.getAll();
        setData(result);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.routeId}</div>
      ))}
    </div>
  );
};
```

## Custom Hook Template

```typescript
import { useState, useEffect } from 'react';
import { RepositoryFactory } from '@/adapters/infrastructure';
import { Route } from '@/core/domain';

export const useRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const repo = RepositoryFactory.getRouteRepository();

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const data = await repo.getAll();
      setRoutes(data);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return { routes, loading, error, refetch: fetchRoutes };
};

// Usage:
// const { routes, loading, error, refetch } = useRoutes();
```

## Error Handling

```typescript
try {
  const result = await repo.someMethod();
  // Success
} catch (error: any) {
  if (error.response) {
    // Server error
    console.error('Status:', error.response.status);
    console.error('Message:', error.response.data.message);
  } else if (error.request) {
    // Network error
    console.error('Network error - no response from server');
  } else {
    // Other error
    console.error('Error:', error.message);
  }
}
```

## Environment Variables

```env
# .env file
VITE_API_URL=http://localhost:3001/api

# Production
VITE_API_URL=https://api.fueleu-maritime.com/api
```

## Testing Mock

```typescript
import { IRouteRepository } from '@/core/ports';
import { RepositoryFactory } from '@/adapters/infrastructure';

class MockRouteRepository implements IRouteRepository {
  async getAll() { return []; }
  async getById() { return null; }
  async setBaseline() { return {} as any; }
  async getComparison() { return {} as any; }
  async create() { return {} as any; }
  async update() { return {} as any; }
  async delete() { return true; }
}

// In test setup
beforeEach(() => {
  RepositoryFactory.setRouteRepository(new MockRouteRepository());
});

// In test teardown
afterEach(() => {
  RepositoryFactory.resetAll();
});
```

## Status Types

```typescript
// Compliance status
type ComplianceStatus = 'surplus' | 'deficit' | 'compliant';

// Transaction types
type TransactionType = 'bank' | 'borrow' | 'apply';

// Pool distribution strategies
type DistributionStrategy = 'equal' | 'proportional' | 'custom';
```

## Key Interfaces Summary

### Route
- `routeId`, `vesselType`, `fuelType`, `year`
- `ghgIntensity`, `fuelConsumption`, `distance`, `totalEmissions`
- `isBaseline`

### ComplianceBalance
- `shipId`, `year`
- `baselineGHGIntensity`, `actualGHGIntensity`, `targetGHGIntensity`
- `complianceBalance`, `status`, `penaltyAmount`

### BankEntry
- `shipId`, `year`, `transactionType`
- `amount`, `remainingBalance`, `expiryYear`

### Pool
- `poolId`, `poolName`, `year`
- `memberShips`, `totalSurplus`, `totalDeficit`, `netBalance`
- `isActive`

## API Base URL

Default: `http://localhost:3001/api`

All endpoints are relative to this base URL:
- Routes: `/routes`
- Compliance: `/compliance`
- Banking: `/banking`
- Pools: `/pools`

## TypeScript Tips

```typescript
// Use type inference
const routes = await routeRepo.getAll(); // routes is Route[]

// Use Omit for create operations
const newRoute: Omit<Route, 'id' | 'createdAt' | 'updatedAt'> = {
  routeId: 'ROUTE-001',
  // ... other fields
};

// Use Partial for updates
const updates: Partial<Route> = {
  ghgIntensity: 90.0
};

// Use type guards
if (data && 'routeId' in data) {
  console.log(data.routeId); // TypeScript knows this is a Route
}
```

## Cheat Sheet

| Operation | Repository | Method |
|-----------|-----------|--------|
| Get all routes | RouteRepository | `getAll()` |
| Set baseline | RouteRepository | `setBaseline(routeId)` |
| Get compliance | ComplianceRepository | `getComplianceBalance(shipId, year)` |
| Bank surplus | BankingRepository | `bankSurplus(request)` |
| Create pool | PoolRepository | `createPool(request)` |
| Get available balance | BankingRepository | `getAvailableBalance(shipId, year)` |
| Get pool details | PoolRepository | `getPoolById(poolId)` |

---

**For detailed documentation, see:**
- `ARCHITECTURE.md` - Complete architecture guide
- `USAGE_EXAMPLES.md` - Detailed code examples
- `IMPLEMENTATION_SUMMARY.md` - Implementation overview
