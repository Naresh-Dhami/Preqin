# Investor Commitments Frontend

A React TypeScript frontend application for viewing and managing investor commitments data.

## Features

- **Investor List**: View all investors with their details and total commitments
- **Investor Detail**: Click on any investor to view their individual commitments
- **Asset Class Filtering**: Filter commitments by asset class on the client side
- **Dark/Light Theme**: Toggle between dark and light modes with persistence
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive error handling with retry functionality
- **Loading States**: Loading indicators for better user experience

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Context API** for theme management
- **Fetch API** for HTTP requests
- **Local Storage** for theme persistence

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Running .NET API backend on `http://localhost:5000`

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd investor-commitments-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` (opens automatically)

### Environment Configuration

The API base URL can be configured via environment variables:

Create a `.env` file in the root directory:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Project Structure

```
src/
├── components/           # React components
│   ├── CommitmentTable.tsx
│   ├── ErrorMessage.tsx
│   ├── InvestorDetail.tsx
│   ├── InvestorList.tsx
│   ├── LoadingSpinner.tsx
│   └── ThemeToggle.tsx
├── contexts/            # React contexts
│   └── ThemeContext.tsx
├── services/            # API services
│   └── api.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── App.tsx              # Main app component
├── index.tsx            # App entry point
└── index.css            # Global styles
```

## API Integration

The frontend consumes the following API endpoints:

- `GET /api/investors` - Fetch all investors
- `GET /api/investors/{id}/commitments` - Fetch commitments for specific investor
- `GET /api/asset-classes` - Fetch all asset classes for filtering

## Features in Detail

### Theme Management

- Uses React Context API for global theme state
- Persists theme preference in localStorage
- Smooth transitions between light and dark modes
- Applies to all components consistently

### Responsive Design

- Mobile-first approach with Tailwind CSS
- Responsive tables that scroll horizontally on small screens
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements

### Error Handling

- Network error handling with retry functionality
- User-friendly error messages
- Graceful degradation when API is unavailable
- Loading states for better UX

### Data Filtering

- Client-side filtering by asset class
- Real-time filter updates
- Filter state management
- Total calculations update with filters

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Add proper error handling
4. Test on multiple screen sizes
5. Ensure accessibility compliance

## Troubleshooting

**API Connection Issues:**
- Verify the backend API is running on `http://localhost:5000`
- Check CORS configuration in the backend
- Verify the `VITE_API_BASE_URL` environment variable

**Theme Not Persisting:**
- Check browser localStorage support
- Clear localStorage if corrupted: `localStorage.clear()`

**Styling Issues:**
- Ensure Tailwind CSS is properly configured
- Check for conflicting CSS classes
- Verify dark mode classes are applied correctly