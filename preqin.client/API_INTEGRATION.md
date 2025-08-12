# API Integration

This document describes the API integration for the Preqin Client application.

## API Service

The `src/services/api.ts` file contains the main API service that handles all communication with the backend server.

### Base URL Configuration

The API base URL is configured through environment variables:
- Development: `https://localhost:7001/api`
- Production: `/api` (relative to the current domain)

You can override this by setting the `VITE_API_BASE_URL` environment variable.

### API Endpoints

The following endpoints are used:

1. **GET /api/Investors**
   - Returns a list of all investors with their details
   - Used by: InvestorList component, Index page for statistics

2. **GET /api/Investors/commitments/{id}**
   - Returns all commitments for the selected investor
   - Optional query parameter: `assetClass` for filtering
   - Used by: CommitmentBreakdown component

3. **GET /api/AssetClasses**
   - Returns all distinct asset classes for filtering
   - Used by: CommitmentBreakdown component for filter buttons

### Data Types

The API service defines TypeScript interfaces that match the server DTOs:
interface Investor {
  id: number;
  name: string;
  type: string;
  country: string;
  dateAdded: string;
  lastUpdated: string;
  totalCommitments: number;
}

interface Commitment {
  id: number;
  investorId: number;
  assetClass: string;
  amount: number;
  currency: string;
}
### Error Handling

- All API calls include proper error handling with try-catch blocks
- Components display error states when API calls fail
- React Query provides automatic retry functionality (2 retries with 1-second delay)

### Caching

React Query is used for:
- Automatic caching of API responses
- Background refetching
- Loading states management
- Error state management

### Usage Example
import { useQuery } from "@tanstack/react-query";
import { apiService, queryKeys } from "@/services/api";

// In a component
const { data: investors, isLoading, error } = useQuery({
  queryKey: queryKeys.investors,
  queryFn: () => apiService.getInvestors(),
  retry: 2,
  retryDelay: 1000,
});
## Environment Setup

1. Ensure the backend server is running on `http://localhost:7000`
2. The client will automatically connect to the API endpoints
3. For production, configure the `VITE_API_BASE_URL` environment variable appropriately

### HTTPS Configuration

Both the client and server are configured to use HTTPS:
- Client: `https://localhost:3000`
- Server: `http://localhost:7000`
- The Vite proxy is configured with `secure: false` to handle self-signed certificates in development