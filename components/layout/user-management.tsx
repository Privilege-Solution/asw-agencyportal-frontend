"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getApiPath } from '@/lib/asset-utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Users, Building2, UserCheck, AlertCircle, Search, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { cookieUtils } from '@/lib/cookie-utils'
import { Agency, Agent, User } from '@/app/types'
import { RoleGuard } from '@/components/rbac/RoleGuard'
import { USER_ROLES } from '@/lib/types/roles'
import { useGetAgencyById, useGetAgencies } from '@/hooks/useGetData'

// Extend the existing Agency interface to add UI-specific properties
interface AgencyWithUIFlags extends Agency {
  isCreatedByCurrentUser?: boolean
}

// Extend User interface for UI-specific properties
interface UserWithType extends User {
  userType?: 'agency' | 'agent'
}

// Form model for creating an agency (only fields used in the UI/API payload)
interface CreateAgencyFormData {
  name: string
  email: string
  tel: string
  firstName: string
  lastName: string
  agencyTypeID: number
  projectIDs: number[]
}

// Form model for creating an agent
interface CreateAgentFormData {
  email: string
  firstName: string
  lastName: string
  agencyID: string
}

function UserManagement() {
  const { user, isAdmin, isSuperAdmin, isAgency } = useAuth()
  const [agencies, setAgencies] = useState<AgencyWithUIFlags[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [users, setUsers] = useState<UserWithType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAgencyDialogOpen, setIsAgencyDialogOpen] = useState(false)
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserWithType | null>(null)
  const [currentAgency, setCurrentAgency] = useState<Agency | null>(null)
  const [agentList, setAgentList] = useState<Agent[]>([])

  // Pagination and search states for agencies
  const [agencySearchStr, setAgencySearchStr] = useState('')
  const [agencyTypeFilter, setAgencyTypeFilter] = useState<number>(0)
  const [projectFilter, setProjectFilter] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage] = useState(10)
  const [totalAgencies, setTotalAgencies] = useState(0)

  useEffect(() => {
    if (user?.agencyID) {
      useGetAgencyById(user.agencyID.toString(), cookieUtils.getAuthToken()).then((data) => {
        const current = data.data;
        setCurrentAgency(current)
        setAgentList(current.members)
      })
    }
    //console.log(currentAgency)
  }, [])
  
  // Form states
  const [newAgency, setNewAgency] = useState<CreateAgencyFormData>({
    name: '',
    email: '',
    tel: '',
    firstName: '',
    lastName: '',
    agencyTypeID: 1,
    projectIDs: []
  })
  
  const [newAgent, setNewAgent] = useState<CreateAgentFormData>({
    email: '',
    firstName: '',
    lastName: '',
    agencyID: user?.agencyID?.toString() || ''
  })

  // Determine user capabilities based on role
  const canCreateAgency = user?.userRoleID === 1 || user?.userRoleID === 2
  const canCreateAgent = user?.userRoleID === 3 && user?.agencyType === 'agency'
  const canViewAllAgencies = user?.userRoleID === 1 || user?.userRoleID === 2
  const isAgencyUser = user?.userRoleID === 3

  // Check if current user is an agent (restricted access)
  const isAgent = user?.userType === 'agent'

  // Filter users based on search term
  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.userRoleName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      if (canViewAllAgencies) {
        await loadAgencies()
        await loadUsers()
      } else if (isAgencyUser) {
        await loadAgents()
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "Failed to load user management data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadAgencies = async (
    searchStr: string = agencySearchStr,
    agencyTypeID: number = agencyTypeFilter,
    projectID: number = projectFilter,
    page: number = currentPage
  ) => {
    try {
      const token = cookieUtils.getAuthToken()
      if (!token) {
        throw new Error('No auth token found')
      }

      const offset = (page - 1) * perPage

      const requestBody = {
        perPage,
        page,
        offset,
        searchStr,
        agencyTypeID,
        projectID
      }

      const response = await fetch(getApiPath('api/Agency/list'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const result = await response.json()
      
      console.log('API Response:', result) // Debug log
      
      if (result.success && result.data) {
        // Ensure result.data is an array
        const agenciesData = Array.isArray(result.data) ? result.data : []
        
        if (agenciesData.length === 0) {
          console.log('No agencies data received or data is empty')
        }
        
        // Map the API response to our AgencyWithUIFlags interface and mark user-created agencies
        const agenciesWithFlags: AgencyWithUIFlags[] = agenciesData.map((agency: Agency) => ({
          ...agency,
          isCreatedByCurrentUser: agency.createBy === user?.id
        }))
        
        setAgencies(agenciesWithFlags)
        
        // Update pagination info
        if (result.pagination) {
          setTotalAgencies(result.pagination.total)
        } else if (result.total !== undefined) {
          // Fallback if pagination info is directly in result
          setTotalAgencies(result.total)
        } else {
          // Fallback to array length
          setTotalAgencies(agenciesData.length)
        }
      } else {
        console.error('API Response Error:', result)
        throw new Error(result.error || result.message || 'Failed to load agencies')
      }
    } catch (error) {
      console.error('Error loading agencies:', error)
      // Fallback to empty array
      setAgencies([])
      setTotalAgencies(0)
      throw error
    }
  }

  const loadAgents = async () => {
    return;
  }

  const loadUsers = async () => {
    try {
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
      setUsers([])
    }
  }

  const handleCreateAgency = async () => {
    try {
      const token = cookieUtils.getAuthToken()
      if (!token) {
        throw new Error('No auth token found')
      }

      const response = await fetch(getApiPath('api/Agency/create'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAgency),
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Agency created successfully"
        })
        
        setShowCreateDialog(false)
        setNewAgency({
          name: '',
          email: '',
          tel: '',
          firstName: '',
          lastName: '',
          agencyTypeID: 1,
          projectIDs: []
        })
        
        await loadAgencies()
      } else {
        throw new Error(result.error || 'Failed to create agency')
      }
    } catch (error) {
      console.error('Error creating agency:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create agency",
        variant: "destructive"
      })
    }
  }

  // Search and filter handlers
  const handleAgencySearch = async () => {
    setCurrentPage(1) // Reset to first page when searching
    await loadAgencies(agencySearchStr, agencyTypeFilter, projectFilter, 1)
  }

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage)
    await loadAgencies(agencySearchStr, agencyTypeFilter, projectFilter, newPage)
  }

  const handleFilterChange = async (agencyTypeID: number, projectID: number) => {
    setAgencyTypeFilter(agencyTypeID)
    setProjectFilter(projectID)
    setCurrentPage(1) // Reset to first page when filtering
    await loadAgencies(agencySearchStr, agencyTypeID, projectID, 1)
  }

  const handleCreateAgent = async () => {
    try {
      const token = cookieUtils.getAuthToken()
      if (!token) {
        throw new Error('No auth token found')
      }

      const response = await fetch(getApiPath('api/agent/create'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAgent),
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Agent created successfully"
        })
        
        setShowCreateDialog(false)
        setNewAgent({
          email: '',
          firstName: '',
          lastName: '',
          agencyID: user?.agencyID?.toString() || ''
        })
        
        await loadAgents()
      } else {
        throw new Error(result.error || 'Failed to create agent')
      }
    } catch (error) {
      console.error('Error creating agent:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create agent",
        variant: "destructive"
      })
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

  if (isLoading) {
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">User Management</h1>
          <p className="text-gray-600">
            {canViewAllAgencies && "Manage agencies and users in the system"}
            {canCreateAgent && "Manage agents in your agency"}
          </p>
        </div>
      </div>

      {/* Action Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Agency Search and Filters - Show only for users who can view all agencies */}
            {canViewAllAgencies && (
              <div className="flex items-center gap-4">
                {/* Agency Search Box */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search agencies..."
                    value={agencySearchStr}
                    onChange={(e) => setAgencySearchStr(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAgencySearch()}
                    className="pl-10"
                  />
                </div>

                {/* Agency Type Filter */}
                <Select
                  value={agencyTypeFilter.toString()}
                  onValueChange={(value) => handleFilterChange(parseInt(value), projectFilter)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Agency Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Types</SelectItem>
                    <SelectItem value="1">Agency</SelectItem>
                    <SelectItem value="2">Agent</SelectItem>
                  </SelectContent>
                </Select>

                {/* Project Filter */}
                <Select
                  value={projectFilter.toString()}
                  onValueChange={(value) => handleFilterChange(agencyTypeFilter, parseInt(value))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Projects</SelectItem>
                    <SelectItem value="1">Project 1</SelectItem>
                    <SelectItem value="2">Project 2</SelectItem>
                    <SelectItem value="3">Project 3</SelectItem>
                  </SelectContent>
                </Select>

                {/* Search Button */}
                <Button onClick={handleAgencySearch} variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            )}

            {/* User Search Box - For general user search */}
            <div className="flex items-center justify-between gap-4">
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
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingUser(null)} className="bg-blue-500 hover:bg-blue-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Agency
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Agency</DialogTitle>
                      <DialogDescription>
                        Add a new agency to the system
                      </DialogDescription>
                    </DialogHeader>
                    <CreateAgencyForm 
                      newAgency={newAgency}
                      setNewAgency={setNewAgency}
                      onSubmit={handleCreateAgency}
                    />
                  </DialogContent>
                </Dialog>
              </RoleGuard>

              {/* Agent Creation - for Agency users */}
              <RoleGuard allowedRoles={[USER_ROLES.AGENCY]}>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingUser(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      เพิ่ม Agent
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>เพิ่ม Agent ใหม่ | <span className="text-blue-900">{currentAgency?.name}</span></DialogTitle>
                      <DialogDescription>
                        กรุณากรอกข้อมูลด้านล่าง
                      </DialogDescription>
                    </DialogHeader>
                    <CreateAgentForm 
                      newAgent={newAgent}
                      setNewAgent={setNewAgent}
                      onSubmit={handleCreateAgent}
                    />
                  </DialogContent>
                </Dialog>
              </RoleGuard>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content based on user role */}
      {canViewAllAgencies && (
        <>
          <AgencyListView 
            agencies={agencies} 
            currentUserId={user?.id}
            currentPage={currentPage}
            totalPages={Math.ceil(totalAgencies / perPage)}
            totalAgencies={totalAgencies}
            onPageChange={handlePageChange}
          />
          
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
                          {((((isAdmin && isAdmin()) || (isSuperAdmin && isSuperAdmin())) && user.userType === 'agency') || 
                           ((isAgency && isAgency()) && user.userType === 'agent')) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {/* Delete permissions */}
                          {((((isAdmin && isAdmin()) || (isSuperAdmin && isSuperAdmin())) && user.userType === 'agency') || 
                           ((isAgency && isAgency()) && user.userType === 'agent')) && (
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
        </>
      )}
      
      {canCreateAgent && (
        <AgentListView agents={agentList} />
      )}
    </div>
  )
}

// Create Agency Form Component
function CreateAgencyForm({ newAgency, setNewAgency, onSubmit }: {
  newAgency: CreateAgencyFormData
  setNewAgency: (agency: any) => void
  onSubmit: () => void
}) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="agency-name" className="text-right">Name</Label>
        <Input
          id="agency-name"
          value={newAgency.name}
          onChange={(e) => setNewAgency({...newAgency, name: e.target.value})}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="agency-email" className="text-right">Email</Label>
        <Input
          id="agency-email"
          type="email"
          value={newAgency.email}
          onChange={(e) => setNewAgency({...newAgency, email: e.target.value})}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="agency-tel" className="text-right">Phone</Label>
        <Input
          id="agency-tel"
          value={newAgency.tel}
          onChange={(e) => setNewAgency({...newAgency, tel: e.target.value})}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="first-name" className="text-right">First Name</Label>
        <Input
          id="first-name"
          value={newAgency.firstName}
          onChange={(e) => setNewAgency({...newAgency, firstName: e.target.value})}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="last-name" className="text-right">Last Name</Label>
        <Input
          id="last-name"
          value={newAgency.lastName}
          onChange={(e) => setNewAgency({...newAgency, lastName: e.target.value})}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="agency-type" className="text-right">Type</Label>
        <Select
          value={newAgency.agencyTypeID.toString()}
          onValueChange={(value) => setNewAgency({...newAgency, agencyTypeID: parseInt(value)})}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Agency</SelectItem>
            <SelectItem value="2">Agent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="agency-project-ids" className="text-right">โครงการที่รับผิดชอบ</Label>
        <Select
          value={newAgency.projectIDs.join(',')}
          onValueChange={(value) => setNewAgency({...newAgency, projectIDs: value.split(',').map(Number)})}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Project 1</SelectItem>
            <SelectItem value="2">Project 2</SelectItem>
            <SelectItem value="3">Project 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <DialogFooter>
        <Button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700">
          Create Agency
        </Button>
      </DialogFooter>
    </div>
  )
}

// Create Agent Form Component
function CreateAgentForm({ newAgent, setNewAgent, onSubmit }: {
  newAgent: CreateAgentFormData
  setNewAgent: (agent: any) => void
  onSubmit: () => void
}) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="agent-email" className="text-right">อีเมล</Label>
        <Input
          id="agent-email"
          type="email"
          value={newAgent.email}
          onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="agent-first-name" className="text-right">ชื่อ</Label>
        <Input
          id="agent-first-name"
          value={newAgent.firstName}
          onChange={(e) => setNewAgent({...newAgent, firstName: e.target.value})}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="agent-last-name" className="text-right">นามสกุล</Label>
        <Input
          id="agent-last-name"
          value={newAgent.lastName}
          onChange={(e) => setNewAgent({...newAgent, lastName: e.target.value})}
          className="col-span-3"
        />
      </div>
      
      <DialogFooter>
        <Button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700">
          เพิ่ม Agent
        </Button>
      </DialogFooter>
    </div>
  )
}

// Agency List View Component
function AgencyListView({ 
  agencies, 
  currentUserId, 
  currentPage, 
  totalPages, 
  totalAgencies, 
  onPageChange 
}: {
  agencies: AgencyWithUIFlags[]
  currentUserId?: string
  currentPage: number
  totalPages: number
  totalAgencies: number
  onPageChange: (page: number) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Agencies ({totalAgencies})
        </CardTitle>
        <CardDescription>
          All agencies in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agencies.map((agency) => (
              <TableRow 
                key={agency.id}
                className={agency.isCreatedByCurrentUser ? "opacity-50" : ""}
              >
                <TableCell>
                  <div>
                    <div className="font-medium">{agency.name}</div>
                    <div className="text-sm text-gray-500">{agency.refCode}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm">{agency.email}</div>
                    <div className="text-sm text-gray-500">{agency.tel}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={agency.agencyTypeID === 1 ? "default" : "secondary"}>
                    {agency.agencyType.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={agency.isActive ? "default" : "destructive"}>
                      {agency.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {agency.isCreatedByCurrentUser && (
                      <Badge variant="outline" className="text-orange-600">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Created by you
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {new Date(agency.createDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    disabled={agency.isCreatedByCurrentUser}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {agencies.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-muted-foreground">
                    No agencies found.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} ({totalAgencies} total agencies)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                if (pageNum > totalPages) return null
                
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Agent List View Component
function AgentListView({ agents }: { agents: Agent[] }) {
  if (agents.length === 0) { return <p className="text-center text-gray-500">ไม่พบ Agent ใน Agency นี้</p>; }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Agents
        </CardTitle>
        <CardDescription>
          Agents in your agency
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>
                  <div className="font-medium">
                    {agent.firstName} {agent.lastName}
                  </div>
                </TableCell>
                <TableCell>{agent.email}</TableCell>
                <TableCell>
                  <Badge variant={agent.isActive ? "default" : "destructive"}>
                    {agent.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {new Date(agent.createDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default UserManagement