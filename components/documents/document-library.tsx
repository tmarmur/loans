"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DocumentViewer } from "./document-viewer"
import type { Document } from "@/lib/types"
import { Search, Filter, Eye, Download, FileText, Calendar, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface DocumentLibraryProps {
  documents: Document[]
  onApproveDocument?: (documentId: string, comments?: string) => void
  onRejectDocument?: (documentId: string, reason: string) => void
  canReview?: boolean
  title?: string
  description?: string
}

export function DocumentLibrary({
  documents,
  onApproveDocument,
  onRejectDocument,
  canReview = false,
  title = "Document Library",
  description = "Manage and review uploaded documents",
}: DocumentLibraryProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [selectedDocument, setSelectedDocument] = React.useState<Document | null>(null)
  const [isViewerOpen, setIsViewerOpen] = React.useState(false)
  const [isReviewLoading, setIsReviewLoading] = React.useState(false)

  const filteredDocuments = React.useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || doc.type === typeFilter
      const matchesStatus = statusFilter === "all" || doc.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [documents, searchTerm, typeFilter, statusFilter])

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document)
    setIsViewerOpen(true)
  }

  const handleApproveDocument = async (documentId: string, comments?: string) => {
    if (!onApproveDocument) return

    setIsReviewLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onApproveDocument(documentId, comments)
    setIsReviewLoading(false)
    setIsViewerOpen(false)
    setSelectedDocument(null)
  }

  const handleRejectDocument = async (documentId: string, reason: string) => {
    if (!onRejectDocument) return

    setIsReviewLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onRejectDocument(documentId, reason)
    setIsReviewLoading(false)
    setIsViewerOpen(false)
    setSelectedDocument(null)
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

  const documentTypes = Array.from(new Set(documents.map((doc) => doc.type)))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace("-", " ").toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Documents Grid */}
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No documents found</h3>
              <p className="text-muted-foreground">No documents match your current filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Document Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getFileIcon(document.name)}</span>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium truncate">{document.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {document.type.replace("-", " ").toUpperCase()}
                            </p>
                          </div>
                        </div>
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

                      {/* Document Info */}
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Uploaded {formatDistanceToNow(document.uploadedAt, { addSuffix: true })}</span>
                        </div>
                        {document.reviewedBy && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>Reviewed by {document.reviewedBy}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDocument(document)}
                          className="flex-1"
                        >
                          <Eye className="mr-2 h-3 w-3" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Viewer */}
      <DocumentViewer
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false)
          setSelectedDocument(null)
        }}
        document={selectedDocument}
        onApprove={handleApproveDocument}
        onReject={handleRejectDocument}
        canReview={canReview}
        isLoading={isReviewLoading}
      />
    </div>
  )
}
