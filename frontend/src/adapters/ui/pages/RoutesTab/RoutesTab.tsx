import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RepositoryFactory } from '../../../infrastructure';
import { RouteFilters as Filters } from '../../../../core/domain/Route';
import RouteFilters from './RouteFilters';
import RoutesTable from './RoutesTable';

function RoutesTab() {
  const [filters, setFilters] = useState<Filters>({});
  const routeRepo = RepositoryFactory.getRouteRepository();

  const {
    data: routes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['routes', filters],
    queryFn: () => routeRepo.getAll(filters),
  });

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <p className="text-red-600 font-medium">Error loading routes</p>
          <p className="text-sm text-gray-500 mt-2">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Routes Management</h2>
        <p className="text-gray-600 mt-1">
          View and manage routes, set baselines for compliance calculations
        </p>
      </div>

      <RouteFilters filters={filters} onFilterChange={setFilters} />

      {isLoading ? (
        <div className="card">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-gray-500 mt-4">Loading routes...</p>
          </div>
        </div>
      ) : (
        <RoutesTable routes={routes || []} />
      )}
    </div>
  );
}

export default RoutesTab;
