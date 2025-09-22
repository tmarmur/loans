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
import { Search, Plus, Edit, Trash2, Building2, Phone, Mail } from "lucide-react"
import type { Financier } from "@/lib/types"

interface FinancierManagementTableProps {
  financiers: Financier[]
  onCreateFinancier: (financierData: Partial<Financier>) => void
  onUpdateFinancier: (financierId: string, financierData: Partial<Financier>) => void
  onDeleteFinancier: (financierId: string) => void
}

export function FinancierManagementTable({
  financiers,
  onCreateFinancier,
  onUpdateFinancier,
  onDeleteFinancier,
}: FinancierManagementTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedFinancier, setSelectedFinancier] = React.useState<Financier | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)

  const filteredFinanciers = financiers.filter(
    (financier) =>
      financier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      financier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      financier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const financierData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      contactPerson: formData.get("contactPerson") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      registrationNumber: formData.get("registrationNumber") as string,
      status: formData.get("status") as "active" | "inactive" | "suspended",
      loanLimit: Number(formData.get("loanLimit")),
      interestRateRange: {
        min: Number(formData.get("minRate")),
        max: Number(formData.get("maxRate")),
      },
      specializations: (formData.get("specializations") as string).split(",").map((s) => s.trim()),
    }

    onCreateFinancier(financierData)
    setIsCreateDialogOpen(false)
  }

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedFinancier) return

    const formData = new FormData(event.currentTarget)

    const financierData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      contactPerson: formData.get("contactPerson") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      registrationNumber: formData.get("registrationNumber") as string,
      status: formData.get("status") as "active" | "inactive" | "suspended",
      loanLimit: Number(formData.get("loanLimit")),
      interestRateRange: {
        min: Number(formData.get("minRate")),
        max: Number(formData.get("maxRate")),
      },
      specializations: (formData.get("specializations") as string).split(",").map((s) => s.trim()),
    }

    onUpdateFinancier(selectedFinancier.id, financierData)
    setIsEditDialogOpen(false)
    setSelectedFinancier(null)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      suspended: "destructive",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Financier Management</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Financier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Financier</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Organization Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input id="contactPerson" name="contactPerson" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" name="address" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input id="registrationNumber" name="registrationNumber" required />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue="active">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="loanLimit">Loan Limit</Label>
                  <Input id="loanLimit" name="loanLimit" type="number" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minRate">Min Interest Rate (%)</Label>
                    <Input id="minRate" name="minRate" type="number" step="0.1" required />
                  </div>
                  <div>
                    <Label htmlFor="maxRate">Max Interest Rate (%)</Label>
                    <Input id="maxRate" name="maxRate" type="number" step="0.1" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="specializations">Specializations (comma-separated)</Label>
                  <Input id="specializations" name="specializations" placeholder="SME Loans, Equipment Financing" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Financier</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search financiers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Loan Limit</TableHead>
              <TableHead>Interest Range</TableHead>
              <TableHead>Specializations</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFinanciers.map((financier) => (
              <TableRow key={financier.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{financier.name}</div>
                      <div className="text-sm text-muted-foreground">{financier.registrationNumber}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3" />
                      {financier.email}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {financier.phone}
                    </div>
                    <div className="text-sm text-muted-foreground">{financier.contactPerson}</div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(financier.status)}</TableCell>
                <TableCell>${financier.loanLimit.toLocaleString()}</TableCell>
                <TableCell>
                  {financier.interestRateRange.min}% - {financier.interestRateRange.max}%
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {financier.specializations.slice(0, 2).map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {financier.specializations.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{financier.specializations.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFinancier(financier)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteFinancier(financier.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Financier</DialogTitle>
            </DialogHeader>
            {selectedFinancier && (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Organization Name</Label>
                    <Input id="edit-name" name="name" defaultValue={selectedFinancier.name} required />
                  </div>
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input id="edit-email" name="email" type="email" defaultValue={selectedFinancier.email} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-contactPerson">Contact Person</Label>
                    <Input
                      id="edit-contactPerson"
                      name="contactPerson"
                      defaultValue={selectedFinancier.contactPerson}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input id="edit-phone" name="phone" defaultValue={selectedFinancier.phone} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-address">Address</Label>
                  <Textarea id="edit-address" name="address" defaultValue={selectedFinancier.address} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-registrationNumber">Registration Number</Label>
                    <Input
                      id="edit-registrationNumber"
                      name="registrationNumber"
                      defaultValue={selectedFinancier.registrationNumber}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <Select name="status" defaultValue={selectedFinancier.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-loanLimit">Loan Limit</Label>
                  <Input
                    id="edit-loanLimit"
                    name="loanLimit"
                    type="number"
                    defaultValue={selectedFinancier.loanLimit}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-minRate">Min Interest Rate (%)</Label>
                    <Input
                      id="edit-minRate"
                      name="minRate"
                      type="number"
                      step="0.1"
                      defaultValue={selectedFinancier.interestRateRange.min}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-maxRate">Max Interest Rate (%)</Label>
                    <Input
                      id="edit-maxRate"
                      name="maxRate"
                      type="number"
                      step="0.1"
                      defaultValue={selectedFinancier.interestRateRange.max}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-specializations">Specializations (comma-separated)</Label>
                  <Input
                    id="edit-specializations"
                    name="specializations"
                    defaultValue={selectedFinancier.specializations.join(", ")}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Financier</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
