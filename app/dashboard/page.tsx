"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Dashboard } from "@/components/dashboard/dashboard"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('🔍 DashboardPage: Auth state:', { isAuthenticated, isLoading, user: user ? 'exists' : 'null' });
    
    if (!isLoading && !isAuthenticated) {
      console.log('🔍 DashboardPage: Not authenticated, redirecting to login');
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router, user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect via useEffect
  }

  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  )
} 