'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePipelineStore } from '@/stores/pipeline-store'
import { useSetupStore, FlatFileMetadata } from '@/stores/setup-store'

export function AnalysisStage() {
  const { completeStage, moveToNextStage } = usePipelineStore()
  const { projectInfo, analysisResults, connections, updateConnection, testConnection } = useSetupStore()
  const [testingConnection, setTestingConnection] = useState<string | null>(null)
  const [expandedFileTypes, setExpandedFileTypes] = useState<Set<string>>(new Set())

  const handleStartMigration = () => {
    completeStage('analysis')
    moveToNextStage()
  }

  const handleTestConnection = async (name: string) => {
    setTestingConnection(name)
    await testConnection(name)
    setTestingConnection(null)
  }

  const toggleFileType = (fileType: string) => {
    setExpandedFileTypes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(fileType)) {
        newSet.delete(fileType)
      } else {
        newSet.add(fileType)
      }
      return newSet
    })
  }

  // Group files by type with counts
  const fileTypeGroups = useMemo(() => {
    if (!analysisResults?.flatFiles) return []

    const groups = analysisResults.flatFiles.reduce((acc, file) => {
      const type = file.fileType
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(file)
      return acc
    }, {} as Record<string, FlatFileMetadata[]>)

    return Object.entries(groups).map(([type, files]) => ({
      type,
      count: files.length,
      files
    }))
  }, [analysisResults?.flatFiles])

  const hasAnalysisData = analysisResults !== null

  const canStartMigration = () => {
    if (!analysisResults) return false

    const requiredConnections = analysisResults.detectedConnections.filter((dc) => dc.required)
    const allRequiredTested = requiredConnections.every((rc) => {
      const conn = connections.find((c) => c.name === rc.name)
      // Flat files don't need testing
      if (conn?.type === 'Flat File') return true
      return conn?.tested && conn?.testSuccess
    })

    return allRequiredTested
  }

  return (
    <div className="space-y-6">
      {/* Analysis Results Hero */}
      {hasAnalysisData && analysisResults && (
        <>
          {/* Hero Metrics - Clean & Minimal */}
          <div className="border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold mb-0.5">
                  Analysis Complete
                </h2>
                <p className="text-xs text-foreground-secondary">
                  {projectInfo.name} • {analysisResults.objectCounts.mappings} mappings detected
                </p>
              </div>
              <div className="px-2.5 py-1 border border-green-200 dark:border-green-800 rounded-md">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-green-500 rounded-full" />
                  <span className="text-xs text-green-700 dark:text-green-400">Ready</span>
                </div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              {/* Automation Rate */}
              <div className="border border-border rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                <div className="text-2xl font-semibold mb-1 text-blue-600 dark:text-blue-400">
                  {analysisResults.automationRate}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Automation Rate</div>
                <div className="mt-2 h-0.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${analysisResults.automationRate}%` }} />
                </div>
              </div>

              {/* Time Savings */}
              <div className="border border-border rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                <div className="text-2xl font-semibold mb-1 text-purple-600 dark:text-purple-400">
                  {analysisResults.timeSavingsEstimate}h
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Time Savings</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1.5">
                  vs manual migration
                </div>
              </div>

              {/* Complexity */}
              <div className="border border-border rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                <div className="text-2xl font-semibold mb-1 text-emerald-600 dark:text-emerald-400">
                  {analysisResults.complexity.average}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Avg Complexity</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-300 via-yellow-300 to-red-300 dark:from-emerald-700 dark:via-yellow-700 dark:to-red-700 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Detected Objects & Patterns */}
          <div className="grid grid-cols-2 gap-4">
            {/* Objects */}
            <div className="border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold mb-4">Detected Objects</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Mappings', value: analysisResults.objectCounts.mappings },
                  { label: 'Workflows', value: analysisResults.objectCounts.workflows },
                  { label: 'Sessions', value: analysisResults.objectCounts.sessions },
                  { label: 'Mapplets', value: analysisResults.objectCounts.mapplets },
                  { label: 'Sources', value: analysisResults.objectCounts.sources },
                  { label: 'Targets', value: analysisResults.objectCounts.targets },
                ].map((item) => (
                  <div key={item.label} className="border border-border rounded p-2.5 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                    <div className="text-lg font-semibold mb-0.5">{item.value}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Patterns */}
            <div className="border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold mb-4">ETL Patterns</h3>
              <div className="space-y-2.5">
                {analysisResults.patterns.map((pattern, index) => {
                  const colorClasses = [
                    'bg-blue-500',
                    'bg-purple-500',
                    'bg-indigo-500',
                    'bg-pink-500'
                  ]
                  const colorClass = colorClasses[index % colorClasses.length]

                  return (
                    <div key={pattern.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{pattern.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{pattern.percentage}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colorClass} rounded-full transition-all duration-700`}
                            style={{ width: `${pattern.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[2.5rem] text-right">{pattern.count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Connection Configuration */}
      {hasAnalysisData && connections.filter(c => c.type !== 'Flat File').length > 0 && (
        <div className="border border-border rounded-lg p-6">
          <div className="mb-5">
            <h3 className="text-sm font-semibold mb-0.5">
              Connection Configuration
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Configure and test database connections before migration
            </p>
          </div>

          <div className="space-y-4">
            {connections.filter(c => c.type !== 'Flat File').map((conn) => {
              const isRequired = analysisResults?.detectedConnections.find(dc => dc.name === conn.name)?.required
              const isTesting = testingConnection === conn.name

              return (
                <div
                  key={conn.name}
                  className={`border rounded-lg p-4 transition-colors ${
                    conn.tested && conn.testSuccess
                      ? 'border-green-200 dark:border-green-800'
                      : isRequired
                      ? 'border-amber-200 dark:border-amber-800'
                      : 'border-border'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${
                        conn.type === 'Oracle'
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                          : conn.type === 'Flat File'
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {conn.type === 'Flat File' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                          )}
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-medium">{conn.name}</h4>
                          {isRequired && (
                            <span className="px-1.5 py-0.5 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 text-xs rounded">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{conn.type}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {conn.tested && conn.testSuccess && (
                      <div className="flex items-center gap-1.5 px-2 py-1 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs rounded">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Connected
                      </div>
                    )}
                  </div>

                  {/* Connection Form - Only for database connections */}
                  {conn.type !== 'Flat File' ? (
                    <div className="space-y-3 mb-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`${conn.name}-host`} className="text-xs mb-1.5">Host</Label>
                          <Input
                            id={`${conn.name}-host`}
                            type="text"
                            placeholder="localhost"
                            value={conn.host || ''}
                            onChange={(e) => updateConnection(conn.name, { host: e.target.value })}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${conn.name}-port`} className="text-xs mb-1.5">Port</Label>
                          <Input
                            id={`${conn.name}-port`}
                            type="number"
                            placeholder="1521"
                            value={conn.port || ''}
                            onChange={(e) => updateConnection(conn.name, { port: parseInt(e.target.value) })}
                            className="h-9 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`${conn.name}-database`} className="text-xs mb-1.5">Database / SID</Label>
                        <Input
                          id={`${conn.name}-database`}
                          type="text"
                          placeholder="ORCL"
                          value={conn.database || ''}
                          onChange={(e) => updateConnection(conn.name, { database: e.target.value })}
                          className="h-9 text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`${conn.name}-username`} className="text-xs mb-1.5">Username</Label>
                          <Input
                            id={`${conn.name}-username`}
                            type="text"
                            placeholder="username"
                            value={conn.username || ''}
                            onChange={(e) => updateConnection(conn.name, { username: e.target.value })}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${conn.name}-password`} className="text-xs mb-1.5">Password</Label>
                          <Input
                            id={`${conn.name}-password`}
                            type="password"
                            placeholder="••••••••"
                            value={conn.password || ''}
                            onChange={(e) => updateConnection(conn.name, { password: e.target.value })}
                            className="h-9 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-600 dark:text-gray-400 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                      File-based connection - No testing required
                    </div>
                  )}

                  {/* Test Button - Only for database connections */}
                  {conn.type !== 'Flat File' && (
                    <>
                      <Button
                        onClick={() => handleTestConnection(conn.name)}
                        disabled={isTesting || (conn.tested && conn.testSuccess)}
                        variant="outline"
                        size="sm"
                        className={`w-full h-9 ${
                          conn.tested && conn.testSuccess
                            ? 'bg-green-200 dark:bg-green-900/60 border-green-500 dark:border-green-500 text-green-800 dark:text-green-200 hover:bg-green-300 dark:hover:bg-green-900/80 font-medium'
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {isTesting ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                            Testing Connection...
                          </>
                        ) : conn.tested && conn.testSuccess ? (
                          <>
                            <svg className="w-3.5 h-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Connection Verified
                          </>
                        ) : (
                          'Test Connection'
                        )}
                      </Button>

                      {/* Test Message - Only show errors */}
                      {conn.tested && !conn.testSuccess && conn.testMessage && (
                        <div className="mt-3 text-xs px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                          {conn.testMessage}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Flat Files Detected */}
      {hasAnalysisData && analysisResults?.flatFiles && analysisResults.flatFiles.length > 0 && (
        <div className="border border-border rounded-lg p-6">
          <div className="mb-5">
            <h3 className="text-sm font-semibold mb-0.5">
              Flat File Sources
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              File-based data sources detected from metadata ({analysisResults.flatFiles.length} total files)
            </p>
          </div>

          <div className="space-y-3">
            {fileTypeGroups.map(({ type, count, files }) => {
              const isExpanded = expandedFileTypes.has(type)

              return (
                <div key={type} className="border border-border rounded-lg overflow-hidden">
                  {/* File Type Header - Clickable */}
                  <button
                    onClick={() => toggleFileType(type)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-medium">{type} Files</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{count} file{count !== 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded File List */}
                  {isExpanded && (
                    <div className="border-t border-border bg-gray-50/50 dark:bg-gray-800/20">
                      <div className="divide-y divide-border">
                        {files.map((file, idx) => (
                          <div key={idx} className="px-4 py-3">
                            <div className="flex items-start gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {file.fileName}
                                </p>
                                {file.description && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                    {file.description}
                                  </p>
                                )}
                              </div>
                              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded flex-shrink-0">
                                {file.fileType}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Start Migration CTA */}
      <div className="border border-border rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded bg-foreground flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-1">Ready to Start Migration</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
              All connections configured and tested. The automated migration process will convert your Informatica workflows to Talend jobs with {analysisResults?.automationRate}% automation.
            </p>

            <div className="flex items-start gap-2.5 p-3 border border-border rounded mb-4">
              <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs space-y-1.5">
                <p className="font-medium">Migration Process:</p>
                <ul className="text-gray-600 dark:text-gray-400 space-y-0.5">
                  <li>• Discovery: Map dependencies and relationships</li>
                  <li>• Conversion: Transform workflows to Talend jobs</li>
                  <li>• Validation: Verify data lineage and business rules</li>
                  <li>• Optimization: Fine-tune performance and quality</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleStartMigration}
              size="lg"
              disabled={!canStartMigration()}
              className="w-full bg-foreground hover:bg-foreground/90 text-background font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {canStartMigration() ? (
                <>
                  Start Discovery Process
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Test All Required Connections First
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
