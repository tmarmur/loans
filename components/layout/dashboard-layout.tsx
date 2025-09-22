"use client"

import type React from "react"

import { useAuth } from "@/components/auth/auth-provider"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Home,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Users,
  DollarSign,
  BarChart3,
  CheckSquare,
  Receipt,
  Building2,
} from "lucide-react"
import Link from "next/link"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigationConfig = {
  client: [
    {
      label: "Overview",
      items: [
        { title: "Dashboard", href: "/dashboard", icon: Home },
        { title: "My Loans", href: "/loans", icon: CreditCard },
      ],
    },
    {
      label: "Applications",
      items: [
        { title: "New Application", href: "/loans/apply", icon: FileText },
        { title: "Expenditure", href: "/expenditure", icon: Receipt },
      ],
    },
    {
      label: "Account",
      items: [{ title: "Settings", href: "/settings", icon: Settings }],
    },
  ],
  financier: [
    {
      label: "Overview",
      items: [
        { title: "Dashboard", href: "/dashboard", icon: Home },
        { title: "Applications", href: "/applications", icon: FileText },
      ],
    },
    {
      label: "Review",
      items: [
        { title: "Pending Reviews", href: "/reviews", icon: CheckSquare },
        { title: "Expense Claims", href: "/claims", icon: Receipt },
      ],
    },
    {
      label: "Management",
      items: [
        { title: "Clients", href: "/clients", icon: Users },
        { title: "Analytics", href: "/analytics", icon: BarChart3 },
      ],
    },
  ],
  admin: [
    {
      label: "Overview",
      items: [
        { title: "Dashboard", href: "/dashboard", icon: Home },
        { title: "Reconciliation", href: "/reconciliation", icon: DollarSign },
      ],
    },
    {
      label: "Management",
      items: [
        { title: "Users", href: "/users", icon: Users },
        { title: "Financiers", href: "/financiers", icon: Building2 },
        { title: "System", href: "/system", icon: Settings },
      ],
    },
    {
      label: "Reports",
      items: [{ title: "Analytics", href: "/analytics", icon: BarChart3 }],
    },
  ],
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  if (!user) {
    router.push("/login")
    return null
  }

  const navigation = navigationConfig[user.role] || []

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Loan Platform</h2>
              <p className="text-xs text-muted-foreground capitalize">{user.role} Portal</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {navigation.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Welcome back, {user.name}</h1>
              <p className="text-sm text-muted-foreground">Manage your loans and applications</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
