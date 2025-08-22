"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Link, UserPlus, CloudUpload, TableProperties, Webhook } from "lucide-react"
import { WalkIcon, BookIcon, FollowUpsIcon, LeadsIcon, CircleXIcon } from "@/lib/icons"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import ConnectorsTabs from "@/components/ui/connectors-tabs"
import { SimpleApiTest } from "@/components/test/SimpleApiTest"
import { RoleGuard, SuperAdminOnly, AdminAndUp } from "@/components/rbac/RoleGuard"
import { PERMISSIONS, VIEWS, ROLE_NAMES, UserRole } from "@/lib/types/roles"
import { Badge } from "@/components/ui/badge"
import { UserDataSync } from "@/components/auth/UserDataSync"

const stats = [
  {
    title: "Leads",
    value: "1,234",
    icon: LeadsIcon,
    iconColor: "bg-dashboard-blue",
    backgroundColor: "bg-dashboard-blue/20",
    color: "text-blue-600",
  },
  {
    title: "Follow-ups",
    value: "567",
    icon: FollowUpsIcon,
    iconColor: "bg-dashboard-green",
    backgroundColor: "bg-dashboard-green/20",
    color: "text-green-600",
  },
  {
    title: "None Follow-ups",
    value: "168",
    icon: CircleXIcon,
    iconColor: "bg-dashboard-pink",
    backgroundColor: "bg-dashboard-pink/20",
    color: "text-yellow-600",
  },
  {
    title: "Convert to Walk",
    value: "100",
    icon: WalkIcon,
    iconColor: "bg-dashboard-purple",
    backgroundColor: "bg-dashboard-purple/20",
    color: "text-purple-600",
  },
  {
    title: "Convert to Book",
    value: "89",
    icon: BookIcon,
    iconColor: "bg-dashboard-blue",
    backgroundColor: "bg-dashboard-blue/20",
    color: "text-blue-600",
  },
]

const addLeadsMethod = [
  {
    title: "Lead Form",
    icon: UserPlus,
    key: "lead_form",
    description: "เพิ่มข้อมูลผ่านแบบฟอร์ม",
  },
  {
    title: "File Upload",
    icon: CloudUpload,
    key: "file_upload",
    description: "อัพโหลดไฟล์ .csv",
  },
  {
    title: "Google Sheet",
    icon: TableProperties,
    key: "google_sheet",
    description: "เชื่อมต่อกับ Google Sheet",
  },
  {
    title: "Open API",
    icon: Webhook,
    key: "open_api",
    description: "Open API",
  },
]

export function Dashboard() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const { user } = useAuth()

  // Load debug utilities in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@/lib/debug-roles').catch(console.warn)
      import('@/lib/force-role-refresh').catch(console.warn)
    }
  }, [])


  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium text-gray-900">
            ยินดีต้อนรับ <span className="text-dashboard-blue">{user?.displayName}</span>
          </h2>
          {user && (
            <div className="flex items-center gap-2">
              <Badge variant={user.userRoleID === 1 ? "destructive" : user.userRoleID === 2 ? "default" : "secondary"}>
                {ROLE_NAMES[user.userRoleID as UserRole]}
              </Badge>
              {user.departmentName && (
                <Badge variant="outline">{user.departmentName}</Badge>
              )}
            </div>
          )}
        </div>
        {user?.userRoleID === 3 && user?.departmentID && (
          <p className="text-sm text-gray-600 mt-1">
            Agency ID: {user.departmentID} • You can only view your own data
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className={`${stat.backgroundColor}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className={`${stat.iconColor} w-14 h-10 rounded-2xl flex items-center justify-center`}>
                <stat.icon />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-medium text-center">{stat.value}</div>
              <div className="font-medium text-gray-700 text-center">{stat.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role-based Content Sections */}
      
      {/* Connectors - Available to all roles */}
      <RoleGuard requiredView={VIEWS.LEADS}>
        <div id="dashboard_main" className="bg-white rounded-2xl p-9 mb-8">
          <h3 className="flex items-center gap-4">
            <Link className="w-8 h-8" />
            <span className="text-2xl font-medium">CONNECTORS</span>
          </h3>
          <ConnectorsTabs />
        </div>
      </RoleGuard>

      {/* API Testing - Admin and Super Admin only */}
      <AdminAndUp>
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium">API Testing</h3>
            <div className="flex gap-4 text-sm">
              <a 
                href="/dashboard/api-test-client" 
                className="text-green-600 hover:text-green-800 font-medium"
              >
                Client-Only Test →
              </a>
              <a 
                href="/dashboard/api-test" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Full Test Page →
              </a>
            </div>
          </div>
          <SimpleApiTest />
        </div>
      </AdminAndUp>

      {/* Super Admin Only Section */}
      <SuperAdminOnly>
        <div className="mt-8">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <h3 className="text-xl font-medium text-red-800">Super Admin Controls</h3>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-4">
                These controls are only visible to Super Admins and affect system-wide settings.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-white">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Site Settings</h4>
                    <p className="text-sm text-gray-600">Configure system-wide settings, themes, and preferences.</p>
                  </CardContent>
                </Card>
                <Card className="bg-white">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">System Logs</h4>
                    <p className="text-sm text-gray-600">View system logs and monitor application health.</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </SuperAdminOnly>

      {/* Agency User Info */}
      <RoleGuard allowedRoles={[3]}>
        <div className="mt-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <h3 className="text-xl font-medium text-blue-800">Agency Dashboard</h3>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">
                Welcome to your agency dashboard. You can view and manage your leads and data.
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Data Access:</strong> Limited to your agency data only</p>
                <p><strong>Available Features:</strong> Lead management, file uploads</p>
                <p><strong>Need more access?</strong> Contact your administrator</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </RoleGuard>

      {/* User Data Sync - For monitoring role changes */}
      <AdminAndUp>
        <div className="mt-8">
          <UserDataSync />
        </div>
      </AdminAndUp>


    </div>
  )
}
