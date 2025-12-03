import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PipelineStage = 'setup' | 'analysis' | 'discovery' | 'conversion' | 'validation' | 'optimization' | 'completed'
export type StageStatus = 'pending' | 'in_progress' | 'completed' | 'error'

export interface StageResult {
  stage: PipelineStage
  status: StageStatus
  startTime?: Date
  endTime?: Date
  progress?: number
  message?: string
  errors?: string[]
  warnings?: string[]
  metrics?: Record<string, any>
}

export interface PipelineState {
  // Current state
  currentStage: PipelineStage
  stages: Record<PipelineStage, StageResult>
  isRunning: boolean

  // Actions
  setCurrentStage: (stage: PipelineStage) => void
  startStage: (stage: PipelineStage) => void
  updateStageProgress: (stage: PipelineStage, progress: number, message?: string) => void
  completeStage: (stage: PipelineStage, metrics?: Record<string, any>) => void
  failStage: (stage: PipelineStage, errors: string[]) => void
  addWarning: (stage: PipelineStage, warning: string) => void
  moveToNextStage: () => void
  resetPipeline: () => void
}

const stageOrder: PipelineStage[] = [
  'setup',
  'analysis',
  'discovery',
  'conversion',
  'completed'
]

const initialStages: Record<PipelineStage, StageResult> = {
  setup: { stage: 'setup', status: 'in_progress' }, // Start with setup active
  analysis: { stage: 'analysis', status: 'pending' },
  discovery: { stage: 'discovery', status: 'pending' },
  conversion: { stage: 'conversion', status: 'pending' },
  completed: { stage: 'completed', status: 'pending' }
}

export const usePipelineStore = create<PipelineState>()(
  persist(
    (set, get) => ({
      currentStage: 'setup',
      stages: initialStages,
      isRunning: false,

      setCurrentStage: (stage) => {
        set({ currentStage: stage })
      },

      startStage: (stage) => {
        set((state) => ({
          currentStage: stage,
          isRunning: true,
          stages: {
            ...state.stages,
            [stage]: {
              ...state.stages[stage],
              status: 'in_progress',
              startTime: new Date(),
              progress: 0
            }
          }
        }))
      },

      updateStageProgress: (stage, progress, message) => {
        set((state) => ({
          stages: {
            ...state.stages,
            [stage]: {
              ...state.stages[stage],
              progress,
              message
            }
          }
        }))
      },

      completeStage: (stage, metrics) => {
        set((state) => ({
          stages: {
            ...state.stages,
            [stage]: {
              ...state.stages[stage],
              status: 'completed',
              endTime: new Date(),
              progress: 100,
              metrics
            }
          }
        }))
      },

      failStage: (stage, errors) => {
        set((state) => ({
          isRunning: false,
          stages: {
            ...state.stages,
            [stage]: {
              ...state.stages[stage],
              status: 'error',
              endTime: new Date(),
              errors
            }
          }
        }))
      },

      addWarning: (stage, warning) => {
        set((state) => ({
          stages: {
            ...state.stages,
            [stage]: {
              ...state.stages[stage],
              warnings: [...(state.stages[stage].warnings || []), warning]
            }
          }
        }))
      },

      moveToNextStage: () => {
        const current = get().currentStage
        const currentIndex = stageOrder.indexOf(current)

        if (currentIndex < stageOrder.length - 1) {
          const nextStage = stageOrder[currentIndex + 1]
          get().startStage(nextStage)
        } else {
          set({ isRunning: false })
        }
      },

      resetPipeline: () => {
        set({
          currentStage: 'setup',
          stages: initialStages,
          isRunning: false
        })
      }
    }),
    {
      name: 'pipeline-storage',
      skipHydration: true,
    }
  )
)
