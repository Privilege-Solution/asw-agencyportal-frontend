"use client"

import { useState } from "react"
import { AuthForm } from "@/components/auth/auth-form"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <AuthForm onAuthenticated={() => setIsAuthenticated(true)} />
      </div>
    )
  }

  return <DashboardLayout />
}
