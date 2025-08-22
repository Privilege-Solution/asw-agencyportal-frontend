"use client"

import { AuthManager } from "@/components/auth/auth-manager"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-24 w-24 rounded-full mx-auto bg-neutral-300" />
          <Skeleton className="h-8 w-3/4 mx-auto bg-neutral-300" />
          <Skeleton className="h-4 w-1/2 mx-auto bg-neutral-300" />
          <Skeleton className="h-10 w-full bg-neutral-300 rounded-lg" />
          <Skeleton className="h-10 w-full bg-neutral-300" />
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 flex items-center justify-center p-4">
      <AuthManager />
    </div>
  )
} 