import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RepositoryFactory } from '../../../infrastructure';

interface PoolMember {
  shipId: string;
  cbBefore: number;
}

interface CreatePoolFormProps {
  members: PoolMember[];
  year: number;
  onPoolCreated: () => void;
}

function CreatePoolForm({ members, year, onPoolCreated }: CreatePoolFormProps) {
  const [poolName, setPoolName] = useState('');
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();
  const poolRepo = RepositoryFactory.getPoolRepository();

  const totalCB = members.reduce((sum, member) => sum + member.cbBefore, 0);
  const canCreatePool = members.length >= 2 && totalCB >= 0;

  const createPoolMutation = useMutation({
    mutationFn: () =>
      poolRepo.createPool({
        poolName,
        year,
        memberShips: members.map((m) => m.shipId),
        notes: notes || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pools'] });
      setPoolName('');
      setNotes('');
      onPoolCreated();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (poolName && canCreatePool) {
      createPoolMutation.mutate();
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Pool</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="poolName" className="block text-sm font-medium text-gray-700 mb-2">
            Pool Name
          </label>
          <input
            id="poolName"
            type="text"
            className="input w-full"
            value={poolName}
            onChange={(e) => setPoolName(e.target.value)}
            placeholder="e.g., North Atlantic Pool 2025"
            disabled={createPoolMutation.isPending}
          />
        </div>

        <div>
          <label htmlFor="poolNotes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="poolNotes"
            rows={3}
            className="input w-full"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this pool"
            disabled={createPoolMutation.isPending}
          />
        </div>

        {createPoolMutation.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">
              {createPoolMutation.error instanceof Error
                ? createPoolMutation.error.message
                : 'Failed to create pool'}
            </p>
          </div>
        )}

        {createPoolMutation.isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-600">Pool created successfully!</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Pool Requirements:</strong>
          </p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
            <li>Minimum 2 members required</li>
            <li>Total pool balance must be non-negative</li>
            <li>All members must be from the same year</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={!canCreatePool || !poolName || createPoolMutation.isPending}
          className="btn btn-primary w-full"
        >
          {createPoolMutation.isPending ? 'Creating Pool...' : 'Create Pool'}
        </button>

        {!canCreatePool && members.length > 0 && (
          <p className="text-sm text-amber-600 text-center">
            {members.length < 2
              ? 'Add at least 2 members to create a pool'
              : 'Pool sum must be non-negative'}
          </p>
        )}
      </form>
    </div>
  );
}

export default CreatePoolForm;
