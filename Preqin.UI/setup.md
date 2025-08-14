# Quick Setup Guide

## Prerequisites
- Node.js 16+ installed
- .NET API backend running on http://localhost:5000

## Installation Steps

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
   - The app will automatically open at `http://localhost:3000`
   - If not, manually navigate to `http://localhost:3000`

## Verify Setup

1. **Check API Connection:**
   - The investor list should load automatically
   - If you see "Failed to fetch investors", verify the backend API is running

2. **Test Features:**
   - Click on any investor row to view their commitments
   - Use the asset class filter dropdown
   - Toggle between light/dark themes using the button in the header

## Troubleshooting

**If the app doesn't start:**
- Make sure you're in the `investor-commitments-frontend` directory
- Try deleting `node_modules` and running `npm install` again
- Check that Node.js version is 16 or higher: `node --version`

**If API calls fail:**
- Verify the .NET API is running on port 5000
- Check the browser console for CORS errors
- Ensure the `.env` file has the correct API URL

**If styling looks broken:**
- Clear browser cache
- Make sure Tailwind CSS installed correctly: `npm list tailwindcss`

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview

# Install additional packages
npm install <package-name>
```