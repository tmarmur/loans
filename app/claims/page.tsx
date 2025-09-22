"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ExpenseClaimsTable } from "@/components/financier/expense-claims-table"
import { mockExpenseClaims } from "@/lib/mock-data"

export default function ClaimsPage() {
  const [claims, setClaims] = React.useState(mockExpenseClaims)

  const handleViewClaim = (claimId: string) => {
    console.log("View claim:", claimId)
    // In a real app, this would open a detailed view modal
  }

  const handleApproveClaim = async (claimId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setClaims((prev) => prev.map((claim) => (claim.id === claimId ? { ...claim, status: "approved" as const } : claim)))

    console.log("Approved claim:", claimId)
  }

  const handleRejectClaim = async (claimId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setClaims((prev) => prev.map((claim) => (claim.id === claimId ? { ...claim, status: "rejected" as const } : claim)))

    console.log("Rejected claim:", claimId)
  }

  const handleBulkApprove = async (claimIds: string[]) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setClaims((prev) =>
      prev.map((claim) => (claimIds.includes(claim.id) ? { ...claim, status: "approved" as const } : claim)),
    )

    console.log("Bulk approved claims:", claimIds)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Expense Claims</h2>
          <p className="text-muted-foreground">Review and approve expense claims from clients</p>
        </div>

        <ExpenseClaimsTable
          claims={claims}
          onViewClaim={handleViewClaim}
          onApproveClaim={handleApproveClaim}
          onRejectClaim={handleRejectClaim}
          onBulkApprove={handleBulkApprove}
        />
      </div>
    </DashboardLayout>
  )
}
