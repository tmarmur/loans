import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "under-review"
    | "draft"
    | "submitted"
    | "disbursed"
    | "confirmed"
    | "failed"
  variant?: "default" | "outline"
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
  },
  approved: {
    label: "Approved",
    className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
  },
  "under-review": {
    label: "Under Review",
    className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  },
  draft: {
    label: "Draft",
    className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
  },
  submitted: {
    label: "Submitted",
    className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  },
  disbursed: {
    label: "Disbursed",
    className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
  },
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, status, variant = "default", ...props }, ref) => {
    const config = statusConfig[status]

    return (
      <Badge ref={ref} variant={variant} className={cn(config.className, className)} {...props}>
        {config.label}
      </Badge>
    )
  },
)
StatusBadge.displayName = "StatusBadge"

export { StatusBadge }
