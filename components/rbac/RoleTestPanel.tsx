"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import { USER_ROLES, ROLE_NAMES } from '@/lib/types/roles'
import { Shield, Crown, Users, Building } from 'lucide-react'

export function RoleTestPanel() {
  const { login, user, logout } = useAuth()

  const mockUsers = [
    {
      id: 'super-admin-1',
      email: 'superadmin@asw.com',
      name: 'Super Admin User',
      role: USER_ROLES.SUPER_ADMIN,
      userRoleID: 1,
      userRoleName: 'Super Administrator',
      departmentName: 'IT Department',
      jobTitle: 'System Administrator'
    },
    {
      id: 'admin-1', 
      email: 'admin@asw.com',
      name: 'Admin User',
      role: USER_ROLES.ADMIN,
      userRoleID: 2,
      userRoleName: 'Administrator',
      departmentName: 'Management',
      jobTitle: 'Team Lead'
    },
    {
      id: 'agency-1',
      email: 'agency@asw.com', 
      name: 'Agency User',
      role: USER_ROLES.AGENCY,
      userRoleID: 3,
      userRoleName: 'Agency User',
      departmentName: 'Sales',
      jobTitle: 'Sales Agent',
      agencyId: 'agency-001',
      subRole: 'senior'
    }
  ]

  const loginAs = (mockUser: any) => {
    login('email', mockUser, 'mock-token-' + mockUser.role)
  }

  const getRoleIcon = (role: number) => {
    switch (role) {
      case USER_ROLES.SUPER_ADMIN:
        return <Crown className="h-4 w-4" />
      case USER_ROLES.ADMIN:
        return <Shield className="h-4 w-4" />
      case USER_ROLES.AGENCY:
        return <Building className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: number) => {
    switch (role) {
      case USER_ROLES.SUPER_ADMIN:
        return "destructive"
      case USER_ROLES.ADMIN:
        return "default"
      case USER_ROLES.AGENCY:
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Role-Based Access Control Test Panel
        </CardTitle>
        <CardDescription>
          Test different user roles to see how the interface changes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Current User */}
        {user && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-800">Current User</h4>
                <p className="text-sm text-green-700">{user.name} ({user.email})</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getRoleColor(user.role)}>
                    {getRoleIcon(user.role)}
                    {ROLE_NAMES[user.role]}
                  </Badge>
                  {user.departmentName && (
                    <Badge variant="outline">{user.departmentName}</Badge>
                  )}
                </div>
              </div>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        )}

        {/* Mock Login Options */}
        <div>
          <h4 className="font-medium mb-3">Test Different Roles:</h4>
          <div className="space-y-2">
            {mockUsers.map((mockUser) => (
              <div key={mockUser.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  {getRoleIcon(mockUser.role)}
                  <div>
                    <p className="font-medium">{mockUser.name}</p>
                    <p className="text-sm text-gray-600">{mockUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getRoleColor(mockUser.role)} className="text-xs">
                        {ROLE_NAMES[mockUser.role]}
                      </Badge>
                      <span className="text-xs text-gray-500">{mockUser.departmentName}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => loginAs(mockUser)}
                  variant={user?.id === mockUser.id ? "default" : "outline"}
                  size="sm"
                  disabled={user?.id === mockUser.id}
                >
                  {user?.id === mockUser.id ? "Current" : "Login"}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Role Permissions Info */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2">Role Permissions:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Super Admin (1):</strong> Full system access including site settings</p>
            <p><strong>Admin (2):</strong> All features except site settings</p>
            <p><strong>Agency (3):</strong> Limited to own data and basic features</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
          <h4 className="font-medium text-gray-800 mb-2">Test Instructions:</h4>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Click "Login" for different roles to test access</li>
            <li>Notice how sidebar navigation changes</li>
            <li>Observe different dashboard sections visible</li>
            <li>Try accessing different pages to see role protection</li>
          </ol>
        </div>

      </CardContent>
    </Card>
  )
}
