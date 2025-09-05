"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { Agency } from '@/app/types'
import { useAuth } from '@/lib/auth-context'
import { USER_ROLES } from '@/lib/types/roles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { DialogFooter } from '@/components/ui/dialog'

interface AgencyFormProps {
  initialData?: any
  onSubmit: (data: Agency) => void
  onCancel: () => void
}

interface AgencyFormData {
  name: string
  description: string
  email: string
  tel: string
  isActive: boolean
  firstName: string
  lastName: string
  projectIDs: number[]
}

export function AgencyForm({ initialData, onSubmit, onCancel }: AgencyFormProps) {
  const { user } = useAuth()
  
  const form = useForm<AgencyFormData>({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      email: initialData?.email || '',
      tel: initialData?.tel || '',
      isActive: initialData?.isActive ?? true,
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      projectIDs: initialData?.projectIDs || []
    }
  })

  const handleSubmit = (data: AgencyFormData) => {
    // Determine agencyTypeID based on user role
    // Admin role = 1, Agency role = 2
    const agencyTypeID = user?.userRoleID === USER_ROLES.ADMIN ? 1 : 2
    
    const agencyData: Agency = {
      id: initialData?.id,
      name: data.name,
      description: data.description,
      email: data.email,
      tel: data.tel,
      agencyTypeID: agencyTypeID,
      isActive: data.isActive,
      firstName: data.firstName,
      lastName: data.lastName,
      projectIDs: data.projectIDs
    }
    console.log(agencyData)
    return
    onSubmit(agencyData)
  }

  // Mock project data - in real implementation, fetch from API
  const availableProjects = [
    { id: 1, name: 'Project Alpha' },
    { id: 2, name: 'Project Beta' },
    { id: 3, name: 'Project Gamma' },
    { id: 4, name: 'Project Delta' }
  ]


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Agency Name */}
          <FormField
            control={form.control}
            name="name"
            rules={{ required: 'Agency name is required' }}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Agency Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter agency name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* First Name */}
          <FormField
            control={form.control}
            name="firstName"
            rules={{ required: 'First name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastName"
            rules={{ required: 'Last name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            rules={{ 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Enter email address" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="tel"
            rules={{ required: 'Phone number is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
                    placeholder="Enter phone number" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter agency description" 
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Project Assignment */}
        <FormField
          control={form.control}
          name="projectIDs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned Projects</FormLabel>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableProjects.map((project) => (
                  <div key={project.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`project-${project.id}`}
                      checked={field.value?.includes(project.id)}
                      onCheckedChange={(checked) => {
                        const currentProjects = field.value || []
                        if (checked) {
                          field.onChange([...currentProjects, project.id])
                        } else {
                          field.onChange(currentProjects.filter(id => id !== project.id))
                        }
                      }}
                    />
                    <label
                      htmlFor={`project-${project.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {project.name}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Active Status */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-medium">
                Active Agency
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Agency Type Info Display */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Agency Type Assignment</h4>
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Agency Type ID:</strong> {user?.userRoleID === USER_ROLES.ADMIN ? '1' : '2'}
            </p>
            <p>
              <strong>Assigned by:</strong> {user?.userRoleID === USER_ROLES.ADMIN ? 'Admin User' : 'Agency User'}
            </p>
            <p className="text-xs mt-1">
              Agency type is automatically determined based on who creates this agency.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Agency' : 'Create Agency'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
