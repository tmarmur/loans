"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { LoanProgressStepper } from "@/components/dashboard/loan-progress-stepper"
import { mockLoanApplications } from "@/lib/mock-data"
import { useAuth } from "@/components/auth/auth-provider"
import { Plus, Eye, FileText, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default function LoansPage() {
  const { user } = useAuth()

  if (!user) return null

  const userLoans = mockLoanApplications.filter((loan) => loan.clientId === user.id)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Loans</h2>
            <p className="text-muted-foreground">Manage your loan applications and track their progress</p>
          </div>
          <Button asChild>
            <Link href="/loans/apply">
              <Plus className="mr-2 h-4 w-4" />
              New Application
            </Link>
          </Button>
        </div>

        {userLoans.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">No loan applications yet</h3>
                  <p className="text-muted-foreground">Get started by creating your first loan application.</p>
                </div>
                <Button asChild>
                  <Link href="/loans/apply">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Application
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {userLoans.map((loan) => {
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

              return (
                <Card key={loan.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-3">
                          {loan.purpose}
                          <StatusBadge status={loan.status} />
                        </CardTitle>
                        <CardDescription>Application ID: {loan.id.toUpperCase()}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/loans/${loan.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Loan Amount</p>
                          <p className="font-medium">${loan.amount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Applied</p>
                          <p className="font-medium">{formatDistanceToNow(loan.createdAt, { addSuffix: true })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Interest Rate</p>
                          <p className="font-medium">{loan.interestRate}% APR</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-3">Application Progress</h4>
                      <LoanProgressStepper steps={progressSteps} />
                    </div>

                    {loan.documents.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Documents ({loan.documents.length})</h4>
                        <div className="flex flex-wrap gap-2">
                          {loan.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center gap-2 text-xs bg-muted px-2 py-1 rounded">
                              <FileText className="h-3 w-3" />
                              {doc.name}
                              <StatusBadge status={doc.status} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
