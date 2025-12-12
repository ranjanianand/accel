'use client'

import * as React from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { format } from 'date-fns'
import { MoreVertical, FileText, Code, Trash2, Pencil } from 'lucide-react'
import { type MigrationRow } from './types'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

export interface MigrationsCardViewProps {
  migrations: MigrationRow[]
}

export function MigrationsCardView({ migrations }: MigrationsCardViewProps) {
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editedName, setEditedName] = React.useState('')

  const getStatusStyles = (status: MigrationRow['status']) => {
    switch (status) {
      case 'completed':
        return {
          badge: <Badge variant="success">Completed</Badge>,
          dot: 'bg-green-500',
        }
      case 'in_progress':
        return {
          badge: <Badge variant="info">In Progress</Badge>,
          dot: 'bg-blue-500',
        }
      case 'failed':
        return {
          badge: <Badge variant="error">Failed</Badge>,
          dot: 'bg-red-600',
        }
      case 'pending_review':
        return {
          badge: <Badge variant="warning">Pending Review</Badge>,
          dot: 'bg-yellow-600',
        }
    }
  }

  const getComplexityColor = (complexity: number) => {
    if (complexity < 30) return 'text-green-600'
    if (complexity < 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleStartEdit = (migrationId: string, currentName: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setEditingId(migrationId)
    setEditedName(currentName)
  }

  const handleSaveEdit = (migrationId: string) => {
    if (editedName.trim()) {
      // TODO: Call API to update migration name
      console.log('Saving migration name:', migrationId, editedName)
      alert(`Rename functionality will update: "${editedName}"`)
    }
    setEditingId(null)
    setEditedName('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditedName('')
  }

  const handleKeyDown = (e: React.KeyboardEvent, migrationId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSaveEdit(migrationId)
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {migrations.map((migration) => {
        const statusStyles = getStatusStyles(migration.status)

        return (
          <Link
            key={migration.id}
            href={`/migrations/${migration.id}`}
            className="block group"
          >
            <div className="h-[140px] border-[1.5px] border-gray-300 rounded-lg bg-white hover:border-gray-400 hover:shadow-lg transition-all duration-200 flex flex-col" style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1)' }}>
              <div className="p-3 flex items-start gap-2 flex-1">
                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-100`}>
                  <div className={`w-2 h-2 rounded-full ${statusStyles.dot}`} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  {/* Title + Menu */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    {editingId === migration.id ? (
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, migration.id)}
                        onBlur={() => handleSaveEdit(migration.id)}
                        autoFocus
                        className="text-xs font-semibold text-gray-900 bg-white border border-blue-500 rounded px-1 py-0.5 flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <h3
                          className="text-xs font-semibold truncate group-hover:text-blue-600 transition-colors leading-tight text-gray-900 cursor-pointer"
                          onClick={(e) => handleStartEdit(migration.id, migration.name, e)}
                          title="Click to rename"
                        >
                          {migration.name}
                        </h3>
                        <button
                          onClick={(e) => handleStartEdit(migration.id, migration.name, e)}
                          className="flex-shrink-0 p-0.5 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Rename"
                        >
                          <Pencil className="h-3 w-3 text-gray-400" />
                        </button>
                      </div>
                    )}
                    <DropdownMenu
                      trigger={
                        <button className="flex-shrink-0 p-0.5 hover:bg-gray-100 rounded transition-colors">
                          <MoreVertical className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                      }
                    >
                      <DropdownMenuItem
                        icon={<FileText className="h-4 w-4" />}
                        onClick={() => {
                          window.location.href = `/migrations/${migration.id}`
                        }}
                      >
                        Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        icon={<Code className="h-4 w-4" />}
                        onClick={() => {
                          window.location.href = `/preview/${migration.id}`
                        }}
                      >
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        icon={<Trash2 className="h-4 w-4" />}
                        variant="danger"
                        onClick={() => {
                          if (confirm(`Delete migration "${migration.name}"?`)) {
                            alert('Delete functionality coming soon')
                          }
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenu>
                  </div>

                  {/* Jobs + Status + Date */}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="default" className="text-xs bg-gray-100 text-gray-700 border-0 px-2 py-0.5 font-medium">
                      {migration.totalJobs || 65} jobs
                    </Badge>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">
                      {format(migration.updatedAt, 'MMM d, yyyy')}
                    </span>
                    <div className="ml-auto">
                      {migration.status === 'in_progress' && migration.progress ? (
                        <Badge variant="info" className="text-[10px]">In Progress {migration.progress}%</Badge>
                      ) : (
                        statusStyles.badge
                      )}
                    </div>
                  </div>

                  {/* Metrics Grid - 4 key columns */}
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Complexity</div>
                      <div className="text-sm font-bold leading-none text-gray-900">
                        {migration.complexity}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Quality</div>
                      <div className="text-sm font-bold leading-none text-gray-900">
                        {migration.qualityScore ? `${migration.qualityScore}%` : '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Rules</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-gray-900 leading-none">{migration.businessRules}</span>
                        {migration.businessRulesNeedReview > 0 && (
                          <Badge variant="warning" className="text-[8px] px-1 py-0">
                            {migration.businessRulesNeedReview}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Rows</div>
                      <div className="text-sm font-bold leading-none text-gray-900">
                        {migration.rowCount ? (
                          migration.rowCount >= 1000000
                            ? `${(migration.rowCount / 1000000).toFixed(1)}M`
                            : migration.rowCount >= 1000
                            ? `${(migration.rowCount / 1000).toFixed(1)}K`
                            : migration.rowCount
                        ) : '—'}
                      </div>
                    </div>
                  </div>

                  {/* Error Types - Only for Failed Status */}
                  {migration.status === 'failed' && migration.errorTypes && migration.errorTypes.length > 0 && (
                    <div className="mt-2 flex items-center gap-1 flex-wrap">
                      {migration.errorTypes.map((errorType, idx) => (
                        <Badge key={idx} variant="error" className="text-[9px] px-1.5 py-0">
                          {errorType}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
