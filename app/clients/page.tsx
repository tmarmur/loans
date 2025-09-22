"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockLoanApplications, mockExpenseClaims } from "@/lib/mock-data"
import { Search, Eye, User, Building2, CreditCard, Receipt, Phone, Mail } from "lucide-react"

// Create mock client data from applications
const mockClients = Array.from(new Set(mockLoanApplications.map((app) => app.clientName))).map((name, index) => {
  const clientApplications = mockLoanApplications.filter((app) => app.clientName === name)
  const clientClaims = mockExpenseClaims.filter((claim) => claim.clientName === name)

  return {
    id: `client-${index + 1}`,
    name,
    email: `${name.toLowerCase().replace(" ", ".")}@email.com`,
    phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    businessName: clientApplications[0]?.businessName || "N/A",
    totalLoans: clientApplications.length,
    activeLoans: clientApplications.filter((app) => app.status === "approved").length,
    totalAmount: clientApplications.reduce((sum, app) => sum + app.amount, 0),
    pendingClaims: clientClaims.filter((claim) => claim.status === "pending").length,
    status: clientApplications.some((app) => app.status === "approved") ? "active" : "inactive",
    joinedDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    applications: clientApplications,
    claims: clientClaims,
  }
})

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [selectedClient, setSelectedClient] = React.useState<(typeof mockClients)[0] | null>(null)

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Client Management</h2>
          <p className="text-muted-foreground">Manage and monitor your clients' loan portfolios</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client Portfolio</CardTitle>
            <CardDescription>{filteredClients.length} clients in your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by client or business name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Total Loans</TableHead>
                  <TableHead>Active Loans</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Pending Claims</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-muted-foreground">{client.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        {client.businessName}
                      </div>
                    </TableCell>
                    <TableCell>{client.totalLoans}</TableCell>
                    <TableCell>{client.activeLoans}</TableCell>
                    <TableCell>${client.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      {client.pendingClaims > 0 ? (
                        <Badge variant="outline">{client.pendingClaims}</Badge>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedClient(client)}>
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Client Details</DialogTitle>
                            <DialogDescription>
                              Complete overview of client's loan portfolio and activity
                            </DialogDescription>
                          </DialogHeader>

                          {selectedClient && (
                            <div className="space-y-6">
                              {/* Client Info */}
                              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                                <div>
                                  <label className="text-sm font-medium">Client Name</label>
                                  <p className="text-sm">{selectedClient.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Business Name</label>
                                  <p className="text-sm">{selectedClient.businessName}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Email</label>
                                  <p className="text-sm flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {selectedClient.email}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Phone</label>
                                  <p className="text-sm flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {selectedClient.phone}
                                  </p>
                                </div>
                              </div>

                              <Tabs defaultValue="applications" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                  <TabsTrigger value="applications">
                                    <CreditCard className="w-4 h-4 mr-1" />
                                    Loan Applications ({selectedClient.applications.length})
                                  </TabsTrigger>
                                  <TabsTrigger value="claims">
                                    <Receipt className="w-4 h-4 mr-1" />
                                    Expense Claims ({selectedClient.claims.length})
                                  </TabsTrigger>
                                </TabsList>

                                <TabsContent value="applications" className="space-y-4">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Purpose</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Submitted</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedClient.applications.map((app) => (
                                        <TableRow key={app.id}>
                                          <TableCell>${app.amount.toLocaleString()}</TableCell>
                                          <TableCell>{app.purpose}</TableCell>
                                          <TableCell>{getStatusBadge(app.status)}</TableCell>
                                          <TableCell>{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TabsContent>

                                <TabsContent value="claims" className="space-y-4">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Submitted</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedClient.claims.map((claim) => (
                                        <TableRow key={claim.id}>
                                          <TableCell>{claim.description}</TableCell>
                                          <TableCell>${claim.amount.toLocaleString()}</TableCell>
                                          <TableCell>{claim.category}</TableCell>
                                          <TableCell>{getStatusBadge(claim.status)}</TableCell>
                                          <TableCell>{new Date(claim.submittedAt).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TabsContent>
                              </Tabs>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
