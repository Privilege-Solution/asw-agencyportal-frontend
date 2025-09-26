"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Building2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Agency } from '@/app/types'

// Extend the existing Agency interface to add UI-specific properties
export interface AgencyWithUIFlags extends Agency {
  isCreatedByCurrentUser?: boolean
}

interface AgencyListViewProps {
  agencies: AgencyWithUIFlags[]
  currentUserId?: string
  currentPage: number
  totalPages: number
  totalAgencies: number
  onPageChange: (page: number) => void
  onEditAgency: (agency: Agency) => void
}

export function AgencyListView({ 
  agencies, 
  currentUserId, 
  currentPage, 
  totalPages, 
  totalAgencies, 
  onPageChange,
  onEditAgency
}: AgencyListViewProps) {
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
                className={!agency.isCreatedByCurrentUser ? "opacity-50" : ""}
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
                    disabled={!agency.isCreatedByCurrentUser}
                    onClick={() => onEditAgency(agency)}
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
