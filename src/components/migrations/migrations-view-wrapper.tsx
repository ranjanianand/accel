'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MigrationsCardView } from './migrations-card-view'
import { MigrationsListView } from './migrations-list-view'
import { type MigrationRow } from './types'
import { ViewToggle, type ViewMode } from './view-toggle'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

const PATTERNS = [
  'All Patterns',
  'SCD Type 2',
  'Fact Load',
  'Dimension Load',
  'CDC',
  'Aggregation',
  'Lookup',
]

const STATUSES = [
  'All Status',
  'Completed',
  'In Progress',
  'Failed',
  'Pending Review',
]

export interface MigrationsViewWrapperProps {
  migrations: MigrationRow[]
}

export function MigrationsViewWrapper({ migrations }: MigrationsViewWrapperProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [searchInput, setSearchInput] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get('status') || 'All Status'
  const currentPattern = searchParams.get('pattern') || 'All Patterns'
  const currentSearch = searchParams.get('search') || ''

  // Initialize search input from URL
  useEffect(() => {
    setSearchInput(currentSearch)
  }, [currentSearch])

  // Debounced search update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentSearch) {
        updateFilters('search', searchInput)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value && value !== 'All Patterns' && value !== 'All Status') {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/migrations?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchInput('')
    router.push('/migrations')
  }

  const hasActiveFilters = currentStatus !== 'All Status' ||
                          currentPattern !== 'All Patterns' ||
                          currentSearch !== ''

  return (
    <>
      {/* Single Row: Search, Filters, and View Toggle */}
      <div className="flex items-center gap-3 px-8 py-3 border-b border-gray-200 bg-white relative z-10">
        {/* Search - Larger width on left */}
        <div className="relative" style={{ width: '600px' }}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by name, description, tags, or path..."
            className="pl-9 pr-8 h-9 text-sm border-gray-300 w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Spacer to push filters to right */}
        <div className="flex-1"></div>

        {/* Status Filter */}
        <Select
          value={currentStatus}
          onChange={(e) => updateFilters('status', e.target.value)}
          className="w-40 h-9 text-sm rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 relative z-20"
          style={{
            border: '1px solid #d1d5db',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>

        {/* Pattern Filter */}
        <Select
          value={currentPattern}
          onChange={(e) => updateFilters('pattern', e.target.value)}
          className="w-44 h-9 text-sm rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 relative z-20"
          style={{
            border: '1px solid #d1d5db',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          {PATTERNS.map((pattern) => (
            <option key={pattern} value={pattern}>
              {pattern}
            </option>
          ))}
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1.5 h-9 text-sm text-gray-600 hover:text-gray-900"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}

        {/* View Toggle */}
        <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
      </div>

      {/* Content */}
      {viewMode === 'card' ? (
        <MigrationsCardView migrations={migrations} />
      ) : (
        <MigrationsListView migrations={migrations} />
      )}
    </>
  )
}
