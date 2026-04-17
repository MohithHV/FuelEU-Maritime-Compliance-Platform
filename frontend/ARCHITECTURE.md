# FuelEU Maritime Frontend - Architecture Documentation

## Overview

This frontend application follows **Clean Architecture** principles with **Hexagonal Architecture** (Ports and Adapters) pattern. The codebase is organized into three main layers:

1. **Domain Layer** (`src/core/domain/`) - Business entities and types
2. **Ports Layer** (`src/core/ports/`) - Interface definitions (contracts)
3. **Infrastructure Layer** (`src/adapters/infrastructure/`) - External implementations

## Directory Structure

```
src/
├── core/
│   ├── domain/              # Domain entities (business models)
│   │   ├── Route.ts
│   │   ├── Comparison.ts
│   │   ├── ComplianceBalance.ts
│   │   ├── BankEntry.ts
│   │   ├── Pool.ts
│   │   └── index.ts
│   ├── ports/               # Port interfaces (contracts)
│   │   ├── IRouteRepository.ts
│   │   ├── IComplianceRepository.ts
│   │   ├── IBankingRepository.ts
│   │   ├── IPoolRepository.ts
│   │   └── index.ts
│   └── application/         # Use cases / business logic
└── adapters/
    ├── infrastructure/      # Infrastructure implementations
    │   ├── apiClient.ts
    │   ├── ApiRouteRepository.ts
    │   ├── ApiComplianceRepository.ts
    │   ├── ApiBankingRepository.ts
    │   ├── ApiPoolRepository.ts
    │   ├── RepositoryFactory.ts
    │   └── index.ts
    └── ui/                  # UI components (React)
```

## Domain Entities

### Route
Represents a maritime route with fuel consumption and emissions data.

```typescript
interface Route {
  id: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### ComplianceBalance
Represents the compliance balance calculation for a ship in a given year.

```typescript
interface ComplianceBalance {
  shipId: string;
  year: number;
  baselineGHGIntensity: number;
  actualGHGIntensity: number;
  targetGHGIntensity: number;
  complianceBalance: number;
  status: 'surplus' | 'deficit' | 'compliant';
  penaltyAmount?: number;
}
```

### BankEntry
Represents banking and borrowing transactions for compliance balances.

```typescript
interface BankEntry {
  id: number;
  shipId: string;
  year: number;
  transactionType: 'bank' | 'borrow' | 'apply';
  amount: number;
  remainingBalance: number;
  expiryYear?: number;
  notes?: string;
}
```

### Pool
Represents a compliance pool where multiple ships pool their balances.

```typescript
interface Pool {
  id: number;
  poolId: string;
  poolName: string;
  year: number;
  memberShips: string[];
  totalSurplus: number;
  totalDeficit: number;
  netBalance: number;
  isActive: boolean;
}
```

## Repository Interfaces (Ports)

### IRouteRepository
```typescript
interface IRouteRepository {
  getAll(filters?: RouteFilters): Promise<Route[]>;
  getById(id: number): Promise<Route | null>;
  setBaseline(routeId: string): Promise<Route>;
  getComparison(filters?: RouteFilters): Promise<ComparisonResult>;
  create(route: Omit<Route, 'id' | 'createdAt' | 'updatedAt'>): Promise<Route>;
  update(id: number, route: Partial<Route>): Promise<Route>;
  delete(id: number): Promise<boolean>;
}
```

### IComplianceRepository
```typescript
interface IComplianceRepository {
  getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance>;
  getAdjustedComplianceBalance(shipId: string, year: number): Promise<AdjustedComplianceBalance>;
  getAll(filters?: ComplianceBalanceFilters): Promise<ComplianceBalance[]>;
  calculate(shipId: string, year: number): Promise<ComplianceBalance>;
  getSummary(shipId: string, startYear: number, endYear: number): Promise<Summary>;
}
```

### IBankingRepository
```typescript
interface IBankingRepository {
  getBankRecords(shipId: string, year?: number): Promise<BankEntry[]>;
  getBankingSummary(shipId: string): Promise<BankingSummary>;
  bankSurplus(request: BankRequest): Promise<BankEntry>;
  applyBanked(request: ApplyBankedRequest): Promise<BankEntry>;
  borrowFromFuture(request: BankRequest): Promise<BankEntry>;
  getAvailableBalance(shipId: string, asOfYear: number): Promise<number>;
  getExpiringBalances(shipId: string, year: number): Promise<BankEntry[]>;
}
```

### IPoolRepository
```typescript
interface IPoolRepository {
  createPool(request: CreatePoolRequest): Promise<Pool>;
  getAll(filters?: PoolFilters): Promise<Pool[]>;
  getPoolById(poolId: string): Promise<PoolDetails | null>;
  addMemberToPool(poolId: string, shipId: string): Promise<Pool>;
  removeMemberFromPool(poolId: string, shipId: string): Promise<Pool>;
  getPoolsByShip(shipId: string, year?: number): Promise<Pool[]>;
  calculatePoolDistribution(poolId: string): Promise<PoolMember[]>;
  setPoolStatus(poolId: string, isActive: boolean): Promise<Pool>;
  deletePool(poolId: string): Promise<boolean>;
}
```

## API Client

The API client is built using Axios and includes:

- Base URL configuration from environment variables
- Request interceptors for authentication
- Response interceptors for error handling
- Automatic token management
- Common error handling (401, 403, 404, 500)

```typescript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
```

## Repository Factory

The `RepositoryFactory` provides singleton instances of all repositories and allows for dependency injection:

```typescript
// Usage in React components or services
import { RepositoryFactory } from '@/adapters/infrastructure';

