import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Step {
  id: string
  title: string
  description: string
  status: "completed" | "current" | "upcoming"
}

interface LoanProgressStepperProps {
  steps: Step[]
  className?: string
}

export function LoanProgressStepper({ steps, className }: LoanProgressStepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <nav aria-label="Progress">
        <ol className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, stepIdx) => (
            <li key={step.id} className="md:flex-1">
              <div
                className={cn(
                  "group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",
                  step.status === "completed"
                    ? "border-green-600"
                    : step.status === "current"
                      ? "border-blue-600"
                      : "border-gray-200",
                )}
              >
                <span className="text-sm font-medium">
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                      step.status === "completed"
                        ? "bg-green-600 text-white"
                        : step.status === "current"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600",
                    )}
                  >
                    {step.status === "completed" ? <Check className="h-4 w-4" /> : stepIdx + 1}
                  </span>
                </span>
                <span className="text-sm font-medium mt-2">{step.title}</span>
                <span className="text-sm text-muted-foreground">{step.description}</span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
