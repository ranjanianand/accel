'use client'

import { usePipelineStore, PipelineStage } from '@/stores/pipeline-store'

const stages: Array<{ id: PipelineStage; label: string; number: number }> = [
  { id: 'setup', label: 'Setup', number: 1 },
  { id: 'analysis', label: 'Analysis', number: 2 },
  { id: 'discovery', label: 'Discovery', number: 3 },
  { id: 'conversion', label: 'Conversion', number: 4 },
  { id: 'completed', label: 'Completed', number: 5 }
]

interface PipelineProgressProps {
  asTabBar?: boolean
}

// Engineering icons for each stage
const StageIcon = ({ stageId }: { stageId: PipelineStage }) => {
  const iconClass = "w-6 h-6"

  switch (stageId) {
    case 'setup':
      // Settings/Cog icon
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    case 'analysis':
      // Chart/Analytics icon
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    case 'discovery':
      // Radar/Search icon
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    case 'conversion':
      // Code/Transformation icon
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    case 'completed':
      // Trophy/Success icon
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    default:
      return null
  }
}

export function PipelineProgress({ asTabBar = false }: PipelineProgressProps = {}) {
  const { currentStage, stages: stageResults } = usePipelineStore()

  const getStageIndex = (stage: PipelineStage) => stages.findIndex((s) => s.id === stage)
  const currentIndex = getStageIndex(currentStage)

  // FORWARD-ONLY: Can only view current stage, not previous or future
  const canNavigateToStage = (stage: PipelineStage) => {
    return stage === currentStage
  }

  if (asTabBar) {
    return (
      <div className="border-b border-border bg-background">
        <div className="flex items-center">
          {stages.map((stage) => {
            const result = stageResults[stage.id]
            const isActive = stage.id === currentStage
            const isCompleted = result.status === 'completed'
            const isError = result.status === 'error'

            return (
              <div
                key={stage.id}
                className={`
                  flex-1 flex flex-col items-center justify-center gap-2 px-4 py-4 border-b-2 transition-all
                  ${isActive
                    ? 'border-blue-600 dark:border-blue-500'
                    : 'border-transparent'}
                  ${isCompleted ? 'bg-emerald-50/30 dark:bg-emerald-950/10' : ''}
                  ${stage.id === 'completed' && isActive ? 'bg-gradient-to-b from-emerald-50/50 to-blue-50/30 dark:from-emerald-950/20 dark:to-blue-950/10' : ''}
                  cursor-default
                `}
              >
                {/* Icon + Name Row */}
                <div className="flex items-center gap-3">
                  <div className={`${
                    isError
                      ? 'text-status-error'
                      : isCompleted
                        ? 'text-emerald-600 dark:text-emerald-500'
                        : isActive
                          ? stage.id === 'completed' ? 'text-emerald-600 dark:text-emerald-500' : 'text-blue-600 dark:text-blue-500'
                          : 'text-foreground-tertiary'
                  }`}>
                    {isError ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <StageIcon stageId={stage.id} />
                    )}
                  </div>
                  <span className={`text-base font-semibold antialiased ${
                    isCompleted
                      ? stage.id === 'completed' ? 'text-emerald-700 dark:text-emerald-400' : 'text-emerald-600 dark:text-emerald-500'
                      : isActive
                        ? stage.id === 'completed' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900'
                        : 'text-gray-600'
                  }`}>
                    {stage.label}
                  </span>
                </div>

                {/* Checkmark indicator */}
                <div className="h-4 flex items-center justify-center">
                  {(isCompleted || (stage.id === 'completed' && isActive)) && (
                    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background border border-border rounded-lg p-6">
      <div className="flex items-center justify-between gap-2">
        {stages.map((stage, index) => {
          const result = stageResults[stage.id]
          const isActive = stage.id === currentStage
          const isCompleted = result.status === 'completed'
          const isError = result.status === 'error'

          return (
            <div key={stage.id} className="flex-1 flex items-center gap-2">
              {/* Stage Circle */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${
                      isCompleted
                        ? stage.id === 'completed'
                          ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                          : 'bg-emerald-600 dark:bg-emerald-500 text-white'
                        : isError
                          ? 'bg-status-error text-white'
                          : isActive
                            ? 'border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                            : 'bg-background-secondary text-foreground-tertiary border border-border'
                    }
                  `}
                >
                  {isError ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <StageIcon stageId={stage.id} />
                  )}
                </div>

                <p className={`text-sm font-semibold antialiased mt-2 text-center ${
                  isCompleted
                    ? stage.id === 'completed' ? 'text-emerald-700 dark:text-emerald-400' : 'text-emerald-600 dark:text-emerald-500'
                    : isActive
                      ? 'text-gray-900'
                      : 'text-gray-600'
                }`}>
                  {stage.label}
                </p>

                {/* Completion indicator */}
                {isCompleted && (
                  <div className="mt-1 flex items-center justify-center">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                {/* Progress indicator */}
                {isActive && result.progress !== undefined && (
                  <div className="w-full mt-1">
                    <div className="h-0.5 bg-background-tertiary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-foreground transition-all duration-300"
                        style={{ width: `${result.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-foreground-tertiary text-center mt-0.5">
                      {result.progress}%
                    </p>
                  </div>
                )}
              </div>

              {/* Connector Line */}
              {index < stages.length - 1 && (
                <div className={`flex-1 h-px mx-1 transition-all ${
                  index < currentIndex
                    ? 'bg-emerald-500 dark:bg-emerald-600'
                    : 'bg-border'
                }`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
