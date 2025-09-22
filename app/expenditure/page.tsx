"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ExcelUpload } from "@/components/expenditure/excel-upload"
import { ExpenditureTable } from "@/components/expenditure/expenditure-table"
import { ExpenseClaimModal } from "@/components/expenditure/expense-claim-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { mockExpenditureItems } from "@/lib/mock-data"
import type { ExpenditureItem } from "@/lib/types"
import { FileSpreadsheet, Info } from "lucide-react"

export default function ExpenditurePage() {
  const [expenditureItems, setExpenditureItems] = React.useState<ExpenditureItem[]>(mockExpenditureItems)
  const [hasUploadedFile, setHasUploadedFile] = React.useState(true) // Set to true to show mock data
  const [selectedItem, setSelectedItem] = React.useState<ExpenditureItem | null>(null)
  const [isClaimModalOpen, setIsClaimModalOpen] = React.useState(false)
  const [isSubmittingClaim, setIsSubmittingClaim] = React.useState(false)

  const handleExcelUpload = (data: any[]) => {
    // Convert uploaded data to ExpenditureItem format
    const items: ExpenditureItem[] = data.map((item, index) => ({
      id: `exp-${index + 1}`,
      loanId: "loan-002",
      lineItem: item.lineItem,
      allocatedAmount: item.allocatedAmount,
      spentAmount: 0,
      remainingAmount: item.allocatedAmount,
      status: "available",
      claims: [],
    }))

    setExpenditureItems(items)
    setHasUploadedFile(true)
  }

  const handleClaimExpense = (itemId: string) => {
    const item = expenditureItems.find((i) => i.id === itemId)
    if (item) {
      setSelectedItem(item)
      setIsClaimModalOpen(true)
    }
  }

  const handleSubmitClaim = async (claimData: any) => {
    setIsSubmittingClaim(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update the expenditure item status
    setExpenditureItems((prev) =>
      prev.map((item) => (item.id === selectedItem?.id ? { ...item, status: "claimed" as const } : item)),
    )

    setIsSubmittingClaim(false)
    setIsClaimModalOpen(false)
    setSelectedItem(null)

    console.log("Expense claim submitted:", claimData)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Expenditure Management</h2>
          <p className="text-muted-foreground">Manage your loan expenditure line items and submit expense claims</p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Upload your expenditure plan Excel file to get started, or use the template to create your 24 line items.
            Each line item can be claimed against with supporting documentation.
          </AlertDescription>
        </Alert>

        {!hasUploadedFile ? (
          <ExcelUpload onUpload={handleExcelUpload} />
        ) : (
          <div className="space-y-6">
            {/* Upload Section - Always visible for re-upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  Expenditure Plan
                </CardTitle>
                <CardDescription>
                  Your expenditure plan has been loaded. You can upload a new file to replace the current plan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExcelUpload onUpload={handleExcelUpload} />
              </CardContent>
            </Card>

            {/* Expenditure Management */}
            <ExpenditureTable items={expenditureItems} onClaimExpense={handleClaimExpense} />
          </div>
        )}

        {/* Expense Claim Modal */}
        <ExpenseClaimModal
          isOpen={isClaimModalOpen}
          onClose={() => {
            setIsClaimModalOpen(false)
            setSelectedItem(null)
          }}
          expenditureItem={selectedItem}
          onSubmit={handleSubmitClaim}
          isLoading={isSubmittingClaim}
        />
      </div>
    </DashboardLayout>
  )
}
