"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Switch } from "@/components/ui/switch"
import type { LoanApplication } from "@/lib/types"
import { mockBusinessTrainingCourses } from "@/lib/mock-data"
import { CheckCircle, XCircle, MessageSquare, FileText, DollarSign, Calendar, User, Loader2 } from "lucide-react"

interface ApplicationDetailModalProps {
  isOpen: boolean
  onClose: () => void
  application: LoanApplication | null
  onApprove: (applicationId: string, comments: string, recommendTraining: boolean, selectedCourses: string[]) => void
  onReject: (applicationId: string, reason: string) => void
  onRequestChanges: (applicationId: string, changes: string) => void
  isLoading?: boolean
}

export function ApplicationDetailModal({
  isOpen,
  onClose,
  application,
  onApprove,
  onReject,
  onRequestChanges,
  isLoading = false,
}: ApplicationDetailModalProps) {
  const [reviewAction, setReviewAction] = React.useState<"approve" | "reject" | "changes" | null>(null)
  const [comments, setComments] = React.useState("")
  const [recommendTraining, setRecommendTraining] = React.useState(false)
  const [selectedCourses, setSelectedCourses] = React.useState<string[]>([])

  const handleSubmitReview = () => {
    if (!application || !reviewAction) return

    switch (reviewAction) {
      case "approve":
        onApprove(application.id, comments, recommendTraining, selectedCourses)
        break
      case "reject":
        onReject(application.id, comments)
        break
      case "changes":
        onRequestChanges(application.id, comments)
        break
    }

    // Reset form
    setReviewAction(null)
    setComments("")
    setRecommendTraining(false)
    setSelectedCourses([])
  }

  const handleClose = () => {
    setReviewAction(null)
    setComments("")
    setRecommendTraining(false)
    setSelectedCourses([])
    onClose()
  }

  if (!application) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Application Review: {application.id.toUpperCase()}
            <StatusBadge status={application.status} />
          </DialogTitle>
          <DialogDescription>Review loan application details and make approval decision</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Application Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Application Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Client</p>
                      <p className="font-medium">{application.clientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Loan Amount</p>
                      <p className="font-medium">${application.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Term</p>
                      <p className="font-medium">
                        {application.term} months at {application.interestRate}% APR
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">KYC Number</p>
                    <p className="font-medium font-mono">{application.kycNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purpose</p>
                    <p className="font-medium">{application.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="font-medium">{application.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents ({application.documents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {application.documents.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No documents uploaded</p>
              ) : (
                <div className="space-y-3">
                  {application.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {doc.type.replace("-", " ")} • Uploaded {doc.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={doc.status} />
                        <Button size="sm" variant="outline">
                          Preview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Review Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Review Decision
              </CardTitle>
              <CardDescription>Make your review decision and provide feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Action Selection */}
              <div className="flex gap-2">
                <Button
                  variant={reviewAction === "approve" ? "default" : "outline"}
                  onClick={() => setReviewAction("approve")}
                  className="flex-1"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant={reviewAction === "reject" ? "destructive" : "outline"}
                  onClick={() => setReviewAction("reject")}
                  className="flex-1"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  variant={reviewAction === "changes" ? "secondary" : "outline"}
                  onClick={() => setReviewAction("changes")}
                  className="flex-1"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Request Changes
                </Button>
              </div>

              {/* Comments */}
              {reviewAction && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="comments">
                      {reviewAction === "approve"
                        ? "Approval Comments"
                        : reviewAction === "reject"
                          ? "Rejection Reason"
                          : "Requested Changes"}
                    </Label>
                    <Textarea
                      id="comments"
                      placeholder={
                        reviewAction === "approve"
                          ? "Add any comments for the approval..."
                          : reviewAction === "reject"
                            ? "Explain the reason for rejection..."
                            : "Describe what changes are needed..."
                      }
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Business Training Recommendation */}
                  {reviewAction === "approve" && (
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="recommend-training">Recommend Business Training</Label>
                          <p className="text-sm text-muted-foreground">
                            Suggest training courses to help the client succeed
                          </p>
                        </div>
                        <Switch
                          id="recommend-training"
                          checked={recommendTraining}
                          onCheckedChange={setRecommendTraining}
                        />
                      </div>

                      {recommendTraining && (
                        <div className="space-y-3">
                          <Label>Select Training Courses</Label>
                          <div className="grid grid-cols-1 gap-2">
                            {mockBusinessTrainingCourses.map((course) => (
                              <div key={course.id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={course.id}
                                  checked={selectedCourses.includes(course.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedCourses((prev) => [...prev, course.id])
                                    } else {
                                      setSelectedCourses((prev) => prev.filter((id) => id !== course.id))
                                    }
                                  }}
                                  className="rounded border-gray-300"
                                />
                                <label htmlFor={course.id} className="text-sm">
                                  <span className="font-medium">{course.title}</span>
                                  <span className="text-muted-foreground"> - {course.provider}</span>
                                  <span className="text-muted-foreground"> ({course.duration})</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={!reviewAction || !comments.trim() || isLoading}
              variant={reviewAction === "reject" ? "destructive" : "default"}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
