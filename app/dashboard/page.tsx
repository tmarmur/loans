"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { LoanProgressStepper } from "@/components/dashboard/loan-progress-stepper"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { mockLoanApplications } from "@/lib/mock-data"
import { CreditCard, DollarSign, FileText, TrendingUp, Plus, Eye } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  // Mock data based on user role
  const userLoans = mockLoanApplications.filter((loan) => loan.clientId === user.id)
  const totalLoanAmount = userLoans.reduce((sum, loan) => sum + loan.amount, 0)
  const activeLoan = userLoans.find((loan) => loan.status === "approved" || loan.status === "disbursed")
  const pendingApplications = userLoans.filter((loan) => loan.status === "under-review" || loan.status === "submitted")

  // Progress steps for active loan
  const progressSteps = [
    {
      id: "application",
      title: "Application",
      description: "Submit loan application",
      status: "completed" as const,
    },
    {
      id: "review",
      title: "Review",
      description: "Document verification",
      status:
        activeLoan?.stage === "review"
          ? ("current" as const)
          : activeLoan
            ? ("completed" as const)
            : ("upcoming" as const),
    },
    {
      id: "approval",
      title: "Approval",
      description: "Final approval process",
      status:
        activeLoan?.stage === "approval-1" || activeLoan?.stage === "approval-2"
          ? ("current" as const)
          : activeLoan?.status === "approved" || activeLoan?.status === "disbursed"
            ? ("completed" as const)
            : ("upcoming" as const),
    },
    {
      id: "disbursement",
      title: "Disbursement",
      description: "Funds transfer",
      status:
        activeLoan?.status === "disbursed"
          ? ("completed" as const)
          : activeLoan?.stage === "disbursement"
            ? ("current" as const)
            : ("upcoming" as const),
    },
  ]

  // Recent activities
  const recentActivities = [
    {
      id: "1",
      type: "document-upload" as const,
      title: "Document Uploaded",
      description: "Financial projections uploaded for review",
      status: "pending" as const,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: "2",
      type: "loan-application" as const,
      title: "Application Submitted",
      description: "Business expansion loan application submitted",
      status: "under-review" as const,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Overview of your loans and applications</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/loans/apply">
                <Plus className="mr-2 h-4 w-4" />
                New Application
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Loan Amount"
            value={`$${totalLoanAmount.toLocaleString()}`}
            description="Across all applications"
            icon={DollarSign}
          />
          <StatsCard
            title="Active Loans"
            value={userLoans.filter((l) => l.status === "approved" || l.status === "disbursed").length}
            description="Currently active"
            icon={CreditCard}
          />
          <StatsCard
            title="Pending Applications"
            value={pendingApplications.length}
            description="Under review"
            icon={FileText}
          />
          <StatsCard
            title="Available Credit"
            value={activeLoan ? `$${(activeLoan.amount * 0.8).toLocaleString()}` : "$0"}
            description="Ready to use"
            icon={TrendingUp}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Loan Progress */}
          {activeLoan && (
            <Card>
              <CardHeader>
                <CardTitle>Loan Progress</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {activeLoan.purpose} - ${activeLoan.amount.toLocaleString()}
                </p>
              </CardHeader>
              <CardContent>
                <LoanProgressStepper steps={progressSteps} />
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <RecentActivity activities={recentActivities} />
        </div>

        {/* Loan Applications Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Loan Applications</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/loans">
                <Eye className="mr-2 h-4 w-4" />
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userLoans.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">No loan applications</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get started by creating your first loan application.
                  </p>
                  <div className="mt-6">
                    <Button asChild>
                      <Link href="/loans/apply">
                        <Plus className="mr-2 h-4 w-4" />
                        New Application
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                userLoans.map((loan) => (
                  <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{loan.purpose}</h4>
                        <StatusBadge status={loan.status} />
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>Amount: ${loan.amount.toLocaleString()}</span>
                        <span>Rate: {loan.interestRate}%</span>
                        <span>Term: {loan.term} months</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/loans/${loan.id}`}>View Details</Link>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
