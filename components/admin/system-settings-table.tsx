"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Edit, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import type { SystemSettings, SystemHealth } from "@/lib/types"

interface SystemSettingsTableProps {
  settings: SystemSettings[]
  healthStatus: SystemHealth[]
  onUpdateSetting: (settingId: string, value: string) => void
  onCreateSetting: (settingData: Partial<SystemSettings>) => void
}

export function SystemSettingsTable({
  settings,
  healthStatus,
  onUpdateSetting,
  onCreateSetting,
}: SystemSettingsTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editValue, setEditValue] = React.useState("")

  const categories = ["all", "general", "security", "notifications", "integrations"]

  const filteredSettings = settings.filter((setting) => {
    const matchesSearch =
      setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setting.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || setting.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const settingData = {
      category: formData.get("category") as "general" | "security" | "notifications" | "integrations",
      key: formData.get("key") as string,
      value: formData.get("value") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as "string" | "number" | "boolean" | "json",
    }

    onCreateSetting(settingData)
    setIsCreateDialogOpen(false)
  }

  const handleEdit = (setting: SystemSettings) => {
    setEditingId(setting.id)
    setEditValue(setting.value)
  }

  const handleSave = (settingId: string) => {
    onUpdateSetting(settingId, editValue)
    setEditingId(null)
    setEditValue("")
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValue("")
  }

  const getCategoryBadge = (category: string) => {
    const variants = {
      general: "default",
      security: "destructive",
      notifications: "secondary",
      integrations: "outline",
    } as const

    return <Badge variant={variants[category as keyof typeof variants] || "default"}>{category}</Badge>
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="settings" className="w-full">
        <TabsList>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>System Configuration</CardTitle>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Setting
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Setting</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" defaultValue="general">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                            <SelectItem value="notifications">Notifications</SelectItem>
                            <SelectItem value="integrations">Integrations</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="key">Key</Label>
                        <Input id="key" name="key" required />
                      </div>
                      <div>
                        <Label htmlFor="value">Value</Label>
                        <Input id="value" name="value" required />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" required />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select name="type" defaultValue="string">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Create Setting</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search settings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSettings.map((setting) => (
                    <TableRow key={setting.id}>
                      <TableCell>{getCategoryBadge(setting.category)}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">{setting.key}</code>
                      </TableCell>
                      <TableCell>
                        {editingId === setting.id ? (
                          <div className="flex items-center gap-2">
                            <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-32" />
                            <Button size="sm" onClick={() => handleSave(setting.id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancel}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <span className="font-mono text-sm">{setting.value}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{setting.type}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-muted-foreground truncate">{setting.description}</p>
                      </TableCell>
                      <TableCell>
                        {editingId !== setting.id && (
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(setting)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>System Health Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {healthStatus.map((service) => (
                  <Card key={service.service}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getHealthIcon(service.status)}
                          <h3 className="font-medium">{service.service}</h3>
                        </div>
                        <Badge
                          variant={
                            service.status === "healthy"
                              ? "default"
                              : service.status === "warning"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {service.status}
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <p>Last check: {service.lastCheck.toLocaleTimeString()}</p>
                        {service.responseTime && <p>Response time: {service.responseTime}ms</p>}
                        {service.errorMessage && <p className="text-red-500">{service.errorMessage}</p>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
