"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/ui/status-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { ExpenseClaim } from "@/lib/types"
import { Eye, Search, Filter, CheckSquare, X, DollarSign, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ExpenseClaimsTableProps {
  claims: ExpenseClaim[]
  onViewClaim: (claimId: string) => void
  onApproveClaim: (claimId: string) => void
  onRejectClaim: (claimId: string) => void
  onBulkApprove: (claimIds: string[]) => void
}

export function ExpenseClaimsTable({
  claims,
  onViewClaim,
  onApproveClaim,
  onRejectClaim,
  onBulkApprove,
}: ExpenseClaimsTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [selectedClaims, setSelectedClaims] = React.useState<string[]>([])

  const filteredClaims = React.useMemo(() => {
    return claims.filter((claim) => {
      const matchesSearch =
        claim.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || claim.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [claims, searchTerm, statusFilter])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClaims(filteredClaims.filter((claim) => claim.status === "pending").map((claim) => claim.id))
    } else {
      setSelectedClaims([])
    }
  }

  const handleSelectClaim = (claimId: string, checked: boolean) => {
    if (checked) {
      setSelectedClaims((prev) => [...prev, claimId])
    } else {
      setSelectedClaims((prev) => prev.filter((id) => id !== claimId))
    }
  }

  const pendingClaims = filteredClaims.filter((claim) => claim.status === "pending")
  const allPendingSelected =
    pendingClaims.length > 0 && pendingClaims.every((claim) => selectedClaims.includes(claim.id))

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{claims.length}</div>
            <p className="text-xs text-muted-foreground">Total Claims</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{claims.filter((c) => c.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{claims.filter((c) => c.status === "approved").length}</div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              $
              {claims
                .filter((c) => c.status === "pending")
                .reduce((sum, claim) => sum + claim.amount, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Pending Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Claims Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Claims</CardTitle>
          <CardDescription>Review and approve expense claims from clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by description or claim ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            {selectedClaims.length > 0 && (
              <Button onClick={() => onBulkApprove(selectedClaims)} className="whitespace-nowrap">
                <CheckSquare className="mr-2 h-4 w-4" />
                Approve Selected ({selectedClaims.length})
              </Button>
            )}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allPendingSelected}
                      onCheckedChange={handleSelectAll}
                      disabled={pendingClaims.length === 0}
                    />
                  </TableHead>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Line Item</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClaims.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No expense claims found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClaims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedClaims.includes(claim.id)}
                          onCheckedChange={(checked) => handleSelectClaim(claim.id, checked as boolean)}
                          disabled={claim.status !== "pending"}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{claim.id.toUpperCase()}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <p className="truncate">{claim.description}</p>
                          <p className="text-xs text-muted-foreground">{claim.documents.length} documents</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">Equipment Purchase</p>
                        <p className="text-xs text-muted-foreground">Office Equipment</p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span className="font-mono">{claim.amount.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize text-sm">{claim.type.replace("-", " ")}</span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={claim.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(claim.submittedAt, { addSuffix: true })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="outline" onClick={() => onViewClaim(claim.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {claim.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onApproveClaim(claim.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckSquare className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onRejectClaim(claim.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
