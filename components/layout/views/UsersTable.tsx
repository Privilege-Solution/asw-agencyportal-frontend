"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { User } from '@/app/types'
import { USER_ROLES } from '@/lib/types/roles'

// Extend User interface for UI-specific properties
export interface UserWithType extends User {
  userType?: 'agency' | 'agent'
}

interface UsersTableProps {
  users: UserWithType[]
  searchTerm: string
  onEditUser: (user: UserWithType) => void
  onDeleteUser: (userId: string) => void
  isAdmin?: boolean
  isSuperAdmin?: boolean
  isAgency?: boolean
}

export function UsersTable({ 
  users, 
  searchTerm, 
  onEditUser, 
  onDeleteUser, 
  isAdmin, 
  isSuperAdmin, 
  isAgency 
}: UsersTableProps) {
  // Filter users based on search term
  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.userRoleName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadgeColor = (roleId: number | null) => {
    switch (roleId) {
      case USER_ROLES.SUPER_ADMIN:
        return 'bg-red-100 text-red-800'
      case USER_ROLES.ADMIN:
        return 'bg-blue-100 text-blue-800'
      case USER_ROLES.AGENCY:
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeBadgeColor = (userType?: string) => {
    switch (userType) {
      case 'agency':
        return 'bg-purple-100 text-purple-800'
      case 'agent':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Users ({filteredUsers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{user.displayName}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.jobTitle}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.userRoleID)}>
                    {user.userRoleName}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getTypeBadgeColor(user.userType)}>
                    {user.userType || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>{user.departmentName}</TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {/* Edit permissions based on user role */}
                    {((((isAdmin && isAdmin) || (isSuperAdmin && isSuperAdmin)) && user.userType === 'agency') || 
                     ((isAgency && isAgency) && user.userType === 'agent')) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {/* Delete permissions */}
                    {((((isAdmin && isAdmin) || (isSuperAdmin && isSuperAdmin)) && user.userType === 'agency') || 
                     ((isAgency && isAgency) && user.userType === 'agent')) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-muted-foreground">
                    {searchTerm ? 'No users found matching your search.' : 'No users available.'}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
