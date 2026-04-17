import { RouteFilters as Filters } from '../../../../core/domain/Route';

interface RouteFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

function RouteFilters({ filters, onFilterChange }: RouteFiltersProps) {
  const vesselTypes = ['Container Ship', 'Tanker', 'Bulk Carrier', 'Ro-Ro', 'LNG Carrier'];
  const fuelTypes = ['HFO', 'VLSFO', 'MDO', 'MGO', 'LNG', 'Methanol'];
  const years = [2025, 2026, 2027, 2028, 2029, 2030];

  return (
    <div className="card mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="vesselType" className="block text-sm font-medium text-gray-700 mb-2">
            Vessel Type
          </label>
          <select
            id="vesselType"
            className="input w-full"
            value={filters.vesselType || ''}
            onChange={(e) =>
              onFilterChange({ ...filters, vesselType: e.target.value || undefined })
            }
          >
            <option value="">All Vessel Types</option>
            {vesselTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-2">
            Fuel Type
          </label>
          <select
            id="fuelType"
            className="input w-full"
            value={filters.fuelType || ''}
            onChange={(e) =>
              onFilterChange({ ...filters, fuelType: e.target.value || undefined })
            }
          >
            <option value="">All Fuel Types</option>
            {fuelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <select
            id="year"
            className="input w-full"
            value={filters.year || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                year: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default RouteFilters;
