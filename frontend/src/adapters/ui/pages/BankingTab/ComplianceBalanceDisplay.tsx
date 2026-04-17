import { BankingSummary } from '../../../../core/domain/BankEntry';

interface ComplianceBalanceDisplayProps {
  summary: BankingSummary;
}

function ComplianceBalanceDisplay({ summary }: ComplianceBalanceDisplayProps) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Balance</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Banked</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {summary.totalBanked.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">MJ surplus</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Applied</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {summary.totalApplied.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">MJ applied</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Borrowed</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            {summary.totalBorrowed.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">MJ borrowed</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Current Balance</p>
          <p
            className={`text-2xl font-bold mt-1 ${
              summary.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {summary.currentBalance.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {summary.currentBalance >= 0 ? 'Surplus' : 'Deficit'}
          </p>
        </div>
      </div>

      {summary.entries.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Transactions</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Year
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Remaining
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summary.entries.slice(0, 5).map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">{entry.year}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          entry.transactionType === 'bank'
                            ? 'bg-blue-100 text-blue-800'
                            : entry.transactionType === 'apply'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {entry.transactionType}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {entry.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {entry.remainingBalance.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {entry.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComplianceBalanceDisplay;
