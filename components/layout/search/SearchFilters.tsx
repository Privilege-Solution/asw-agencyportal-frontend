"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'

interface SearchFiltersProps {
  agencySearchStr: string
  setAgencySearchStr: (value: string) => void
  agencyTypeFilter: number
  projectFilter: number
  onSearch: () => void
  onFilterChange: (agencyTypeID: number, projectID: number) => void
}

export function SearchFilters({
  agencySearchStr,
  setAgencySearchStr,
  agencyTypeFilter,
  projectFilter,
  onSearch,
  onFilterChange
}: SearchFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Agency Search Box */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search agencies..."
          value={agencySearchStr}
          onChange={(e) => setAgencySearchStr(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          className="pl-10"
        />
      </div>

      {/* Agency Type Filter */}
      <Select
        value={agencyTypeFilter.toString()}
        onValueChange={(value) => onFilterChange(parseInt(value), projectFilter)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Agency Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">All Types</SelectItem>
          <SelectItem value="1">Agency</SelectItem>
          <SelectItem value="2">Agent</SelectItem>
        </SelectContent>
      </Select>

      {/* Project Filter */}
      <Select
        value={projectFilter.toString()}
        onValueChange={(value) => onFilterChange(agencyTypeFilter, parseInt(value))}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">All Projects</SelectItem>
          <SelectItem value="1">Project 1</SelectItem>
          <SelectItem value="2">Project 2</SelectItem>
          <SelectItem value="3">Project 3</SelectItem>
        </SelectContent>
      </Select>

      {/* Search Button */}
      <Button onClick={onSearch} variant="outline">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  )
}
