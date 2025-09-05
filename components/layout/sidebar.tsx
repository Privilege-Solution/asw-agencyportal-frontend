"use client"

import { Button } from "@/components/ui/button"
import { Home, Users, FileText, Settings, BarChart3, Briefcase, FileTextIcon, Shield, Upload, TestTube } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { RoleGuard } from "@/components/rbac/RoleGuard"
import { PERMISSIONS, VIEWS } from "@/lib/types/roles"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Define menu items with role-based access control
const menuItems = [
  { 
    icon: Home, 
    label: "หน้าหลัก", 
    href: "/dashboard",
    view: VIEWS.DASHBOARD
  },
  { 
    icon: FileTextIcon, 
    label: "Leads", 
    href: "/dashboard/leads",
    view: VIEWS.LEADS
  },
  { 
    icon: Users, 
    label: "User Management", 
    href: "/dashboard/users",
    view: VIEWS.USER_MANAGEMENT
  },
  { 
    icon: Settings, 
    label: "Site Settings", 
    href: "/dashboard/settings",
    view: VIEWS.SITE_SETTINGS
  },
]

export function Sidebar() {
  const { user } = useAuth()
  const pathname = usePathname()

  return (
    <div className="bg-white border-r border-gray-200 w-64">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <img
              src="https://cdn.assetwise.co.th/wp-content/themes/seed-spring/img/asw-logo_horizontal.svg"
              alt="AssetWise Logo"
              className="w-[150px] h-auto"
            />
          </div>
        </div>

        {/* User Role Indicator */}
        {user && (
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-600">
                {user.userRoleName || `Role ${user.userRoleID}`}
                {user.agencyType && (
                  <span className="ml-1 text-blue-600">({user.agencyType})</span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <RoleGuard key={index} requiredView={item.view}>
                <li>
                  <Link href={item.href}>
                    <Button
                      variant={pathname === item.href ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start rounded-full px-5",
                        pathname === item.href && "bg-dashboard-blue/20 text-dashboard-blue hover:text-white hover:bg-dashboard-blue",
                      )}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                </li>
              </RoleGuard>
            ))}
          </ul>
        </nav>

        {/* Footer with current user info */}
        {user && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p className="font-medium">{user.displayName}</p>
              <p>{user.email}</p>
              {user.departmentName && (
                <p className="mt-1">{user.departmentName}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
