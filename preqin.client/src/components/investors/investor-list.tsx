import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { apiService, queryKeys, type Investor } from "@/services/api"
import { useQuery } from "@tanstack/react-query"
import { Building2, Calendar, ChevronLeft, ChevronRight, MapPin, Search } from "lucide-react"
import { useState } from "react"

interface InvestorListProps {
  onSelectInvestor: (investor: Investor) => void
  selectedInvestorId?: number
  isLoading?: boolean
}

export function InvestorList({ onSelectInvestor, selectedInvestorId, isLoading }: InvestorListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Fetch investors data
  const { data: investors = [], error } = useQuery({
    queryKey: queryKeys.investors,
    queryFn: () => apiService.getInvestors(),
    retry: 2,
    retryDelay: 1000,
  })
  
  const filteredInvestors = investors.filter(investor =>
    investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredInvestors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedInvestors = filteredInvestors.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo(0, 0)
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `£${(amount / 1000000000).toFixed(1)}B`
    }
    if (amount >= 1000000) {
      return `£${(amount / 1000000).toFixed(1)}M`
    }
    return `£${amount.toLocaleString()}`
  }

  const getTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      "wealth manager": "investment-hedge-funds",
      "bank": "investment-private-equity", 
      "asset manager": "investment-real-estate",
      "fund manager": "investment-infrastructure"
    }
    return typeColors[type] || "secondary"
  }

  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader className="bg-card-header border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Investors</h2>
            <Skeleton className="h-9 w-64" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4 border-b last:border-b-0">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="shadow-md">
        <CardHeader className="bg-card-header border-b">
          <h2 className="text-xl font-semibold">Investors</h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="text-destructive mb-2">Failed to load investors</div>
            <div className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'An error occurred'}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-card-header border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Investors</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search investors..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
              className="pl-9 w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {paginatedInvestors.map((investor) => (
          <div
            key={investor.id}
            className={`p-4 border-b last:border-b-0 cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
              selectedInvestorId === investor.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
            }`}
            onClick={() => onSelectInvestor(investor)}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{investor.name}</h3>
                  <Badge 
                    variant="secondary" 
                    className={`bg-${getTypeColor(investor.type)}/10 text-${getTypeColor(investor.type)} border-${getTypeColor(investor.type)}/20`}
                  >
                    <Building2 className="h-3 w-3 mr-1" />
                    {investor.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(investor.dateAdded).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {investor.country}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-lg">
                  {formatCurrency(investor.totalCommitments)}
                </div>
                <div className="text-xs text-muted-foreground">Total Commitment</div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredInvestors.length)} of {filteredInvestors.length}
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