import { Comparison } from '../../../../core/domain/Comparison';

interface ComparisonTableProps {
  comparisons: Comparison[];
  targetValue: number;
}

function ComparisonTable({ comparisons, targetValue }: ComparisonTableProps) {
  if (comparisons.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">No comparison data available.</p>
        <p className="text-sm text-gray-400 mt-2">Set a baseline route first in the Routes tab.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="table-header">Year</th>
              <th className="table-header">Baseline Intensity</th>
              <th className="table-header">Actual Intensity</th>
              <th className="table-header">Target Value</th>
              <th className="table-header">Difference</th>
              <th className="table-header">% Change</th>
              <th className="table-header">Compliance</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comparisons.map((comparison) => (
              <tr key={comparison.id}>
                <td className="table-cell font-medium">{comparison.year}</td>
                <td className="table-cell">{comparison.baselineIntensity.toFixed(4)} gCO2e/MJ</td>
                <td className="table-cell">{comparison.actualIntensity.toFixed(4)} gCO2e/MJ</td>
                <td className="table-cell">{targetValue.toFixed(4)} gCO2e/MJ</td>
                <td className="table-cell">
                  <span
                    className={
                      comparison.difference < 0 ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {comparison.difference.toFixed(4)} gCO2e/MJ
                  </span>
                </td>
                <td className="table-cell">
                  <span
                    className={
                      comparison.percentChange < 0 ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {comparison.percentChange > 0 ? '+' : ''}
                    {comparison.percentChange.toFixed(2)}%
                  </span>
                </td>
                <td className="table-cell">
                  {comparison.isCompliant ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Compliant
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Non-Compliant
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ComparisonTable;
