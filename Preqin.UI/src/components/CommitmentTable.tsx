import React, { useEffect, useMemo, useState } from 'react';
import { Commitment } from '../types';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import Pagination from './Pagination';

interface CommitmentTableProps {
  commitments: Commitment[];
  loading: boolean;
  error: string | null;
  assetClasses: string[];
  selectedAssetClass: string;
  onAssetClassChange: (assetClass: string) => void;
  onRetry: () => void;
}

const CommitmentTable: React.FC<CommitmentTableProps> = ({
  commitments,
  loading,
  error,
  assetClasses,
  selectedAssetClass,
  onAssetClassChange,
  onRetry
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(commitments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCommitments = commitments.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [commitments]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalAmount = useMemo(() => 
    commitments.reduce((sum, commitment) => sum + commitment.amount, 0), 
    [commitments]
  );

  if (loading) {
    return (
      <div className="card p-8">
        <LoadingSpinner size="lg" />
        <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
          Loading commitments...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={onRetry}
        className="mb-6"
      />
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Commitments ({commitments.length})
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total: {formatCurrency(totalAmount, 'USD')} | 
              Showing {startIndex + 1}-{Math.min(endIndex, commitments.length)} of {commitments.length}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="block w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label htmlFor="assetClass" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter:
              </label>
              <select
                id="assetClass"
                value={selectedAssetClass}
                onChange={(e) => onAssetClassChange(e.target.value)}
                className="block w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="all">All Asset Classes</option>
                {assetClasses.map((assetClass) => (
                  <option key={assetClass} value={assetClass}>
                    {assetClass}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Asset Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Currency
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedCommitments.map((commitment, index) => (
              <tr
                key={commitment.id}
                className={`${index % 2 === 0 ? '' : 'table-row-even'}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                    {commitment.assetClass}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(commitment.amount, commitment.currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {commitment.currency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {commitments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No commitments found.
          </p>
        </div>
      )}
    </div>
  );
};

export default CommitmentTable;