"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
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
import { Button } from "@/components/ui/button"
import { AuthDebugger } from "@/components/test/AuthDebugger"
import LeadForm from "../methods/LeadForm"
import LeadsMethod from "./LeadsMethod"

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
    isActive: true,
  },
  {
    title: "File Upload",
    icon: CloudUpload,
    key: "file_upload",
    description: "อัพโหลดไฟล์ .csv",
    isActive: true,
  },
  {
    title: "Google Sheet",
    icon: TableProperties,
    key: "google_sheet",
    description: "เชื่อมต่อกับ Google Sheet",
    isActive: false,
  },
  {
    title: "Open API",
    icon: Webhook,
    key: "open_api",
    description: "Open API",
    isActive: false,
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

  // Debug user data
  // useEffect(() => {
  //   console.log('🔍 Dashboard: User data:', user);
  //   console.log('🔍 Dashboard: User role ID:', user?.userRoleID);
  //   console.log('🔍 Dashboard: User display name:', user?.displayName);
  // }, [user])

  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method)
    document.getElementById('addLeadsPanel')?.scrollIntoView({ behavior: 'smooth' })
  }


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
          <Card key={index} className={`${stat.backgroundColor} flex flex-col gap-3 p-4`}>
            <div className="flex flex-row">
              <div className="w-1/3">
                <div className={`${stat.iconColor} w-14 h-10 rounded-2xl flex items-center justify-center`}>
                  <stat.icon />
                </div>
              </div>
              <div className="w-2/3">
                <div className="text-3xl font-medium text-center">{stat.value}</div>
              </div>
            </div>
            <div className="w-full">
              <div className="font-medium text-[12px] text-gray-700 text-center">{stat.title}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Role-based Content Sections */}

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
              <a 
                href="/dashboard/auth-test" 
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Auth Test →
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
          <h3 className="text-2xl font-medium">ADD LEADS METHODS</h3>
          <div className="h-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          { addLeadsMethod.map((method, index) => (
            <Card key={index} className={`border-[3px] ${method.isActive ? 'border-gray-300 bg-gray-50 cursor-pointer hover:scale-105' : 'cursor-not-allowed hidden'} ${selectedMethod === method.key ? 'border-blue-500 bg-blue-50' : ''} rounded-xl transition-all duration-300`} onClick={() => handleSelectMethod(method.key)}>
              <CardHeader>
                <h3 className={`text-xl font-medium ${selectedMethod === method.key ? 'text-blue-800' : 'text-gray-500'}`}>{method.title}</h3>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${method.isActive ? 'text-gray-600' : 'text-gray-400'} ${selectedMethod === method.key ? 'text-blue-600' : 'text-gray-600'}`}>{method.description}</p>
              </CardContent>
            </Card>
            ))}
          </div>
          <div className="h-10"></div>
          { selectedMethod && (
            <div id="addLeadsPanel" className="h-4">
              <div className="flex flex-col gap-4 min-h-[500px]">
                <LeadsMethod selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} />
              </div>
            </div>
          ) }
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
