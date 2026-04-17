import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RepositoryFactory } from '../../../infrastructure';
import ComplianceBalanceDisplay from './ComplianceBalanceDisplay';
import BankSurplusForm from './BankSurplusForm';
import ApplyBankedForm from './ApplyBankedForm';

function BankingTab() {
  const [shipId, setShipId] = useState('');
  const [year, setYear] = useState('');
  const [shouldFetch, setShouldFetch] = useState(false);

  const bankingRepo = RepositoryFactory.getBankingRepository();

  const {
    data: summary,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['banking-summary', shipId],
    queryFn: () => bankingRepo.getBankingSummary(shipId),
    enabled: shouldFetch && !!shipId,
  });

  const handleGetBalance = () => {
    if (shipId) {
      setShouldFetch(true);
    }
  };

  const canPerformActions = summary && summary.currentBalance > 0;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Compliance Banking</h2>
        <p className="text-gray-600 mt-1">
          Bank surplus compliance balance or apply banked balance to deficit years
        </p>
      </div>

      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Compliance Balance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="shipId" className="block text-sm font-medium text-gray-700 mb-2">
              Ship ID
            </label>
            <input
              id="shipId"
              type="text"
              className="input w-full"
              value={shipId}
              onChange={(e) => {
                setShipId(e.target.value);
                setShouldFetch(false);
              }}
              placeholder="e.g., SHIP-001"
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <input
              id="year"
              type="number"
              className="input w-full"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g., 2025"
            />
          </div>
        </div>

        <button
          onClick={handleGetBalance}
          disabled={!shipId || isLoading}
          className="btn btn-primary mt-4"
        >
          {isLoading ? 'Loading...' : 'Get Compliance Balance'}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-red-600">
              {error instanceof Error ? error.message : 'Failed to fetch compliance balance'}
            </p>
          </div>
        )}
      </div>

      {summary && (
        <>
          <div className="mb-6">
            <ComplianceBalanceDisplay summary={summary} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BankSurplusForm
              shipId={shipId}
              year={Number(year) || new Date().getFullYear()}
              disabled={!canPerformActions}
            />

            <ApplyBankedForm
              shipId={shipId}
              year={Number(year) || new Date().getFullYear()}
              disabled={!canPerformActions}
            />
          </div>
        </>
      )}

      {!summary && shouldFetch && !isLoading && !error && (
        <div className="card text-center py-12">
          <p className="text-gray-500">
            Enter a Ship ID and click "Get Compliance Balance" to view banking options.
          </p>
        </div>
      )}
    </div>
  );
}

export default BankingTab;
