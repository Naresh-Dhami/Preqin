// API configuration and service functions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000/api';

// Types based on server DTOs
export interface Investor {
  id: number;
  name: string;
  type: string;
  country: string;
  dateAdded: string;
  lastUpdated: string;
  totalCommitments: number;
}

export interface Commitment {
  id: number;
  investorId: number;
  assetClass: string;
  amount: number;
  currency: string;
}

// API service class
class ApiService {
  private async fetchApi<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // GET /api/Investors → Returns a list of all investors with their details
  async getInvestors(): Promise<Investor[]> {
    return this.fetchApi<Investor[]>('/Investors');
  }

  // GET /api/Investors/commitments/{id} → Returns all commitments for the selected investor
  async getInvestorCommitments(investorId: number, assetClass?: string): Promise<Commitment[]> {
    const queryParam = assetClass ? `?assetClass=${encodeURIComponent(assetClass)}` : '';
    return this.fetchApi<Commitment[]>(`/Investors/commitments/${investorId}${queryParam}`);
  }

  // GET /api/AssetClasses → Returns all distinct asset classes for filtering
  async getAssetClasses(): Promise<string[]> {
    return this.fetchApi<string[]>('/AssetClasses');
  }
}

// Export singleton instance
export const apiService = new ApiService();

// React Query keys for consistent caching
export const queryKeys = {
  investors: ['investors'] as const,
  commitments: (investorId: number) => ['commitments', investorId] as const,
  assetClasses: ['assetClasses'] as const,
} as const;