"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { ExpenditureItem } from "@/lib/types"
import { Receipt, AlertTriangle } from "lucide-react"

interface ExpenditureTableProps {
  items: ExpenditureItem[]
  onClaimExpense: (itemId: string) => void
}

export function ExpenditureTable({ items, onClaimExpense }: ExpenditureTableProps) {
  const totalAllocated = items.reduce((sum, item) => sum + item.allocatedAmount, 0)
  const totalSpent = items.reduce((sum, item) => sum + item.spentAmount, 0)
  const totalRemaining = items.reduce((sum, item) => sum + item.remainingAmount, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "claimed":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "approved":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getUtilizationPercentage = (spent: number, allocated: number) => {
    return allocated > 0 ? (spent / allocated) * 100 : 0
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">${totalAllocated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Allocated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">${totalRemaining.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Remaining Budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Expenditure Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expenditure Line Items</CardTitle>
          <CardDescription>Click "Claim Expense" to submit expense claims for each line item</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Line Item</TableHead>
                  <TableHead className="text-right">Allocated</TableHead>
                  <TableHead className="text-right">Spent</TableHead>
                  <TableHead className="text-right">Remaining</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const utilizationPercentage = getUtilizationPercentage(item.spentAmount, item.allocatedAmount)
                  const isCashHeavy = utilizationPercentage > 80 // Warning for high utilization

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {item.lineItem}
                          {isCashHeavy && (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" title="High utilization" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">${item.allocatedAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">${item.spentAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">${item.remainingAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={utilizationPercentage} className="h-2" />
                          <span className="text-xs text-muted-foreground">{utilizationPercentage.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onClaimExpense(item.id)}
                          disabled={item.remainingAmount <= 0 || item.status === "claimed"}
                        >
                          <Receipt className="mr-2 h-4 w-4" />
                          Claim Expense
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
