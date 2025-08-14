import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { apiService, queryKeys } from "@/services/api"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight, DollarSign, PieChart, TrendingUp } from "lucide-react"
import { useMemo, useState } from "react"

interface CommitmentBreakdownProps {
  investorId: number
  isLoading?: boolean
}

export function CommitmentBreakdown({ investorId, isLoading }: CommitmentBreakdownProps) {
  const [selectedAssetClass, setSelectedAssetClass] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Fetch commitments for the selected investor
  const { data: commitments = [], isLoading: commitmentsLoading, error: commitmentsError } = useQuery({
    queryKey: queryKeys.commitments(investorId),
    queryFn: () => apiService.getInvestorCommitments(investorId),
    enabled: !!investorId,
    retry: 2,
    retryDelay: 1000,
  })

  // Fetch asset classes
  const { data: assetClassesData = [], isLoading: assetClassesLoading, error: assetClassesError } = useQuery({
    queryKey: queryKeys.assetClasses,
    queryFn: () => apiService.getAssetClasses(),
    retry: 2,
    retryDelay: 1000,
  })

  // Add "All" option to asset classes
  const assetClasses = ["All", ...assetClassesData]
  
  const dataLoading = isLoading || commitmentsLoading || assetClassesLoading

  const assetClassTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    
    commitments.forEach(commitment => {
      if (!totals[commitment.assetClass]) {
        totals[commitment.assetClass] = 0
      }
      totals[commitment.assetClass] += commitment.amount
    })
    
    return totals
  }, [commitments])

  const filteredCommitments = selectedAssetClass === "All" 
    ? commitments 
    : commitments.filter(commitment => commitment.assetClass === selectedAssetClass)

  // Pagination logic
  const totalPages = Math.ceil(filteredCommitments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCommitments = filteredCommitments.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo(0, 0)
  }

  const totalAmount = commitments.reduce((sum, commitment) => sum + commitment.amount, 0)

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `£${(amount / 1000000000).toFixed(1)}B`
    }
    if (amount >= 1000000) {
      return `£${(amount / 1000000).toFixed(1)}M`
    }
    return `£${amount.toLocaleString()}`
  }

  const getAssetClassColor = (assetClass: string) => {
    const colors: Record<string, string> = {
      "Hedge Funds": "investment-hedge-funds",
      "Private Equity": "investment-private-equity", 
      "Real Estate": "investment-real-estate",
      "Infrastructure": "investment-infrastructure",
      "Natural Resources": "investment-natural-resources",
      "Private Debt": "investment-private-debt"
    }
    return colors[assetClass] || "primary"
  }

  if (dataLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader className="bg-card-header border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Commitments
            </h2>
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4" />
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (commitmentsError || assetClassesError) {
    return (
      <Card className="shadow-md">
        <CardHeader className="bg-card-header border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Commitments
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="text-destructive mb-2">Failed to load commitment data</div>
            <div className="text-sm text-muted-foreground">
              {(commitmentsError || assetClassesError) instanceof Error 
                ? (commitmentsError || assetClassesError)?.message 
                : 'An error occurred'}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (commitments.length === 0 && !dataLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader className="bg-card-header border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Commitments
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No commitments found for this investor.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-card-header border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Commitments
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="font-medium">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Asset Class Filter Buttons */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
          {assetClasses.map((assetClass) => {
            const total = assetClass === "All" ? totalAmount : (assetClassTotals[assetClass] || 0)
            const isActive = selectedAssetClass === assetClass
            
            return (
              <Button
                key={assetClass}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedAssetClass(assetClass)
                  setCurrentPage(1) // Reset to first page when changing filter
                }}
                className={`p-2 h-auto flex flex-col items-center gap-1 `}
              >
                <span className="text-xs font-medium truncate w-full text-center">
                  {assetClass}
                </span>
                <span className="text-xs font-semibold">
                  {formatCurrency(total)}
                </span>
              </Button>
            )
          })}
        </div>

        {/* Commitments List */}
        <div className="space-y-3">
          {paginatedCommitments.map((commitment) => (
            <div
              key={commitment.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div 
                />
                <div>
                  <div className="font-medium text-sm">#{commitment.id}</div>
                  <div className="text-xs text-muted-foreground">
                    {commitment.assetClass} • {commitment.currency}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(commitment.amount)}</div>
                <Badge variant="outline" className="text-xs">
                  {((commitment.amount / totalAmount) * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCommitments.length)} of {filteredCommitments.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}