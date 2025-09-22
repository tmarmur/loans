"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Document } from "@/lib/types"
import { Download, Eye, MessageSquare, CheckCircle, XCircle, Loader2 } from "lucide-react"

interface DocumentViewerProps {
  isOpen: boolean
  onClose: () => void
  document: Document | null
  onApprove?: (documentId: string, comments?: string) => void
  onReject?: (documentId: string, reason: string) => void
  canReview?: boolean
  isLoading?: boolean
}

export function DocumentViewer({
  isOpen,
  onClose,
  document,
  onApprove,
  onReject,
  canReview = false,
  isLoading = false,
}: DocumentViewerProps) {
  const [reviewAction, setReviewAction] = React.useState<"approve" | "reject" | null>(null)
  const [comments, setComments] = React.useState("")

  const handleSubmitReview = () => {
    if (!document || !reviewAction) return

    if (reviewAction === "approve" && onApprove) {
      onApprove(document.id, comments)
    } else if (reviewAction === "reject" && onReject) {
      onReject(document.id, comments)
    }

    setReviewAction(null)
    setComments("")
  }

  const handleClose = () => {
    setReviewAction(null)
    setComments("")
    onClose()
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return "📄"
      case "doc":
      case "docx":
        return "📝"
      case "xls":
      case "xlsx":
        return "📊"
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️"
      default:
        return "📎"
    }
  }

  if (!document) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{getFileIcon(document.name)}</span>
            {document.name}
            <Badge
              className={
                document.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : document.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }
            >
              {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Document type: {document.type.replace("-", " ").toUpperCase()} • Uploaded{" "}
            {document.uploadedAt.toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Preview */}
          <div className="border rounded-lg p-8 bg-muted/50 text-center">
            <div className="space-y-4">
              <div className="text-6xl">{getFileIcon(document.name)}</div>
              <div>
                <h3 className="text-lg font-medium">{document.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {document.type.replace("-", " ").toUpperCase()} Document
                </p>
              </div>
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          {/* Document Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Upload Date</Label>
              <p className="text-sm">{document.uploadedAt.toLocaleDateString()}</p>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Badge
                className={
                  document.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : document.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }
              >
                {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
              </Badge>
            </div>
            {document.reviewedBy && (
              <>
                <div className="space-y-2">
                  <Label>Reviewed By</Label>
                  <p className="text-sm">{document.reviewedBy}</p>
                </div>
                <div className="space-y-2">
                  <Label>Review Date</Label>
                  <p className="text-sm">{document.reviewedAt?.toLocaleDateString()}</p>
                </div>
              </>
            )}
          </div>

          {/* Existing Comments */}
          {document.comments && (
            <div className="space-y-2">
              <Label>Review Comments</Label>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{document.comments}</p>
              </div>
            </div>
          )}

          {/* Review Actions */}
          {canReview && document.status === "pending" && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <Label>Document Review</Label>
              </div>

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
              </div>

              {reviewAction && (
                <div className="space-y-2">
                  <Label htmlFor="review-comments">
                    {reviewAction === "approve" ? "Approval Comments (Optional)" : "Rejection Reason"}
                  </Label>
                  <Textarea
                    id="review-comments"
                    placeholder={
                      reviewAction === "approve"
                        ? "Add any comments about this approval..."
                        : "Explain why this document is being rejected..."
                    }
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            {canReview && reviewAction && (
              <Button
                onClick={handleSubmitReview}
                disabled={isLoading || (reviewAction === "reject" && !comments.trim())}
                variant={reviewAction === "reject" ? "destructive" : "default"}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Review
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
