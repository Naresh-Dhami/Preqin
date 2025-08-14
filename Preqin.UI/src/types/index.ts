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