"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { RoleGuard } from '@/components/rbac/RoleGuard'
import { USER_ROLES } from '@/lib/types/roles'
import { Agency, Agent, User } from '@/app/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Edit, Trash2, Users } from 'lucide-react'
import { AgencyForm } from '@/components/layout/AgencyForm'
import { AgentForm } from '@/components/layout/AgentForm'

interface UserWithType extends User {
  userType?: 'agency' | 'agent'
}

function UserManagement() {
  const { user, isAdmin, isSuperAdmin, isAgency } = useAuth()
  const [users, setUsers] = useState<UserWithType[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [isAgencyDialogOpen, setIsAgencyDialogOpen] = useState(false)
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserWithType | null>(null)

  // Filter users based on search term
  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.userRoleName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Check if current user is an agent (restricted access)
  const isAgent = user?.userType === 'agent'

  // Load users data
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        // Mock data for now - replace with actual API call
        const mockUsers: UserWithType[] = [
          {
            id: '1',
            displayName: 'John Admin',
            givenName: 'John',
            surename: 'Admin',
            email: 'john.admin@example.com',
            userRoleID: 2,
            userRoleName: 'Admin',
            departmentID: 1,
            departmentName: 'Administration',
            jobTitle: 'System Administrator',
            projectIDs: [1, 2, 3],
            createBy: 'system',
            createDate: '2024-01-01',
            updateBy: 'system',
            updateDate: '2024-01-01',
            isActive: true,
            userType: 'agency'
          },
          {
            id: '2',
            displayName: 'Jane Agency',
            givenName: 'Jane',
            surename: 'Agency',
            email: 'jane.agency@example.com',
            userRoleID: 3,
            userRoleName: 'Agency',
            departmentID: 2,
            departmentName: 'Sales',
            jobTitle: 'Agency Manager',
            projectIDs: [2],
            createBy: 'admin',
            createDate: '2024-01-02',
            updateBy: 'admin',
            updateDate: '2024-01-02',
            isActive: true,
            userType: 'agency'
          },
          {
            id: '3',
            displayName: 'Bob Agent',
            givenName: 'Bob',
            surename: 'Agent',
            email: 'bob.agent@example.com',
            userRoleID: 3,
            userRoleName: 'Agency',
            departmentID: 2,
            departmentName: 'Sales',
            jobTitle: 'Sales Agent',
            projectIDs: [2],
            createBy: 'jane.agency',
            createDate: '2024-01-03',
            updateBy: 'jane.agency',
            updateDate: '2024-01-03',
            isActive: true,
            userType: 'agent'
          }
        ]
        setUsers(mockUsers)
      } catch (error) {
        console.error('Error loading users:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  const handleCreateAgency = async (agencyData: Agency) => {
    try {
      const response = await fetch('/Agency/SaveAgency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agencyData)
      })

      if (response.ok) {
        // Refresh users list
        // In real implementation, you'd reload the users
        setIsAgencyDialogOpen(false)
        setEditingUser(null)
      }
    } catch (error) {
      console.error('Error creating agency:', error)
    }
  }

  const handleCreateAgent = async (agentData: Agent) => {
    try {
      const response = await fetch('/Agency/SaveAgencyMember', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData)
      })

      if (response.ok) {
        // Refresh users list
        setIsAgentDialogOpen(false)
        setEditingUser(null)
      }
    } catch (error) {
      console.error('Error creating agent:', error)
    }
  }

  const handleEditUser = (user: UserWithType) => {
    setEditingUser(user)
    if (user.userType === 'agency' || user.userRoleID === USER_ROLES.AGENCY) {
      setIsAgencyDialogOpen(true)
    } else if (user.userType === 'agent') {
      setIsAgentDialogOpen(true)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      // Implement delete functionality
      console.log('Deleting user:', userId)
    }
  }

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

  // Restrict access for agent users
  if (isAgent) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">Access Restricted</h3>
          <p className="text-sm text-muted-foreground">
            Agent users do not have access to user management.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Agency and Agent Management</h1>
          <p className="text-muted-foreground">
            Manage users and their permissions across the platform
          </p>
        </div>
      </div>

      {/* Action Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Agency Creation - for SuperAdmin and Admin */}
              <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]}>
                <Dialog open={isAgencyDialogOpen} onOpenChange={setIsAgencyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingUser(null)} className="bg-blue-500 hover:bg-blue-600">
                      <Plus className="h-4 w-4 mr-2" />
                      เพิ่ม Agency
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingUser ? 'แก้ไข Agency' : 'เพิ่ม Agency'}
                      </DialogTitle>
                    </DialogHeader>
                    <AgencyForm
                      initialData={editingUser}
                      onSubmit={handleCreateAgency}
                      onCancel={() => {
                        setIsAgencyDialogOpen(false)
                        setEditingUser(null)
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </RoleGuard>

              {/* Agent Creation - for Agency users */}
              <RoleGuard allowedRoles={[USER_ROLES.AGENCY]}>
                <Dialog open={isAgentDialogOpen} onOpenChange={setIsAgentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingUser(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      เพิ่ม Agent
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingUser ? 'Edit Agent' : 'Create New Agent'}
                      </DialogTitle>
                    </DialogHeader>
                    <AgentForm
                      initialData={editingUser}
                      onSubmit={handleCreateAgent}
                      onCancel={() => {
                        setIsAgentDialogOpen(false)
                        setEditingUser(null)
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </RoleGuard>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
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
                      {(((isAdmin() || isSuperAdmin()) && user.userType === 'agency') || 
                       (isAgency() && user.userType === 'agent')) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {/* Delete permissions */}
                      {(((isAdmin() || isSuperAdmin()) && user.userType === 'agency') || 
                       (isAgency() && user.userType === 'agent')) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
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
    </div>
  )
}

export default UserManagement