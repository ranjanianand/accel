'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMigrationWizardStore } from '@/stores/migration-wizard-store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// ============================================================================
// Summary Metrics Component
// ============================================================================

function SummaryMetrics() {
  const { analysisResults } = useMigrationWizardStore()

  if (!analysisResults) return null

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <Card className="p-6 text-center">
        <div className="text-4xl font-bold text-primary mb-2">
          {analysisResults.automationRate}%
        </div>
        <div className="text-sm text-muted-foreground mb-1">Automation Rate</div>
        <div className="text-xs text-muted-foreground">Industry Leading</div>
      </Card>
      <Card className="p-6 text-center">
        <div className="text-4xl font-bold text-primary mb-2">
          {analysisResults.timeSavingsEstimate}h
        </div>
        <div className="text-sm text-muted-foreground mb-1">Time Savings</div>
        <div className="text-xs text-muted-foreground">Estimated for this project</div>
      </Card>
      <Card className="p-6 text-center">
        <div className="text-4xl font-bold text-foreground mb-2">
          {analysisResults.complexity.average.toFixed(0)}
        </div>
        <div className="text-sm text-muted-foreground mb-1">Avg Complexity</div>
        <div className="text-xs text-muted-foreground">
          {analysisResults.complexity.average < 40
            ? 'Low'
            : analysisResults.complexity.average < 70
            ? 'Medium'
            : 'High'}
        </div>
      </Card>
    </div>
  )
}

// ============================================================================
// Detailed Breakdown Component
// ============================================================================

