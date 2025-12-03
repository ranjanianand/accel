'use client'

import { useEffect, useState } from 'react'
import { usePipelineStore } from '@/stores/pipeline-store'
import { useSetupStore } from '@/stores/setup-store'
import { Plus, Minus, AlertCircle, CheckCircle2, AlertTriangle, Download, Clock, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DependencyChain {
  name: string
  jobCount: number
  criticalPath: boolean
}

interface LineageFlow {
  name: string
  sourceToTargetPaths: number
  businessCritical: boolean
}

interface MigrationWave {
  wave: number
  complexity: 'low' | 'medium' | 'high'
  jobCount: number
  jobs: string[]
  description: string
}

interface RiskItem {
  jobName: string
  riskType: 'custom_code' | 'unresolved_dependency' | 'high_complexity'
  severity: 'medium' | 'high' | 'critical'
  description: string
}

interface ActivityLog {
  timestamp: string
  message: string
  type: 'info' | 'success' | 'warning'
}

interface DiscoveryResults {
  dependencyChains: DependencyChain[]
  criticalPaths: { source: string; affectedJobs: number }[]
  topDependencies: { name: string; type: string; usedBy: number }[]
  lineageFlows: LineageFlow[]
  orphanedObjects: string[]
  migrationWaves: MigrationWave[]
  riskItems: RiskItem[]
}

export function DiscoveryStage() {
  const { stages, updateStageProgress, completeStage, moveToNextStage } = usePipelineStore()
  const { projectInfo, analysisResults, connections } = useSetupStore()
  const stageResult = stages['discovery']
  const [progress, setProgress] = useState(0)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['waves']))
  const [isExporting, setIsExporting] = useState(false)
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([])
  const [estimatedTime, setEstimatedTime] = useState('3-5 min')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }

  const expandAll = () => {
    setExpandedSections(new Set(['waves', 'dependencies', 'lineage', 'risks']))
  }

  const collapseAll = () => {
    setExpandedSections(new Set())
  }

  // Mock discovery results
  const discoveryData: DiscoveryResults = {
    dependencyChains: [
      { name: 'Customer_Master_Chain', jobCount: 23, criticalPath: true },
      { name: 'Sales_Analytics_Chain', jobCount: 18, criticalPath: true },
      { name: 'Product_Dimension_Chain', jobCount: 12, criticalPath: false },
      { name: 'Inventory_Chain', jobCount: 9, criticalPath: false },
      { name: 'Lookup_Tables_Chain', jobCount: 15, criticalPath: false },
    ],
    criticalPaths: [
      { source: 'CUSTOMER_MASTER', affectedJobs: 45 },
      { source: 'SALES_FACT_DAILY', affectedJobs: 32 },
      { source: 'PRODUCT_HIERARCHY', affectedJobs: 28 },
    ],
    topDependencies: [
      { name: 'LKP_CURRENCY_RATES', type: 'Lookup', usedBy: 42 },
      { name: 'DIM_TIME_CALENDAR', type: 'Dimension', usedBy: 38 },
      { name: 'SRC_CUSTOMER_DB', type: 'Connection', usedBy: 35 },
      { name: 'DIM_PRODUCT', type: 'Dimension', usedBy: 29 },
      { name: 'LKP_EXCHANGE_RATES', type: 'Lookup', usedBy: 24 },
    ],
    lineageFlows: [
      { name: 'Customer 360 Pipeline', sourceToTargetPaths: 23, businessCritical: true },
      { name: 'Sales Reporting Flow', sourceToTargetPaths: 18, businessCritical: true },
      { name: 'Inventory Management', sourceToTargetPaths: 15, businessCritical: false },
      { name: 'Product Master Data', sourceToTargetPaths: 12, businessCritical: true },
    ],
    orphanedObjects: [
      'TEMP_STAGING_TABLE_OLD',
      'BACKUP_CUSTOMER_2022',
      'TEST_MAPPING_V1',
    ],
    migrationWaves: [
      {
        wave: 1,
        complexity: 'low',
        jobCount: 15,
        jobs: ['LKP_CURRENCY_RATES', 'LKP_EXCHANGE_RATES', 'DIM_TIME_CALENDAR', 'DIM_GEOGRAPHY', 'LKP_PRODUCT_TYPES'],
        description: 'Independent lookups and reference data - no dependencies, straightforward conversion'
      },
      {
        wave: 2,
        complexity: 'medium',
        jobCount: 42,
        jobs: ['DIM_CUSTOMER_SCD2', 'DIM_PRODUCT_MASTER', 'STG_INVENTORY_CDC', 'DIM_SUPPLIER', 'DIM_STORE_LOCATION'],
        description: 'Standard dimension loads and staging - moderate complexity, well-established patterns'
      },
      {
        wave: 3,
        complexity: 'high',
        jobCount: 8,
        jobs: ['FACT_SALES_AGGREGATION', 'AGG_CUSTOMER_LTV', 'COMPLEX_RECONCILIATION_JOB'],
        description: 'Complex aggregations with custom code - requires manual review and validation'
      },
    ],
    riskItems: [
      {
        jobName: 'FACT_SALES_AGGREGATION',
        riskType: 'custom_code',
        severity: 'high',
        description: 'Contains 5 custom Java transformations requiring manual review and conversion'
      },
      {
        jobName: 'RECONCILIATION_DAILY',
        riskType: 'high_complexity',
        severity: 'critical',
        description: 'Complexity score 94/100 - nested subqueries and 12 lookup transformations'
      },
      {
        jobName: 'STG_EXTERNAL_API_FEED',
        riskType: 'unresolved_dependency',
        severity: 'medium',
        description: 'References external API connection not found in metadata'
      },
      {
        jobName: 'AGG_CUSTOMER_LTV',
        riskType: 'custom_code',
        severity: 'high',
        description: 'Uses custom expression macros not in standard function library'
      },
      {
        jobName: 'HIST_DATA_ARCHIVE',
        riskType: 'unresolved_dependency',
        severity: 'medium',
        description: 'Target table schema mismatch detected between source and metadata'
      },
    ],
  }

  useEffect(() => {
    if (stageResult.status === 'in_progress') {
      const addLog = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false })
        setActivityLog(prev => [...prev, { timestamp, message, type }])
      }

      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + 5, 100)

          // Add activity log messages at key milestones
          if (newProgress === 10) {
            addLog('Starting dependency analysis...', 'info')
            updateStageProgress('discovery', newProgress, 'Analyzing dependencies...')
          } else if (newProgress === 25) {
            addLog('Identified 4 dependency chains', 'success')
            updateStageProgress('discovery', newProgress, 'Building dependency graph...')
          } else if (newProgress === 40) {
            addLog('Mapping data lineage flows...', 'info')
            updateStageProgress('discovery', newProgress, 'Mapping data lineage...')
          } else if (newProgress === 55) {
            addLog('Traced 67 lineage paths across 12 flows', 'success')
            updateStageProgress('discovery', newProgress, 'Analyzing lineage paths...')
          } else if (newProgress === 70) {
            addLog('Calculating migration waves...', 'info')
            updateStageProgress('discovery', newProgress, 'Calculating migration waves...')
          } else if (newProgress === 85) {
            addLog('Organized into 3 migration waves', 'success')
            updateStageProgress('discovery', newProgress, 'Identifying risk factors...')
          } else if (newProgress === 95) {
            addLog('Found 5 items requiring attention', 'warning')
            updateStageProgress('discovery', newProgress, 'Finalizing discovery...')
          } else if (newProgress === 100) {
            addLog('Discovery analysis completed', 'success')
            updateStageProgress('discovery', newProgress, 'Discovery complete')
            clearInterval(interval)
            setTimeout(() => {
              completeStage('discovery', {
                totalChains: discoveryData.dependencyChains.length,
                criticalPaths: discoveryData.criticalPaths.length,
                lineageFlows: discoveryData.lineageFlows.length,
                riskItems: discoveryData.riskItems.length,
              })
            }, 500)
          }

          return newProgress
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [stageResult.status])

  const isCompleted = stageResult.status === 'completed'

  const handleShowConfirmation = () => {
    setShowConfirmDialog(true)
  }

  const handleProceedToConversion = () => {
    setShowConfirmDialog(false)
    completeStage('discovery')
    moveToNextStage()
  }

  const totalJobs = discoveryData.migrationWaves.reduce((sum, wave) => sum + wave.jobCount, 0)
  const totalEstimatedTime = '~13 min' // Sum of all wave times (2 + 8 + 3)

  const handleDownloadReport = async () => {
    if (!analysisResults) return

    setIsExporting(true)
    try {
      // Dynamic import to avoid SSR issues with exceljs
      const { generateDiscoveryExcel } = await import('@/lib/excel-export')

      const blob = await generateDiscoveryExcel({
        projectName: projectInfo.name,
        analysisResults,
        connections
      })

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const timestamp = new Date().toISOString().split('T')[0]
      link.download = `Discovery_Report_${projectInfo.name.replace(/\s+/g, '_')}_${timestamp}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to generate Excel report:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const getComplexityColor = (complexity: 'low' | 'medium' | 'high') => {
    switch (complexity) {
      case 'low': return 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400'
      case 'medium': return 'text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400'
      case 'high': return 'text-orange-700 bg-orange-50 dark:bg-orange-950/20 dark:text-orange-400'
    }
  }

  const getSeverityIcon = (severity: 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'medium': return <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500" />
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-500" />
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-background border border-border rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold mb-1">Discovery Stage</h2>
          <p className="text-sm text-foreground-secondary">
            Dependency analysis, data lineage mapping, and migration planning
          </p>
        </div>

        {/* Progress Bar (only during processing) */}
        {stageResult.status === 'in_progress' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{progress}%</span>
                <span className="text-xs text-foreground-tertiary">{stageResult.message}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-foreground-tertiary">
                <Clock className="w-3 h-3" />
                <span>~{estimatedTime}</span>
              </div>
            </div>
            <div className="h-1.5 bg-background-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Activity Log */}
            {activityLog.length > 0 && (
              <div className="mt-4 bg-background-secondary rounded border border-border p-4 max-h-48 overflow-y-auto">
                <h4 className="text-xs font-semibold mb-2 text-foreground-secondary">Activity Log</h4>
                <div className="space-y-1">
                  {activityLog.map((log, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-mono">
                      <span className="text-foreground-tertiary shrink-0">{log.timestamp}</span>
                      <span className={
                        log.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                        log.type === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                        'text-foreground-secondary'
                      }>{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Summary Cards */}
        {isCompleted && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="border border-border rounded-lg p-4">
              <div className="text-2xl font-semibold">{discoveryData.dependencyChains.length}</div>
              <div className="text-xs text-foreground-secondary mt-1">Job Chains</div>
            </div>
            <div className="border border-border rounded-lg p-4">
              <div className="text-2xl font-semibold">{discoveryData.criticalPaths.length}</div>
              <div className="text-xs text-foreground-secondary mt-1">Critical Paths</div>
            </div>
            <div className="border border-border rounded-lg p-4">
              <div className="text-2xl font-semibold">{discoveryData.lineageFlows.reduce((sum, f) => sum + f.sourceToTargetPaths, 0)}</div>
              <div className="text-xs text-foreground-secondary mt-1">Lineage Paths</div>
            </div>
            <div className="border border-border rounded-lg p-4">
              <div className="text-2xl font-semibold">{discoveryData.riskItems.length}</div>
              <div className="text-xs text-foreground-secondary mt-1">Attention Required</div>
            </div>
          </div>
        )}
      </div>

      {/* Discovery Results Sections */}
      {isCompleted && (
        <div className="space-y-4">
          {/* Expand/Collapse All Controls */}
          <div className="flex justify-end gap-2">
            <button
              onClick={expandAll}
              className="text-xs px-3 py-1.5 rounded border border-border bg-background hover:bg-background-secondary transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3" />
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="text-xs px-3 py-1.5 rounded border border-border bg-background hover:bg-background-secondary transition-colors flex items-center gap-1.5"
            >
              <Minus className="w-3 h-3" />
              Collapse All
            </button>
          </div>

          {/* Migration Waves */}
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('waves')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-background-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedSections.has('waves') ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <h3 className="text-sm font-semibold">Migration Wave Recommendations</h3>
                <span className="text-xs text-foreground-tertiary">({discoveryData.migrationWaves.length} waves)</span>
              </div>
            </button>

            {expandedSections.has('waves') && (
              <div className="px-6 pb-6 space-y-3">
                {discoveryData.migrationWaves.map((wave) => (
                  <div key={wave.wave} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">Wave {wave.wave}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getComplexityColor(wave.complexity)}`}>
                          {wave.complexity.toUpperCase()} COMPLEXITY
                        </span>
                        <span className="text-xs text-foreground-tertiary">{wave.jobCount} jobs</span>
                      </div>
                    </div>
                    <p className="text-xs text-foreground-secondary mb-2">{wave.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {wave.jobs.slice(0, 5).map((job) => (
                        <span key={job} className="text-xs px-2 py-1 bg-background-secondary rounded border border-border">
                          {job}
                        </span>
                      ))}
                      {wave.jobCount > 5 && (
                        <span className="text-xs px-2 py-1 text-foreground-tertiary">
                          +{wave.jobCount - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dependency Graph */}
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('dependencies')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-background-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedSections.has('dependencies') ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <h3 className="text-sm font-semibold">Job Relationships & Impact</h3>
              </div>
            </button>

            {expandedSections.has('dependencies') && (
              <div className="px-6 pb-6">
                {/* Job Chains */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-foreground-secondary mb-2">Independent Job Chains</h4>
                  <div className="space-y-2">
                    {discoveryData.dependencyChains.map((chain) => (
                      <div key={chain.name} className="flex items-center justify-between px-3 py-2 bg-background-secondary rounded border border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{chain.name}</span>
                          {chain.criticalPath && (
                            <span className="text-xs px-1.5 py-0.5 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded">
                              CRITICAL
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-foreground-tertiary">{chain.jobCount} jobs</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Critical Paths */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-foreground-secondary mb-2">Critical Paths (High Downstream Impact)</h4>
                  <div className="space-y-2">
                    {discoveryData.criticalPaths.map((path) => (
                      <div key={path.source} className="flex items-center justify-between px-3 py-2 bg-background-secondary rounded border border-border">
                        <span className="text-sm">{path.source}</span>
                        <span className="text-xs text-foreground-tertiary">affects {path.affectedJobs} jobs</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Dependencies */}
                <div>
                  <h4 className="text-xs font-semibold text-foreground-secondary mb-2">Most Referenced Objects</h4>
                  <div className="space-y-2">
                    {discoveryData.topDependencies.map((dep) => (
                      <div key={dep.name} className="flex items-center justify-between px-3 py-2 bg-background-secondary rounded border border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{dep.name}</span>
                          <span className="text-xs text-foreground-tertiary">({dep.type})</span>
                        </div>
                        <span className="text-xs text-foreground-tertiary">used by {dep.usedBy} jobs</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Data Lineage */}
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('lineage')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-background-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedSections.has('lineage') ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <h3 className="text-sm font-semibold">Where Data Flows</h3>
              </div>
            </button>

            {expandedSections.has('lineage') && (
              <div className="px-6 pb-6">
                <div className="space-y-2 mb-4">
                  {discoveryData.lineageFlows.map((flow) => (
                    <div key={flow.name} className="flex items-center justify-between px-3 py-2 bg-background-secondary rounded border border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{flow.name}</span>
                        {flow.businessCritical && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        )}
                      </div>
                      <span className="text-xs text-foreground-tertiary">{flow.sourceToTargetPaths} paths</span>
                    </div>
                  ))}
                </div>

                {discoveryData.orphanedObjects.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-foreground-secondary mb-2">Orphaned Objects (Not Used)</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {discoveryData.orphanedObjects.map((obj) => (
                        <span key={obj} className="text-xs px-2 py-1 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 rounded border border-yellow-200 dark:border-yellow-800">
                          {obj}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Jobs Requiring Attention */}
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('risks')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-background-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedSections.has('risks') ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <h3 className="text-sm font-semibold">Jobs Requiring Attention</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400">
                  {discoveryData.riskItems.length} jobs
                </span>
              </div>
            </button>

            {expandedSections.has('risks') && (
              <div className="px-6 pb-6 space-y-2">
                {discoveryData.riskItems.map((risk, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-3">
                    <div className="flex items-start gap-2 mb-1">
                      {getSeverityIcon(risk.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{risk.jobName}</span>
                          <span className="text-xs px-1.5 py-0.5 bg-background-secondary rounded border border-border">
                            {risk.riskType.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-foreground-secondary">{risk.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Proceed to Conversion Button */}
      {isCompleted && (
        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold mb-1">Discovery Complete</h3>
              <p className="text-xs text-foreground-secondary">
                Review the findings above and proceed to automated conversion
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleDownloadReport}
                disabled={isExporting}
                variant="outline"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Download Report'}
              </Button>
              <Button onClick={handleShowConfirmation} size="lg">
                Proceed to Conversion →
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg max-w-lg w-full mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold">Start Automated Conversion?</h2>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="text-foreground-tertiary hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-foreground-secondary">
                The system will begin automated conversion of {totalJobs} Informatica mappings to Talend jobs across 3 migration waves.
              </p>

              {/* Wave Breakdown */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold mb-2">Migration Plan:</h3>
                {discoveryData.migrationWaves.map((wave) => (
                  <div key={wave.wave} className="flex items-center justify-between text-sm border border-border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Wave {wave.wave}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getComplexityColor(wave.complexity)}`}>
                        {wave.complexity.toUpperCase()}
                      </span>
                      <span className="text-foreground-secondary">• {wave.jobCount} jobs</span>
                    </div>
                    <div className="flex items-center gap-1 text-foreground-tertiary">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">
                        {wave.complexity === 'low' ? '~2 min' : wave.complexity === 'medium' ? '~8 min' : '~3 min'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-foreground-tertiary mb-1">Total Jobs</div>
                    <div className="text-xl font-semibold">{totalJobs}</div>
                  </div>
                  <div>
                    <div className="text-foreground-tertiary mb-1">Estimated Time</div>
                    <div className="text-xl font-semibold">{totalEstimatedTime}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-foreground-tertiary mb-1">Automation Rate</div>
                    <div className="text-xl font-semibold">92-97%</div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-foreground-tertiary">
                The conversion process will run automatically. You can monitor progress in real-time and download generated Talend jobs upon completion.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <Button
                onClick={() => setShowConfirmDialog(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={handleProceedToConversion}>
                <ArrowRight className="w-4 h-4 mr-2" />
                Start Conversion
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
