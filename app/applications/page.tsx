"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ApplicationReviewTable } from "@/components/financier/application-review-table"
import { ApplicationDetailModal } from "@/components/financier/application-detail-modal"
import { mockLoanApplications } from "@/lib/mock-data"
import type { LoanApplication } from "@/lib/types"

export default function ApplicationsPage() {
  const [selectedApplication, setSelectedApplication] = React.useState<LoanApplication | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false)
  const [isReviewLoading, setIsReviewLoading] = React.useState(false)

  const handleViewApplication = (applicationId: string) => {
    const application = mockLoanApplications.find((app) => app.id === applicationId)
    if (application) {
      setSelectedApplication(application)
      setIsDetailModalOpen(true)
    }
  }

  const handleApprove = async (
    applicationId: string,
    comments: string,
    recommendTraining: boolean,
    selectedCourses: string[],
  ) => {
    setIsReviewLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Approved application:", {
      applicationId,
      comments,
      recommendTraining,
      selectedCourses,
    })

    setIsReviewLoading(false)
    setIsDetailModalOpen(false)
    setSelectedApplication(null)
  }

  const handleReject = async (applicationId: string, reason: string) => {
    setIsReviewLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Rejected application:", { applicationId, reason })

    setIsReviewLoading(false)
    setIsDetailModalOpen(false)
    setSelectedApplication(null)
  }

  const handleRequestChanges = async (applicationId: string, changes: string) => {
    setIsReviewLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Requested changes for application:", { applicationId, changes })

    setIsReviewLoading(false)
    setIsDetailModalOpen(false)
    setSelectedApplication(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Loan Applications</h2>
          <p className="text-muted-foreground">Review and manage loan applications from clients</p>
        </div>

        <ApplicationReviewTable applications={mockLoanApplications} onViewApplication={handleViewApplication} />

        <ApplicationDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedApplication(null)
          }}
          application={selectedApplication}
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestChanges={handleRequestChanges}
          isLoading={isReviewLoading}
        />
      </div>
    </DashboardLayout>
  )
}
