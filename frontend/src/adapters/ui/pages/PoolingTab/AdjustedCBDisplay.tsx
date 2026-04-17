import { AdjustedComplianceBalance } from '../../../../core/domain/ComplianceBalance';

interface AdjustedCBDisplayProps {
  adjustedCB: AdjustedComplianceBalance;
}

function AdjustedCBDisplay({ adjustedCB }: AdjustedCBDisplayProps) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Adjusted Compliance Balance - {adjustedCB.shipId} ({adjustedCB.year})
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Original CB</p>
          <p
            className={`text-xl font-bold mt-1 ${
              adjustedCB.originalCB >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {adjustedCB.originalCB.toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Borrowed</p>
          <p className="text-xl font-bold text-orange-600 mt-1">
            {adjustedCB.borrowedAmount.toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Banked</p>
          <p className="text-xl font-bold text-blue-600 mt-1">
            {adjustedCB.bankedAmount.toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Pool Contribution</p>
          <p className="text-xl font-bold text-purple-600 mt-1">
            {adjustedCB.poolContribution.toFixed(2)}
          </p>
        </div>

        <div className="bg-blue-100 rounded-lg p-4">
          <p className="text-xs text-gray-700 uppercase tracking-wide font-medium">
            Adjusted CB
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${
              adjustedCB.adjustedCB >= 0 ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {adjustedCB.adjustedCB.toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Final Status</p>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${
              adjustedCB.finalStatus === 'surplus'
                ? 'bg-green-100 text-green-800'
                : adjustedCB.finalStatus === 'deficit'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {adjustedCB.finalStatus}
          </span>
        </div>
      </div>

      {adjustedCB.penaltyAmount && adjustedCB.penaltyAmount > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm font-medium text-red-800">
            Penalty Amount: {adjustedCB.penaltyAmount.toFixed(2)} EUR
          </p>
        </div>
      )}
    </div>
  );
}

export default AdjustedCBDisplay;
