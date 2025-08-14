import { Commitment, Investor } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  private async fetch<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
    }
    return response.json();
  }

  getInvestors(): Promise<Investor[]> {
    return this.fetch(`${API_BASE_URL}/investors`);
  }

  getInvestorCommitments(investorId: number, assetClass?: string): Promise<Commitment[]> {
    const url = assetClass 
      ? `${API_BASE_URL}/investors/commitments/${investorId}?assetClass=${encodeURIComponent(assetClass)}`
      : `${API_BASE_URL}/investors/commitments/${investorId}`;
    return this.fetch(url);
  }

  getAssetClasses(): Promise<string[]> {
    return this.fetch(`${API_BASE_URL}/assetclasses`);
  }
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiService = new ApiService();
export { ApiError };
