export interface User {
  id: string
  email: string
  name: string
  role: "client" | "financier" | "admin"
  avatar?: string
  createdAt: Date
}

export interface LoanApplication {
  id: string
  clientId: string
  clientName: string
  kycNumber: string
  amount: number
  purpose: string
  status: "draft" | "submitted" | "under-review" | "approved" | "rejected" | "disbursed"
  stage: "application" | "review" | "approval-1" | "approval-2" | "disbursement"
  interestRate: number
  term: number // in months
  documents: Document[]
  createdAt: Date
  updatedAt: Date
  reviewedBy?: string
  approvedBy?: string[]
  rejectionReason?: string
}

export interface Document {
  id: string
  name: string
  type: "resolution-letter" | "business-plan" | "financial-projections" | "contract" | "other"
  url: string
  status: "pending" | "approved" | "rejected"
  uploadedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  comments?: string
}

export interface ExpenditureItem {
  id: string
  loanId: string
  lineItem: string
  allocatedAmount: number
  spentAmount: number
  remainingAmount: number
  status: "available" | "claimed" | "approved" | "rejected"
  claims: ExpenseClaim[]
}

export interface ExpenseClaim {
  id: string
  expenditureItemId: string
  amount: number
  description: string
  type: "cash" | "bank-transfer" | "cheque"
  documents: Document[]
  status: "pending" | "approved" | "rejected"
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  comments?: string
}

export interface PaymentEntry {
  id: string
  loanId: string
  amount: number
  referenceNumber: string
  status: "pending" | "confirmed" | "failed"
  paymentDate: Date
  confirmedAt?: Date
  confirmedBy?: string
}

export interface BusinessTrainingCourse {
  id: string
  title: string
  provider: string
  duration: string
  description: string
  category: string
}

export interface Financier {
  id: string
  name: string
  email: string
  contactPerson: string
  phone: string
  address: string
  registrationNumber: string
  status: "active" | "inactive" | "suspended"
  loanLimit: number
  interestRateRange: {
    min: number
    max: number
  }
  specializations: string[]
  createdAt: Date
  updatedAt: Date
}

export interface SystemSettings {
  id: string
  category: "general" | "security" | "notifications" | "integrations"
  key: string
  value: string
  description: string
  type: "string" | "number" | "boolean" | "json"
  updatedAt: Date
  updatedBy: string
}

export interface SystemHealth {
  service: string
  status: "healthy" | "warning" | "error"
  lastCheck: Date
  responseTime?: number
  errorMessage?: string
}

export type LoanStatus = "draft" | "submitted" | "under-review" | "approved" | "rejected" | "disbursed"
export type DocumentStatus = "pending" | "approved" | "rejected"
export type ClaimStatus = "pending" | "approved" | "rejected"
