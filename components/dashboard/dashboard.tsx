"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Calendar, Link, Plus, FileUser, Upload, UserPlus, CloudUpload, TableProperties, Webhook } from "lucide-react"
import { WalkIcon, BookIcon, FollowUpsIcon, LeadsIcon, CircleXIcon, FormIcon } from "@/lib/icons"
import Image from "next/image"

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
    description: "เพิ่มข้อมูลผ่านแบบฟอร์ม",
  },
  {
    title: "File Upload",
    icon: CloudUpload,
    description: "อัพโหลดไฟล์ .csv",
  },
  {
    title: "Google Sheet",
    icon: TableProperties,
    description: "เชื่อมต่อกับ Google Sheet",
  },
  {
    title: "Open API",
    icon: Webhook,
    description: "Open API",
  },
]

export function Dashboard() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-gray-900">ยินดีต้อนรับ <span className="text-dashboard-blue">สมศรี</span></h2>
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
          <Link className="w-9 h-9" />
          <span className="text-4xl font-medium">CONNECTORS</span>
        </h3>
        <div id="add_leads_section" className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {addLeadsMethod.map((method, index) => (
              <div key={index} className="add-leads-method method-form cursor-pointer flex items-center justify-center gap-4 border-2 border-gray-200 rounded-2xl p-4">
                <method.icon className="w-7 h-7" />
                <span className="text-xl font-medium">{method.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
