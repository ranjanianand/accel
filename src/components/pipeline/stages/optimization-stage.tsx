'use client'

import { useEffect, useState } from 'react'
import { usePipelineStore } from '@/stores/pipeline-store'

interface OptimizationMetrics {
  performanceTuned: number
  totalPerformanceTasks: number
  codeOptimized: number
  totalCodeTasks: number
  bestPracticesApplied: number
  totalBestPractices: number
}

export function OptimizationStage() {
  const { stages, updateStageProgress, completeStage, moveToNextStage } = usePipelineStore()
  const stageResult = stages['optimization']
  const [metrics, setMetrics] = useState<OptimizationMetrics>({
    performanceTuned: 0,
    totalPerformanceTasks: 23,
    codeOptimized: 0,
    totalCodeTasks: 45,
    bestPracticesApplied: 0,
    totalBestPractices: 18
  })

  useEffect(() => {
    if (stageResult.status === 'in_progress') {
      const interval = setInterval(() => {
        setMetrics((prev) => {
          const newPerf = Math.min(prev.performanceTuned + 2, prev.totalPerformanceTasks)
          const newCode = Math.min(prev.codeOptimized + 3, prev.totalCodeTasks)
          const newBest = Math.min(prev.bestPracticesApplied + 1, prev.totalBestPractices)

          const totalProgress =
            ((newPerf / prev.totalPerformanceTasks +
              newCode / prev.totalCodeTasks +
              newBest / prev.totalBestPractices) /
              3) *
            100

          updateStageProgress('optimization', Math.floor(totalProgress), 'Optimizing generated code...')

          if (
            newPerf === prev.totalPerformanceTasks &&
            newCode === prev.totalCodeTasks &&
            newBest === prev.totalBestPractices
          ) {
            clearInterval(interval)
            setTimeout(() => {
              completeStage('optimization', {
                performanceTuned: newPerf,
                codeOptimized: newCode,
                bestPracticesApplied: newBest,
                performanceGain: 28,
                codeQualityScore: 92
              })
              // Don't auto-advance, let user navigate manually
            }, 500)
          }

          return {
            ...prev,
            performanceTuned: newPerf,
            codeOptimized: newCode,
            bestPracticesApplied: newBest
          }
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [stageResult.status])

  return (
    <div className="bg-background border border-border rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold mb-1">Optimization Stage</h2>
        <p className="text-sm text-foreground-secondary">
          Applying performance tuning and best practices
        </p>
      </div>

      <div className="space-y-3">
        {/* Performance Tuning */}
        <div className="border border-border rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Performance Tuning</span>
            <span className="text-xs text-foreground-tertiary">
              {metrics.performanceTuned} / {metrics.totalPerformanceTasks}
            </span>
          </div>
          <div className="h-1 bg-background-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground transition-all duration-300"
              style={{
                width: `${(metrics.performanceTuned / metrics.totalPerformanceTasks) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Code Optimization */}
        <div className="border border-border rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Code Optimization</span>
            <span className="text-xs text-foreground-tertiary">
              {metrics.codeOptimized} / {metrics.totalCodeTasks}
            </span>
          </div>
          <div className="h-1 bg-background-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground transition-all duration-300"
              style={{ width: `${(metrics.codeOptimized / metrics.totalCodeTasks) * 100}%` }}
            />
          </div>
        </div>

        {/* Best Practices */}
        <div className="border border-border rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Best Practices Application</span>
            <span className="text-xs text-foreground-tertiary">
              {metrics.bestPracticesApplied} / {metrics.totalBestPractices}
            </span>
          </div>
          <div className="h-1 bg-background-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground transition-all duration-300"
              style={{
                width: `${(metrics.bestPracticesApplied / metrics.totalBestPractices) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Live Log */}
        {stageResult.status === 'in_progress' && (
          <div className="border border-border rounded p-4 font-mono text-xs">
            <div className="space-y-1 text-foreground-tertiary">
              <p>→ Optimizing tMap lookup strategies...</p>
              <p>→ Applying bulk load patterns...</p>
              <p>→ Consolidating context variables...</p>
              <p className="text-foreground">→ {stageResult.message}</p>
            </div>
          </div>
        )}

        {stageResult.status === 'completed' && (
          <div className="border border-border rounded p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">Optimization Complete</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-foreground-secondary">Performance Gain</p>
                <p className="text-sm font-semibold">
                  +{stageResult.metrics?.performanceGain}%
                </p>
              </div>
              <div>
                <p className="text-foreground-secondary">Code Quality Score</p>
                <p className="text-sm font-semibold">
                  {stageResult.metrics?.codeQualityScore}/100
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
