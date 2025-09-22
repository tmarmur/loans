"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { FileSpreadsheet, Download, Upload, CheckCircle, AlertTriangle } from "lucide-react"

interface ExcelUploadProps {
  onUpload: (data: ExpenditureLineItem[]) => void
  isLoading?: boolean
}

interface ExpenditureLineItem {
  id: string
  lineItem: string
  allocatedAmount: number
  description?: string
}

export function ExcelUpload({ onUpload, isLoading = false }: ExcelUploadProps) {
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setUploadError("Please upload a valid Excel file (.xlsx or .xls)")
      return
    }

    setIsUploading(true)
    setUploadError(null)
    setUploadSuccess(false)
    setUploadProgress(0)

    try {
      // Simulate file processing with progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Simulate API call to process Excel file
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock parsed data - in real app, this would come from Excel parsing
      const mockData: ExpenditureLineItem[] = [
        {
          id: "1",
          lineItem: "Office Equipment",
          allocatedAmount: 10000,
          description: "Computers, furniture, and office supplies",
        },
        {
          id: "2",
          lineItem: "Marketing & Advertising",
          allocatedAmount: 5000,
          description: "Digital marketing campaigns and promotional materials",
        },
        {
          id: "3",
          lineItem: "Staff Training",
          allocatedAmount: 3000,
          description: "Professional development and training programs",
        },
        {
          id: "4",
          lineItem: "Technology Infrastructure",
          allocatedAmount: 8000,
          description: "Software licenses and IT equipment",
        },
        {
          id: "5",
          lineItem: "Inventory Purchase",
          allocatedAmount: 15000,
          description: "Initial inventory for retail operations",
        },
        {
          id: "6",
          lineItem: "Legal & Professional Services",
          allocatedAmount: 4000,
          description: "Legal consultation and accounting services",
        },
        {
          id: "7",
          lineItem: "Utilities & Rent",
          allocatedAmount: 6000,
          description: "Office rent and utility deposits",
        },
        { id: "8", lineItem: "Insurance", allocatedAmount: 2500, description: "Business insurance premiums" },
        {
          id: "9",
          lineItem: "Transportation",
          allocatedAmount: 3500,
          description: "Vehicle purchase and transportation costs",
        },
        {
          id: "10",
          lineItem: "Research & Development",
          allocatedAmount: 7000,
          description: "Product development and research activities",
        },
      ]

      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadSuccess(true)
      onUpload(mockData)
    } catch (error) {
      setUploadError("Failed to process Excel file. Please check the format and try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    // In a real app, this would download an actual Excel template
    const templateData = `Line Item,Allocated Amount,Description
Office Equipment,10000,Computers and furniture
Marketing & Advertising,5000,Digital marketing campaigns
Staff Training,3000,Professional development
Technology Infrastructure,8000,Software and IT equipment
Inventory Purchase,15000,Initial inventory
Legal & Professional Services,4000,Legal and accounting
Utilities & Rent,6000,Office rent and utilities
Insurance,2500,Business insurance
Transportation,3500,Vehicle and transport costs
Research & Development,7000,Product development`

    const blob = new Blob([templateData], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "expenditure-template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Upload Expenditure Plan
        </CardTitle>
        <CardDescription>
          Upload your Excel file with 24 expenditure line items to manage your loan disbursement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
          <span className="text-sm text-muted-foreground">Use our template to ensure proper formatting</span>
        </div>

        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          <div className="text-center space-y-4">
            <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-medium">Upload Excel File</h3>
              <p className="text-sm text-muted-foreground">Select your expenditure plan file (.xlsx or .xls)</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />

            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Processing..." : "Choose File"}
            </Button>
          </div>
        </div>

        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Processing file...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        {uploadError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        {uploadSuccess && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Excel file processed successfully! Your expenditure items are now available for management.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            <strong>File Requirements:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Excel format (.xlsx or .xls)</li>
            <li>Maximum 24 line items</li>
            <li>Columns: Line Item, Allocated Amount, Description (optional)</li>
            <li>Maximum file size: 5MB</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
