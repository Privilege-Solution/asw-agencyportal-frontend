"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DialogFooter } from '@/components/ui/dialog'

// Form model for creating an agency
export interface CreateAgencyFormData {
  name: string
  email: string
  tel: string
  firstName: string
  lastName: string
  agencyTypeID: number
  projectIDs: number[]
}

interface CreateAgencyFormProps {
  newAgency: CreateAgencyFormData
  setNewAgency: (agency: CreateAgencyFormData | ((prev: CreateAgencyFormData) => CreateAgencyFormData)) => void
  onSubmit: () => void
}

export function CreateAgencyForm({ newAgency, setNewAgency, onSubmit }: CreateAgencyFormProps) {
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
