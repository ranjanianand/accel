'use client'

import { useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { SetupProjectUploadSection } from '@/components/setup/project-upload-section'
import { useMigrationWizardStore } from '@/stores/migration-wizard-store'
import { usePipelineStore } from '@/stores/pipeline-store'
import { useSetupStore } from '@/stores/setup-store'

export default function SetupPage() {
  const { reset: resetWizard } = useMigrationWizardStore()
  const { resetPipeline } = usePipelineStore()
  const { reset: resetSetup } = useSetupStore()

  // Reset all stores when starting a new migration setup
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
        <div className="p-6 border-b border-border bg-background-secondary">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-semibold">New Migration Setup</h1>
            <p className="text-sm text-foreground-secondary mt-1">
              Configure project details, upload files, and run analysis
            </p>
          </div>
        </div>

        {/* Setup & Analysis */}
        <div className="max-w-6xl mx-auto p-6">
          <SetupProjectUploadSection />
        </div>
      </main>
    </>
  )
}
