"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { UserManagementTable } from "@/components/admin/user-management-table"
import { mockUsers } from "@/lib/mock-data"
import type { User } from "@/lib/types"

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>(mockUsers)

  const handleCreateUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name!,
      email: userData.email!,
      role: userData.role!,
      createdAt: new Date(),
    }

    setUsers((prev) => [...prev, newUser])
    console.log("User created:", newUser)
  }

  const handleUpdateUser = (userId: string, userData: Partial<User>) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, ...userData } : user)))
    console.log("User updated:", { userId, userData })
  }

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
    console.log("User deleted:", userId)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">Manage system users and their roles</p>
        </div>

        <UserManagementTable
          users={users}
          onCreateUser={handleCreateUser}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>
    </DashboardLayout>
  )
}
