"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { ExpenditureItem } from "@/lib/types"
import { AlertTriangle, Loader2 } from "lucide-react"

const expenseClaimSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  description: z.string().min(10, "Please provide a detailed description (minimum 10 characters)"),
  type: z.enum(["cash", "bank-transfer", "cheque"], {
    required_error: "Please select a payment type",
  }),
})

type ExpenseClaimFormData = z.infer<typeof expenseClaimSchema>

interface ExpenseClaimModalProps {
  isOpen: boolean
  onClose: () => void
  expenditureItem: ExpenditureItem | null
  onSubmit: (data: ExpenseClaimFormData & { documents: File[] }) => void
  isLoading?: boolean
}

export function ExpenseClaimModal({
  isOpen,
  onClose,
  expenditureItem,
  onSubmit,
  isLoading = false,
}: ExpenseClaimModalProps) {
  const [uploadedDocuments, setUploadedDocuments] = React.useState<File[]>([])
  const [cashWarning, setCashWarning] = React.useState(false)

  const form = useForm<ExpenseClaimFormData>({
    resolver: zodResolver(expenseClaimSchema),
    defaultValues: {
      amount: 0,
      description: "",
      type: undefined,
    },
  })

  const watchedAmount = form.watch("amount")
  const watchedType = form.watch("type")

  React.useEffect(() => {
    if (expenditureItem && watchedAmount > 0) {
      const cashPercentage = (watchedAmount / expenditureItem.allocatedAmount) * 100
      setCashWarning(watchedType === "cash" && cashPercentage > 20)
    }
  }, [watchedAmount, watchedType, expenditureItem])

  const handleSubmit = (data: ExpenseClaimFormData) => {
    onSubmit({ ...data, documents: uploadedDocuments })
    form.reset()
    setUploadedDocuments([])
    setCashWarning(false)
  }

  const handleClose = () => {
    form.reset()
    setUploadedDocuments([])
    setCashWarning(false)
    onClose()
  }

  if (!expenditureItem) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Expense Claim</DialogTitle>
          <DialogDescription>
            Submit an expense claim for: <strong>{expenditureItem.lineItem}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Budget Information */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Allocated</p>
                <p className="font-semibold">${expenditureItem.allocatedAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Spent</p>
                <p className="font-semibold">${expenditureItem.spentAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Remaining</p>
                <p className="font-semibold">${expenditureItem.remainingAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Claim Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Claim Amount ($) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...form.register("amount", { valueAsNumber: true })}
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
            )}
            {watchedAmount > expenditureItem.remainingAmount && (
              <p className="text-sm text-red-500">
                Amount exceeds remaining budget (${expenditureItem.remainingAmount.toLocaleString()})
              </p>
            )}
          </div>

          {/* Payment Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Payment Type *</Label>
            <Select onValueChange={(value) => form.setValue("type", value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>}
          </div>

          {/* Cash Warning */}
          {cashWarning && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Warning: Cash expenditure exceeds 20% of allocated budget for this line item. This may require
                additional approval.
              </AlertDescription>
            </Alert>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed description of the expense..."
              rows={3}
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>

          {/* Document Upload */}
          <div className="space-y-4">
            <div>
              <Label>Supporting Documents *</Label>
              <p className="text-sm text-muted-foreground">
                Upload quotations, invoices, receipts, or other supporting documents
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUpload
                label="Quotation/Invoice"
                description="Upload quotation or invoice"
                accept=".pdf,.jpg,.jpeg,.png"
                onFileSelect={(files) => setUploadedDocuments((prev) => [...prev, ...files])}
                maxSize={5}
              />
              <FileUpload
                label="Receipt/Proof"
                description="Upload receipt or payment proof"
                accept=".pdf,.jpg,.jpeg,.png"
                onFileSelect={(files) => setUploadedDocuments((prev) => [...prev, ...files])}
                maxSize={5}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || watchedAmount > expenditureItem.remainingAmount}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Claim
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
