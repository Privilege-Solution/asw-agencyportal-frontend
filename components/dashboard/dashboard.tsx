"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Link, UserPlus, CloudUpload, TableProperties, Webhook } from "lucide-react"
import { WalkIcon, BookIcon, FollowUpsIcon, LeadsIcon, CircleXIcon } from "@/lib/icons"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import ConnectorsTabs from "@/components/ui/connectors-tabs"
import { SimpleApiTest } from "@/components/test/SimpleApiTest"

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

  // Load test functions for console use
  useEffect(() => {
    const loadTestFunctions = async () => {
      try {
        // Only load in client environment
        if (typeof window !== 'undefined') {
          // Load simple test first (no complex dependencies)
          await import('@/lib/simple-test')
          // Try to load the advanced test functions
          try {
            await import('@/lib/quick-test')
          } catch (advancedError) {
            console.warn('Advanced test functions not available:', advancedError)
          }
        }
      } catch (error) {
        console.warn('Could not load test functions:', error)
      }
    }
    loadTestFunctions()
  }, [])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-gray-900">ยินดีต้อนรับ <span className="text-dashboard-blue">{user?.name}</span></h2>
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

      {/* Placeholder Content */}
      <div id="dashboard_main" className="bg-white rounded-2xl p-9">
        <h3 className="flex items-center gap-4">
          <Link className="w-8 h-8" />
          <span className="text-2xl font-medium">CONNECTORS</span>
        </h3>

        <ConnectorsTabs />
        
      </div>

      {/* GetUser API Test Section */}
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
    </div>
  )
}
