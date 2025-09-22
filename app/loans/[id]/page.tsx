"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { LoanProgressStepper } from "@/components/dashboard/loan-progress-stepper"
import { DocumentLibrary } from "@/components/documents/document-library"
import { mockLoanApplications } from "@/lib/mock-data"
import type { Document } from "@/lib/types"
import { ArrowLeft, DollarSign, Calendar, FileText, User, Percent } from "lucide-react"
import Link from "next/link"

export default function LoanDetailPage() {
  const params = useParams()
  const loanId = params.id as string

  const loan = mockLoanApplications.find((l) => l.id === loanId)
  const [documents, setDocuments] = React.useState<Document[]>(loan?.documents || [])

  if (!loan) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Loan Not Found</h2>
          <p className="text-muted-foreground mt-2">The requested loan application could not be found.</p>
          <Button asChild className="mt-4">
            <Link href="/loans">Back to Loans</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const progressSteps = [
    {
      id: "application",
      title: "Application",
      description: "Submitted",
      status: "completed" as const,
    },
    {
      id: "review",
      title: "Review",
      description: "Document verification",
      status:
        loan.stage === "review"
          ? ("current" as const)
          : loan.status === "approved" || loan.status === "disbursed"
            ? ("completed" as const)
            : ("upcoming" as const),
    },
    {
      id: "approval",
      title: "Approval",
      description: "Final approval",
      status:
        loan.stage === "approval-1" || loan.stage === "approval-2"
          ? ("current" as const)
          : loan.status === "approved" || loan.status === "disbursed"
            ? ("completed" as const)
            : ("upcoming" as const),
    },
    {
      id: "disbursement",
      title: "Disbursement",
      description: "Funds transfer",
      status:
        loan.status === "disbursed"
          ? ("completed" as const)
          : loan.stage === "disbursement"
            ? ("current" as const)
            : ("upcoming" as const),
    },
  ]

  const handleApproveDocument = (documentId: string, comments?: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              status: "approved" as const,
              reviewedAt: new Date(),
              reviewedBy: "Current User",
              comments,
            }
          : doc,
      ),
    )
  }

  const handleRejectDocument = (documentId: string, reason: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              status: "rejected" as const,
              reviewedAt: new Date(),
              reviewedBy: "Current User",
              comments: reason,
            }
          : doc,
      ),
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/loans">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Loans
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{loan.purpose}</h2>
            <p className="text-muted-foreground">Application ID: {loan.id.toUpperCase()}</p>
          </div>
          <StatusBadge status={loan.status} />
        </div>

        {/* Loan Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Loan Details */}
            <Card>
              <CardHeader>
                <CardTitle>Loan Details</CardTitle>
                <CardDescription>Complete information about this loan application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Loan Amount</p>
                        <p className="font-semibold">${loan.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Interest Rate</p>
                        <p className="font-semibold">{loan.interestRate}% APR</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Term</p>
                        <p className="font-semibold">{loan.term} months</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Client</p>
                        <p className="font-semibold">{loan.clientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">KYC Number</p>
                        <p className="font-semibold font-mono">{loan.kycNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Applied</p>
                        <p className="font-semibold">{loan.createdAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-muted-foreground">Purpose</p>
                  <p className="mt-1">{loan.purpose}</p>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <DocumentLibrary
              documents={documents}
              onApproveDocument={handleApproveDocument}
              onRejectDocument={handleRejectDocument}
              canReview={false} // Set to true for financier role
              title="Application Documents"
              description="Documents submitted with this loan application"
            />
          </div>

          {/* Progress Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Progress</CardTitle>
                <CardDescription>Track the status of your loan application</CardDescription>
              </CardHeader>
              <CardContent>
                <LoanProgressStepper steps={progressSteps} />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href={`/expenditure?loan=${loan.id}`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Manage Expenditure
                  </Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Payment History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
