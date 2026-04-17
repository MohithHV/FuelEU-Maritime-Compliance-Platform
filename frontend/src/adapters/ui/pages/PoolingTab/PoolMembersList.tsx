interface PoolMember {
  shipId: string;
  cbBefore: number;
}

interface PoolMembersListProps {
  members: PoolMember[];
  onRemoveMember: (shipId: string) => void;
}

function PoolMembersList({ members, onRemoveMember }: PoolMembersListProps) {
  if (members.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pool Members</h3>
        <p className="text-gray-500 text-center py-8">
          No members added yet. Add ships to create a pool.
        </p>
      </div>
    );
  }

  const totalCB = members.reduce((sum, member) => sum + member.cbBefore, 0);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Pool Members ({members.length})
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ship ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                CB Before
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.shipId}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {member.shipId}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={
                      member.cbBefore >= 0 ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {member.cbBefore.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      member.cbBefore >= 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {member.cbBefore >= 0 ? 'Surplus' : 'Deficit'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => onRemoveMember(member.shipId)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-4 py-3 text-sm font-bold text-gray-900">Total</td>
              <td className="px-4 py-3 text-sm font-bold">
                <span className={totalCB >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {totalCB.toFixed(2)}
                </span>
              </td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default PoolMembersList;
