'use client'

import { Button } from '@/components/ui/button'
import { usePipelineStore, PipelineStage } from '@/stores/pipeline-store'

const stageOrder: PipelineStage[] = [
  'review',
  'discovery',
  'conversion',
  'validation',
  'optimization',
  'completed'
]

export function PipelineNavigation() {
  const { currentStage, startStage } = usePipelineStore()

  const currentIndex = stageOrder.indexOf(currentStage)
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < stageOrder.length - 1

  const handlePrevious = () => {
    if (hasPrevious) {
      startStage(stageOrder[currentIndex - 1])
    }
  }

  const handleNext = () => {
    if (hasNext) {
      startStage(stageOrder[currentIndex + 1])
    }
  }

  return (
    <div className="flex items-center justify-between border-t border-border pt-6">
      <Button
        onClick={handlePrevious}
        disabled={!hasPrevious}
        variant="ghost"
        size="sm"
        className="text-sm"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous Stage
      </Button>

      <div className="text-xs text-foreground-tertiary">
        Stage {currentIndex + 1} of {stageOrder.length}
      </div>

      <Button
        onClick={handleNext}
        disabled={!hasNext}
        variant="ghost"
        size="sm"
        className="text-sm"
      >
        Next Stage
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  )
}
