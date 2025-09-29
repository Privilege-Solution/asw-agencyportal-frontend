"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { cookieUtils } from '@/lib/cookie-utils'
import { toast } from '@/hooks/use-toast'
import { apiCall } from '@/lib/api-utils'
import { useGetAgencyById } from '@/hooks/useGetData'
import { Agency, Agent, User } from '@/app/types'

// Extend interfaces for UI-specific properties
export interface AgencyWithUIFlags extends Agency {
  isCreatedByCurrentUser?: boolean
}

export interface UserWithType extends User {
  userType?: 'agency' | 'agent'
}

export interface CreateAgencyFormData {
  name: string
  email: string
  tel: string
  firstName: string
  lastName: string
  agencyTypeID: number
  projectIDs: number[]
}

export interface CreateAgentFormData {
  email: string
  firstName: string
  lastName: string
  agencyID: string
}

export function useUserManagement() {
  const { user } = useAuth()
  
  // State management
  const [agencies, setAgencies] = useState<AgencyWithUIFlags[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [users, setUsers] = useState<UserWithType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentAgency, setCurrentAgency] = useState<Agency | null>(null)
  const [agentList, setAgentList] = useState<Agent[]>([])

  // Pagination and search states
  const [agencySearchStr, setAgencySearchStr] = useState('')
  const [agencyTypeFilter, setAgencyTypeFilter] = useState<number>(0)
  const [projectFilter, setProjectFilter] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage] = useState(10)
  const [totalAgencies, setTotalAgencies] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

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

  // User capabilities
  const canCreateAgency = user?.userRoleID === 1 || user?.userRoleID === 2
  const canCreateAgent = user?.userRoleID === 3 && user?.agencyType === 'agency'
  const canViewAllAgencies = user?.userRoleID === 1 || user?.userRoleID === 2
  const isAgencyUser = user?.userRoleID === 3
  const isAgent = user?.userType === 'agent'

  // Load current agency data
  useEffect(() => {
    if (user?.agencyID) {
      useGetAgencyById(user.agencyID.toString(), cookieUtils.getAuthToken()).then((data) => {
        const current = data.data
        setCurrentAgency(current)
        setAgentList(current.members)
      })
    }
  }, [user])

  // Load initial data
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

      const response = await apiCall('/Agency/list', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const result = await response.json()
      
      if (result.success && result.data) {
        const agenciesData = Array.isArray(result.data) ? result.data : []
        
        const agenciesWithFlags: AgencyWithUIFlags[] = agenciesData.map((agency: Agency) => ({
          ...agency,
          isCreatedByCurrentUser: agency.createBy === user?.id
        }))
        
        setAgencies(agenciesWithFlags)
        
        if (result.pagination) {
          setTotalAgencies(result.pagination.total)
        } else if (result.total !== undefined) {
          setTotalAgencies(result.total)
        } else {
          setTotalAgencies(agenciesData.length)
        }
      } else {
        throw new Error(result.error || result.message || 'Failed to load agencies')
      }
    } catch (error) {
      console.error('Error loading agencies:', error)
      setAgencies([])
      setTotalAgencies(0)
      throw error
    }
  }

  const loadAgents = async () => {
    // Implementation for loading agents
    return
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

      const response = await apiCall('/Agency/create', {
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
        return true
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
      return false
    }
  }

  const handleCreateAgent = async () => {
    try {
      const token = cookieUtils.getAuthToken()
      if (!token) {
        throw new Error('No auth token found')
      }

      const response = await apiCall('/agent/create', {
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
        
        setNewAgent({
          email: '',
          firstName: '',
          lastName: '',
          agencyID: user?.agencyID?.toString() || ''
        })
        
        await loadAgents()
        return true
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
      return false
    }
  }

  // Search and filter handlers
  const handleAgencySearch = async () => {
    setCurrentPage(1)
    await loadAgencies(agencySearchStr, agencyTypeFilter, projectFilter, 1)
  }

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage)
    await loadAgencies(agencySearchStr, agencyTypeFilter, projectFilter, newPage)
  }

  const handleFilterChange = async (agencyTypeID: number, projectID: number) => {
    setAgencyTypeFilter(agencyTypeID)
    setProjectFilter(projectID)
    setCurrentPage(1)
    await loadAgencies(agencySearchStr, agencyTypeID, projectID, 1)
  }

  return {
    // State
    agencies,
    agents,
    users,
    isLoading,
    currentAgency,
    agentList,
    
    // Search and pagination
    agencySearchStr,
    setAgencySearchStr,
    agencyTypeFilter,
    projectFilter,
    currentPage,
    totalAgencies,
    searchTerm,
    setSearchTerm,
    
    // Form data
    newAgency,
    setNewAgency,
    newAgent,
    setNewAgent,
    
    // User capabilities
    canCreateAgency,
    canCreateAgent,
    canViewAllAgencies,
    isAgencyUser,
    isAgent,
    
    // Actions
    handleCreateAgency,
    handleCreateAgent,
    handleAgencySearch,
    handlePageChange,
    handleFilterChange,
    loadData
  }
}
