"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { mockLoanApplications } from "@/lib/mock-data"
import { Search, Eye, CheckCircle, XCircle, Clock } from "lucide-react"
import type { LoanApplication } from "@/lib/types"

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [selectedApplication, setSelectedApplication] = React.useState<LoanApplication | null>(null)
  const [reviewComment, setReviewComment] = React.useState("")
  const [isReviewLoading, setIsReviewLoading] = React.useState(false)

  // Filter applications that need review
  const pendingApplications = mockLoanApplications.filter(
    (app) => app.status === "under_review" || app.status === "pending",
  )

  const filteredApplications = pendingApplications.filter((app) => {
    const matchesSearch =
      app.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleReview = async (applicationId: string, action: "approve" | "reject") => {
    setIsReviewLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log(`${action} application:`, { applicationId, comment: reviewComment })

    setIsReviewLoading(false)
    setSelectedApplication(null)
    setReviewComment("")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "under_review":
        return (
          <Badge variant="outline">
            <Eye className="w-3 h-3 mr-1" />
            Under Review
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pending Reviews</h2>
          <p className="text-muted-foreground">Review loan applications requiring your attention</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Applications Awaiting Review</CardTitle>
            <CardDescription>{filteredApplications.length} applications need your review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by client or business name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.clientName}</TableCell>
                    <TableCell>{application.businessName}</TableCell>
                    <TableCell>${application.amount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell>{new Date(application.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={application.priority === "high" ? "destructive" : "secondary"}>
                        {application.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedApplication(application)}>
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Review Application</DialogTitle>
                            <DialogDescription>Review and approve or reject this loan application</DialogDescription>
                          </DialogHeader>

                          {selectedApplication && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Client Name</label>
                                  <p className="text-sm text-muted-foreground">{selectedApplication.clientName}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Business Name</label>
                                  <p className="text-sm text-muted-foreground">{selectedApplication.businessName}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Loan Amount</label>
                                  <p className="text-sm text-muted-foreground">
                                    ${selectedApplication.amount.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Purpose</label>
                                  <p className="text-sm text-muted-foreground">{selectedApplication.purpose}</p>
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium">Review Comments</label>
                                <Textarea
                                  placeholder="Add your review comments..."
                                  value={reviewComment}
                                  onChange={(e) => setReviewComment(e.target.value)}
                                  className="mt-1"
                                />
                              </div>

                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  onClick={() => handleReview(selectedApplication.id, "reject")}
                                  disabled={isReviewLoading}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  onClick={() => handleReview(selectedApplication.id, "approve")}
                                  disabled={isReviewLoading}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
