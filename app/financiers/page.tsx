"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { FinancierManagementTable } from "@/components/admin/financier-management-table"
import { mockFinanciers } from "@/lib/mock-data"
import type { Financier } from "@/lib/types"

export default function FinanciersPage() {
  const [financiers, setFinanciers] = React.useState<Financier[]>(mockFinanciers)

  const handleCreateFinancier = (financierData: Partial<Financier>) => {
    const newFinancier: Financier = {
      id: `fin-${Date.now()}`,
      name: financierData.name!,
      email: financierData.email!,
      contactPerson: financierData.contactPerson!,
      phone: financierData.phone!,
      address: financierData.address!,
      registrationNumber: financierData.registrationNumber!,
      status: financierData.status!,
      loanLimit: financierData.loanLimit!,
      interestRateRange: financierData.interestRateRange!,
      specializations: financierData.specializations!,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setFinanciers((prev) => [...prev, newFinancier])
    console.log("Financier created:", newFinancier)
  }

  const handleUpdateFinancier = (financierId: string, financierData: Partial<Financier>) => {
    setFinanciers((prev) =>
      prev.map((financier) =>
        financier.id === financierId ? { ...financier, ...financierData, updatedAt: new Date() } : financier,
      ),
    )
    console.log("Financier updated:", { financierId, financierData })
  }

  const handleDeleteFinancier = (financierId: string) => {
    setFinanciers((prev) => prev.filter((financier) => financier.id !== financierId))
    console.log("Financier deleted:", financierId)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financier Management</h2>
          <p className="text-muted-foreground">Manage financier organizations and their lending capabilities</p>
        </div>

        <FinancierManagementTable
          financiers={financiers}
          onCreateFinancier={handleCreateFinancier}
          onUpdateFinancier={handleUpdateFinancier}
          onDeleteFinancier={handleDeleteFinancier}
        />
      </div>
    </DashboardLayout>
  )
}
