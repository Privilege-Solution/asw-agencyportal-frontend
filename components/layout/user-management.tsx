"use client"

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Users } from 'lucide-react'
import { USER_ROLES } from '@/lib/types/roles'
import { useUserManagement, UserWithType } from '@/hooks/use-user-management'
import { ActionPanel } from './search'
import { AgencyListView, AgentListView, UsersTable } from './views'

function UserManagement() {
  const { user, isAdmin, isSuperAdmin, isAgency } = useAuth()
  
  // Use custom hook for all data management
  const {
    agencies,
    users,
    isLoading,
    currentAgency,
    agentList,
    agencySearchStr,
    setAgencySearchStr,
    agencyTypeFilter,
    projectFilter,
    currentPage,
    totalAgencies,
    searchTerm,
    setSearchTerm,
    newAgency,
    setNewAgency,
    newAgent,
    setNewAgent,
    canCreateAgency,
    canCreateAgent,
    canViewAllAgencies,
    isAgencyUser,
    isAgent,
    handleCreateAgency,
    handleCreateAgent,
    handleAgencySearch,
    handlePageChange,
    handleFilterChange
  } = useUserManagement()

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [isAgencyDialogOpen, setIsAgencyDialogOpen] = useState(false)
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserWithType | null>(null)
  const [editingAgency, setEditingAgency] = useState<any>(null)

  // Event handlers
  const handleCreateAgencyWrapper = async () => {
    const success = await handleCreateAgency()
    if (success) {
      setShowCreateDialog(false)
    }
  }

  const handleCreateAgentWrapper = async () => {
    const success = await handleCreateAgent()
    if (success) {
        setShowCreateDialog(false)
    }
  }

  const handleEditAgency = async (agency: any) => {
    console.log('Editing agency:', agency)
    setEditingAgency(agency)
    setIsAgencyDialogOpen(true)
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
      <ActionPanel
        canViewAllAgencies={canViewAllAgencies}
        agencySearchStr={agencySearchStr}
        setAgencySearchStr={setAgencySearchStr}
        agencyTypeFilter={agencyTypeFilter}
        projectFilter={projectFilter}
        onAgencySearch={handleAgencySearch}
        onFilterChange={handleFilterChange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showCreateDialog={showCreateDialog}
        setShowCreateDialog={setShowCreateDialog}
        isAgencyDialogOpen={isAgencyDialogOpen}
        setIsAgencyDialogOpen={setIsAgencyDialogOpen}
                      newAgency={newAgency}
                      setNewAgency={setNewAgency}
                      newAgent={newAgent}
                      setNewAgent={setNewAgent}
        onCreateAgency={handleCreateAgencyWrapper}
        onCreateAgent={handleCreateAgentWrapper}
        setEditingUser={setEditingUser}
        setEditingAgency={setEditingAgency}
        currentAgency={currentAgency}
      />

      {/* Content based on user role */}
      {canViewAllAgencies && (
        <>
          <AgencyListView 
            agencies={agencies} 
            currentUserId={user?.id}
            currentPage={currentPage}
            totalPages={Math.ceil(totalAgencies / 10)}
            totalAgencies={totalAgencies}
            onPageChange={handlePageChange}
            onEditAgency={handleEditAgency}
          />
          
          <UsersTable
            users={users}
            searchTerm={searchTerm}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            isAdmin={isAdmin?.()}
            isSuperAdmin={isSuperAdmin?.()}
            isAgency={isAgency?.()}
          />
        </>
      )}
      
      {canCreateAgent && (
        <AgentListView agents={agentList} />
      )}
    </div>
  )
}

export default UserManagement