"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SystemSettingsTable } from "@/components/admin/system-settings-table"
import { mockSystemSettings, mockSystemHealth } from "@/lib/mock-data"
import type { SystemSettings } from "@/lib/types"

export default function SystemPage() {
  const [settings, setSettings] = React.useState<SystemSettings[]>(mockSystemSettings)

  const handleUpdateSetting = (settingId: string, value: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === settingId ? { ...setting, value, updatedAt: new Date(), updatedBy: "Admin User" } : setting,
      ),
    )
    console.log("Setting updated:", { settingId, value })
  }

  const handleCreateSetting = (settingData: Partial<SystemSettings>) => {
    const newSetting: SystemSettings = {
      id: `set-${Date.now()}`,
      category: settingData.category!,
      key: settingData.key!,
      value: settingData.value!,
      description: settingData.description!,
      type: settingData.type!,
      updatedAt: new Date(),
      updatedBy: "Admin User",
    }

    setSettings((prev) => [...prev, newSetting])
    console.log("Setting created:", newSetting)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Management</h2>
          <p className="text-muted-foreground">Configure system settings and monitor platform health</p>
        </div>

        <SystemSettingsTable
          settings={settings}
          healthStatus={mockSystemHealth}
          onUpdateSetting={handleUpdateSetting}
          onCreateSetting={handleCreateSetting}
        />
      </div>
    </DashboardLayout>
  )
}
