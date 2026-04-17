import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RepositoryFactory } from '../../../infrastructure';
import AdjustedCBDisplay from './AdjustedCBDisplay';
import PoolMembersList from './PoolMembersList';
import CreatePoolForm from './CreatePoolForm';
import PoolSumIndicator from './PoolSumIndicator';

interface PoolMember {
  shipId: string;
  cbBefore: number;
}

function PoolingTab() {
  const [shipId, setShipId] = useState('');
  const [year, setYear] = useState('2025');
  const [shouldFetchAdjusted, setShouldFetchAdjusted] = useState(false);
  const [poolMembers, setPoolMembers] = useState<PoolMember[]>([]);
  const [newMemberShipId, setNewMemberShipId] = useState('');
  const [newMemberCB, setNewMemberCB] = useState('');

  const complianceRepo = RepositoryFactory.getComplianceRepository();

  const {
    data: adjustedCB,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['adjusted-cb', shipId, year],
    queryFn: () => complianceRepo.getAdjustedComplianceBalance(shipId, Number(year)),
    enabled: shouldFetchAdjusted && !!shipId && !!year,
  });

  const handleGetAdjustedCB = () => {
    if (shipId && year) {
      setShouldFetchAdjusted(true);
    }
  };

  const handleAddMember = () => {
    if (newMemberShipId && newMemberCB) {
      const existingMember = poolMembers.find((m) => m.shipId === newMemberShipId);
      if (existingMember) {
        alert('This ship is already in the pool');
        return;
      }

      setPoolMembers([
        ...poolMembers,
        {
          shipId: newMemberShipId,
          cbBefore: Number(newMemberCB),
        },
      ]);
      setNewMemberShipId('');
      setNewMemberCB('');
    }
  };

  const handleRemoveMember = (shipId: string) => {
    setPoolMembers(poolMembers.filter((m) => m.shipId !== shipId));
  };

  const handlePoolCreated = () => {
    setPoolMembers([]);
    setNewMemberShipId('');
    setNewMemberCB('');
  };

  const totalPoolCB = poolMembers.reduce((sum, member) => sum + member.cbBefore, 0);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Compliance Pooling</h2>
        <p className="text-gray-600 mt-1">
          Create pools to share compliance balances between multiple ships
        </p>
      </div>

      {/* Get Adjusted CB Section */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Get Adjusted Compliance Balance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="shipIdAdjusted" className="block text-sm font-medium text-gray-700 mb-2">
              Ship ID
            </label>
            <input
              id="shipIdAdjusted"
              type="text"
              className="input w-full"
              value={shipId}
              onChange={(e) => {
                setShipId(e.target.value);
                setShouldFetchAdjusted(false);
              }}
              placeholder="e.g., SHIP-001"
            />
          </div>

          <div>
            <label htmlFor="yearAdjusted" className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <input
              id="yearAdjusted"
              type="number"
              className="input w-full"
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setShouldFetchAdjusted(false);
              }}
              placeholder="e.g., 2025"
            />
          </div>
        </div>

        <button
          onClick={handleGetAdjustedCB}
          disabled={!shipId || !year || isLoading}
          className="btn btn-primary mt-4"
        >
          {isLoading ? 'Loading...' : 'Get Adjusted CB'}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-red-600">
              {error instanceof Error ? error.message : 'Failed to fetch adjusted CB'}
            </p>
          </div>
        )}
      </div>

      {adjustedCB && (
        <div className="mb-6">
          <AdjustedCBDisplay adjustedCB={adjustedCB} />
        </div>
      )}

      {/* Pool Creation Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Pool</h3>

        {/* Add Member Form */}
        <div className="card mb-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Add Pool Member</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="newMemberShipId" className="block text-sm font-medium text-gray-700 mb-2">
                Ship ID
              </label>
              <input
                id="newMemberShipId"
                type="text"
                className="input w-full"
                value={newMemberShipId}
                onChange={(e) => setNewMemberShipId(e.target.value)}
                placeholder="e.g., SHIP-001"
              />
            </div>

            <div>
              <label htmlFor="newMemberCB" className="block text-sm font-medium text-gray-700 mb-2">
                CB Before
              </label>
              <input
                id="newMemberCB"
                type="number"
                step="0.01"
                className="input w-full"
                value={newMemberCB}
                onChange={(e) => setNewMemberCB(e.target.value)}
                placeholder="e.g., 100.50"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleAddMember}
                disabled={!newMemberShipId || !newMemberCB}
                className="btn btn-primary w-full"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>

        {/* Pool Members List */}
        <div className="mb-4">
          <PoolMembersList members={poolMembers} onRemoveMember={handleRemoveMember} />
        </div>

        {/* Pool Sum Indicator */}
        {poolMembers.length > 0 && (
          <div className="mb-4">
            <PoolSumIndicator totalCB={totalPoolCB} memberCount={poolMembers.length} />
          </div>
        )}

        {/* Create Pool Form */}
        <CreatePoolForm
          members={poolMembers}
          year={Number(year)}
          onPoolCreated={handlePoolCreated}
        />
      </div>
    </div>
  );
}

export default PoolingTab;
