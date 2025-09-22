"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { FileUpload } from "@/components/ui/file-upload"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronRight, Loader2, AlertTriangle } from "lucide-react"

const loanApplicationSchema = z.object({
  // Basic Information
  kycNumber: z
    .string()
    .min(1, "KYC number is required")
    .regex(/^KYC\d{9}$/, "KYC number must be in format KYC123456789"),
  loanAmount: z.number().min(1000, "Minimum loan amount is $1,000").max(1000000, "Maximum loan amount is $1,000,000"),
  loanPurpose: z.string().min(10, "Please provide a detailed purpose (minimum 10 characters)"),
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  yearsInBusiness: z.number().min(0, "Years in business must be 0 or greater"),

  // Financial Information
  monthlyRevenue: z.number().min(0, "Monthly revenue must be 0 or greater"),
  monthlyExpenses: z.number().min(0, "Monthly expenses must be 0 or greater"),
  existingDebt: z.number().min(0, "Existing debt must be 0 or greater"),

  // Contact Information
  contactPerson: z.string().min(1, "Contact person is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  businessAddress: z.string().min(10, "Complete business address is required"),
})

type LoanApplicationFormData = z.infer<typeof loanApplicationSchema>

interface LoanApplicationFormProps {
  onSubmit: (data: LoanApplicationFormData & { documents: File[] }) => void
  isLoading?: boolean
}

export function LoanApplicationForm({ onSubmit, isLoading = false }: LoanApplicationFormProps) {
  const [openSections, setOpenSections] = React.useState<string[]>(["basic"])
  const [uploadedDocuments, setUploadedDocuments] = React.useState<File[]>([])
  const [cashExpenditureWarning, setCashExpenditureWarning] = React.useState(false)

  const form = useForm<LoanApplicationFormData>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      kycNumber: "",
      loanAmount: 0,
      loanPurpose: "",
      businessName: "",
      businessType: "",
      yearsInBusiness: 0,
      monthlyRevenue: 0,
      monthlyExpenses: 0,
      existingDebt: 0,
      contactPerson: "",
      phoneNumber: "",
      email: "",
      businessAddress: "",
    },
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const handleFormSubmit = (data: LoanApplicationFormData) => {
    // Check cash expenditure ratio
    const cashRatio = (data.monthlyExpenses * 0.2) / data.monthlyRevenue
    if (cashRatio > 0.2) {
      setCashExpenditureWarning(true)
    } else {
      setCashExpenditureWarning(false)
    }

    onSubmit({ ...data, documents: uploadedDocuments })
  }

  const handleDocumentUpload = (files: File[]) => {
    setUploadedDocuments((prev) => [...prev, ...files])
  }

  const sections = [
    {
      id: "basic",
      title: "Basic Information",
      description: "Provide your KYC details and loan requirements",
      required: true,
    },
    {
      id: "business",
      title: "Business Information",
      description: "Details about your business operations",
      required: true,
    },
    {
      id: "financial",
      title: "Financial Information",
      description: "Your business financial details",
      required: true,
    },
    {
      id: "contact",
      title: "Contact Information",
      description: "How we can reach you",
      required: true,
    },
    {
      id: "documents",
      title: "Required Documents",
      description: "Upload supporting documents",
      required: true,
    },
  ]

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <Collapsible open={openSections.includes("basic")} onOpenChange={() => toggleSection("basic")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Basic Information
                    <span className="text-sm text-red-500">*</span>
                  </CardTitle>
                  <CardDescription>Provide your KYC details and loan requirements</CardDescription>
                </div>
                {openSections.includes("basic") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kycNumber">KYC Platform Number *</Label>
                  <Input id="kycNumber" placeholder="KYC123456789" {...form.register("kycNumber")} />
                  {form.formState.errors.kycNumber && (
                    <p className="text-sm text-red-500">{form.formState.errors.kycNumber.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan Amount ($) *</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    placeholder="50000"
                    {...form.register("loanAmount", { valueAsNumber: true })}
                  />
                  {form.formState.errors.loanAmount && (
                    <p className="text-sm text-red-500">{form.formState.errors.loanAmount.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanPurpose">Loan Purpose *</Label>
                <Textarea
                  id="loanPurpose"
                  placeholder="Describe how you plan to use the loan funds..."
                  rows={3}
                  {...form.register("loanPurpose")}
                />
                {form.formState.errors.loanPurpose && (
                  <p className="text-sm text-red-500">{form.formState.errors.loanPurpose.message}</p>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Business Information */}
      <Card>
        <Collapsible open={openSections.includes("business")} onOpenChange={() => toggleSection("business")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Business Information
                    <span className="text-sm text-red-500">*</span>
                  </CardTitle>
                  <CardDescription>Details about your business operations</CardDescription>
                </div>
                {openSections.includes("business") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input id="businessName" placeholder="Your Business Name" {...form.register("businessName")} />
                  {form.formState.errors.businessName && (
                    <p className="text-sm text-red-500">{form.formState.errors.businessName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Input
                    id="businessType"
                    placeholder="e.g., Retail, Manufacturing, Services"
                    {...form.register("businessType")}
                  />
                  {form.formState.errors.businessType && (
                    <p className="text-sm text-red-500">{form.formState.errors.businessType.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                <Input
                  id="yearsInBusiness"
                  type="number"
                  placeholder="5"
                  {...form.register("yearsInBusiness", { valueAsNumber: true })}
                />
                {form.formState.errors.yearsInBusiness && (
                  <p className="text-sm text-red-500">{form.formState.errors.yearsInBusiness.message}</p>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Financial Information */}
      <Card>
        <Collapsible open={openSections.includes("financial")} onOpenChange={() => toggleSection("financial")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Financial Information
                    <span className="text-sm text-red-500">*</span>
                  </CardTitle>
                  <CardDescription>Your business financial details</CardDescription>
                </div>
                {openSections.includes("financial") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyRevenue">Monthly Revenue ($) *</Label>
                  <Input
                    id="monthlyRevenue"
                    type="number"
                    placeholder="25000"
                    {...form.register("monthlyRevenue", { valueAsNumber: true })}
                  />
                  {form.formState.errors.monthlyRevenue && (
                    <p className="text-sm text-red-500">{form.formState.errors.monthlyRevenue.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyExpenses">Monthly Expenses ($) *</Label>
                  <Input
                    id="monthlyExpenses"
                    type="number"
                    placeholder="15000"
                    {...form.register("monthlyExpenses", { valueAsNumber: true })}
                  />
                  {form.formState.errors.monthlyExpenses && (
                    <p className="text-sm text-red-500">{form.formState.errors.monthlyExpenses.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="existingDebt">Existing Debt ($) *</Label>
                  <Input
                    id="existingDebt"
                    type="number"
                    placeholder="5000"
                    {...form.register("existingDebt", { valueAsNumber: true })}
                  />
                  {form.formState.errors.existingDebt && (
                    <p className="text-sm text-red-500">{form.formState.errors.existingDebt.message}</p>
                  )}
                </div>
              </div>

              {cashExpenditureWarning && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Warning: Cash expenditure exceeds 20% of monthly revenue. This may affect loan approval.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Contact Information */}
      <Card>
        <Collapsible open={openSections.includes("contact")} onOpenChange={() => toggleSection("contact")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Contact Information
                    <span className="text-sm text-red-500">*</span>
                  </CardTitle>
                  <CardDescription>How we can reach you</CardDescription>
                </div>
                {openSections.includes("contact") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input id="contactPerson" placeholder="John Doe" {...form.register("contactPerson")} />
                  {form.formState.errors.contactPerson && (
                    <p className="text-sm text-red-500">{form.formState.errors.contactPerson.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input id="phoneNumber" placeholder="+1 (555) 123-4567" {...form.register("phoneNumber")} />
                  {form.formState.errors.phoneNumber && (
                    <p className="text-sm text-red-500">{form.formState.errors.phoneNumber.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" placeholder="john@business.com" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address *</Label>
                <Textarea
                  id="businessAddress"
                  placeholder="123 Business St, City, State, ZIP"
                  rows={2}
                  {...form.register("businessAddress")}
                />
                {form.formState.errors.businessAddress && (
                  <p className="text-sm text-red-500">{form.formState.errors.businessAddress.message}</p>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Document Upload */}
      <Card>
        <Collapsible open={openSections.includes("documents")} onOpenChange={() => toggleSection("documents")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Required Documents
                    <span className="text-sm text-red-500">*</span>
                  </CardTitle>
                  <CardDescription>Upload supporting documents for your application</CardDescription>
                </div>
                {openSections.includes("documents") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload
                  label="Resolution Letter"
                  description="Board resolution authorizing the loan application"
                  accept=".pdf,.doc,.docx"
                  onFileSelect={handleDocumentUpload}
                  maxSize={5}
                />
                <FileUpload
                  label="Business Plan"
                  description="Detailed business plan document"
                  accept=".pdf,.doc,.docx"
                  onFileSelect={handleDocumentUpload}
                  maxSize={10}
                />
                <FileUpload
                  label="Financial Projections"
                  description="Financial forecasts and projections"
                  accept=".pdf,.xlsx,.xls"
                  onFileSelect={handleDocumentUpload}
                  maxSize={5}
                />
                <FileUpload
                  label="Contracts"
                  description="Relevant business contracts"
                  accept=".pdf,.doc,.docx"
                  onFileSelect={handleDocumentUpload}
                  maxSize={5}
                  multiple
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Separator />

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Application
        </Button>
      </div>
    </form>
  )
}
