'use client'

import { useSetupStore } from '@/stores/setup-store'

export function SetupAnalysisSection() {
  const { uploadStatus, analysisStatus, analysisResults, isAnalyzing } = useSetupStore()

  // Section not visible until upload is complete
  if (uploadStatus === 'incomplete') {
    return null
  }

  // Analyzing state handled in upload section
  if (isAnalyzing) {
    return null
  }

  // No results yet
  if (!analysisResults) {
    return null
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground-secondary">Analysis Results</h3>
        <p className="text-xs text-foreground-tertiary">
          Automated pattern detection completed
        </p>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-accent-blue/5 to-accent-blue/10 rounded-lg p-4 border border-accent-blue/20">
          <div className="text-3xl font-bold text-accent-blue mb-1">
            {analysisResults.automationRate}%
          </div>
          <div className="text-xs text-foreground-secondary">Automation Rate</div>
        </div>

        <div className="bg-gradient-to-br from-accent-green/5 to-accent-green/10 rounded-lg p-4 border border-accent-green/20">
          <div className="text-3xl font-bold text-accent-green mb-1">
            ~{analysisResults.timeSavingsEstimate}h
          </div>
          <div className="text-xs text-foreground-secondary">Time Savings Estimate</div>
        </div>

        <div className="bg-gradient-to-br from-accent-yellow/5 to-accent-yellow/10 rounded-lg p-4 border border-accent-yellow/20">
          <div className="text-3xl font-bold text-accent-yellow mb-1">
            {analysisResults.complexity.average}
          </div>
          <div className="text-xs text-foreground-secondary">Avg Complexity Score</div>
        </div>
      </div>

      {/* Object Counts */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Detected Objects</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-background-secondary rounded p-3 border border-border">
            <div className="text-2xl font-bold text-foreground mb-1">
              {analysisResults.objectCounts.mappings}
            </div>
            <div className="text-xs text-foreground-secondary">Mappings</div>
          </div>
          <div className="bg-background-secondary rounded p-3 border border-border">
            <div className="text-2xl font-bold text-foreground mb-1">
              {analysisResults.objectCounts.workflows}
            </div>
            <div className="text-xs text-foreground-secondary">Workflows</div>
          </div>
          <div className="bg-background-secondary rounded p-3 border border-border">
            <div className="text-2xl font-bold text-foreground mb-1">
              {analysisResults.objectCounts.sessions}
            </div>
            <div className="text-xs text-foreground-secondary">Sessions</div>
          </div>
          <div className="bg-background-secondary rounded p-3 border border-border">
            <div className="text-2xl font-bold text-foreground mb-1">
              {analysisResults.objectCounts.mapplets}
            </div>
            <div className="text-xs text-foreground-secondary">Mapplets</div>
          </div>
          <div className="bg-background-secondary rounded p-3 border border-border">
            <div className="text-2xl font-bold text-foreground mb-1">
              {analysisResults.objectCounts.sources}
            </div>
            <div className="text-xs text-foreground-secondary">Sources</div>
          </div>
          <div className="bg-background-secondary rounded p-3 border border-border">
            <div className="text-2xl font-bold text-foreground mb-1">
              {analysisResults.objectCounts.targets}
            </div>
            <div className="text-xs text-foreground-secondary">Targets</div>
          </div>
        </div>
      </div>

      {/* Detected Patterns */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Detected Patterns</h3>
        <div className="space-y-2">
          {analysisResults.patterns.map((pattern) => (
            <div
              key={pattern.name}
              className="flex items-center gap-3 p-3 bg-background-secondary rounded border border-border"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{pattern.name}</span>
                  <span className="badge bg-accent-blue/10 text-accent-blue border-accent-blue/20">
                    {pattern.count} instances
                  </span>
                </div>
                <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-blue transition-all duration-300"
                    style={{ width: `${pattern.percentage}%` }}
                  />
                </div>
              </div>
              <div className="text-sm font-medium text-foreground-secondary">
                {pattern.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complexity Distribution */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Complexity Distribution</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-status-success/5 rounded p-3 border border-status-success/20">
            <div className="text-xl font-bold text-status-success mb-1">
              {analysisResults.complexity.distribution.low}
            </div>
            <div className="text-xs text-foreground-secondary">Low Complexity</div>
          </div>
          <div className="bg-accent-yellow/5 rounded p-3 border border-accent-yellow/20">
            <div className="text-xl font-bold text-accent-yellow mb-1">
              {analysisResults.complexity.distribution.medium}
            </div>
            <div className="text-xs text-foreground-secondary">Medium Complexity</div>
          </div>
          <div className="bg-status-error/5 rounded p-3 border border-status-error/20">
            <div className="text-xl font-bold text-status-error mb-1">
              {analysisResults.complexity.distribution.high}
            </div>
            <div className="text-xs text-foreground-secondary">High Complexity</div>
          </div>
        </div>
      </div>

      {/* Detected Connections Info */}
      {analysisResults.detectedConnections.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <div className="bg-accent-blue/5 border border-accent-blue/20 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="text-accent-blue mt-0.5">
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
                <h4 className="text-sm font-medium text-accent-blue mb-1">
                  Connections Detected
                </h4>
                <p className="text-sm text-foreground-secondary">
                  Found {analysisResults.detectedConnections.length} connection
                  {analysisResults.detectedConnections.length !== 1 ? 's' : ''} that need
                  configuration. Scroll down to configure connections before starting migration.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
