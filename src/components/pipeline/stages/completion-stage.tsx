'use client'

import { Button } from '@/components/ui/button'
import { usePipelineStore } from '@/stores/pipeline-store'
import { useSetupStore } from '@/stores/setup-store'
import { useState } from 'react'
import { CheckCircle2, Clock, FileCode, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react'

export function CompletionStage() {
  const { stages } = usePipelineStore()
  const { projectInfo, analysisResults } = useSetupStore()

  const discoveryMetrics = stages['discovery'].metrics
  const conversionMetrics = stages['conversion'].metrics

  // Validation and optimization metrics
  const validationMetrics = {
    passRate: conversionMetrics?.validationPassRate || 99.7,
    issuesFound: 0
  }
  const optimizationMetrics = {
    performanceGain: 28,
    codeQualityScore: 92
  }

  // Calculate total jobs from analysis
  const totalJobs = analysisResults?.objectCounts
    ? analysisResults.objectCounts.mappings + analysisResults.objectCounts.workflows
    : 65

  const manualJobs = 2 // From conversion stage
  const automationRate = conversionMetrics?.automationRate || 97

  // Expandable sections state
  const [expandedSections, setExpandedSections] = useState({
    patterns: false,
    files: false,
    validation: false,
    manual: false
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const expandAll = () => {
    setExpandedSections({
      patterns: true,
      files: true,
      validation: true,
      manual: true
    })
  }

  const collapseAll = () => {
    setExpandedSections({
      patterns: false,
      files: false,
      validation: false,
      manual: false
    })
  }

  const handleDownload = () => {
    alert('Downloading Talend project files...')
  }

  const handleViewReport = () => {
    window.location.href = '/migrations/report'
  }

  const handleNewMigration = () => {
    window.location.href = '/setup'
  }

  return (
    <div className="space-y-6">
      {/* Success Banner with Metrics */}
      <div className="bg-gradient-to-br from-emerald-50/80 via-green-50/50 to-blue-50/40 dark:from-emerald-950/30 dark:via-green-950/20 dark:to-blue-950/10 border border-emerald-200/50 dark:border-emerald-800/30 rounded-lg p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-emerald-900 dark:text-emerald-100">Migration Complete</h2>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Your project has been successfully migrated to Talend
            </p>
          </div>
        </div>

        {/* Inline Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-emerald-200/50 dark:border-emerald-800/30">
          <div className="text-center">
            <div className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">15 mins</div>
            <div className="text-xs font-medium text-foreground-secondary mt-0.5">Total Time</div>
            <div className="text-xs text-foreground-tertiary">(vs 3-4 weeks manual)</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">410-520 hrs</div>
            <div className="text-xs font-medium text-foreground-secondary mt-0.5">Time Saved</div>
            <div className="text-xs text-foreground-tertiary">vs manual migration</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">{automationRate}%</div>
            <div className="text-xs font-medium text-foreground-secondary mt-0.5">Automation Rate</div>
            <div className="text-xs text-foreground-tertiary">{totalJobs - manualJobs}/{totalJobs} jobs</div>
          </div>
        </div>
      </div>

      {/* Expand/Collapse All Controls */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={expandAll}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground bg-background-secondary hover:bg-background-tertiary border border-border rounded transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground bg-background-secondary hover:bg-background-tertiary border border-border rounded transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
          Collapse All
        </button>
      </div>

      {/* Pattern Coverage Summary */}
      <div className="bg-background border border-border rounded-lg">
        <button
          onClick={() => toggleSection('patterns')}
          className="w-full p-4 flex items-center justify-between hover:bg-background-secondary transition-colors"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-semibold tracking-tight">Pattern Coverage Summary</h3>
            <span className="text-xs text-foreground-tertiary">19 ETL patterns detected & converted</span>
          </div>
          {expandedSections.patterns ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.patterns && (
          <div className="px-4 pb-4 border-t border-border">
            <div className="mt-3 space-y-3">
              <div className="bg-emerald-50/50 dark:bg-emerald-950/5 border border-emerald-200/50 dark:border-emerald-800/20 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-foreground">Low Complexity Patterns</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-500">15 jobs • 100% automated</span>
                </div>
                <div className="text-xs text-foreground-secondary space-y-1">
                  <div>• Simple Lookup (5 jobs)</div>
                  <div>• Direct Load (4 jobs)</div>
                  <div>• Filter & Route (3 jobs)</div>
                  <div>• Snapshot Load (3 jobs)</div>
                </div>
              </div>

              <div className="bg-blue-50/50 dark:bg-blue-950/5 border border-blue-200/50 dark:border-blue-800/20 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-foreground">Medium Complexity Patterns</span>
                  <span className="text-xs text-blue-600 dark:text-blue-500">42 jobs • 97% automated</span>
                </div>
                <div className="text-xs text-foreground-secondary space-y-1">
                  <div>• SCD Type 2 (12 jobs)</div>
                  <div>• CDC Processing (10 jobs)</div>
                  <div>• Aggregation (8 jobs)</div>
                  <div>• Slowly Changing Dimensions (7 jobs)</div>
                  <div>• Data Validation (5 jobs)</div>
                </div>
              </div>

              <div className="bg-amber-50/50 dark:bg-amber-950/5 border border-amber-200/50 dark:border-amber-800/20 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-foreground">High Complexity Patterns</span>
                  <span className="text-xs text-amber-600 dark:text-amber-500">8 jobs • 75% automated (2 manual)</span>
                </div>
                <div className="text-xs text-foreground-secondary space-y-1">
                  <div>• Custom Transformations (3 jobs)</div>
                  <div>• Unconnected Lookups (2 jobs - 1 manual)</div>
                  <div>• Complex Aggregations (2 jobs - 1 manual)</div>
                  <div>• External API Integration (1 job)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* File Deliverables Summary */}
      <div className="bg-background border border-border rounded-lg">
        <button
          onClick={() => toggleSection('files')}
          className="w-full p-4 flex items-center justify-between hover:bg-background-secondary transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold tracking-tight">Generated Talend Files</h3>
            <span className="text-xs text-foreground-tertiary">{totalJobs * 3 + 12} files ready for download</span>
          </div>
          {expandedSections.files ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.files && (
          <div className="px-4 pb-4 border-t border-border">
            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <div>
                  <div className="text-sm font-medium">Talend Job Files (.item)</div>
                  <div className="text-xs text-foreground-secondary">Job definitions with components, connections, and mappings</div>
                </div>
                <span className="text-sm font-semibold text-blue-600">{totalJobs} files</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <div>
                  <div className="text-sm font-medium">Properties Files (.properties)</div>
                  <div className="text-xs text-foreground-secondary">Job metadata, version info, and descriptions</div>
                </div>
                <span className="text-sm font-semibold text-blue-600">{totalJobs} files</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <div>
                  <div className="text-sm font-medium">Screenshot Files (.screenshot)</div>
                  <div className="text-xs text-foreground-secondary">Visual job flow representations</div>
                </div>
                <span className="text-sm font-semibold text-blue-600">{totalJobs} files</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <div>
                  <div className="text-sm font-medium">Java Routines (.item)</div>
                  <div className="text-xs text-foreground-secondary">Custom code for lookups and transformations</div>
                </div>
                <span className="text-sm font-semibold text-blue-600">12 routines</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <div className="text-sm font-medium">Metadata & Context Files</div>
                  <div className="text-xs text-foreground-secondary">Connection configs and environment variables</div>
                </div>
                <span className="text-sm font-semibold text-blue-600">included</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Validation Engine Results */}
      <div className="bg-background border border-border rounded-lg">
        <button
          onClick={() => toggleSection('validation')}
          className="w-full p-4 flex items-center justify-between hover:bg-background-secondary transition-colors"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-semibold tracking-tight">6 Validation Engines - Quality Assurance</h3>
            <span className="text-xs text-foreground-tertiary">{validationMetrics.passRate}% pass rate</span>
          </div>
          {expandedSections.validation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.validation && (
          <div className="px-4 pb-4 border-t border-border">
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="bg-background-secondary border border-border rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span className="text-xs font-semibold">Data Lineage Validation</span>
                </div>
                <div className="text-xs text-foreground-secondary space-y-1">
                  <div className="flex justify-between">
                    <span>Source-to-target mappings</span>
                    <span className="text-emerald-600">{totalJobs}/{totalJobs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data flow integrity</span>
                    <span className="text-emerald-600">{totalJobs}/{totalJobs}</span>
                  </div>
                </div>
              </div>

              <div className="bg-background-secondary border border-border rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span className="text-xs font-semibold">Business Rules Validation</span>
                </div>
                <div className="text-xs text-foreground-secondary space-y-1">
                  <div className="flex justify-between">
                    <span>Expression logic preserved</span>
                    <span className="text-emerald-600">{totalJobs}/{totalJobs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Filter conditions verified</span>
                    <span className="text-emerald-600">{totalJobs}/{totalJobs}</span>
                  </div>
                </div>
              </div>

              <div className="bg-background-secondary border border-border rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span className="text-xs font-semibold">Error Handling Validation</span>
                </div>
                <div className="text-xs text-foreground-secondary space-y-1">
                  <div className="flex justify-between">
                    <span>Rejection handling</span>
                    <span className="text-emerald-600">{totalJobs}/{totalJobs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error logging preserved</span>
                    <span className="text-emerald-600">{totalJobs}/{totalJobs}</span>
                  </div>
                </div>
              </div>

              <div className="bg-background-secondary border border-border rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-3 h-3 text-purple-600" />
                  <span className="text-xs font-semibold">Performance Validation</span>
                </div>
                <div className="text-xs text-foreground-secondary space-y-1">
                  <div className="flex justify-between">
                    <span>Bulk loading enabled</span>
                    <span className="text-purple-600">{Math.floor(totalJobs * 0.9)}/{totalJobs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connection pooling</span>
                    <span className="text-purple-600">{Math.floor(totalJobs * 0.85)}/{totalJobs}</span>
                  </div>
                </div>
              </div>

              <div className="bg-background-secondary border border-border rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span className="text-xs font-semibold">Security Validation</span>
                </div>
                <div className="text-xs text-foreground-secondary space-y-1">
                  <div className="flex justify-between">
                    <span>Credentials secured</span>
                    <span className="text-emerald-600">{totalJobs}/{totalJobs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Context variables validated</span>
                    <span className="text-emerald-600">{totalJobs}/{totalJobs}</span>
                  </div>
                </div>
              </div>

              <div className="bg-background-secondary border border-border rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-3 h-3 text-purple-600" />
                  <span className="text-xs font-semibold">Best Practices Applied</span>
                </div>
                <div className="text-xs text-foreground-secondary space-y-1">
                  <div className="flex justify-between">
                    <span>Naming conventions</span>
                    <span className="text-purple-600">{Math.floor(totalJobs * 0.92)}/{totalJobs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Component reuse</span>
                    <span className="text-purple-600">{Math.floor(totalJobs * 0.88)}/{totalJobs}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Manual Review Summary */}
      {manualJobs > 0 && (
        <div className="bg-background border border-border rounded-lg">
          <button
            onClick={() => toggleSection('manual')}
            className="w-full p-4 flex items-center justify-between hover:bg-background-secondary transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h3 className="text-sm font-semibold tracking-tight">Manual Review Summary</h3>
              <span className="text-xs text-foreground-tertiary">{manualJobs} jobs ({Math.round((manualJobs / totalJobs) * 100)}% of total)</span>
            </div>
            {expandedSections.manual ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expandedSections.manual && (
            <div className="px-4 pb-4 border-t border-border">
              <div className="mt-3 space-y-2">
                <div className="bg-amber-50/30 dark:bg-amber-950/5 border border-amber-200/40 dark:border-amber-800/20 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-semibold text-foreground">FACT_SALES_AGGREGATION</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100/60 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border border-orange-200/50 dark:border-orange-800/30">HIGH</span>
                  </div>
                  <div className="text-xs text-foreground-secondary">
                    <div><strong className="text-foreground">Reason:</strong> Custom Java Code Detected</div>
                    <div className="mt-1">Custom Java routines for complex aggregations required validation</div>
                  </div>
                </div>

                <div className="bg-amber-50/30 dark:bg-amber-950/5 border border-amber-200/40 dark:border-amber-800/20 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-semibold text-foreground">AGG_MONTHLY_SALES</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100/60 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/30">MEDIUM</span>
                  </div>
                  <div className="text-xs text-foreground-secondary">
                    <div><strong className="text-foreground">Reason:</strong> Unconnected Lookup Transformation</div>
                    <div className="mt-1">Unconnected lookups with custom return logic required manual conversion</div>
                  </div>
                </div>

                <div className="bg-blue-50/30 dark:bg-blue-950/5 border border-blue-200/40 dark:border-blue-800/20 rounded p-3 mt-3">
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-foreground-secondary">Time spent on manual review:</span>
                      <span className="font-semibold text-foreground">45 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground-secondary">Time saved vs manual conversion:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-500">40+ hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Migration Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-foreground-secondary mb-4">
            Migration Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-foreground-secondary">Automation Rate</span>
              <span className="text-sm font-semibold">
                {automationRate}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-foreground-secondary">Validation Pass Rate</span>
              <span className="text-sm font-semibold">
                {validationMetrics?.passRate}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-foreground-secondary">Performance Gain</span>
              <span className="text-sm font-semibold">
                +{optimizationMetrics?.performanceGain}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-foreground-secondary">Code Quality</span>
              <span className="text-sm font-semibold">
                {optimizationMetrics?.codeQualityScore}/100
              </span>
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-foreground-secondary mb-4">
            Components Generated
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-foreground-secondary">Talend Jobs</span>
              <span className="text-sm font-semibold">{conversionMetrics?.mappingsConverted || totalJobs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-foreground-secondary">Orchestrations</span>
              <span className="text-sm font-semibold">{conversionMetrics?.workflowsConverted || 12}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-foreground-secondary">Expressions Converted</span>
              <span className="text-sm font-semibold">
                {conversionMetrics?.expressionsConverted || 248}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-foreground-secondary">Dependencies Mapped</span>
              <span className="text-sm font-semibold">
                {discoveryMetrics?.dependenciesAnalyzed || 156}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Download & Actions */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold tracking-tight mb-4">Download Migration Files</h3>
        <p className="text-sm text-foreground-secondary mb-4">
          Your Talend project files are ready. Download the complete package to import into Talend Studio.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <Button onClick={handleDownload} size="lg" className="w-full">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
            Download Talend Files
          </Button>

          <Button onClick={handleViewReport} variant="secondary" size="lg" className="w-full">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            View Detailed Report
          </Button>

          <Button
            onClick={() => window.location.href = '/migrations'}
            variant="ghost"
            size="lg"
            className="w-full border border-border"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Migrations
          </Button>
        </div>
      </div>

      {/* Issues Found */}
      {validationMetrics?.issuesFound > 0 && (
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-4 h-4 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-1">
                {validationMetrics.issuesFound} Minor Issues Detected
              </h4>
              <p className="text-sm text-foreground-secondary">
                These issues do not block migration but should be reviewed. Check the detailed report
                for recommendations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
