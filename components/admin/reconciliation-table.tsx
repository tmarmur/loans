"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/ui/status-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { PaymentEntry } from "@/lib/types"
import { Search, Filter, CheckCircle, AlertTriangle, DollarSign, Calendar, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ReconciliationTableProps {
  payments: PaymentEntry[]
  onConfirmPayment: (paymentId: string, notes?: string) => void
  onRejectPayment: (paymentId: string, reason: string) => void
}

export function ReconciliationTable({ payments, onConfirmPayment, onRejectPayment }: ReconciliationTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [selectedPayment, setSelectedPayment] = React.useState<PaymentEntry | null>(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false)
  const [confirmationNotes, setConfirmationNotes] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)

  const filteredPayments = React.useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.loanId.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || payment.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [payments, searchTerm, statusFilter])

  const handleConfirmPayment = async () => {
    if (!selectedPayment) return

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    onConfirmPayment(selectedPayment.id, confirmationNotes)
    setIsProcessing(false)
    setIsConfirmModalOpen(false)
    setSelectedPayment(null)
    setConfirmationNotes("")
  }

  const handleRejectPayment = async (paymentId: string) => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onRejectPayment(paymentId, "Payment verification failed")
    setIsProcessing(false)
  }

  const openConfirmModal = (payment: PaymentEntry) => {
    setSelectedPayment(payment)
    setIsConfirmModalOpen(true)
  }

  const statusCounts = React.useMemo(() => {
    return payments.reduce(
      (acc, payment) => {
        acc[payment.status] = (acc[payment.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }, [payments])

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">Total Payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{statusCounts["pending"] || 0}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{statusCounts["confirmed"] || 0}</div>
            <p className="text-xs text-muted-foreground">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              $
              {payments
                .filter((p) => p.status === "pending")
                .reduce((sum, payment) => sum + payment.amount, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Pending Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Reconciliation</CardTitle>
          <CardDescription>Review and confirm payment entries for loan disbursements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by reference number, payment ID, or loan ID..."
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
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Reference Number</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Confirmed By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No payment entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">{payment.id.toUpperCase()}</TableCell>
                      <TableCell className="font-mono text-sm">{payment.loanId.toUpperCase()}</TableCell>
                      <TableCell className="font-mono">{payment.referenceNumber}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span className="font-mono">{payment.amount.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {payment.paymentDate.toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={payment.status} />
                      </TableCell>
                      <TableCell>
                        {payment.confirmedBy ? (
                          <div>
                            <p className="text-sm font-medium">{payment.confirmedBy}</p>
                            {payment.confirmedAt && (
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(payment.confirmedAt, { addSuffix: true })}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.status === "pending" && (
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openConfirmModal(payment)}
                              className="text-green-600 hover:text-green-700"
                              disabled={isProcessing}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectPayment(payment.id)}
                              className="text-red-600 hover:text-red-700"
                              disabled={isProcessing}
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Confirm the payment entry and add any additional notes for the audit trail.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payment ID:</span>
                  <span className="font-mono text-sm">{selectedPayment.id.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Reference:</span>
                  <span className="font-mono text-sm">{selectedPayment.referenceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="font-mono text-sm">${selectedPayment.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span className="text-sm">{selectedPayment.paymentDate.toLocaleDateString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Confirmation Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this payment confirmation..."
                  value={confirmationNotes}
                  onChange={(e) => setConfirmationNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmPayment} disabled={isProcessing}>
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirm Payment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
