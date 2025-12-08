'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePipelineStore } from '@/stores/pipeline-store'
import { Plus, Minus, Download, FileCode, Clock, ArrowRight, Play, AlertCircle, CheckCircle2, X, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WaveProgress {
  wave: number
  complexity: 'low' | 'medium' | 'high'
  jobCount: number
  convertedCount: number
  status: 'pending' | 'converting' | 'completed'
  automationRate: number
  estimatedTime?: string
  validatedCount?: number
  optimizationsApplied?: number
}

interface ConvertingJob {
  name: string
  pattern: string
  method: 'AST Parser' | 'Pattern Match' | 'Attention Required'
  status: 'converting' | 'completed' | 'warning'
  progress: number
  componentsGenerated?: number
}

interface AttentionJob {
  name: string
  reason: string
  details: string
  complexity: 'medium' | 'high'
}

interface ActivityLog {
  timestamp: string
  message: string
  type: 'info' | 'success' | 'warning'
}

type TabType = 'automated' | 'manual'

export function ConversionStage() {
  const router = useRouter()
  const { stages, updateStageProgress, completeStage, moveToNextStage } = usePipelineStore()
  const stageResult = stages['conversion']
  const [activeTab, setActiveTab] = useState<TabType>('automated')
  const [expandedWaves, setExpandedWaves] = useState<Set<number>>(new Set([1]))
  const [showAttentionSection, setShowAttentionSection] = useState(true)
  const [wave1Activity, setWave1Activity] = useState<ActivityLog[]>([])
  const [wave2Activity, setWave2Activity] = useState<ActivityLog[]>([])
  const [wave3Activity, setWave3Activity] = useState<ActivityLog[]>([])
  const [wizardOpen, setWizardOpen] = useState(false)
  const [currentJobIndex, setCurrentJobIndex] = useState(0)
  const [wizardStep, setWizardStep] = useState<'review' | 'implement' | 'test' | 'complete'>('review')
  const [completedManualJobs, setCompletedManualJobs] = useState(0)
  const [expandedValidation, setExpandedValidation] = useState<Set<number>>(new Set())
  const [expandedOptimization, setExpandedOptimization] = useState<Set<number>>(new Set())

  const [waves, setWaves] = useState<WaveProgress[]>([
    { wave: 1, complexity: 'low', jobCount: 15, convertedCount: 0, status: 'converting', automationRate: 98, estimatedTime: '2 min', validatedCount: 0, optimizationsApplied: 0 },
    { wave: 2, complexity: 'medium', jobCount: 42, convertedCount: 0, status: 'pending', automationRate: 94, estimatedTime: '8 min', validatedCount: 0, optimizationsApplied: 0 },
    { wave: 3, complexity: 'high', jobCount: 8, convertedCount: 0, status: 'pending', automationRate: 87, estimatedTime: '3 min', validatedCount: 0, optimizationsApplied: 0 },
  ])

  const [currentlyConverting, setCurrentlyConverting] = useState<ConvertingJob[]>([
    { name: 'LKP_CURRENCY_RATES', pattern: 'Lookup', method: 'Pattern Match', status: 'converting', progress: 45 },
    { name: 'LKP_EXCHANGE_RATES', pattern: 'Lookup', method: 'Pattern Match', status: 'converting', progress: 28 },
    { name: 'DIM_TIME_CALENDAR', pattern: 'Dimension', method: 'AST Parser', status: 'converting', progress: 62 },
  ])

  const [wave2Converting, setWave2Converting] = useState<ConvertingJob[]>([
    { name: 'FACT_SALES_DAILY_AGG', pattern: 'Fact Load', method: 'AST Parser', status: 'converting', progress: 52 },
    { name: 'DIM_PRODUCT_MASTER', pattern: 'Dimension', method: 'Pattern Match', status: 'converting', progress: 38 },
    { name: 'STG_ORDER_HEADER_CDC', pattern: 'CDC', method: 'AST Parser', status: 'converting', progress: 71 },
    { name: 'AGG_MONTHLY_SALES', pattern: 'Aggregation', method: 'Attention Required', status: 'warning', progress: 15 },
  ])

  const [wave3Converting, setWave3Converting] = useState<ConvertingJob[]>([
    { name: 'FACT_SALES_AGGREGATION', pattern: 'Fact Load', method: 'Attention Required', status: 'warning', progress: 22 },
    { name: 'AGG_CUSTOMER_LTV', pattern: 'Aggregation', method: 'Attention Required', status: 'warning', progress: 48 },
  ])

  const [attentionJobs] = useState<AttentionJob[]>([
    {
      name: 'FACT_SALES_AGGREGATION',
      reason: 'Custom Java Code Detected',
      details: 'Contains custom Java routines for complex aggregations that require manual validation',
      complexity: 'high'
    },
    {
      name: 'AGG_MONTHLY_SALES',
      reason: 'Unconnected Lookup Transformation',
      details: 'Uses unconnected lookups with custom return logic requiring manual conversion',
      complexity: 'medium'
    }
  ])

  const currentJob = attentionJobs[currentJobIndex]

  const handleOpenWizard = () => {
    setWizardOpen(true)
    setCurrentJobIndex(0)
    setWizardStep('review')
  }

  const handleCloseWizard = () => {
    setWizardOpen(false)
    setCurrentJobIndex(0)
    setWizardStep('review')
  }

  const handleNextJob = () => {
    // Mark current job as completed
    if (wizardStep === 'complete') {
      setCompletedManualJobs(prev => prev + 1)
    }

    if (currentJobIndex < attentionJobs.length - 1) {
      setCurrentJobIndex(currentJobIndex + 1)
      setWizardStep('review')
    } else {
      handleCloseWizard()
    }
  }

  const handleNextStep = () => {
    const steps: Array<'review' | 'implement' | 'test' | 'complete'> = ['review', 'implement', 'test', 'complete']
    const currentStepIndex = steps.indexOf(wizardStep)
    if (currentStepIndex < steps.length - 1) {
      setWizardStep(steps[currentStepIndex + 1])
    } else {
      handleNextJob()
    }
  }

  const toggleWave = (wave: number) => {
    setExpandedWaves(prev => {
      const next = new Set(prev)
      if (next.has(wave)) {
        next.delete(wave)
      } else {
        next.add(wave)
      }
      return next
    })
  }

  const expandAll = () => setExpandedWaves(new Set([1, 2, 3]))
  const collapseAll = () => setExpandedWaves(new Set())

  const toggleValidation = (wave: number) => {
    setExpandedValidation(prev => {
      const next = new Set(prev)
      if (next.has(wave)) {
        next.delete(wave)
      } else {
        next.add(wave)
      }
      return next
    })
  }

  const toggleOptimization = (wave: number) => {
    setExpandedOptimization(prev => {
      const next = new Set(prev)
      if (next.has(wave)) {
        next.delete(wave)
      } else {
        next.add(wave)
      }
      return next
    })
  }

  const getComplexityColor = (complexity: 'low' | 'medium' | 'high') => {
    switch (complexity) {
      case 'low': return 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400'
      case 'medium': return 'text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400'
      case 'high': return 'text-orange-700 bg-orange-50 dark:bg-orange-950/20 dark:text-orange-400'
    }
  }

  const getStatusColor = (status: 'pending' | 'converting' | 'completed') => {
    switch (status) {
      case 'pending': return 'text-gray-600 dark:text-gray-400'
      case 'converting': return 'text-blue-600 dark:text-blue-400'
      case 'completed': return 'text-emerald-600 dark:text-emerald-400'
    }
  }

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case 'AST Parser': return 'bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'
      case 'Pattern Match': return 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      case 'Attention Required': return 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800'
      default: return 'bg-gray-50 dark:bg-gray-950/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800'
    }
  }

  // Simulate conversion progress with inline validation/optimization
  useEffect(() => {
    if (stageResult.status === 'in_progress') {
      const interval = setInterval(() => {
        // Update wave progress
        setWaves(prev => {
          const updated = [...prev]
          const convertingWave = updated.find(w => w.status === 'converting')

          if (convertingWave) {
            convertingWave.convertedCount = Math.min(convertingWave.convertedCount + 1, convertingWave.jobCount)

            // Inline validation and optimization (happens automatically with conversion)
            convertingWave.validatedCount = convertingWave.convertedCount
            convertingWave.optimizationsApplied = Math.floor(convertingWave.convertedCount * 0.6) // 60% of jobs get optimizations

            if (convertingWave.convertedCount === convertingWave.jobCount) {
              convertingWave.status = 'completed'
              const nextWaveIndex = updated.findIndex(w => w.status === 'pending')
              if (nextWaveIndex !== -1) {
                updated[nextWaveIndex].status = 'converting'
                setExpandedWaves(new Set([updated[nextWaveIndex].wave]))
              }
            }
          }

          const totalJobs = updated.reduce((sum, w) => sum + w.jobCount, 0)
          const convertedJobs = updated.reduce((sum, w) => sum + w.convertedCount, 0)
          const progress = Math.floor((convertedJobs / totalJobs) * 100)

          updateStageProgress('conversion', progress, `Converting Wave ${convertingWave?.wave || 1}...`)

          if (convertedJobs === totalJobs) {
            clearInterval(interval)
            const totalValidated = updated.reduce((sum, w) => sum + (w.validatedCount || 0), 0)
            const totalOptimizations = updated.reduce((sum, w) => sum + (w.optimizationsApplied || 0), 0)
            setTimeout(() => {
              completeStage('conversion', {
                totalJobs,
                automationRate: 94.5,
                manualReviewRequired: 5,
                validatedJobs: totalValidated,
                optimizationsApplied: totalOptimizations,
                validationPassRate: 99.7
              })
            }, 500)
          }

          // Add activity logs - different messages per wave
          if (convertingWave) {
            const wave1Messages = [
              { message: '→ Generated tMap for LKP_CURRENCY_RATES', type: 'success' as const },
              { message: '→ Converted lookup transformation to tJavaRow', type: 'info' as const },
              { message: '✓ Validated: Data lineage preserved', type: 'success' as const },
              { message: '→ Applied 3 performance optimizations', type: 'info' as const },
              { message: '→ Created tFileInputDelimited for exchange rates', type: 'success' as const },
              { message: '→ Pattern matched: Simple Lookup detected', type: 'info' as const },
            ]

            const wave2Messages = [
              { message: '→ Generated tMap for DIM_CUSTOMER_SCD2', type: 'success' as const },
              { message: '→ Converted 15 expressions with AST parser', type: 'info' as const },
              { message: '✓ Validated: Business rules verified', type: 'success' as const },
              { message: '→ Pattern matched: SCD Type 2 detected', type: 'info' as const },
              { message: '→ Applied bulk loading optimization', type: 'info' as const },
              { message: '→ Created tCDC components for staging layer', type: 'success' as const },
              { message: '→ Generated tFilterRow for business rules', type: 'success' as const },
            ]

            const wave3Messages = [
              { message: '→ Analyzing complex aggregation logic', type: 'info' as const },
              { message: '⚠ Custom Java code detected in FACT_SALES_AGG', type: 'warning' as const },
              { message: '→ Generated tAggregateRow for customer LTV', type: 'success' as const },
              { message: '✓ Validated: Error handling preserved', type: 'success' as const },
              { message: '⚠ Unconnected lookup requires manual conversion', type: 'warning' as const },
              { message: '→ Created tJoin components for fact tables', type: 'success' as const },
            ]

            if (convertingWave.wave === 1 && wave1Activity.length < wave1Messages.length) {
              const nextMessage = wave1Messages[wave1Activity.length]
              setWave1Activity(prev => [...prev, { ...nextMessage, timestamp: new Date().toLocaleTimeString() }])
            } else if (convertingWave.wave === 2 && wave2Activity.length < wave2Messages.length) {
              const nextMessage = wave2Messages[wave2Activity.length]
              setWave2Activity(prev => [...prev, { ...nextMessage, timestamp: new Date().toLocaleTimeString() }])
            } else if (convertingWave.wave === 3 && wave3Activity.length < wave3Messages.length) {
              const nextMessage = wave3Messages[wave3Activity.length]
              setWave3Activity(prev => [...prev, { ...nextMessage, timestamp: new Date().toLocaleTimeString() }])
            }
          }

          return updated
        })
      }, 800)

      return () => clearInterval(interval)
    }
  }, [stageResult.status, updateStageProgress, completeStage, wave1Activity.length, wave2Activity.length, wave3Activity.length])

  const isCompleted = stageResult.status === 'completed'
  const totalJobs = waves.reduce((sum, w) => sum + w.jobCount, 0)
  const convertedJobs = waves.reduce((sum, w) => sum + w.convertedCount, 0)
  const totalValidated = waves.reduce((sum, w) => sum + (w.validatedCount || 0), 0)
  const totalOptimizations = waves.reduce((sum, w) => sum + (w.optimizationsApplied || 0), 0)
  const manualReviewCount = 2

  // Only allow proceed when BOTH automated AND manual are complete
  const allAutomatedComplete = waves.every(w => w.status === 'completed')
  const allManualComplete = completedManualJobs === manualReviewCount
  const canProceed = isCompleted && allAutomatedComplete && allManualComplete

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div>
        <h2 className="text-lg font-semibold mb-1">Conversion Stage</h2>
        <p className="text-sm text-foreground-secondary">
          {!isCompleted
            ? 'Real-time progress as jobs are converted from Informatica to Talend with automatic validation and optimization.'
            : 'Conversion results summary. Review automated conversions and jobs requiring manual attention.'
          }
        </p>
      </div>

      {/* Preview Banner - Show when jobs are being converted */}
      {convertedJobs > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900">
                  Preview Available: {convertedJobs} jobs converted
                </h3>
                <p className="text-xs text-blue-700 mt-0.5">
                  View side-by-side Informatica → Talend XML comparison with confidence scores
                </p>
              </div>
            </div>
            <Button
              onClick={() => window.open('/preview/1', '_blank')}
              variant="outline"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Preview
            </Button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="border border-border rounded-lg p-4">
          <div className="text-2xl font-semibold">{convertedJobs}/{totalJobs}</div>
          <div className="text-xs text-foreground-secondary mt-1">Jobs Converted</div>
        </div>
        <div className="border border-border rounded-lg p-4">
          <div className="text-2xl font-semibold">94.5%</div>
          <div className="text-xs text-foreground-secondary mt-1">Automation Rate</div>
        </div>
        <div className="border border-border rounded-lg p-4">
          <div className="text-2xl font-semibold text-emerald-600">{totalValidated}</div>
          <div className="text-xs text-foreground-secondary mt-1">Validated ✓</div>
        </div>
        <div className="border border-border rounded-lg p-4">
          <div className="text-2xl font-semibold text-purple-600">{totalOptimizations}</div>
          <div className="text-xs text-foreground-secondary mt-1">Optimizations Applied</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('automated')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'automated'
                ? 'border-foreground text-foreground'
                : 'border-transparent text-foreground-secondary hover:text-foreground hover:border-border'
            }`}
          >
            Automated Conversion
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400">
              {convertedJobs - manualReviewCount}/{totalJobs - manualReviewCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'manual'
                ? 'border-foreground text-foreground'
                : 'border-transparent text-foreground-secondary hover:text-foreground hover:border-border'
            }`}
          >
            Manual Review
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400">
              {completedManualJobs}/{manualReviewCount}
            </span>
          </button>
        </div>
      </div>

      {/* Automated Tab Content */}
      {activeTab === 'automated' && (
        <div className="space-y-4">
          {/* Expand/Collapse Controls */}
          {!isCompleted && (
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
          )}

          {/* Wave Sections */}
          {waves.map((wave) => (
            <div key={wave.wave} className="bg-background border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleWave(wave.wave)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-background-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  {expandedWaves.has(wave.wave) ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <h3 className="text-sm font-semibold">Wave {wave.wave}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getComplexityColor(wave.complexity)}`}>
                    {wave.complexity.toUpperCase()}
                  </span>
                  <span className={`text-xs font-medium ${getStatusColor(wave.status)}`}>
                    {wave.status === 'pending' && '⏳ Pending'}
                    {wave.status === 'converting' && '🔄 Converting...'}
                    {wave.status === 'completed' && '✓ Complete'}
                  </span>
                  {/* Inline validation/optimization badges */}
                  {wave.status === 'completed' && (
                    <>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400">
                        ✓ {wave.validatedCount} validated
                      </span>
                      <span className="text-xs text-purple-600 dark:text-purple-400">
                        {wave.optimizationsApplied} optimizations
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-foreground-tertiary">
                  <span>{wave.convertedCount}/{wave.jobCount} jobs</span>
                  <span>{wave.automationRate}% automated</span>
                  {wave.status !== 'completed' && wave.estimatedTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {wave.estimatedTime}
                    </span>
                  )}
                  {wave.convertedCount > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open('/preview/1', '_blank')
                      }}
                      className="ml-2"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                  )}
                </div>
              </button>

              {expandedWaves.has(wave.wave) && (
                <div className="px-6 pb-6 border-t border-border">
                  {/* Progress Bar */}
                  <div className="mt-4 mb-4">
                    <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          wave.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(wave.convertedCount / wave.jobCount) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Activity Logs */}
                  {wave.status !== 'pending' && (
                    <div className="bg-background-secondary rounded border border-border p-4 max-h-64 overflow-y-auto">
                      <h4 className="text-xs font-semibold mb-2 text-foreground-secondary">Activity Log</h4>
                      <div className="space-y-1">
                        {wave.wave === 1 && wave1Activity.map((log, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs font-mono">
                            <span className="text-foreground-tertiary">{log.timestamp}</span>
                            <span className={
                              log.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                              log.type === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                              'text-foreground-secondary'
                            }>
                              {log.message}
                            </span>
                          </div>
                        ))}
                        {wave.wave === 2 && wave2Activity.map((log, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs font-mono">
                            <span className="text-foreground-tertiary">{log.timestamp}</span>
                            <span className={
                              log.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                              log.type === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                              'text-foreground-secondary'
                            }>
                              {log.message}
                            </span>
                          </div>
                        ))}
                        {wave.wave === 3 && wave3Activity.map((log, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs font-mono">
                            <span className="text-foreground-tertiary">{log.timestamp}</span>
                            <span className={
                              log.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                              log.type === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                              'text-foreground-secondary'
                            }>
                              {log.message}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Validation Details (only for completed waves) */}
                  {wave.status === 'completed' && (
                    <div className="mt-4">
                      <button
                        onClick={() => toggleValidation(wave.wave)}
                        className="w-full flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-950/20 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-900 dark:text-emerald-400">
                            Validation Summary
                          </span>
                          <span className="text-xs text-emerald-700 dark:text-emerald-500">
                            {wave.validatedCount}/{wave.jobCount} jobs validated
                          </span>
                        </div>
                        {expandedValidation.has(wave.wave) ? (
                          <Minus className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Plus className="w-4 h-4 text-emerald-600" />
                        )}
                      </button>

                      {expandedValidation.has(wave.wave) && (
                        <div className="mt-2 bg-background-secondary border border-border rounded-lg p-4 space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span className="text-xs font-semibold text-foreground">Data Lineage Validation</span>
                            </div>
                            <div className="ml-5 text-xs text-foreground-secondary space-y-1">
                              <div className="flex justify-between">
                                <span>• Source-to-target mappings verified</span>
                                <span className="text-emerald-600">{wave.jobCount}/{wave.jobCount} passed</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Data flow integrity checked</span>
                                <span className="text-emerald-600">{wave.jobCount}/{wave.jobCount} passed</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span className="text-xs font-semibold text-foreground">Business Rules Validation</span>
                            </div>
                            <div className="ml-5 text-xs text-foreground-secondary space-y-1">
                              <div className="flex justify-between">
                                <span>• Expression logic preserved</span>
                                <span className="text-emerald-600">{wave.jobCount}/{wave.jobCount} passed</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Filter conditions verified</span>
                                <span className="text-emerald-600">{wave.jobCount}/{wave.jobCount} passed</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span className="text-xs font-semibold text-foreground">Error Handling Validation</span>
                            </div>
                            <div className="ml-5 text-xs text-foreground-secondary space-y-1">
                              <div className="flex justify-between">
                                <span>• Rejection handling verified</span>
                                <span className="text-emerald-600">{wave.jobCount}/{wave.jobCount} passed</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Error logging preserved</span>
                                <span className="text-emerald-600">{wave.jobCount}/{wave.jobCount} passed</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Optimization Details (only for completed waves) */}
                  {wave.status === 'completed' && wave.optimizationsApplied && wave.optimizationsApplied > 0 && (
                    <div className="mt-4">
                      <button
                        onClick={() => toggleOptimization(wave.wave)}
                        className="w-full flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/10 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-950/20 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="text-sm font-medium text-purple-900 dark:text-purple-400">
                            Optimizations Applied
                          </span>
                          <span className="text-xs text-purple-700 dark:text-purple-500">
                            {wave.optimizationsApplied} optimizations
                          </span>
                        </div>
                        {expandedOptimization.has(wave.wave) ? (
                          <Minus className="w-4 h-4 text-purple-600" />
                        ) : (
                          <Plus className="w-4 h-4 text-purple-600" />
                        )}
                      </button>

                      {expandedOptimization.has(wave.wave) && (
                        <div className="mt-2 bg-background-secondary border border-border rounded-lg p-4 space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              <span className="text-xs font-semibold text-foreground">Performance Optimizations</span>
                            </div>
                            <div className="ml-5 text-xs text-foreground-secondary space-y-1">
                              <div className="flex justify-between">
                                <span>• Bulk loading enabled</span>
                                <span className="text-purple-600">{Math.floor(wave.optimizationsApplied * 0.5)} jobs</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Connection pooling configured</span>
                                <span className="text-purple-600">{Math.floor(wave.optimizationsApplied * 0.3)} jobs</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Parallel execution enabled</span>
                                <span className="text-purple-600">{Math.floor(wave.optimizationsApplied * 0.2)} jobs</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs font-semibold text-foreground">Code Quality Improvements</span>
                            </div>
                            <div className="ml-5 text-xs text-foreground-secondary space-y-1">
                              <div>• Redundant components removed</div>
                              <div>• Lookup caching implemented</div>
                              <div>• Error handling standardized</div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                              </svg>
                              <span className="text-xs font-semibold text-foreground">Best Practices Applied</span>
                            </div>
                            <div className="ml-5 text-xs text-foreground-secondary space-y-1">
                              <div>• Naming conventions standardized</div>
                              <div>• Component reuse maximized</div>
                              <div>• Memory management optimized</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Manual Review Tab Content */}
      {activeTab === 'manual' && (
        <div className="space-y-6">
          {/* Jobs Requiring Attention */}
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Jobs Requiring Manual Review</h3>
                <p className="text-xs text-foreground-secondary mt-1">
                  {manualReviewCount} jobs need manual attention due to complexity
                </p>
              </div>
              {!wizardOpen && completedManualJobs < manualReviewCount && (
                <Button onClick={handleOpenWizard} size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Start Manual Review
                </Button>
              )}
            </div>

            {showAttentionSection && (
              <div className="space-y-3">
                {attentionJobs.map((job, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 transition-all ${
                      completedManualJobs > index
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
                        : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {completedManualJobs > index ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                          )}
                          <span className="font-mono text-sm font-semibold text-foreground">{job.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getComplexityColor(job.complexity)}`}>
                            {job.complexity.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs space-y-1 ml-6">
                          <p className="text-foreground"><strong>Reason:</strong> {job.reason}</p>
                          <p className="text-foreground-secondary">{job.details}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {completedManualJobs === manualReviewCount && (
              <div className="mt-6 p-4 bg-emerald-50/50 dark:bg-emerald-950/5 border border-emerald-200/50 dark:border-emerald-800/30 rounded-lg">
                <div className="flex items-center gap-2 text-emerald-700/90 dark:text-emerald-400/90">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    All manual review jobs completed! Ready to proceed.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Manual Conversion Wizard Modal */}
          {wizardOpen && currentJob && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-background border border-border rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Wizard Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Manual Conversion Wizard</h3>
                    <p className="text-xs text-foreground-secondary mt-1">
                      Job {currentJobIndex + 1} of {attentionJobs.length}: {currentJob.name}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseWizard}
                    className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Wizard Progress Steps */}
                <div className="px-6 py-4 border-b border-border bg-background-secondary">
                  <div className="flex items-center justify-between">
                    {['review', 'implement', 'test', 'complete'].map((step, index) => (
                      <div key={step} className="flex items-center">
                        <div className={`flex items-center gap-2 ${
                          wizardStep === step
                            ? 'text-foreground font-semibold'
                            : index < ['review', 'implement', 'test', 'complete'].indexOf(wizardStep)
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-foreground-tertiary'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                            wizardStep === step
                              ? 'bg-foreground text-background'
                              : index < ['review', 'implement', 'test', 'complete'].indexOf(wizardStep)
                              ? 'bg-emerald-600 text-white'
                              : 'bg-background-tertiary'
                          }`}>
                            {index < ['review', 'implement', 'test', 'complete'].indexOf(wizardStep) ? '✓' : index + 1}
                          </div>
                          <span className="text-xs capitalize">{step}</span>
                        </div>
                        {index < 3 && (
                          <div className={`w-16 h-0.5 mx-2 ${
                            index < ['review', 'implement', 'test', 'complete'].indexOf(wizardStep)
                              ? 'bg-emerald-600'
                              : 'bg-border'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wizard Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {wizardStep === 'review' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Job Information</h4>
                        <div className="bg-background-secondary rounded-lg p-4 space-y-2 text-sm">
                          <div><strong>Name:</strong> <span className="font-mono">{currentJob.name}</span></div>
                          <div><strong>Complexity:</strong> <span className={`px-2 py-0.5 rounded-full text-xs ${getComplexityColor(currentJob.complexity)}`}>{currentJob.complexity.toUpperCase()}</span></div>
                          <div><strong>Reason for Attention:</strong> {currentJob.reason}</div>
                          <div><strong>Details:</strong> {currentJob.details}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold mb-2">Analysis - Auto-Generated Talend XML Review</h4>
                        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm space-y-3">
                          <div>
                            <strong className="text-blue-900 dark:text-blue-300">1. Review Generated Talend .item Files</strong>
                            <ul className="mt-1 ml-4 space-y-1 text-foreground-secondary">
                              <li>• Our engine generated Talend XML (.item files) from Informatica XML</li>
                              <li>• Expert reviews: process/*.item, metadata/*.item, context/*.item</li>
                              <li>• Validates component structure, connections, and metadata</li>
                              <li>• Checks tMap expressions, tJavaRow code generation quality</li>
                            </ul>
                          </div>

                          <div>
                            <strong className="text-blue-900 dark:text-blue-300">2. Why Manual Review Needed</strong>
                            <ul className="mt-1 ml-4 space-y-1 text-foreground-secondary">
                              <li>• <strong>Unconnected Lookups:</strong> Custom Java routine generation needs validation</li>
                              <li>• <strong>Complex Expressions:</strong> Nested IIF → Java ternary conversion accuracy</li>
                              <li>• <strong>Custom Transformations:</strong> Non-standard Informatica logic</li>
                              <li>• <strong>Business Logic:</strong> Critical financial/regulatory calculations</li>
                            </ul>
                          </div>

                          <div>
                            <strong className="text-blue-900 dark:text-blue-300">3. Generated File Structure Validation</strong>
                            <ul className="mt-1 ml-4 space-y-1 text-foreground-secondary">
                              <li>• <strong>.item XML:</strong> Talend job definition (nodes, connections)</li>
                              <li>• <strong>.properties:</strong> Job metadata and version info</li>
                              <li>• <strong>.screenshot:</strong> Visual job flow representation</li>
                              <li>• <strong>Routines:</strong> Custom Java code for lookups/transformations</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {wizardStep === 'implement' && (
                    <div className="space-y-4">
                      <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2">
                          XML-to-XML Conversion - Edit Generated Talend Files
                        </h4>
                        <p className="text-xs text-foreground-secondary">
                          Our engine auto-generated Talend XML from Informatica XML. Expert refines the generated .item files:
                        </p>
                      </div>

                      {/* Step-by-step XML Editing Guide */}
                      <div className="space-y-3">
                        <div className="border border-border rounded-lg p-4 bg-background-secondary">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                            <div className="flex-1">
                              <h5 className="text-sm font-semibold mb-1">Review Generated Talend .item XML Structure</h5>
                              <p className="text-xs text-foreground-secondary mb-2">
                                Open: output/{currentJob.name}_0.1.item (auto-generated by our engine)
                              </p>
                              <div className="bg-background border border-border rounded p-2 font-mono text-xs overflow-x-auto">
                                &lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;<br/>
                                &lt;talendfile:ProcessType xmi:version=&quot;2.0&quot;<br/>
                                &nbsp;&nbsp;xmlns:TalendMapper=&quot;http://www.talend.org/mapper&quot;<br/>
                                &nbsp;&nbsp;defaultContext=&quot;Default&quot;<br/>
                                &nbsp;&nbsp;jobType=&quot;Standard&quot;&gt;
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border border-border rounded-lg p-4 bg-background-secondary">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">2</div>
                            <div className="flex-1">
                              <h5 className="text-sm font-semibold mb-1">Validate tMap XML Expression Conversion</h5>
                              <p className="text-xs text-foreground-secondary mb-2">
                                Check auto-converted Informatica expressions inside tMap node XML
                              </p>
                              <textarea
                                className="w-full h-32 p-2 border border-border rounded bg-background font-mono text-xs resize-none"
                                placeholder='<!-- Generated tMap expression XML -->
<node componentName="tMap_1" componentVersion="2.1">
  <elementParameter field="TEXT" name="EXPRESSION" value="row1.CUST_ID"/>
  <elementParameter field="TEXT" name="EXPRESSION" value="row1.FIRST_NAME + &quot; &quot; + row1.LAST_NAME"/>
  <elementParameter field="TEXT" name="EXPRESSION" value="TalendDate.diffDate(TalendDate.getCurrentDate(), row1.DOB, &quot;yyyy&quot;)"/>
</node>'
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border border-border rounded-lg p-4 bg-background-secondary">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">3</div>
                            <div className="flex-1">
                              <h5 className="text-sm font-semibold mb-1">Fix Unconnected Lookup - Edit Routine XML</h5>
                              <p className="text-xs text-foreground-secondary mb-2">
                                Refine auto-generated Java routine code inside routine .item file
                              </p>
                              <textarea
                                className="w-full h-40 p-2 border border-border rounded bg-background font-mono text-xs resize-none"
                                placeholder='<!-- code/routines/UnconnectedLookup_0.1.item -->
<TalendProperties:Property xmi:version="2.0">
  <TalendProperties:Item>
    <![CDATA[
public class UnconnectedLookup {
    public static String getCurrencyRate(String currencyId) {
        // Our engine generated this - validate logic
        String rate = null;
        try {
            Connection conn = GlobalResource.getConnection();
            PreparedStatement ps = conn.prepareStatement("SELECT RATE FROM CURRENCY WHERE ID = ?");
            ps.setString(1, currencyId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) rate = rs.getString("RATE");
        } catch (SQLException e) { /* log error */ }
        return rate;
    }
}
    ]]>
  </TalendProperties:Item>
</TalendProperties:Property>'
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border border-border rounded-lg p-4 bg-background-secondary">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">4</div>
                            <div className="flex-1">
                              <h5 className="text-sm font-semibold mb-1">Validate Connection XML & Context Variables</h5>
                              <p className="text-xs text-foreground-secondary mb-2">
                                Review metadata/*.item files for database connections and context params
                              </p>
                              <div className="bg-background border border-border rounded p-2 text-xs space-y-1">
                                <div>• <strong>metadata/connections/*.item</strong> - DB connection XML configs</div>
                                <div>• <strong>context/*.item</strong> - Environment variables (DEV/QA/PROD)</div>
                                <div>• <strong>Validate:</strong> Host, port, schema, credentials placeholders</div>
                                <div>• <strong>Check:</strong> Context group bindings and parameter overrides</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border border-border rounded-lg p-4 bg-background-secondary">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">5</div>
                            <div className="flex-1">
                              <h5 className="text-sm font-semibold mb-1">Update .properties & Save Changes</h5>
                              <p className="text-xs text-foreground-secondary mb-2">
                                Modify job metadata properties and save corrected XML files
                              </p>
                              <div className="bg-background border border-border rounded p-2 text-xs space-y-1">
                                <div>• Update job version in .properties file</div>
                                <div>• Add manual review notes in description field</div>
                                <div>• Validate XML syntax (well-formed, valid namespaces)</div>
                                <div>• Save all modified .item, .properties, and routine files</div>
                                <div>• Upload back to migration platform for testing</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {wizardStep === 'test' && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold">Testing Checklist</h4>
                      <p className="text-xs text-foreground-secondary mb-3">
                        All comprehensive tests are automatically selected for validation
                      </p>
                      <div className="bg-background-secondary rounded-lg p-4 space-y-3">
                        <div className="flex items-start gap-3 text-sm">
                          <input type="checkbox" className="mt-1" checked disabled />
                          <span>Run job with sample data and verify output matches Informatica results</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                          <input type="checkbox" className="mt-1" checked disabled />
                          <span>Validate business rules and calculations produce correct values</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                          <input type="checkbox" className="mt-1" checked disabled />
                          <span>Check error handling and rejection logic works as expected</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                          <input type="checkbox" className="mt-1" checked disabled />
                          <span>Performance test with production-scale data volumes</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                          <input type="checkbox" className="mt-1" checked disabled />
                          <span>Compare row counts, aggregates, and key metrics with Informatica</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {wizardStep === 'complete' && (
                    <div className="space-y-4">
                      <div className="bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6 text-center">
                        <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600 mb-3" />
                        <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-400 mb-2">
                          Job Conversion Complete!
                        </h4>
                        <p className="text-sm text-emerald-700 dark:text-emerald-500">
                          {currentJob.name} has been successfully converted and validated.
                        </p>
                      </div>
                      <div className="bg-background-secondary rounded-lg p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground-secondary">Status:</span>
                          <span className="text-emerald-600 font-medium">✓ Completed</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground-secondary">Components Generated:</span>
                          <span className="font-medium">5 Talend components</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground-secondary">Validation:</span>
                          <span className="text-emerald-600 font-medium">✓ Passed</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Wizard Footer */}
                <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-background-secondary">
                  <div className="text-xs text-foreground-secondary">
                    Progress: {currentJobIndex + 1} of {attentionJobs.length} jobs
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCloseWizard} variant="ghost">
                      Cancel
                    </Button>
                    <Button onClick={handleNextStep}>
                      {wizardStep === 'complete'
                        ? currentJobIndex < attentionJobs.length - 1
                          ? 'Next Job'
                          : 'Finish'
                        : 'Next Step'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Complete Stage Button - Outside tabs, shown when everything is done */}
      {isCompleted && (
        <div className="pt-6 border-t">
          {!canProceed && (
            <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-400">
                    Complete all tasks before proceeding
                  </p>
                  <div className="text-xs text-amber-700 dark:text-amber-500 mt-1 space-y-1">
                    {!allAutomatedComplete && <div>• Automated conversion: {convertedJobs}/{totalJobs} jobs complete</div>}
                    {!allManualComplete && <div>• Manual review: {completedManualJobs}/{manualReviewCount} jobs complete</div>}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button
              onClick={moveToNextStage}
              size="lg"
              disabled={!canProceed}
            >
              Proceed to Completion →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
