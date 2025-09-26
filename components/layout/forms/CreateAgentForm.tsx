"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DialogFooter } from '@/components/ui/dialog'

// Form model for creating an agent
export interface CreateAgentFormData {
  email: string
  firstName: string
  lastName: string
  agencyID: string
}

interface CreateAgentFormProps {
  newAgent: CreateAgentFormData
  setNewAgent: (agent: CreateAgentFormData | ((prev: CreateAgentFormData) => CreateAgentFormData)) => void
  onSubmit: () => void
}

export function CreateAgentForm({ newAgent, setNewAgent, onSubmit }: CreateAgentFormProps) {
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