const routeRepo = RepositoryFactory.getRouteRepository();
const routes = await routeRepo.getAll();
```

### Benefits of Factory Pattern:
1. **Singleton instances** - Prevents multiple instances of repositories
2. **Easy testing** - Can inject mock repositories for unit tests
3. **Loose coupling** - Components depend on interfaces, not implementations
4. **Flexibility** - Easy to swap implementations without changing consuming code

## API Endpoints Mapping

### Routes
- `GET /routes` - Get all routes with filters
- `GET /routes/:id` - Get route by ID
- `POST /routes` - Create new route
- `PUT /routes/:id` - Update route
- `DELETE /routes/:id` - Delete route
- `POST /routes/:routeId/baseline` - Set route as baseline
- `GET /routes/comparison` - Get comparison results

### Compliance
- `GET /compliance/cb?shipId=X&year=Y` - Get compliance balance
- `GET /compliance/adjusted-cb?shipId=X&year=Y` - Get adjusted compliance balance
- `GET /compliance?filters` - Get all compliance balances
- `POST /compliance/calculate` - Calculate compliance balance
- `GET /compliance/summary?shipId=X&startYear=Y&endYear=Z` - Get compliance summary

### Banking
- `GET /banking/records?shipId=X&year=Y` - Get bank records
- `GET /banking/summary?shipId=X` - Get banking summary
- `POST /banking/bank` - Bank surplus
- `POST /banking/apply` - Apply banked balance
- `POST /banking/borrow` - Borrow from future
- `GET /banking/available-balance?shipId=X&asOfYear=Y` - Get available balance
- `GET /banking/expiring?shipId=X&year=Y` - Get expiring balances

### Pools
- `POST /pools` - Create pool
- `GET /pools?filters` - Get all pools
- `GET /pools/:poolId/details` - Get pool details
- `GET /pools/:id` - Get pool by ID
- `POST /pools/:poolId/members` - Add member to pool
- `DELETE /pools/:poolId/members/:shipId` - Remove member from pool
- `GET /pools/ship?shipId=X&year=Y` - Get pools by ship
- `GET /pools/:poolId/distribution` - Calculate pool distribution
- `PATCH /pools/:poolId/status` - Set pool status
- `DELETE /pools/:poolId` - Delete pool

## Usage Examples

### Fetching Routes
```typescript
import { RepositoryFactory } from '@/adapters/infrastructure';

const routeRepo = RepositoryFactory.getRouteRepository();

// Get all routes
const routes = await routeRepo.getAll();

// Get routes with filters
const filteredRoutes = await routeRepo.getAll({
  vesselType: 'Container Ship',
  year: 2024
});

// Set baseline
const baselineRoute = await routeRepo.setBaseline('ROUTE-001');

// Get comparison
const comparison = await routeRepo.getComparison({ year: 2024 });
```

### Working with Compliance
```typescript
import { RepositoryFactory } from '@/adapters/infrastructure';

const complianceRepo = RepositoryFactory.getComplianceRepository();

// Get compliance balance
const cb = await complianceRepo.getComplianceBalance('SHIP-001', 2024);

// Get adjusted balance (with banking/pooling applied)
const adjustedCb = await complianceRepo.getAdjustedComplianceBalance('SHIP-001', 2024);

// Get summary across years
const summary = await complianceRepo.getSummary('SHIP-001', 2020, 2024);
```

### Banking Operations
```typescript
import { RepositoryFactory } from '@/adapters/infrastructure';

const bankingRepo = RepositoryFactory.getBankingRepository();

// Bank surplus
await bankingRepo.bankSurplus({
  shipId: 'SHIP-001',
  year: 2024,
  amount: 50.5,
  notes: 'Banking 2024 surplus'
});

// Apply banked balance
await bankingRepo.applyBanked({
  shipId: 'SHIP-001',
  year: 2025,
  amount: 30.0,
  sourceYear: 2024,
  notes: 'Applying 2024 banked surplus to 2025 deficit'
});

// Get available balance
const balance = await bankingRepo.getAvailableBalance('SHIP-001', 2024);
```

### Pool Management
```typescript
import { RepositoryFactory } from '@/adapters/infrastructure';

const poolRepo = RepositoryFactory.getPoolRepository();

// Create pool
const pool = await poolRepo.createPool({
  poolName: 'Fleet Alpha Pool 2024',
  year: 2024,
  memberShips: ['SHIP-001', 'SHIP-002', 'SHIP-003']
});

// Get pool details
const details = await poolRepo.getPoolById(pool.poolId);

// Calculate distribution
const distribution = await poolRepo.calculatePoolDistribution(pool.poolId);
```

## Environment Configuration

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3001/api
```

For production:

```env
VITE_API_URL=https://api.fueleu-maritime.com/api
```

## Testing

The architecture supports easy testing through dependency injection:

```typescript
// Mock repository for testing
class MockRouteRepository implements IRouteRepository {
  async getAll(): Promise<Route[]> {
    return [/* mock data */];
  }
  // ... implement other methods
}

// Inject mock in tests
RepositoryFactory.setRouteRepository(new MockRouteRepository());
```

## Benefits of This Architecture

1. **Separation of Concerns** - Clear boundaries between layers
2. **Testability** - Easy to mock dependencies
3. **Flexibility** - Can swap implementations without changing business logic
4. **Maintainability** - Each layer has a single responsibility
5. **Type Safety** - Full TypeScript support with strict typing
6. **Scalability** - Easy to add new features following the same pattern

## Next Steps

1. Implement use cases in `src/core/application/`
2. Create React components in `src/adapters/ui/`
3. Add state management (React Query, Redux, or Context)
4. Implement error boundaries and loading states
5. Add comprehensive unit and integration tests
