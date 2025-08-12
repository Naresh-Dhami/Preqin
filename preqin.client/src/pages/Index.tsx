import { CommitmentBreakdown } from "@/components/commitments/commitment-breakdown"
import { InvestorList } from "@/components/investors/investor-list"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { apiService, queryKeys, type Investor } from "@/services/api"
import { useQuery } from "@tanstack/react-query"
import { DollarSign, PieChart, TrendingUp, Users } from "lucide-react"
import { useState } from "react"

const Index = () => {
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null)

  // Fetch investors data
  const { data: investors = [], isLoading, error } = useQuery({
    queryKey: queryKeys.investors,
    queryFn: () => apiService.getInvestors(),
    retry: 2,
    retryDelay: 1000,
  })

  const totalInvestors = investors.length
  const totalCommitments = investors.reduce((sum, investor) => sum + investor.totalCommitments, 0)
  const averageCommitment = totalInvestors > 0 ? totalCommitments / totalInvestors : 0

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `£${(amount / 1000000000).toFixed(1)}B`
    }
    if (amount >= 1000000) {
      return `£${(amount / 1000000).toFixed(1)}M`
    }
    return `£${amount.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-to-r from-card-header to-card-header/80 backdrop-blur supports-[backdrop-filter]:bg-card-header/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Investor Dashboard</h1>
                <p className="text-sm text-muted-foreground">Investment Management Platform</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{totalInvestors}</div>
              )}
              <p className="text-xs text-muted-foreground">
                Active investment partners
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commitments</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold text-success">
                  {formatCurrency(totalCommitments)}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Across all asset classes
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Commitment</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(averageCommitment)}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Per investor average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <InvestorList
            onSelectInvestor={setSelectedInvestor}
            selectedInvestorId={selectedInvestor?.id}
            isLoading={isLoading}
          />
          
          {selectedInvestor ? (
            <CommitmentBreakdown
              investorId={selectedInvestor.id}
              isLoading={isLoading}
            />
          ) : (
            <Card className="shadow-md">
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select an Investor</h3>
                  <p className="text-muted-foreground">
                    Choose an investor from the list to view their commitment breakdown
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
};

export default Index;
