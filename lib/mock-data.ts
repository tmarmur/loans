import type {
  LoanApplication,
  ExpenditureItem,
  ExpenseClaim,
  PaymentEntry,
  BusinessTrainingCourse,
  User,
} from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    email: "john.client@example.com",
    name: "John Doe",
    role: "client",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    email: "sarah.financier@example.com",
    name: "Sarah Wilson",
    role: "financier",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    email: "admin@loanplatform.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
]

export const mockLoanApplications: LoanApplication[] = [
  {
    id: "loan-001",
    clientId: "1",
    clientName: "John Doe",
    kycNumber: "KYC123456789",
    amount: 50000,
    purpose: "Business expansion",
    status: "under-review",
    stage: "review",
    interestRate: 8.5,
    term: 24,
    documents: [
      {
        id: "doc-001",
        name: "Business Plan.pdf",
        type: "business-plan",
        url: "/documents/business-plan.pdf",
        status: "approved",
        uploadedAt: new Date("2024-01-20"),
        reviewedAt: new Date("2024-01-22"),
        reviewedBy: "Sarah Wilson",
      },
      {
        id: "doc-002",
        name: "Financial Projections.xlsx",
        type: "financial-projections",
        url: "/documents/financial-projections.xlsx",
        status: "pending",
        uploadedAt: new Date("2024-01-21"),
      },
    ],
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-22"),
    reviewedBy: "Sarah Wilson",
  },
  {
    id: "loan-002",
    clientId: "1",
    clientName: "John Doe",
    kycNumber: "KYC123456789",
    amount: 25000,
    purpose: "Equipment purchase",
    status: "approved",
    stage: "disbursement",
    interestRate: 7.5,
    term: 18,
    documents: [],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-25"),
    approvedBy: ["Sarah Wilson", "Mike Johnson"],
  },
]

export const mockExpenditureItems: ExpenditureItem[] = [
  {
    id: "exp-001",
    loanId: "loan-002",
    lineItem: "Office Equipment",
    allocatedAmount: 10000,
    spentAmount: 3500,
    remainingAmount: 6500,
    status: "available",
    claims: [],
  },
  {
    id: "exp-002",
    loanId: "loan-002",
    lineItem: "Marketing & Advertising",
    allocatedAmount: 5000,
    spentAmount: 2000,
    remainingAmount: 3000,
    status: "available",
    claims: [],
  },
  {
    id: "exp-003",
    loanId: "loan-002",
    lineItem: "Staff Training",
    allocatedAmount: 3000,
    spentAmount: 0,
    remainingAmount: 3000,
    status: "available",
    claims: [],
  },
]

export const mockExpenseClaims: ExpenseClaim[] = [
  {
    id: "claim-001",
    expenditureItemId: "exp-001",
    amount: 1500,
    description: "Purchase of office chairs and desks",
    type: "bank-transfer",
    documents: [
      {
        id: "doc-003",
        name: "Invoice-001.pdf",
        type: "other",
        url: "/documents/invoice-001.pdf",
        status: "pending",
        uploadedAt: new Date("2024-01-25"),
      },
    ],
    status: "pending",
    submittedAt: new Date("2024-01-25"),
  },
]

export const mockPaymentEntries: PaymentEntry[] = [
  {
    id: "pay-001",
    loanId: "loan-002",
    amount: 25000,
    referenceNumber: "REF123456789",
    status: "confirmed",
    paymentDate: new Date("2024-01-26"),
    confirmedAt: new Date("2024-01-26"),
    confirmedBy: "Admin User",
  },
  {
    id: "pay-002",
    loanId: "loan-001",
    amount: 50000,
    referenceNumber: "REF987654321",
    status: "pending",
    paymentDate: new Date("2024-01-27"),
  },
]

export const mockBusinessTrainingCourses: BusinessTrainingCourse[] = [
  {
    id: "course-001",
    title: "Financial Management for Small Business",
    provider: "Business Academy",
    duration: "4 weeks",
    description: "Learn essential financial management skills for running a successful business.",
    category: "Finance",
  },
  {
    id: "course-002",
    title: "Digital Marketing Fundamentals",
    provider: "Marketing Institute",
    duration: "6 weeks",
    description: "Master the basics of digital marketing to grow your business online.",
    category: "Marketing",
  },
  {
    id: "course-003",
    title: "Leadership and Team Management",
    provider: "Leadership Center",
    duration: "3 weeks",
    description: "Develop leadership skills to effectively manage and motivate your team.",
    category: "Management",
  },
]
