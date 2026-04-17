import { useQuery } from '@tanstack/react-query';
import { RepositoryFactory } from '../../../infrastructure';
import ComparisonTable from './ComparisonTable';
import ComparisonChart from './ComparisonChart';

const TARGET_GHG_INTENSITY = 89.3368; // gCO2e/MJ

function CompareTab() {
  const routeRepo = RepositoryFactory.getRouteRepository();

  const {
    data: comparisonResult,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['comparison'],
    queryFn: () => routeRepo.getComparison(),
  });

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <p className="text-red-600 font-medium">Error loading comparison data</p>
          <p className="text-sm text-gray-500 mt-2">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="text-gray-500 mt-4">Loading comparison data...</p>
        </div>
      </div>
    );
  }

  const comparisons = comparisonResult?.comparisons || [];
  const summary = comparisonResult?.summary;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Baseline vs Actual Comparison</h2>
        <p className="text-gray-600 mt-1">
          Compare baseline routes with actual performance against FuelEU Maritime targets
        </p>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <p className="text-sm text-gray-500">Total Years</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalYears}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Compliant Years</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{summary.compliantYears}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Non-Compliant Years</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{summary.nonCompliantYears}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Avg Improvement</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {summary.averageImprovement.toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <ComparisonChart comparisons={comparisons} targetValue={TARGET_GHG_INTENSITY} />
      </div>

      <ComparisonTable comparisons={comparisons} targetValue={TARGET_GHG_INTENSITY} />
    </div>
  );
}

export default CompareTab;
