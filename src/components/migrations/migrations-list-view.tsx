'use client'

import * as React from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { MoreVertical, Copy, FileText, Code, Trash2, Pencil } from 'lucide-react'
import { type MigrationRow } from './types'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

export interface MigrationsListViewProps {
  migrations: MigrationRow[]
}

export function MigrationsListView({ migrations }: MigrationsListViewProps) {
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
    <div className="space-y-3 p-6">
      {migrations.map((migration) => {
        const statusStyles = getStatusStyles(migration.status)

        return (
          <Link
            key={migration.id}
            href={`/migrations/${migration.id}`}
            className="block group"
          >
            <div className="border-[1.5px] border-gray-300 rounded-lg bg-white hover:border-gray-500 hover:shadow-md transition-all duration-200 p-4" style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1)' }}>
              {/* Top Row: Status Dot + Name + Status Badge + Menu */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${statusStyles.dot}`} />
                {editingId === migration.id ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, migration.id)}
                    onBlur={() => handleSaveEdit(migration.id)}
                    autoFocus
                    className="text-xs font-semibold text-gray-900 bg-white border border-blue-500 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <h3
                      className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer"
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
                <div className="flex items-center gap-2">
                  {migration.status === 'in_progress' && migration.progress ? (
                    <Badge variant="info" className="text-xs">{migration.progress}% Complete</Badge>
                  ) : (
                    statusStyles.badge
                  )}
                  <DropdownMenu
                    trigger={
                      <button className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors">
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
              </div>

              {/* Jobs + Date */}
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="default" className="text-xs bg-gray-100 text-gray-700 border-0 px-2 py-0.5 font-medium">
                  {migration.totalJobs || 65} jobs
                </Badge>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-500">
                  Updated {format(migration.updatedAt, 'MMM d, yyyy')}
                </span>
              </div>

              {/* Description */}
              {migration.description && (
                <div className="mb-3">
                  <p className="text-xs text-gray-600 line-clamp-2">{migration.description}</p>
                </div>
              )}

              {/* Tags */}
              {migration.tags && migration.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap mb-3">
                  {migration.tags.map((tag, idx) => (
                    <Badge key={idx} variant="default" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 px-2 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Source/Target Paths with versions */}
              {(migration.sourcePath || migration.targetPath) && (
                <div className="mb-4 space-y-1.5 text-xs">
                  {migration.sourcePath && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 font-medium min-w-[60px]">Source:</span>
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-gray-700 font-mono text-[11px]">{migration.sourcePath}.xml</span>
                        {migration.sourceVersion && (
                          <Badge variant="default" className="text-[9px] bg-blue-50 text-blue-700 border-blue-200 px-1.5 py-0">
                            {migration.sourceVersion}
                          </Badge>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            navigator.clipboard.writeText(migration.sourcePath + '.xml')
                          }}
                          className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                          title="Copy path"
                        >
                          <Copy className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                    </div>
                  )}
                  {migration.targetPath && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 font-medium min-w-[60px]">Target:</span>
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-gray-700 font-mono text-[11px]">{migration.targetPath}.item</span>
                        {migration.targetVersion && (
                          <Badge variant="default" className="text-[9px] bg-green-50 text-green-700 border-green-200 px-1.5 py-0">
                            {migration.targetVersion}
                          </Badge>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            navigator.clipboard.writeText(migration.targetPath + '.item')
                          }}
                          className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                          title="Copy path"
                        >
                          <Copy className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Metrics Grid - Horizontal Layout */}
              <div className="grid grid-cols-6 gap-4 mb-3">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Complexity</div>
                  <div className="text-base font-bold text-gray-900">
                    {migration.complexity}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Quality</div>
                  <div className="text-base font-bold text-gray-900">
                    {migration.qualityScore ? `${migration.qualityScore}%` : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Rules</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-gray-900">{migration.businessRules}</span>
                    {migration.businessRulesNeedReview > 0 && (
                      <Badge variant="warning" className="text-[9px] px-1 py-0">
                        {migration.businessRulesNeedReview}
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Rows</div>
                  <div className="text-base font-bold text-gray-900">
                    {migration.rowCount ? (
                      migration.rowCount >= 1000000
                        ? `${(migration.rowCount / 1000000).toFixed(1)}M`
                        : migration.rowCount >= 1000
                        ? `${(migration.rowCount / 1000).toFixed(1)}K`
                        : migration.rowCount
                    ) : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Duration</div>
                  <div className="text-base font-bold text-gray-900">
                    {migration.executionDuration ? (
                      migration.executionDuration >= 60
                        ? `${Math.floor(migration.executionDuration / 60)}h ${migration.executionDuration % 60}m`
                        : `${migration.executionDuration}m`
                    ) : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Created</div>
                  <div className="text-base font-bold text-gray-900">
                    {format(migration.createdAt, 'MMM d')}
                  </div>
                </div>
              </div>

              {/* Validation Breakdown or Automation Metrics */}
              {migration.validation && (migration.status === 'completed' || migration.status === 'pending_review') && (
                <div className="mb-3 p-2 bg-gray-50 rounded border border-gray-200">
                  <div className="text-[10px] text-gray-500 font-medium mb-1.5">Validation Breakdown</div>
                  <div className="grid grid-cols-3 gap-x-3 gap-y-1.5 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data Lineage:</span>
                      <span className="font-semibold text-blue-700">{migration.validation.dataLineage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business Rules:</span>
                      <span className="font-semibold text-purple-700">{migration.validation.businessRules}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Performance:</span>
                      <span className="font-semibold text-green-700">{migration.validation.performance}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Error Handling:</span>
                      <span className="font-semibold text-orange-700">{migration.validation.errorHandling}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data Quality:</span>
                      <span className="font-semibold text-teal-700">{migration.validation.dataQuality}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Schema Match:</span>
                      <span className="font-semibold text-indigo-700">{migration.validation.schemaMatch}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Automation Metrics */}
              {migration.automationRate && (
                <div className="mb-3 flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500">Automation:</span>
                    <span className="font-semibold text-green-700">{migration.automationRate}%</span>
                  </div>
                  {migration.conversionMethod && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500">Method:</span>
                      <Badge variant="default" className="text-[9px] bg-indigo-50 text-indigo-700 border-indigo-200 px-1.5 py-0">
                        {migration.conversionMethod}
                      </Badge>
                    </div>
                  )}
                  {migration.manualEffortRequired && migration.manualEffortRequired > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500">Manual effort:</span>
                      <span className="font-medium text-orange-700">{migration.manualEffortRequired}h required</span>
                    </div>
                  )}
                </div>
              )}

              {/* Error Types with counts - Only for Failed Status */}
              {migration.status === 'failed' && migration.errorDetails && migration.errorDetails.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-gray-500 font-medium">Errors:</span>
                  {migration.errorDetails.map((error, idx) => (
                    <Badge
                      key={idx}
                      variant="error"
                      className="text-xs px-2 py-0.5"
                      title={`${error.count} ${error.severity} severity errors`}
                    >
                      {error.type} ({error.count})
                    </Badge>
                  ))}
                </div>
              )}

              {/* Fallback for simple error types */}
              {migration.status === 'failed' && migration.errorTypes && migration.errorTypes.length > 0 && !migration.errorDetails && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-gray-500 font-medium">Errors:</span>
                  {migration.errorTypes.map((errorType, idx) => (
                    <Badge key={idx} variant="error" className="text-xs px-2 py-0.5">
                      {errorType}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
