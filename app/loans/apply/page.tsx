"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LoanApplicationForm } from "@/components/forms/loan-application-form"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoanApplicationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Loan application submitted:", data)
    setIsSubmitting(false)
    setIsSubmitted(true)

    // Redirect after success
    setTimeout(() => {
      router.push("/loans")
    }, 3000)
  }

  if (isSubmitted) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
                <div>
                  <h2 className="text-2xl font-bold">Application Submitted Successfully!</h2>
                  <p className="text-muted-foreground mt-2">
                    Your loan application has been submitted and is now under review. You will receive an email
                    confirmation shortly.
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Application ID:</strong> LN-{Date.now().toString().slice(-6)}
                  </p>
                  <p className="text-sm mt-1">
                    <strong>Expected Review Time:</strong> 3-5 business days
                  </p>
                </div>
                <Button asChild>
                  <Link href="/loans">View My Applications</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Loan Application</h2>
          <p className="text-muted-foreground">Complete all sections to submit your loan application for review.</p>
        </div>

        <Alert>
          <AlertDescription>
            <strong>Before you start:</strong> Make sure you have all required documents ready including resolution
            letter, business plan, financial projections, and relevant contracts.
          </AlertDescription>
        </Alert>

        <div className="max-w-4xl">
          <LoanApplicationForm onSubmit={handleSubmit} isLoading={isSubmitting} />
        </div>
      </div>
    </DashboardLayout>
  )
}
