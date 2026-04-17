interface PoolSumIndicatorProps {
  totalCB: number;
  memberCount: number;
}

function PoolSumIndicator({ totalCB, memberCount }: PoolSumIndicatorProps) {
  const isValid = totalCB >= 0;

  return (
    <div
      className={`card border-2 ${
        isValid
          ? 'border-green-500 bg-green-50'
          : 'border-red-500 bg-red-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Pool Sum</h3>
          <p className="text-sm text-gray-600 mt-1">
            {memberCount} {memberCount === 1 ? 'member' : 'members'} in pool
          </p>
        </div>

        <div className="text-right">
          <p
            className={`text-3xl font-bold ${
              isValid ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {totalCB.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total CB</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        {isValid ? (
          <div className="flex items-center text-green-700">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">Pool is valid - can be created</span>
          </div>
        ) : (
          <div className="flex items-center text-red-700">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">
              Pool sum must be non-negative to create
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PoolSumIndicator;
