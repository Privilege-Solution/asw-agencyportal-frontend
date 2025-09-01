"use client"

import { useAuth } from "@/lib/auth-context"
import { AuthDebugger } from "@/components/test/AuthDebugger"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthTestPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <div>Not authenticated</div>
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>User ID:</strong> {user?.id}
            </div>
            <div>
              <strong>Email:</strong> {user?.email}
            </div>
            <div>
              <strong>Display Name:</strong> {user?.displayName}
            </div>
            <div>
              <strong>Role ID:</strong> {user?.userRoleID}
            </div>
            <div>
              <strong>Role Name:</strong> {user?.userRoleName}
            </div>
            <div>
              <strong>Department:</strong> {user?.departmentName}
            </div>
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      <AuthDebugger />
    </div>
  )
}
