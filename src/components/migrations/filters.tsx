'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

const PATTERNS = [
  'All Patterns',
  'SCD Type 1',
  'SCD Type 2',
  'SCD Type 3',
  'Fact Load',
  'Dimension Load',
  'Aggregation',
  'Lookup',
  'Union',
  'Join',
  'Filter',
  'Router',
  'Normalizer',
  'Sorter',
  'Rank',
  'Pivot',
  'Unpivot',
  'CDC',
  'Slowly Changing',
]

const STATUSES = [
  'All Statuses',
  'Completed',
  'In Progress',
  'Failed',
  'Pending Review',
]

export function MigrationsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get('status') || 'All Statuses'
  const currentPattern = searchParams.get('pattern') || 'All Patterns'
  const currentSearch = searchParams.get('search') || ''

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value && value !== 'All Patterns' && value !== 'All Statuses') {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/migrations?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/migrations')
  }

  const hasActiveFilters = currentStatus !== 'All Statuses' ||
                          currentPattern !== 'All Patterns' ||
                          currentSearch !== ''

  return (
    <div className="flex items-center gap-4 p-4 border-b border-border bg-background-secondary">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-tertiary" />
        <Input
          type="search"
          placeholder="Search migrations..."
          className="pl-9"
          defaultValue={currentSearch}
          onChange={(e) => updateFilters('search', e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <Select
        value={currentStatus}
        onChange={(e) => updateFilters('status', e.target.value)}
        className="w-40"
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
        className="w-48"
      >
        {PATTERNS.map((pattern) => (
          <option key={pattern} value={pattern}>
            {pattern}
          </option>
        ))}
      </Select>

      {/* Date Range */}
      <Select defaultValue="30d" className="w-32">
        <option value="7d">Last 7 Days</option>
        <option value="30d">Last 30 Days</option>
        <option value="90d">Last 90 Days</option>
        <option value="all">All Time</option>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  )
}
