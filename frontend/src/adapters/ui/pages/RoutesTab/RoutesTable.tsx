import { Route } from '../../../../core/domain/Route';
import SetBaselineButton from './SetBaselineButton';

interface RoutesTableProps {
  routes: Route[];
}

function RoutesTable({ routes }: RoutesTableProps) {
  if (routes.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">No routes found. Adjust filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="table-header">Route ID</th>
              <th className="table-header">Vessel Type</th>
              <th className="table-header">Fuel Type</th>
              <th className="table-header">Year</th>
              <th className="table-header">GHG Intensity</th>
              <th className="table-header">Fuel Consumption</th>
              <th className="table-header">Distance (nm)</th>
              <th className="table-header">Total Emissions</th>
              <th className="table-header">Baseline</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {routes.map((route) => (
              <tr key={route.id} className={route.isBaseline ? 'bg-blue-50' : ''}>
                <td className="table-cell font-medium">{route.routeId}</td>
                <td className="table-cell">{route.vesselType}</td>
                <td className="table-cell">{route.fuelType}</td>
                <td className="table-cell">{route.year}</td>
                <td className="table-cell">{route.ghgIntensity.toFixed(4)} gCO2e/MJ</td>
                <td className="table-cell">{route.fuelConsumption.toFixed(2)} tonnes</td>
                <td className="table-cell">{route.distance.toFixed(0)}</td>
                <td className="table-cell">{route.totalEmissions.toFixed(2)} tonnes</td>
                <td className="table-cell">
                  {route.isBaseline ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Baseline
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="table-cell">
                  {!route.isBaseline && <SetBaselineButton routeId={route.routeId} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RoutesTable;
