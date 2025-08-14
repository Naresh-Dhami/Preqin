import React, { useEffect, useState } from 'react';
import InvestorDetail from './components/InvestorDetail';
import InvestorList from './components/InvestorList';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { apiService } from './services/api';
import { Investor } from './types';

function App() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [assetClasses, setAssetClasses] = useState<string[]>([]);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assetClassesLoading, setAssetClassesLoading] = useState(true);

  const fetchInvestors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getInvestors();
      setInvestors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch investors');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssetClasses = async () => {
    try {
      setAssetClassesLoading(true);
      const data = await apiService.getAssetClasses();
      setAssetClasses(data);
    } catch (err) {
      console.error('Failed to fetch asset classes:', err);
      // Don't show error for asset classes as it's not critical
    } finally {
      setAssetClassesLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestors();
    fetchAssetClasses();
  }, []);

  const handleInvestorSelect = (investor: Investor) => {
    setSelectedInvestor(investor);
  };

  const handleBackToList = () => {
    setSelectedInvestor(null);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Investor Commitments
                </h1>
                {selectedInvestor && (
                  <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                    / {selectedInvestor.name}
                  </span>
                )}
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {selectedInvestor ? (
            <InvestorDetail
              investor={selectedInvestor}
              assetClasses={assetClasses}
              onBack={handleBackToList}
            />
          ) : (
            <InvestorList
              investors={investors}
              loading={loading}
              error={error}
              onInvestorSelect={handleInvestorSelect}
              onRetry={fetchInvestors}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Investor Commitments Dashboard
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;