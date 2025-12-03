'use client'

import { useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { WizardSteps } from '@/components/wizard/wizard-steps'
import { Step1ProjectInfo } from '@/components/wizard/step1-project-info'
import { Step2UploadDetection } from '@/components/wizard/step2-upload-detection'
import { Step3Connections } from '@/components/wizard/step3-connections'
import { Step4ReviewConfirm } from '@/components/wizard/step4-review-confirm'
import { useMigrationWizardStore } from '@/stores/migration-wizard-store'
import { usePipelineStore } from '@/stores/pipeline-store'
import { useSetupStore } from '@/stores/setup-store'

const WIZARD_STEPS = [
  { number: 1, title: 'Project Info', description: 'Create migration project' },
  { number: 2, title: 'Upload & Detect', description: 'Upload Informatica files' },
  { number: 3, title: 'Connections', description: 'Configure connections' },
  { number: 4, title: 'Review & Confirm', description: 'Start migration' },
]

export default function NewMigrationPage() {
  const { currentStep, reset: resetWizard } = useMigrationWizardStore()
  const { resetPipeline } = usePipelineStore()
  const { reset: resetSetup } = useSetupStore()

  // Reset all stores when starting a new migration
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ProjectInfo />
      case 2:
        return <Step2UploadDetection />
      case 3:
        return <Step3Connections />
      case 4:
        return <Step4ReviewConfirm />
      default:
        return <Step1ProjectInfo />
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background pb-24">
        {/* Page Header */}
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-semibold">New Migration Project</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Automate your Informatica PowerCenter to Talend migration with 92-97% automation
          </p>
        </div>

        {/* Wizard Steps */}
        <WizardSteps steps={WIZARD_STEPS} currentStep={currentStep} />

        {/* Step Content */}
        <div className="p-6">{renderStep()}</div>
      </main>
    </>
  )
}
