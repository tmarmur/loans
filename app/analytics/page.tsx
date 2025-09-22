"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SystemAnalytics } from "@/components/admin/system-analytics"

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Analytics</h2>
          <p className="text-muted-foreground">Monitor platform performance and key business metrics</p>
        </div>

        <SystemAnalytics />
      </div>
    </DashboardLayout>
  )
}
