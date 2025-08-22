"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, User, CheckCircle, XCircle } from 'lucide-react'
import { useAuthUser } from '@/hooks/use-auth-user'
import { useAuth } from '@/lib/auth-context'
import { ROLE_NAMES } from '@/lib/types/roles'
import { Badge } from '@/components/ui/badge'

export function UserDataSync() {
  const { loading, error, fetchUserData, hasValidToken } = useAuthUser()
  const { user } = useAuth()

  if (!hasValidToken) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <XCircle className="h-5 w-5" />
            No Authentication Token
          </CardTitle>
          <CardDescription className="text-yellow-700">
            Please login to sync user data
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Data Sync
        </CardTitle>
        <CardDescription>
          Sync user role and details from GetUser API endpoint
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Current User Status */}
        {user && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <h4 className="font-medium text-green-800">Current User Data</h4>
            </div>
            <div className="space-y-1 text-sm">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <div className="flex items-center gap-2">
                <strong>Role:</strong>
                <Badge variant={user.role === 1 ? "destructive" : user.role === 2 ? "default" : "secondary"}>
                  {ROLE_NAMES[user.role]}
                </Badge>
                <span className="text-xs text-gray-500">
                  ({user.userRoleName || `ID: ${user.userRoleID}`})
                </span>
              </div>
              {user.departmentName && (
                <p><strong>Department:</strong> {user.departmentName}</p>
              )}
              {user.jobTitle && (
                <p><strong>Job Title:</strong> {user.jobTitle}</p>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="h-4 w-4 text-red-600" />
              <h4 className="font-medium text-red-800">Sync Error</h4>
            </div>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Sync Button */}
        <div className="flex items-center gap-2">
          <Button
            onClick={fetchUserData}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Syncing...' : 'Sync User Data'}
          </Button>
          
          {loading && (
            <span className="text-sm text-gray-600">
              Fetching latest user data from API...
            </span>
          )}
        </div>

        {/* Information */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Calls the GetUser API endpoint with your auth token</p>
            <p>• Updates your role based on userRoleID from the server</p>
            <p>• Refreshes user details like department and job title</p>
            <p>• Changes take effect immediately in the interface</p>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