function DetailedBreakdown() {
  const { uploadedFiles, analysisResults, detectedConnections } = useMigrationWizardStore()

  const filesWithWarnings = analysisResults?.files.filter((f) => f.status === 'warning').length || 0
  const filesWithErrors = analysisResults?.files.filter((f) => f.status === 'error').length || 0
  const filesReady = analysisResults?.files.filter((f) => f.status === 'ready').length || 0

  const configuredConnections = detectedConnections.filter(
    (c) =>
      c.configStatus === 'configured' ||
      c.configStatus === 'tested_success' ||
      c.configStatus === 'linked'
  ).length

  const testedConnections = detectedConnections.filter(
    (c) => c.configStatus === 'tested_success'
  ).length

  return (
    <div className="space-y-4">
      {/* Files */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          Files
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Uploaded successfully:</span>
            <span className="font-medium text-foreground">{uploadedFiles.length} files</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Parsed without errors:</span>
            <span className="font-medium text-foreground">{filesReady} files</span>
          </div>
          {filesWithWarnings > 0 && (
            <div className="flex justify-between">
              <span className="text-yellow-600">Files with warnings:</span>
              <span className="font-medium text-yellow-600">{filesWithWarnings} files</span>
            </div>
          )}
          {filesWithErrors > 0 && (
            <div className="flex justify-between">
              <span className="text-red-600">Files with errors:</span>
              <span className="font-medium text-red-600">{filesWithErrors} files</span>
            </div>
          )}
        </div>
      </Card>

      {/* Connections */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Connections
        </h3>
        {detectedConnections.length > 0 ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Configured and tested:</span>
              <span className="font-medium text-foreground">{testedConnections} connections</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Configured (not tested):</span>
              <span className="font-medium text-foreground">
                {configuredConnections - testedConnections} connections
              </span>
            </div>
            {configuredConnections < detectedConnections.length && (
              <div className="flex justify-between">
                <span className="text-yellow-600">Pending configuration:</span>
                <span className="font-medium text-yellow-600">
                  {detectedConnections.length - configuredConnections} connections
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No connections detected</p>
        )}
      </Card>

      {/* Objects Detected */}
      {analysisResults && (
        <Card className="p-6">
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Objects Detected
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mappings:</span>
              <span className="font-medium text-foreground">
                {analysisResults.objectCounts.mappings}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Workflows:</span>
              <span className="font-medium text-foreground">
                {analysisResults.objectCounts.workflows}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sessions:</span>
              <span className="font-medium text-foreground">
                {analysisResults.objectCounts.sessions}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mapplets:</span>
              <span className="font-medium text-foreground">
                {analysisResults.objectCounts.mapplets}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sources:</span>
              <span className="font-medium text-foreground">
                {analysisResults.objectCounts.sources}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Targets:</span>
              <span className="font-medium text-foreground">
                {analysisResults.objectCounts.targets}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Connections:</span>
              <span className="font-medium text-foreground">
                {analysisResults.objectCounts.connections}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transformations:</span>
              <span className="font-medium text-foreground">
                {analysisResults.objectCounts.transformations}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Automation Analysis */}
      {analysisResults && analysisResults.files.filter((f) => f.status === 'warning').length > 0 && (
        <Card className="p-6">
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Automation Analysis
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                {analysisResults.files.filter((f) => f.status === 'ready').length} fully automated
              </Badge>
            </div>
            {filesWithWarnings > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {filesWithWarnings} require manual review
                  </Badge>
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground ml-4">
                  {analysisResults.files
                    .filter((f) => f.status === 'warning')
                    .slice(0, 3)
                    .map((file, idx) => (
                      <li key={idx}>
                        • {file.name}
                        {file.warnings && file.warnings.length > 0 && `: ${file.warnings[0]}`}
                      </li>
                    ))}
                  {filesWithWarnings > 3 && (
                    <li className="text-primary">• ... and {filesWithWarnings - 3} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

// ============================================================================
// Warnings Component
// ============================================================================

function WarningsSection() {
  const { analysisResults, validationStatus } = useMigrationWizardStore()

  const hasWarnings =
    (analysisResults?.globalWarnings.length || 0) > 0 || validationStatus.warnings.length > 0
  const hasBlockers = validationStatus.blockers.length > 0

  if (!hasWarnings && !hasBlockers) return null

  return (
    <div className="space-y-4">
      {/* Blockers */}
      {hasBlockers && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex gap-3">
            <div className="text-red-600 mt-0.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-900 mb-2">
                ⛔ Blockers ({validationStatus.blockers.length})
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                {validationStatus.blockers.map((blocker, idx) => (
                  <li key={idx}>• {blocker}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Warnings */}
      {hasWarnings && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex gap-3">
            <div className="text-yellow-600 mt-0.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-900 mb-2">
                ⚠ Warnings (
                {(analysisResults?.globalWarnings.length || 0) + validationStatus.warnings.length})
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {analysisResults?.globalWarnings.map((warning, idx) => (
                  <li key={`analysis-${idx}`}>• {warning}</li>
                ))}
                {validationStatus.warnings.map((warning, idx) => (
                  <li key={`validation-${idx}`}>• {warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function Step4ReviewConfirm() {
  const { projectInfo, validateStep4, startMigration, prevStep, isSaving } =
    useMigrationWizardStore()
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)

  const canStart = validateStep4()

  const handleStartMigration = async () => {
    setIsStarting(true)
    try {
      const migrationId = await startMigration()
      // Navigate to migration detail page
      router.push(`/migrations/${migrationId}`)
    } catch (error) {
      console.error('Failed to start migration:', error)
      setIsStarting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Review & Confirm</h2>
        <p className="text-muted-foreground">
          Review your migration project details and start the automated conversion process.
        </p>
      </div>

      {/* Project Info */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Project Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground mb-1">Project Name</div>
            <div className="font-medium text-foreground">{projectInfo.name}</div>
          </div>
          {projectInfo.description && (
            <div>
              <div className="text-muted-foreground mb-1">Description</div>
              <div className="font-medium text-foreground">{projectInfo.description}</div>
            </div>
          )}
          <div>
            <div className="text-muted-foreground mb-1">Source System</div>
            <div className="font-medium text-foreground">
              {projectInfo.sourceSystem.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Target System</div>
            <div className="font-medium text-foreground">Talend</div>
          </div>
          {projectInfo.tags && projectInfo.tags.length > 0 && (
            <div className="col-span-2">
              <div className="text-muted-foreground mb-2">Tags</div>
              <div className="flex gap-2 flex-wrap">
                {projectInfo.tags.map((tag, idx) => (
                  <Badge key={idx} className="bg-gray-100 text-gray-800">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Hero Metrics */}
      <SummaryMetrics />

      {/* Detailed Breakdown */}
      <DetailedBreakdown />

      {/* Warnings & Blockers */}
      <div className="mt-6">
        <WarningsSection />
      </div>

      {/* What Happens Next */}
      <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <div className="text-blue-600 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • Migration jobs will be queued and processed automatically using our 15
                specialized engines
              </li>
              <li>
                • You'll receive real-time progress updates with detailed conversion logs
              </li>
              <li>• Generated Talend jobs will be available for download and validation</li>
              <li>
                • Data lineage validation and business rule checks will run automatically
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between gap-3 pt-6 mt-6 border-t">
        <Button variant="secondary" onClick={prevStep} disabled={isStarting}>
          ← Back to Connections
        </Button>
        <Button
          onClick={handleStartMigration}
          disabled={!canStart || isStarting || isSaving}
          size="lg"
        >
          {isStarting || isSaving ? 'Starting Migration...' : 'Start Migration 🚀'}
        </Button>
      </div>
    </div>
  )
}
