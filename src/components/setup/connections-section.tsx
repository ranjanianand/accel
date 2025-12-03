'use client'

import { useState } from 'react'
import { useSetupStore } from '@/stores/setup-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function SetupConnectionsSection() {
  const { analysisStatus, analysisResults, connections, updateConnection, testConnection } =
    useSetupStore()

  const [expandedConnection, setExpandedConnection] = useState<string | null>(null)

  // Section not visible until analysis is complete
  if (analysisStatus !== 'locked' || !analysisResults) {
    return null
  }

  const toggleConnection = (name: string) => {
    setExpandedConnection(expandedConnection === name ? null : name)
  }

  const handleTest = async (name: string) => {
    await testConnection(name)
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground-secondary">Connection Configuration</h3>
        <p className="text-xs text-foreground-tertiary">
          Configure and test database connections detected in your files
        </p>
      </div>

      {connections.length === 0 ? (
        <div className="text-center py-8 text-foreground-secondary">
          <p className="text-sm">No connections detected in uploaded files</p>
        </div>
      ) : (
        <div className="space-y-3">
          {connections.map((conn) => {
            const isExpanded = expandedConnection === conn.name
            const isRequired = analysisResults.detectedConnections.find(
              (dc) => dc.name === conn.name
            )?.required

            return (
              <div
                key={conn.name}
                className={`
                  border rounded-lg overflow-hidden transition-all
                  ${isRequired ? 'border-accent-blue/30 bg-accent-blue/5' : 'border-border bg-background-secondary'}
                `}
              >
                {/* Connection Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-background-tertiary/50 transition-colors"
                  onClick={() => toggleConnection(conn.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded flex items-center justify-center ${
                          conn.tested && conn.testSuccess
                            ? 'bg-status-success/10 text-status-success'
                            : isRequired
                              ? 'bg-accent-blue/10 text-accent-blue'
                              : 'bg-background-tertiary text-foreground-tertiary'
                        }`}
                      >
                        {conn.tested && conn.testSuccess ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                            />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{conn.name}</p>
                          {isRequired && (
                            <span className="badge bg-accent-blue/10 text-accent-blue border-accent-blue/20 text-xs">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-foreground-secondary">{conn.type}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {conn.tested && (
                        <div className="text-right">
                          <p
                            className={`text-xs font-medium ${
                              conn.testSuccess ? 'text-status-success' : 'text-status-error'
                            }`}
                          >
                            {conn.testSuccess ? 'Connected' : 'Failed'}
                          </p>
                          {conn.testMessage && (
                            <p className="text-xs text-foreground-tertiary">{conn.testMessage}</p>
                          )}
                        </div>
                      )}

                      <svg
                        className={`w-5 h-5 text-foreground-secondary transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Connection Form (Expanded) */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border/50">
                    <div className="pt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`${conn.name}-host`}>Host</Label>
                          <Input
                            id={`${conn.name}-host`}
                            type="text"
                            placeholder="localhost"
                            value={conn.host || ''}
                            onChange={(e) =>
                              updateConnection(conn.name, { host: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${conn.name}-port`}>Port</Label>
                          <Input
                            id={`${conn.name}-port`}
                            type="number"
                            placeholder="1521"
                            value={conn.port || ''}
                            onChange={(e) =>
                              updateConnection(conn.name, { port: parseInt(e.target.value) || 0 })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`${conn.name}-database`}>Database</Label>
                        <Input
                          id={`${conn.name}-database`}
                          type="text"
                          placeholder="ORCL"
                          value={conn.database || ''}
                          onChange={(e) =>
                            updateConnection(conn.name, { database: e.target.value })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`${conn.name}-username`}>Username</Label>
                          <Input
                            id={`${conn.name}-username`}
                            type="text"
                            placeholder="admin"
                            value={conn.username || ''}
                            onChange={(e) =>
                              updateConnection(conn.name, { username: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${conn.name}-password`}>Password</Label>
                          <Input
                            id={`${conn.name}-password`}
                            type="password"
                            placeholder="••••••••"
                            value={conn.password || ''}
                            onChange={(e) =>
                              updateConnection(conn.name, { password: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <Button
                          onClick={() => handleTest(conn.name)}
                          variant="secondary"
                          disabled={!conn.host || !conn.database || !conn.username}
                        >
                          Test Connection
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Summary */}
      {connections.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="text-foreground-secondary">
              {connections.filter((c) => c.tested && c.testSuccess).length} of {connections.length}{' '}
              connections tested successfully
            </div>
            {connections.every((c) => c.tested && c.testSuccess) && (
              <div className="flex items-center gap-2 text-status-success">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">All connections ready</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
