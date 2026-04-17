import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RepositoryFactory } from '../../../infrastructure';

interface BankSurplusFormProps {
  shipId: string;
  year: number;
  disabled: boolean;
}

function BankSurplusForm({ shipId, year, disabled }: BankSurplusFormProps) {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();
  const bankingRepo = RepositoryFactory.getBankingRepository();

  const bankSurplusMutation = useMutation({
    mutationFn: () =>
      bankingRepo.bankSurplus({
        shipId,
        year,
        amount: Number(amount),
        notes: notes || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banking-summary', shipId] });
      setAmount('');
      setNotes('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && Number(amount) > 0) {
      bankSurplusMutation.mutate();
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Surplus</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bankAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Bank (MJ)
          </label>
          <input
            id="bankAmount"
            type="number"
            step="0.01"
            className="input w-full"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            disabled={disabled || bankSurplusMutation.isPending}
          />
        </div>

        <div>
          <label htmlFor="bankNotes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="bankNotes"
            rows={2}
            className="input w-full"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this transaction"
            disabled={disabled || bankSurplusMutation.isPending}
          />
        </div>

        {bankSurplusMutation.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">
              {bankSurplusMutation.error instanceof Error
                ? bankSurplusMutation.error.message
                : 'Failed to bank surplus'}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={disabled || bankSurplusMutation.isPending || !amount || Number(amount) <= 0}
          className="btn btn-primary w-full"
        >
          {bankSurplusMutation.isPending ? 'Banking...' : 'Bank Surplus'}
        </button>

        {disabled && (
          <p className="text-sm text-amber-600">
            No surplus available to bank. Current balance must be positive.
          </p>
        )}
      </form>
    </div>
  );
}

export default BankSurplusForm;
