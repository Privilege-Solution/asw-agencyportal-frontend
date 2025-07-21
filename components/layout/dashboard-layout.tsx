"use client"

import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Dashboard } from "@/components/dashboard/dashboard"

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <Dashboard />
        </main>
      </div>
    </div>
  )
}
