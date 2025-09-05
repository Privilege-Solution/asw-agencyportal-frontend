"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Users, Building2, UserCheck, AlertCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { cookieUtils } from '@/lib/cookie-utils'
import { Agency, Agent } from '@/app/types'

// Extend the existing Agency interface to add UI-specific properties
interface AgencyWithUIFlags extends Agency {
  isCreatedByCurrentUser?: boolean
}

function UserManagement() {
  const { user } = useAuth()
  const [agencies, setAgencies] = useState<AgencyWithUIFlags[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  
  // Form states
  const [newAgency, setNewAgency] = useState({
    name: '',
    email: '',
    tel: '',
    firstName: '',
    lastName: '',
    agencyTypeID: 1
  })
  
  const [newAgent, setNewAgent] = useState({
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

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      if (canViewAllAgencies) {
        await loadAgencies()
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

  const loadAgencies = async () => {
    try {
      const token = cookieUtils.getAuthToken()
      if (!token) {
        throw new Error('No auth token found')
      }

      const response = await fetch('/api/agency/list', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      
      if (result.success && result.data) {
        // Map the API response to our AgencyWithUIFlags interface and mark user-created agencies
        const agenciesWithFlags: AgencyWithUIFlags[] = result.data.map((agency: Agency) => ({
          ...agency,
          isCreatedByCurrentUser: agency.createBy === user?.id
        }))
        
        setAgencies(agenciesWithFlags)
      } else {
        throw new Error(result.error || 'Failed to load agencies')
      }
    } catch (error) {
      console.error('Error loading agencies:', error)
      // Fallback to empty array
      setAgencies([])
      throw error
    }
  }

  const loadAgents = async () => {
    try {
      const token = cookieUtils.getAuthToken()
      if (!token) {
        throw new Error('No auth token found')
      }

      if (!user?.agencyID) {
        throw new Error('No agency ID found for current user')
      }

      const response = await fetch(`/api/agent/list?agencyID=${user.agencyID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      
      if (result.success && result.data) {
        setAgents(result.data)
      } else {
        throw new Error(result.error || 'Failed to load agents')
      }
    } catch (error) {
      console.error('Error loading agents:', error)
      // Fallback to empty array
      setAgents([])
      throw error
    }
  }

  const handleCreateAgency = async () => {
    try {
      const token = cookieUtils.getAuthToken()
      if (!token) {
        throw new Error('No auth token found')
      }

      const response = await fetch('/api/agency/create', {
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
          agencyTypeID: 1
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

  const handleCreateAgent = async () => {
    try {
      const token = cookieUtils.getAuthToken()
      if (!token) {
        throw new Error('No auth token found')
      }

      const response = await fetch('/api/agent/create', {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">
            {canViewAllAgencies && "Manage agencies and users in the system"}
            {canCreateAgent && "Manage agents in your agency"}
          </p>
        </div>
        
        {(canCreateAgency || canCreateAgent) && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                {canCreateAgency ? "Create Agency" : "Create Agent"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {canCreateAgency ? "Create New Agency" : "Create New Agent"}
                </DialogTitle>
                <DialogDescription>
                  {canCreateAgency 
                    ? "Add a new agency to the system" 
                    : "Add a new agent to your agency"
                  }
                </DialogDescription>
              </DialogHeader>
              
              {canCreateAgency ? (
                <CreateAgencyForm 
                  newAgency={newAgency}
                  setNewAgency={setNewAgency}
                  onSubmit={handleCreateAgency}
                />
              ) : (
                <CreateAgentForm 
                  newAgent={newAgent}
                  setNewAgent={setNewAgent}
                  onSubmit={handleCreateAgent}
                />
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Content based on user role */}
      {canViewAllAgencies && (
        <AgencyListView agencies={agencies} currentUserId={user?.id} />
      )}
      
      {canCreateAgent && (
        <AgentListView agents={agents} />
      )}
    </div>
  )
}

// Create Agency Form Component
function CreateAgencyForm({ newAgency, setNewAgency, onSubmit }: {
  newAgency: any
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
  newAgent: any
  setNewAgent: (agent: any) => void
  onSubmit: () => void
}) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="agent-email" className="text-right">Email</Label>
        <Input
          id="agent-email"
          type="email"
          value={newAgent.email}
          onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="agent-first-name" className="text-right">First Name</Label>
        <Input
          id="agent-first-name"
          value={newAgent.firstName}
          onChange={(e) => setNewAgent({...newAgent, firstName: e.target.value})}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="agent-last-name" className="text-right">Last Name</Label>
        <Input
          id="agent-last-name"
          value={newAgent.lastName}
          onChange={(e) => setNewAgent({...newAgent, lastName: e.target.value})}
          className="col-span-3"
        />
      </div>
      
      <DialogFooter>
        <Button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700">
          Create Agent
        </Button>
      </DialogFooter>
    </div>
  )
}

// Agency List View Component
function AgencyListView({ agencies, currentUserId }: {
  agencies: AgencyWithUIFlags[]
  currentUserId?: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Agencies
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
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Agent List View Component
function AgentListView({ agents }: { agents: Agent[] }) {
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