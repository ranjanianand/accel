'use client'

import { useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { PipelineProgress } from '@/components/pipeline/pipeline-progress'
import { SetupStage } from '@/components/pipeline/stages/setup-stage'
import { AnalysisStage } from '@/components/pipeline/stages/analysis-stage'
import { DiscoveryStage } from '@/components/pipeline/stages/discovery-stage'
import { ConversionStage } from '@/components/pipeline/stages/conversion-stage'
import { ValidationStage } from '@/components/pipeline/stages/validation-stage'
import { OptimizationStage } from '@/components/pipeline/stages/optimization-stage'
import { CompletionStage } from '@/components/pipeline/stages/completion-stage'
import { PipelineNavigation } from '@/components/pipeline/pipeline-navigation'
import { usePipelineStore } from '@/stores/pipeline-store'
import { useSetupStore } from '@/stores/setup-store'
import { useMigrationWizardStore } from '@/stores/migration-wizard-store'

export default function PipelinePage() {
  const { currentStage, resetPipeline } = usePipelineStore()
  const { projectInfo, reset: resetSetup } = useSetupStore()
  const { reset: resetWizard } = useMigrationWizardStore()

  // Reset all stores when starting a new migration via pipeline
  useEffect(() => {
    // Clear localStorage to ensure fresh state
    if (typeof window !== 'undefined') {
      localStorage.removeItem('migration-wizard-storage')
      localStorage.removeItem('pipeline-storage')
      localStorage.removeItem('migration-setup-storage')
    }

    // Reset stores
    resetWizard()
    resetPipeline()
    resetSetup()
  }, [resetWizard, resetPipeline, resetSetup])

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background pb-24">
        {/* Page Header */}
        <div className="px-6 py-3 border-b border-border bg-background-secondary">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">Migration Pipeline</h1>
              {currentStage !== 'setup' && projectInfo.name && (
                <>
                  <span className="text-foreground-tertiary">•</span>
                  <span className="text-base font-medium text-foreground-secondary">{projectInfo.name}</span>
                </>
              )}
            </div>
            <p className="text-sm text-foreground-secondary mt-0.5">
              Automated migration process with validation
            </p>
          </div>
        </div>

        {/* Tab-based Pipeline Progress */}
        <div className="sticky top-0 z-10 bg-background shadow-sm">
          <div className="max-w-6xl mx-auto">
            <PipelineProgress asTabBar />
          </div>
        </div>

        {/* Current Stage Content */}
        <div className="max-w-6xl mx-auto px-6 py-6">
          {currentStage === 'setup' && <SetupStage />}
          {currentStage === 'analysis' && <AnalysisStage />}
          {currentStage === 'discovery' && <DiscoveryStage />}
          {currentStage === 'conversion' && <ConversionStage />}
          {currentStage === 'validation' && <ValidationStage />}
          {currentStage === 'optimization' && <OptimizationStage />}
          {currentStage === 'completed' && <CompletionStage />}
        </div>

        {/* Navigation */}
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <PipelineNavigation />
        </div>
      </main>
    </>
  )
}
