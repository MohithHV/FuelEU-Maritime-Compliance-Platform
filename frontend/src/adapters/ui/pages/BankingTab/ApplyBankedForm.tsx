import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RepositoryFactory } from '../../../infrastructure';

interface ApplyBankedFormProps {
  shipId: string;
  year: number;
  disabled: boolean;
}

function ApplyBankedForm({ shipId, year, disabled }: ApplyBankedFormProps) {
  const [amount, setAmount] = useState('');
  const [sourceYear, setSourceYear] = useState('');
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();
  const bankingRepo = RepositoryFactory.getBankingRepository();

  const applyBankedMutation = useMutation({
    mutationFn: () =>
      bankingRepo.applyBanked({
        shipId,
        year,
        amount: Number(amount),
        sourceYear: Number(sourceYear),
        notes: notes || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banking-summary', shipId] });
      setAmount('');
      setSourceYear('');
      setNotes('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && Number(amount) > 0 && sourceYear) {
      applyBankedMutation.mutate();
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply Banked Balance</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="applyAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Apply (MJ)
          </label>
          <input
            id="applyAmount"
            type="number"
            step="0.01"
            className="input w-full"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            disabled={disabled || applyBankedMutation.isPending}
          />
        </div>

        <div>
          <label htmlFor="sourceYear" className="block text-sm font-medium text-gray-700 mb-2">
            Source Year
          </label>
          <input
            id="sourceYear"
            type="number"
            className="input w-full"
            value={sourceYear}
            onChange={(e) => setSourceYear(e.target.value)}
            placeholder="e.g., 2025"
            disabled={disabled || applyBankedMutation.isPending}
          />
        </div>

        <div>
          <label htmlFor="applyNotes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="applyNotes"
            rows={2}
            className="input w-full"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this transaction"
            disabled={disabled || applyBankedMutation.isPending}
          />
        </div>

        {applyBankedMutation.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">
              {applyBankedMutation.error instanceof Error
                ? applyBankedMutation.error.message
                : 'Failed to apply banked balance'}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={
            disabled ||
            applyBankedMutation.isPending ||
            !amount ||
            Number(amount) <= 0 ||
            !sourceYear
          }
          className="btn btn-primary w-full"
        >
          {applyBankedMutation.isPending ? 'Applying...' : 'Apply Banked Balance'}
        </button>

        {disabled && (
          <p className="text-sm text-amber-600">
            No banked balance available. Current balance must be positive.
          </p>
        )}
      </form>
    </div>
  );
}

export default ApplyBankedForm;
