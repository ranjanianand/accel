/**
 * Setup Store - State management for single-page migration setup
 * Handles progressive disclosure and state locking
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// ============================================================================
// Types
// ============================================================================

export type SetupStep = 'project' | 'upload' | 'analysis' | 'connections' | 'ready'
export type SectionStatus = 'incomplete' | 'complete' | 'locked'

export interface ProjectInfo {
  name: string
  description?: string
  sourceSystem: 'informatica_9' | 'informatica_10' | 'informatica_10.5'
  targetSystem: 'talend'
  tags?: string[]
}

export interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  status: 'pending' | 'uploading' | 'uploaded' | 'error'
  uploadProgress: number
  error?: string
}

export interface FlatFileMetadata {
  fileName: string
  fileType: 'CSV' | 'TXT' | 'Excel' | 'JSON' | 'XML' | 'Fixed Width' | 'Other'
  description?: string
}

export interface AnalysisResults {
  objectCounts: {
    mappings: number
    workflows: number
    sessions: number
    mapplets: number
    sources: number
    targets: number
  }
  patterns: Array<{
    name: string
    count: number
    percentage: number
  }>
  automationRate: number
  timeSavingsEstimate: number
  complexity: {
    average: number
    distribution: {
      low: number
      medium: number
      high: number
    }
  }
  detectedConnections: Array<{
    name: string
    type: string
    required: boolean
    configured: boolean
  }>
  flatFiles?: FlatFileMetadata[]
}

export interface ConnectionConfig {
  name: string
  type: string
  host?: string
  port?: number
  database?: string
  username?: string
  password?: string
  tested: boolean
  testSuccess?: boolean
  testMessage?: string
}

// ============================================================================
// Store Interface
// ============================================================================

interface SetupStore {
  // Current step
  currentStep: SetupStep

  // Section statuses
  projectStatus: SectionStatus
  uploadStatus: SectionStatus
  analysisStatus: SectionStatus
  connectionsStatus: SectionStatus

  // Data
  projectInfo: ProjectInfo
  files: UploadedFile[]
  analysisResults: AnalysisResults | null
  connections: ConnectionConfig[]

  // UI States
  isAnalyzing: boolean
  isUploadLocked: boolean
  isProjectCollapsed: boolean

  // Actions - Project
  updateProjectInfo: (info: Partial<ProjectInfo>) => void

  // Actions - Upload
  addFiles: (files: File[]) => void
  removeFile: (fileId: string) => void
  updateFileProgress: (fileId: string, progress: number) => void
  updateFileStatus: (fileId: string, status: UploadedFile['status']) => void
  clearFiles: () => void

  // Actions - Analysis
  startAnalysis: () => void
  setAnalysisResults: (results: AnalysisResults) => void
  completeAnalysis: () => void

  // Actions - Connections
  updateConnection: (name: string, config: Partial<ConnectionConfig>) => void
  testConnection: (name: string) => Promise<void>

  // Validation
  canAnalyze: () => boolean
  canStartMigration: () => boolean

  // Global
  reset: () => void
}

// ============================================================================
// Initial State
// ============================================================================

const initialState = {
  currentStep: 'project' as SetupStep,

  projectStatus: 'incomplete' as SectionStatus,
  uploadStatus: 'incomplete' as SectionStatus,
  analysisStatus: 'incomplete' as SectionStatus,
  connectionsStatus: 'incomplete' as SectionStatus,

  projectInfo: {
    name: '',
    sourceSystem: 'informatica_10.5' as const,
    targetSystem: 'talend' as const,
  },

  files: [],
  analysisResults: null,
  connections: [],

  isAnalyzing: false,
  isUploadLocked: false,
  isProjectCollapsed: false,
}

// ============================================================================
// Store Implementation
// ============================================================================

export const useSetupStore = create<SetupStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Project actions
        updateProjectInfo: (info) => {
          set({
            projectInfo: { ...get().projectInfo, ...info },
            projectStatus: 'complete'
          })
        },

        // Upload actions
        addFiles: (newFiles) => {
          const filesWithMeta: UploadedFile[] = newFiles.map((file, index) => ({
            id: `${Date.now()}-${index}`,
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'pending',
            uploadProgress: 0,
          }))

          set({
            files: [...get().files, ...filesWithMeta],
            uploadStatus: 'complete',
          })

          // Simulate upload
          filesWithMeta.forEach((fileWithMeta) => {
            get().updateFileStatus(fileWithMeta.id, 'uploading')

            // Simulate progress
            let progress = 0
            const interval = setInterval(() => {
              progress += 10
              if (progress <= 100) {
                get().updateFileProgress(fileWithMeta.id, progress)
              }
              if (progress === 100) {
                clearInterval(interval)
                get().updateFileStatus(fileWithMeta.id, 'uploaded')
              }
            }, 100)
          })
        },

        removeFile: (fileId) => {
          set({ files: get().files.filter((f) => f.id !== fileId) })
          if (get().files.length === 0) {
            set({ uploadStatus: 'incomplete' })
          }
        },

        updateFileProgress: (fileId, progress) => {
          set({
            files: get().files.map((f) =>
              f.id === fileId ? { ...f, uploadProgress: progress } : f
            ),
          })
        },

        updateFileStatus: (fileId, status) => {
          set({
            files: get().files.map((f) =>
              f.id === fileId ? { ...f, status } : f
            ),
          })
        },

        clearFiles: () => {
          if (get().analysisStatus !== 'locked') {
            set({
              files: [],
              uploadStatus: 'incomplete',
              analysisResults: null,
              analysisStatus: 'incomplete',
            })
          }
        },

        // Analysis actions
        startAnalysis: () => {
          set({
            isAnalyzing: true,
            isUploadLocked: true,
            currentStep: 'analysis',
          })

          // Mock analysis with timeout
          setTimeout(() => {
            get().setAnalysisResults({
              objectCounts: {
                mappings: 10,
                workflows: 3,
                sessions: 5,
                mapplets: 2,
                sources: 8,
                targets: 6,
              },
              patterns: [
                { name: 'SCD Type 2', count: 4, percentage: 40 },
                { name: 'CDC', count: 3, percentage: 30 },
                { name: 'Snapshot', count: 2, percentage: 20 },
                { name: 'Aggregation', count: 1, percentage: 10 },
              ],
              automationRate: 95,
              timeSavingsEstimate: 45,
              complexity: {
                average: 52,
                distribution: {
                  low: 2,
                  medium: 6,
                  high: 2,
                },
              },
              detectedConnections: [
                { name: 'SRC_CUSTOMER_DB', type: 'Oracle', required: true, configured: false },
                { name: 'TGT_DWH_DB', type: 'Oracle', required: true, configured: false },
                { name: 'FILE_INPUT', type: 'Flat File', required: false, configured: false },
              ],
              flatFiles: [
                { fileName: 'customer_master.csv', fileType: 'CSV', description: 'Customer master data' },
                { fileName: 'transactions_daily.txt', fileType: 'TXT', description: 'Daily transaction records' },
                { fileName: 'product_catalog.xlsx', fileType: 'Excel', description: 'Product reference data' },
                { fileName: 'orders_feed.csv', fileType: 'CSV', description: 'Order processing feed' },
                { fileName: 'inventory_snapshot.txt', fileType: 'TXT', description: 'Daily inventory levels' },
              ],
            })
            get().completeAnalysis()
          }, 3000)
        },

        setAnalysisResults: (results) => {
          set({
            analysisResults: results,
            connections: results.detectedConnections.map((conn) => ({
              name: conn.name,
              type: conn.type,
              tested: false,
            })),
          })
        },

        completeAnalysis: () => {
          set({
            isAnalyzing: false,
            analysisStatus: 'locked',
            uploadStatus: 'locked',
            currentStep: 'connections',
          })
        },

        // Connection actions
        updateConnection: (name, config) => {
          set({
            connections: get().connections.map((conn) =>
              conn.name === name ? { ...conn, ...config } : conn
            ),
          })
        },

        testConnection: async (name) => {
          // Mock connection test
          get().updateConnection(name, { tested: false })

          await new Promise((resolve) => setTimeout(resolve, 1500))

          get().updateConnection(name, {
            tested: true,
            testSuccess: true,
            testMessage: 'Connection successful',
          })
        },

        // Validation
        canAnalyze: () => {
          const { projectInfo, files } = get()
          return (
            projectInfo.name.length >= 3 &&
            files.length > 0 &&
            files.every((f) => f.status === 'uploaded')
          )
        },

        canStartMigration: () => {
          const { analysisResults, connections } = get()
          if (!analysisResults) return false

          const requiredConnections = analysisResults.detectedConnections.filter(
            (c) => c.required
          )

          return requiredConnections.every((rc) => {
            const conn = connections.find((c) => c.name === rc.name)
            return conn && conn.tested && conn.testSuccess
          })
        },

        // Global
        reset: () => {
          set(initialState)
        },
      }),
      {
        name: 'migration-setup-storage',
        skipHydration: true,
        partialize: (state) => ({
          ...state,
          // Exclude File objects from persistence (cannot be serialized)
          files: state.files.map(({ file, ...rest }) => rest) as any,
        }),
      }
    )
  )
)
