export interface Comparison {
  year: number;
  baselineIntensity: number;
  actualIntensity: number;
  difference: number;
  percentChange: number;
  isCompliant: boolean;
}

export interface ComparisonResult {
  comparisons: Comparison[];
  summary: {
    totalYears: number;
    compliantYears: number;
    nonCompliantYears: number;
    averageImprovement: number;
  };
}
