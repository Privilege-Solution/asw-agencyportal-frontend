"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'
import { Agent } from '@/app/types'

interface AgentListViewProps {
  agents: Agent[]
}

export function AgentListView({ agents }: AgentListViewProps) {
  if (agents.length === 0) { 
    return <p className="text-center text-gray-500">ไม่พบ Agent ใน Agency นี้</p>
  }

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
