"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Search, Edit } from 'lucide-react'
import { RoleGuard } from '@/components/rbac/RoleGuard'
import { USER_ROLES } from '@/lib/types/roles'
import { Agency } from '@/app/types'
import { CreateAgencyForm, CreateAgentForm, CreateAgencyFormData, CreateAgentFormData } from '../forms'
import { SearchFilters } from './SearchFilters'

interface ActionPanelProps {
  // Search and filters
  canViewAllAgencies: boolean
  agencySearchStr: string
  setAgencySearchStr: (value: string) => void
  agencyTypeFilter: number
  projectFilter: number
  onAgencySearch: () => void
  onFilterChange: (agencyTypeID: number, projectID: number) => void
  
  // User search
  searchTerm: string
  setSearchTerm: (value: string) => void
  
  // Dialog states
  showCreateDialog: boolean
  setShowCreateDialog: (value: boolean) => void
  isAgencyDialogOpen: boolean
  setIsAgencyDialogOpen: (value: boolean) => void
  
  // Form data
  newAgency: CreateAgencyFormData
  setNewAgency: (agency: CreateAgencyFormData | ((prev: CreateAgencyFormData) => CreateAgencyFormData)) => void
  newAgent: CreateAgentFormData
  setNewAgent: (agent: CreateAgentFormData | ((prev: CreateAgentFormData) => CreateAgentFormData)) => void
  
  // Actions
  onCreateAgency: () => void
  onCreateAgent: () => void
  setEditingUser: (user: any) => void
  setEditingAgency: (agency: Agency | null) => void
  
  // Current data
  currentAgency: Agency | null
}

export function ActionPanel({
  canViewAllAgencies,
  agencySearchStr,
  setAgencySearchStr,
  agencyTypeFilter,
  projectFilter,
  onAgencySearch,
  onFilterChange,
  searchTerm,
  setSearchTerm,
  showCreateDialog,
  setShowCreateDialog,
  isAgencyDialogOpen,
  setIsAgencyDialogOpen,
  newAgency,
  setNewAgency,
  newAgent,
  setNewAgent,
  onCreateAgency,
  onCreateAgent,
  setEditingUser,
  setEditingAgency,
  currentAgency
}: ActionPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Agency Search and Filters - Show only for users who can view all agencies */}
          {canViewAllAgencies && (
            <SearchFilters
              agencySearchStr={agencySearchStr}
              setAgencySearchStr={setAgencySearchStr}
              agencyTypeFilter={agencyTypeFilter}
              projectFilter={projectFilter}
              onSearch={onAgencySearch}
              onFilterChange={onFilterChange}
            />
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
                      onSubmit={onCreateAgency}
                    />
                  </DialogContent>
                </Dialog>
              </RoleGuard>

              {/* Agency Edit - for Agency users */}
              <RoleGuard allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}>
                <Dialog open={isAgencyDialogOpen} onOpenChange={setIsAgencyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingAgency(null)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Agency
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Agency</DialogTitle>
                      <DialogDescription>
                        Edit the agency information
                      </DialogDescription>
                    </DialogHeader>
                    <p>Edit Agency Form Here</p>
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
                      onSubmit={onCreateAgent}
                    />
                  </DialogContent>
                </Dialog>
              </RoleGuard>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
