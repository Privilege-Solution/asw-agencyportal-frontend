"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, ArrowLeft, Home } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { ROLE_NAMES } from '@/lib/types/roles'
import { useRouter } from 'next/navigation'

export default function AccessDeniedPage() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">Access Denied</CardTitle>
          <CardDescription className="text-red-600">
            You don't have permission to access this resource
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {user && (
            <div className="p-3 bg-gray-50 rounded-md">
              <h4 className="font-medium text-gray-800 mb-1">Current Access Level:</h4>
              <p className="text-sm text-gray-600">
                {ROLE_NAMES[user.role]} ({user.userRoleName || 'Role ID: ' + user.role})
              </p>
              {user.departmentName && (
                <p className="text-xs text-gray-500 mt-1">
                  Department: {user.departmentName}
                </p>
              )}
            </div>
          )}

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-800 mb-1">Need Higher Access?</h4>
            <p className="text-sm text-blue-700">
              Contact your system administrator to request additional permissions.
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => router.back()}
              variant="outline" 
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            
            <Button 
              onClick={() => router.push('/dashboard')}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
