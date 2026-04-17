# FuelEU Maritime - Usage Examples

This document provides practical examples of how to use the domain entities, ports, and infrastructure in your React components.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [React Component Examples](#react-component-examples)
3. [Custom Hooks](#custom-hooks)
4. [Error Handling](#error-handling)
5. [TypeScript Best Practices](#typescript-best-practices)

## Basic Setup

### Import Repositories

```typescript
import { RepositoryFactory } from '@/adapters/infrastructure';

// Get repository instances
const routeRepo = RepositoryFactory.getRouteRepository();
const complianceRepo = RepositoryFactory.getComplianceRepository();
const bankingRepo = RepositoryFactory.getBankingRepository();
const poolRepo = RepositoryFactory.getPoolRepository();
```

## React Component Examples

### Example 1: Route List Component

```typescript
import React, { useState, useEffect } from 'react';
import { RepositoryFactory } from '@/adapters/infrastructure';
import { Route, RouteFilters } from '@/core/domain';

export const RouteList: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RouteFilters>({});

  const routeRepo = RepositoryFactory.getRouteRepository();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const data = await routeRepo.getAll(filters);
        setRoutes(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch routes');
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [filters]);

  const handleSetBaseline = async (routeId: string) => {
    try {
      await routeRepo.setBaseline(routeId);
      // Refresh routes list
      const data = await routeRepo.getAll(filters);
      setRoutes(data);
    } catch (err: any) {
      alert('Failed to set baseline: ' + err.message);
    }
  };

  if (loading) return <div>Loading routes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Routes</h1>

      {/* Filters */}
      <div>
        <select onChange={(e) => setFilters({ ...filters, vesselType: e.target.value })}>
          <option value="">All Vessel Types</option>
          <option value="Container Ship">Container Ship</option>
          <option value="Bulk Carrier">Bulk Carrier</option>
          <option value="Tanker">Tanker</option>
        </select>

        <input
          type="number"
          placeholder="Year"
          onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) || undefined })}
        />
      </div>

      {/* Routes Table */}
      <table>
        <thead>
          <tr>
            <th>Route ID</th>
            <th>Vessel Type</th>
            <th>Fuel Type</th>
            <th>Year</th>
            <th>GHG Intensity</th>
            <th>Baseline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id}>
              <td>{route.routeId}</td>
              <td>{route.vesselType}</td>
              <td>{route.fuelType}</td>
              <td>{route.year}</td>
              <td>{route.ghgIntensity.toFixed(2)}</td>
              <td>{route.isBaseline ? 'Yes' : 'No'}</td>
              <td>
                {!route.isBaseline && (
                  <button onClick={() => handleSetBaseline(route.routeId)}>
                    Set as Baseline
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### Example 2: Compliance Balance Dashboard

```typescript
import React, { useState, useEffect } from 'react';
import { RepositoryFactory } from '@/adapters/infrastructure';
import { ComplianceBalance, AdjustedComplianceBalance } from '@/core/domain';

interface Props {
  shipId: string;
  year: number;
}

export const ComplianceDashboard: React.FC<Props> = ({ shipId, year }) => {
  const [cb, setCb] = useState<ComplianceBalance | null>(null);
  const [adjustedCb, setAdjustedCb] = useState<AdjustedComplianceBalance | null>(null);
  const [loading, setLoading] = useState(true);

  const complianceRepo = RepositoryFactory.getComplianceRepository();

  useEffect(() => {
    const fetchCompliance = async () => {
      try {
        setLoading(true);
        const [cbData, adjustedData] = await Promise.all([
          complianceRepo.getComplianceBalance(shipId, year),
          complianceRepo.getAdjustedComplianceBalance(shipId, year)
        ]);
        setCb(cbData);
        setAdjustedCb(adjustedData);
      } catch (err: any) {
        console.error('Failed to fetch compliance data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompliance();
  }, [shipId, year]);

  if (loading) return <div>Loading compliance data...</div>;
  if (!cb || !adjustedCb) return <div>No data available</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'surplus': return 'green';
      case 'deficit': return 'red';
      default: return 'blue';
    }
  };

  return (
    <div className="compliance-dashboard">
      <h2>Compliance Balance - {shipId} ({year})</h2>

      {/* Original Compliance Balance */}
      <div className="card">
        <h3>Original Compliance Balance</h3>
        <div className="metrics">
          <div className="metric">
            <label>Baseline GHG Intensity:</label>
            <span>{cb.baselineGHGIntensity.toFixed(2)} gCO2eq/MJ</span>
          </div>
          <div className="metric">
            <label>Actual GHG Intensity:</label>
            <span>{cb.actualGHGIntensity.toFixed(2)} gCO2eq/MJ</span>
          </div>
          <div className="metric">
            <label>Target GHG Intensity:</label>
            <span>{cb.targetGHGIntensity.toFixed(2)} gCO2eq/MJ</span>
          </div>
          <div className="metric">
            <label>Compliance Balance:</label>
            <span style={{ color: getStatusColor(cb.status) }}>
              {cb.complianceBalance.toFixed(2)} gCO2eq/MJ
            </span>
          </div>
          <div className="metric">
            <label>Status:</label>
            <span style={{ color: getStatusColor(cb.status) }}>
              {cb.status.toUpperCase()}
            </span>
          </div>
          {cb.penaltyAmount && (
            <div className="metric">
              <label>Penalty Amount:</label>
              <span style={{ color: 'red' }}>€{cb.penaltyAmount.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Adjusted Compliance Balance */}
      <div className="card">
        <h3>Adjusted Compliance Balance</h3>
        <div className="metrics">
          <div className="metric">
            <label>Original CB:</label>
            <span>{adjustedCb.originalCB.toFixed(2)}</span>
          </div>
          <div className="metric">
            <label>Borrowed Amount:</label>
            <span>{adjustedCb.borrowedAmount.toFixed(2)}</span>
          </div>
          <div className="metric">
            <label>Banked Amount:</label>
            <span>{adjustedCb.bankedAmount.toFixed(2)}</span>
          </div>
          <div className="metric">
            <label>Pool Contribution:</label>
            <span>{adjustedCb.poolContribution.toFixed(2)}</span>
          </div>
          <div className="metric">
            <label>Adjusted CB:</label>
            <span style={{ color: getStatusColor(adjustedCb.finalStatus) }}>
              {adjustedCb.adjustedCB.toFixed(2)} gCO2eq/MJ
            </span>
          </div>
          <div className="metric">
            <label>Final Status:</label>
            <span style={{ color: getStatusColor(adjustedCb.finalStatus) }}>
              {adjustedCb.finalStatus.toUpperCase()}
            </span>
          </div>
          {adjustedCb.penaltyAmount && (
            <div className="metric">
              <label>Final Penalty:</label>
              <span style={{ color: 'red' }}>€{adjustedCb.penaltyAmount.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

### Example 3: Banking Operations Component

```typescript
import React, { useState, useEffect } from 'react';
import { RepositoryFactory } from '@/adapters/infrastructure';
import { BankEntry, BankingSummary } from '@/core/domain';

interface Props {
  shipId: string;
}

export const BankingManager: React.FC<Props> = ({ shipId }) => {
  const [summary, setSummary] = useState<BankingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [bankAmount, setBankAmount] = useState('');
  const [bankYear, setBankYear] = useState('');

  const bankingRepo = RepositoryFactory.getBankingRepository();

  const loadSummary = async () => {
    try {
      setLoading(true);
      const data = await bankingRepo.getBankingSummary(shipId);
      setSummary(data);
    } catch (err: any) {
      console.error('Failed to load banking summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, [shipId]);

  const handleBankSurplus = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await bankingRepo.bankSurplus({
        shipId,
        year: parseInt(bankYear),
        amount: parseFloat(bankAmount),
        notes: 'Manual banking operation'
      });

      // Reload summary
      await loadSummary();

      // Reset form
      setBankAmount('');
      setBankYear('');

      alert('Surplus banked successfully!');
    } catch (err: any) {
      alert('Failed to bank surplus: ' + err.message);
    }
  };

  if (loading) return <div>Loading banking data...</div>;
  if (!summary) return <div>No data available</div>;

  return (
    <div className="banking-manager">
      <h2>Banking Manager - {shipId}</h2>

      {/* Summary */}
      <div className="summary-card">
        <h3>Banking Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <label>Total Banked:</label>
            <span className="positive">{summary.totalBanked.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <label>Total Borrowed:</label>
            <span className="negative">{summary.totalBorrowed.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <label>Total Applied:</label>
            <span>{summary.totalApplied.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <label>Current Balance:</label>
            <span className={summary.currentBalance >= 0 ? 'positive' : 'negative'}>
              {summary.currentBalance.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Bank Surplus Form */}
      <div className="card">
        <h3>Bank Surplus</h3>
        <form onSubmit={handleBankSurplus}>
          <div className="form-group">
            <label>Year:</label>
            <input
              type="number"
              value={bankYear}
              onChange={(e) => setBankYear(e.target.value)}
              required
              min="2020"
              max="2050"
            />
          </div>
          <div className="form-group">
            <label>Amount (gCO2eq/MJ):</label>
            <input
              type="number"
              step="0.01"
              value={bankAmount}
              onChange={(e) => setBankAmount(e.target.value)}
              required
              min="0"
            />
          </div>
          <button type="submit">Bank Surplus</button>
        </form>
      </div>

      {/* Transaction History */}
      <div className="card">
        <h3>Transaction History</h3>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Remaining Balance</th>
              <th>Expiry Year</th>
              <th>Notes</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {summary.entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.year}</td>
                <td className={`type-${entry.transactionType}`}>
                  {entry.transactionType.toUpperCase()}
                </td>
                <td>{entry.amount.toFixed(2)}</td>
                <td>{entry.remainingBalance.toFixed(2)}</td>
                <td>{entry.expiryYear || '-'}</td>
                <td>{entry.notes || '-'}</td>
                <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

## Custom Hooks

Create reusable hooks for common operations:

### useRoutes Hook

```typescript
// hooks/useRoutes.ts
import { useState, useEffect } from 'react';
import { RepositoryFactory } from '@/adapters/infrastructure';
import { Route, RouteFilters } from '@/core/domain';

export const useRoutes = (filters?: RouteFilters) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const routeRepo = RepositoryFactory.getRouteRepository();

  const refetch = async () => {
    try {
      setLoading(true);
      const data = await routeRepo.getAll(filters);
      setRoutes(data);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [JSON.stringify(filters)]);

  const setBaseline = async (routeId: string) => {
    await routeRepo.setBaseline(routeId);
    await refetch();
  };

  return { routes, loading, error, refetch, setBaseline };
};

// Usage in component:
// const { routes, loading, error, setBaseline } = useRoutes({ year: 2024 });
```

### useCompliance Hook

```typescript
// hooks/useCompliance.ts
import { useState, useEffect } from 'react';
import { RepositoryFactory } from '@/adapters/infrastructure';
import { ComplianceBalance, AdjustedComplianceBalance } from '@/core/domain';

export const useCompliance = (shipId: string, year: number) => {
  const [cb, setCb] = useState<ComplianceBalance | null>(null);
  const [adjustedCb, setAdjustedCb] = useState<AdjustedComplianceBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const complianceRepo = RepositoryFactory.getComplianceRepository();

  const refetch = async () => {
    try {
      setLoading(true);
      const [cbData, adjustedData] = await Promise.all([
        complianceRepo.getComplianceBalance(shipId, year),
        complianceRepo.getAdjustedComplianceBalance(shipId, year)
      ]);
      setCb(cbData);
      setAdjustedCb(adjustedData);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [shipId, year]);

  return { cb, adjustedCb, loading, error, refetch };
};

// Usage in component:
// const { cb, adjustedCb, loading, error } = useCompliance('SHIP-001', 2024);
```

## Error Handling

### Centralized Error Handler

```typescript
// utils/errorHandler.ts
export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return `Bad Request: ${data.message || 'Invalid input'}`;
      case 401:
        return 'Unauthorized: Please log in again';
      case 403:
        return 'Forbidden: You do not have permission';
      case 404:
        return 'Not Found: Resource does not exist';
      case 500:
        return 'Server Error: Please try again later';
      default:
        return data.message || 'An error occurred';
    }
  } else if (error.request) {
    // No response received
    return 'Network Error: Unable to reach server';
  } else {
    // Error in request setup
    return error.message || 'An unexpected error occurred';
  }
};
```

## TypeScript Best Practices

### Type Guards

```typescript
// utils/typeGuards.ts
import { Route, ComplianceBalance, BankEntry, Pool } from '@/core/domain';

export const isRoute = (obj: any): obj is Route => {
  return obj && typeof obj.routeId === 'string' && typeof obj.ghgIntensity === 'number';
};

export const isComplianceBalance = (obj: any): obj is ComplianceBalance => {
  return obj && typeof obj.shipId === 'string' && typeof obj.complianceBalance === 'number';
};

// Usage:
if (isRoute(data)) {
  console.log(data.routeId); // TypeScript knows this is a Route
}
```

### Utility Types

```typescript
// types/utils.ts
import { Route } from '@/core/domain';

// Create a type for form input (without id, timestamps)
export type RouteInput = Omit<Route, 'id' | 'createdAt' | 'updatedAt'>;

// Create a type for partial update
export type RouteUpdate = Partial<Omit<Route, 'id' | 'createdAt' | 'updatedAt'>>;

// Create a type for read-only data
export type ReadOnlyRoute = Readonly<Route>;
```

## Next Steps

1. Implement the custom hooks in `src/hooks/`
2. Create React components using these patterns
3. Add proper error boundaries
4. Implement loading states and skeletons
5. Add unit tests for hooks and components
