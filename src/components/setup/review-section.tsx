'use client'

import { SetupAnalysisSection } from './analysis-section'
import { SetupConnectionsSection } from './connections-section'
import { Button } from '@/components/ui/button'
import { useSetupStore } from '@/stores/setup-store'

export function SetupReviewSection() {
  const { canStartMigration, analysisResults } = useSetupStore()

  const handleStartMigration = () => {
    window.location.href = '/migrations/monitor'
  }

  // Only show after analysis is complete
  if (!analysisResults) {
    return null
  }

  return (
    <div className="bg-background border border-border rounded-lg p-6 animate-slide-down">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-accent-green/10 flex items-center justify-center">
          <span className="text-accent-green text-sm">2</span>
        </div>
        <div>
          <h2 className="font-semibold text-lg">Review & Confirm</h2>
          <p className="text-xs text-foreground-secondary">
            Review analysis results, configure connections, and start migration
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Analysis Results - Nested without outer card */}
        <div>
          <SetupAnalysisSection />
        </div>

        {/* Connection Configuration - Nested without outer card */}
        <div>
          <SetupConnectionsSection />
        </div>

        {/* Start Migration Action */}
        <div className="pt-6 border-t border-border">
          <div className="bg-background-secondary rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Ready to Start Migration?</h3>
                <p className="text-sm text-foreground-secondary mb-4">
                  {canStartMigration()
                    ? 'All requirements met. You can now start the migration process.'
                    : 'Complete all sections above to enable migration start.'}
                </p>

                {!canStartMigration() && (
                  <div className="bg-background border border-border rounded p-3 text-sm text-foreground-secondary">
                    <p className="font-medium mb-2">Requirements:</p>
                    <ul className="space-y-1 ml-4">
                      <li className="flex items-center gap-2">
                        <span className="text-status-success">✓</span>
                        <span>Project information configured</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-status-success">✓</span>
                        <span>Files uploaded and analyzed</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-status-pending">○</span>
                        <span>All required connections tested successfully</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <Button
                onClick={handleStartMigration}
                disabled={!canStartMigration()}
                size="lg"
                className="ml-6"
              >
                Start Migration →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
