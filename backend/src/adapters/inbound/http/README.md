# HTTP Controllers (Inbound Adapters)

This directory contains the Express HTTP controllers that serve as the inbound adapters for the FuelEU Maritime backend application. These controllers handle HTTP requests and delegate business logic to the appropriate use cases.

## Architecture

The controllers follow the Hexagonal Architecture (Ports & Adapters) pattern:
- **Inbound Adapters**: HTTP controllers receive requests from clients
- **Application Layer**: Use cases contain business logic
- **Domain Layer**: Entities and domain services
- **Outbound Adapters**: Repositories interact with the database

## Controllers

### 1. RoutesController

Handles route-related endpoints for managing vessel routes and baseline comparisons.

**Endpoints:**
- `GET /routes` - Get all routes with optional filters
  - Query params: `vesselType`, `fuelType`, `year`
  - Returns: Array of routes

- `POST /routes/:routeId/baseline` - Set a route as baseline
  - Path param: `routeId`
  - Returns: Updated route

- `GET /routes/comparison` - Get baseline vs comparison data
  - Returns: Comparison result with baseline and comparison routes

### 2. ComplianceController

Handles compliance balance calculations for ships.

**Endpoints:**
- `GET /compliance/cb` - Get compliance balance for a ship and year
  - Query params: `shipId` (required), `year` (required)
  - Returns: Compliance balance object

- `GET /compliance/adjusted-cb` - Get adjusted compliance balance after banking
  - Query params: `shipId` (required), `year` (required)
  - Returns: Adjusted compliance balance

### 3. BankingController

Handles banking operations for surplus compliance balance.

**Endpoints:**
- `GET /banking/records` - Get bank records for a ship and year
  - Query params: `shipId` (required), `year` (required)
  - Returns: Array of bank entries

- `POST /banking/bank` - Bank positive compliance balance
  - Body: `{ shipId: string, year: number, amount: number }`
  - Returns: Created bank entry

- `POST /banking/apply` - Apply banked surplus to a specific year
  - Body: `{ shipId: string, year: number, amount: number }`
  - Returns: Updated compliance balance

### 4. PoolingController

Handles compliance pooling operations.

**Endpoints:**
- `POST /pools` - Create a compliance pool
  - Body: `{ year: number, members: [{ shipId: string, cbBefore: number }] }`
  - Returns: Created pool with allocated members

## Middleware

### errorHandler.ts

Provides centralized error handling middleware:
- `errorHandler` - Main error handler that catches all errors
- `notFoundHandler` - Handles 404 Not Found errors
- `asyncHandler` - Wrapper for async route handlers

## Usage

### Setting up the Router

```typescript
import express from 'express';
import { createRouter, errorHandler, notFoundHandler } from './adapters/inbound/http';
import { PrismaRouteRepository } from './adapters/outbound/postgres/PrismaRouteRepository';
import { PrismaComplianceRepository } from './adapters/outbound/postgres/PrismaComplianceRepository';
import { PrismaBankingRepository } from './adapters/outbound/postgres/PrismaBankingRepository';
import { PrismaPoolRepository } from './adapters/outbound/postgres/PrismaPoolRepository';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize repositories
const repositories = {
  routeRepository: new PrismaRouteRepository(),
  complianceRepository: new PrismaComplianceRepository(),
  bankingRepository: new PrismaBankingRepository(),
  poolRepository: new PrismaPoolRepository(),
};

// Mount API routes
const apiRouter = createRouter(repositories);
app.use('/api', apiRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Request/Response Examples

### GET /api/routes?vesselType=Container&year=2025

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "routeId": "R001",
      "vesselType": "Container",
      "fuelType": "HFO",
      "year": 2025,
      "ghgIntensity": 85.5,
      "fuelConsumption": 12000,
      "distance": 5000,
      "totalEmissions": 427500,
      "isBaseline": false,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### POST /api/routes/R001/baseline

**Response:**
```json
{
  "success": true,
  "message": "Route R001 set as baseline",
  "data": {
    "id": 1,
    "routeId": "R001",
    "isBaseline": true,
    ...
  }
}
```

### GET /api/compliance/cb?shipId=SHIP001&year=2025

**Response:**
```json
{
  "success": true,
  "data": {
    "shipId": "SHIP001",
    "year": 2025,
    "cbBefore": 15000,
    "applied": 0,
    "cbAfter": 15000
  }
}
```

### POST /api/banking/bank

**Request:**
```json
{
  "shipId": "SHIP001",
  "year": 2025,
  "amount": 5000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully banked 5000 gCO2eq for ship SHIP001 in year 2025",
  "data": {
    "id": 1,
    "shipId": "SHIP001",
    "year": 2025,
    "amountGco2eq": 5000,
    "isApplied": false,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### POST /api/pools

**Request:**
```json
{
  "year": 2025,
  "members": [
    { "shipId": "SHIP001", "cbBefore": 15000 },
    { "shipId": "SHIP002", "cbBefore": -10000 }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully created pool for year 2025 with 2 members",
  "data": {
    "id": 1,
    "year": 2025,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "members": [
      {
        "id": 1,
        "poolId": 1,
        "shipId": "SHIP001",
        "cbBefore": 15000,
        "cbAfter": 2500
      },
      {
        "id": 2,
        "poolId": 1,
        "shipId": "SHIP002",
        "cbBefore": -10000,
        "cbAfter": 2500
      }
    ]
  }
}
```

## Error Responses

All controllers return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created (for POST requests that create resources)
- `400` - Bad Request (validation errors, business logic errors)
- `404` - Not Found (resource not found)
- `500` - Internal Server Error (unexpected errors)

## Validation

All controllers use `express-validator` for input validation:
- Query parameters are validated for type and format
- Request bodies are validated for required fields and types
- Validation errors return 400 status with detailed error messages

## Dependency Injection

The controllers use constructor-based dependency injection for better testability:
- Use cases are injected into controllers
- Repositories are injected into the router factory
- Easy to mock dependencies for unit testing

## Testing

Each controller can be tested independently by mocking the use cases:

```typescript
import { RoutesController } from './RoutesController';
import { GetAllRoutesUseCase } from '../../../core/application/GetAllRoutesUseCase';

// Mock the use case
const mockGetAllRoutesUseCase = {
  execute: jest.fn().mockResolvedValue([/* mock routes */]),
};

const controller = new RoutesController(
  mockGetAllRoutesUseCase as any,
  // ... other mocked use cases
);

// Test the controller methods
```

## Best Practices

1. **Keep controllers thin** - Business logic belongs in use cases
2. **Use validation middleware** - Validate all inputs before processing
3. **Handle errors consistently** - Use the centralized error handler
4. **Return appropriate status codes** - Follow HTTP conventions
5. **Use TypeScript types** - Leverage type safety for request/response objects
6. **Async/await** - Use async/await for cleaner asynchronous code
7. **Dependency injection** - Inject dependencies for better testability
