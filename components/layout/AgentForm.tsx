"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { Agent } from '@/app/types'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

interface AgentFormProps {
  initialData?: any
  onSubmit: (data: Agent) => void
  onCancel: () => void
}

interface AgentFormData {
  agentID: string
  isActive: boolean
  agent: {
    firstName: string
    lastName: string
    email: string
    tel: string
  }
}

export function AgentForm({ initialData, onSubmit, onCancel }: AgentFormProps) {
  const { user } = useAuth()
  
  const form = useForm<AgentFormData>({
    defaultValues: {
      agentID: initialData?.agentID || '',
      isActive: initialData?.isActive ?? true,
      agent: {
        firstName: initialData?.agent?.firstName || '',
        lastName: initialData?.agent?.lastName || '',
        email: initialData?.agent?.email || '',
        tel: initialData?.agent?.tel || ''
      }
    }
  })

  const handleSubmit = (data: AgentFormData) => {
    const agentData: Agent = {
      agencyID: user?.id || '', // Current agency user's ID
      agentID: data.agentID || `agent-${Date.now()}`, // Generate ID if not provided
      isActive: data.isActive,
      agent: {
        firstName: data.agent.firstName,
        lastName: data.agent.lastName,
        email: data.agent.email,
        tel: data.agent.tel
      }
    }
    onSubmit(agentData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Agent ID */}
          <FormField
            control={form.control}
            name="agentID"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Agent ID</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Auto-generated if left empty" 
                    {...field} 
                    disabled={!!initialData?.agentID} // Disable editing existing agent ID
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* First Name */}
          <FormField
            control={form.control}
            name="agent.firstName"
            rules={{ required: 'First name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
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
            name="agent.lastName"
            rules={{ required: 'Last name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
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
            name="agent.email"
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
            name="agent.tel"
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
                Active Agent
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Agency Info Display */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Agency Information</h4>
          <div className="text-sm text-muted-foreground">
            <p><strong>Agency:</strong> {user?.displayName || 'Current User'}</p>
            <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
            <p><strong>Department:</strong> {user?.departmentName || 'N/A'}</p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Agent' : 'Create Agent'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
