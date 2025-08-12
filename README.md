# Preqin Investment Management Platform

A modern, full-stack investment management platform for tracking investor commitments across various asset classes. Built with .NET 8 Web API backend and React TypeScript frontend.

## 🚀 Project Overview

This platform provides a comprehensive solution for managing investor data and tracking commitments across different asset classes including hedge funds, private equity, real estate, and infrastructure investments.

### Key Features

- **📊 Investor Management**: Complete investor profiles with detailed information
- **💰 Commitment Tracking**: Track and analyze investment commitments by asset class
- **📈 Interactive Dashboard**: Real-time statistics and data visualization
- **🔍 Advanced Filtering**: Filter commitments by asset class and investor
- **📱 Responsive Design**: Modern UI that works on all devices
- **🌙 Dark/Light Theme**: Toggle between dark and light modes
- **📋 CSV Data Import**: Automatic data seeding from CSV files
- **🔄 RESTful API**: Well-documented API with Swagger integration

## 🛠️ Technology Stack

### Backend (.NET 8 Web API)
- **Framework**: ASP.NET Core 8.0
- **Database**: SQLite with Entity Framework Core
- **ORM**: Entity Framework Core 8.0
- **Mapping**: AutoMapper 12.0
- **Documentation**: Swagger/OpenAPI with annotations
- **Data Processing**: CsvHelper for CSV import
- **Architecture**: Clean Architecture with Repository pattern

### Frontend (React TypeScript)
- **Framework**: React 18.3 with TypeScript 5.8
- **Build Tool**: Vite 5.4
- **UI Library**: Radix UI components with shadcn/ui
- **Styling**: Tailwind CSS 3.4
- **State Management**: TanStack React Query 5.8
- **Routing**: React Router DOM 6.30
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Notifications**: Sonner for toast notifications

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **.NET 8 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Git** - [Download here](https://git-scm.com/)
- **Visual Studio 2022** or **Visual Studio Code** (recommended)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd PreqinTest
```

### 2. Backend Setup (Preqin.Server)

Navigate to the server directory:
```bash
cd Preqin.Server
```

Restore NuGet packages:
```bash
dotnet restore
```

Build the project:
```bash
dotnet build
```

Run the server:
```bash
dotnet run
```

The API will be available at:
- HTTP: `http://localhost:7000`
- HTTPS: `https://localhost:7001`
- Swagger UI: `https://localhost:7001/swagger`

### 3. Frontend Setup (preqin.client)

Open a new terminal and navigate to the client directory:
```bash
cd preqin.client
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The client will be available at: `http://localhost:8081`

## 📁 Project Structure

```
PreqinTest/
├── Preqin.Server/                 # Backend API
│   ├── Controllers/               # API Controllers
│   ├── Data/                      # Database Context
│   ├── DTOs/                      # Data Transfer Objects
│   ├── Mappings/                  # AutoMapper Profiles
│   ├── Models/                    # Entity Models
│   ├── Services/                  # Business Logic Services
│   └── Program.cs                 # Application Entry Point
├── preqin.client/                 # Frontend React App
│   ├── src/
│   │   ├── components/            # React Components
│   │   │   ├── ui/               # Reusable UI Components
│   │   │   ├── commitments/      # Commitment-related Components
│   │   │   └── investors/        # Investor-related Components
│   │   ├── hooks/                # Custom React Hooks
│   │   ├── lib/                  # Utility Functions
│   │   ├── pages/                # Page Components
│   │   └── services/             # API Services
│   ├── public/                   # Static Assets
│   └── package.json              # Dependencies
└── README.md                     # This file
```

## 🔧 Configuration

### Backend Configuration

The backend uses `appsettings.json` for configuration:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=investorcommitments.db"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

### Frontend Configuration

Environment variables can be configured in `.env` files:

```env
VITE_API_BASE_URL=https://localhost:7001/api
```

## 📊 Database

The application uses SQLite database with the following entities:

- **Investors**: Store investor information (name, type, country, dates)
- **Commitments**: Store investment commitments (amount, currency, asset class)

### Database Migrations

To create and apply migrations:

```bash
cd Preqin.Server
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## 🧪 Testing

### Backend Testing
```bash
cd Preqin.Server
dotnet test
```

### Frontend Testing
```bash
cd preqin.client
npm run test
```

### Linting
```bash
cd preqin.client
npm run lint
```

## 📦 Building for Production

### Backend
```bash
cd Preqin.Server
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
cd preqin.client
npm run build
```

## 🌟 Best Features

### 1. **Modern Architecture**
- Clean separation of concerns with layered architecture
- Dependency injection and inversion of control
- Repository pattern with Entity Framework Core

### 2. **Developer Experience**
- Hot reload for both frontend and backend
- Comprehensive error handling and logging
- Type-safe API integration with TypeScript
- Auto-generated API documentation with Swagger

### 3. **User Experience**
- Responsive design that works on all devices
- Dark/light theme toggle
- Loading states and error handling
- Interactive data visualizations
- Real-time data updates

### 4. **Performance**
- Optimized database queries with Entity Framework
- Client-side caching with React Query
- Lazy loading and code splitting
- Efficient data mapping with AutoMapper

### 5. **Data Management**
- CSV import functionality for bulk data loading
- Advanced filtering and search capabilities
- Data validation on both client and server
- Automatic database migrations

## 🔗 API Endpoints

### Investors
- `GET /api/Investors` - Get all investors
- `GET /api/Investors/{id}/commitments` - Get investor commitments

### Asset Classes
- `GET /api/AssetClasses` - Get all asset classes

For detailed API documentation, visit the Swagger UI at `https://localhost:7001/swagger`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**: If ports 7000/7001 or 8081 are in use, the applications will automatically find available ports
2. **Database issues**: Delete the `investorcommitments.db` file and restart the server to recreate the database
3. **CORS errors**: Ensure the backend CORS policy allows requests from the frontend URL
4. **Build errors**: Run `dotnet clean` and `dotnet restore` for backend, or `npm install` for frontend

### Getting Help

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure both backend and frontend are running
4. Check the API documentation at `/swagger`

**BackEnd**

<img width="1522" height="609" alt="image" src="https://github.com/user-attachments/assets/34aeb579-dd98-48ef-a7c0-4d10a1c551dc" />

<img width="1426" height="909" alt="image" src="https://github.com/user-attachments/assets/725e7291-5a6a-43a3-a9f6-f8c43275aeb6" />

<img width="1144" height="925" alt="image" src="https://github.com/user-attachments/assets/ee18f139-3c41-481b-81a9-d72089e73ef6" />

<img width="1147" height="918" alt="image" src="https://github.com/user-attachments/assets/975b3a4b-dd39-4cf5-9150-28ba0bb30b67" />

**FrontEnd**

<img width="1119" height="931" alt="image" src="https://github.com/user-attachments/assets/27d0a78a-9fa7-44f5-b65b-43de32fb6677" />

<img width="1123" height="900" alt="image" src="https://github.com/user-attachments/assets/9baa1724-44f1-4448-b54f-29c88191e770" />

