import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Commitment, Investor } from '../types';
import CommitmentTable from './CommitmentTable';

interface InvestorDetailProps {
  investor: Investor;
  assetClasses: string[];
  onBack: () => void;
}

const InvestorDetail: React.FC<InvestorDetailProps> = ({
  investor,
  assetClasses,
  onBack
}) => {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('all');

  const fetchCommitments = async (assetClass?: string) => {
    try {
      setLoading(true);
      setError(null);
      const filterAssetClass = assetClass === 'all' ? undefined : assetClass;
      const data = await apiService.getInvestorCommitments(investor.id, filterAssetClass);
      setCommitments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch commitments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommitments(selectedAssetClass);
  }, [investor.id, selectedAssetClass]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Investors
        </button>
      </div>

      {/* Investor Info Card */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {investor.name}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">{investor.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">{investor.country}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date Added</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">{formatDate(investor.dateAdded)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">{formatDate(investor.lastUpdated)}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 lg:mt-0 lg:ml-6">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Commitments</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(investor.totalCommitments)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Commitments Table */}
      <CommitmentTable
        commitments={commitments}
        loading={loading}
        error={error}
        assetClasses={assetClasses}
        selectedAssetClass={selectedAssetClass}
        onAssetClassChange={setSelectedAssetClass}
        onRetry={() => fetchCommitments(selectedAssetClass)}
      />
    </div>
  );
};

export default InvestorDetail;