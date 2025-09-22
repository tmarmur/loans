"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ReconciliationTable } from "@/components/admin/reconciliation-table"
import { mockPaymentEntries } from "@/lib/mock-data"
import type { PaymentEntry } from "@/lib/types"

export default function ReconciliationPage() {
  const [payments, setPayments] = React.useState<PaymentEntry[]>(mockPaymentEntries)

  const handleConfirmPayment = (paymentId: string, notes?: string) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              status: "confirmed" as const,
              confirmedAt: new Date(),
              confirmedBy: "Admin User",
            }
          : payment,
      ),
    )

    console.log("Payment confirmed:", { paymentId, notes })
  }

  const handleRejectPayment = (paymentId: string, reason: string) => {
    setPayments((prev) =>
      prev.map((payment) => (payment.id === paymentId ? { ...payment, status: "failed" as const } : payment)),
    )

    console.log("Payment rejected:", { paymentId, reason })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payment Reconciliation</h2>
          <p className="text-muted-foreground">Review and confirm payment entries for loan disbursements</p>
        </div>

        <ReconciliationTable
          payments={payments}
          onConfirmPayment={handleConfirmPayment}
          onRejectPayment={handleRejectPayment}
        />
      </div>
    </DashboardLayout>
  )
}
