import { Route } from './Route';

export interface RouteComparison {
  baseline: Route;
  comparison: Route;
  percentDiff: number;
  compliant: boolean;
  target: number;
}

export interface ComparisonResult {
  comparisons: RouteComparison[];
  target: number;
}
