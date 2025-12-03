/**
 * Migration Wizard State Management
 * Zustand store for managing the 4-step migration wizard state
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// ============================================================================
// Types
// ============================================================================

export interface ProjectInfo {
  name: string
  description?: string
  sourceSystem: 'informatica_9' | 'informatica_10' | 'informatica_10.5'
  targetSystem: 'talend'
  workspaceId?: string
  assignedTo?: string
  tags?: string[]
}

export interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  uploadProgress: number
  status: 'pending' | 'uploading' | 'uploaded' | 'analyzing' | 'analyzed' | 'error'
  error?: string
}

export interface AnalysisResults {
  status: 'idle' | 'processing' | 'complete' | 'error'

  // Object counts
  objectCounts: {
    mappings: number
    workflows: number
    sessions: number
    mapplets: number
    sources: number
    targets: number
    connections: number
    transformations: number
  }

  // Pattern distribution
  patterns: Array<{
    name: string
    count: number
    percentage: number
  }>

  // Complexity analysis
  complexity: {
    average: number
    distribution: {
      low: number    // 0-40
      medium: number // 41-70
      high: number   // 71-100
    }
  }

  // File details
  files: Array<{
    name: string
    type: 'mapping' | 'workflow' | 'session' | 'mapplet' | 'source' | 'target' | 'connection' | 'transformation' | 'parameter' | 'unknown'
    pattern?: string
    complexity?: number
    status: 'ready' | 'warning' | 'error'
    warnings?: string[]
    errors?: string[]
  }>

  // Metrics
  automationRate: number
  timeSavingsEstimate: number // hours
  manualWorkEstimate: number // hours

  // Warnings/Errors
  globalWarnings: string[]
  globalErrors: string[]
}

export interface DetectedConnection {
  name: string
  type: 'Oracle' | 'SQL Server' | 'MySQL' | 'PostgreSQL' | 'DB2' | 'Flat File' | 'FTP' | 'HTTP' | 'SAP' | 'Salesforce'
  usedInMappings: number
  usedInWorkflows: number
  configStatus: 'unconfigured' | 'linked' | 'configured' | 'tested_success' | 'tested_failure'

  // If linked to existing connection
  linkedConnectionId?: string

  // If configured new
  config?: ConnectionConfig

  // Test result
  testResult?: {
    success: boolean
    message: string
    duration?: number
    timestamp?: Date
  }
}

export interface ConnectionConfig {
  // Database connections
  host?: string
  port?: number
  database?: string
  schema?: string
  username?: string
  password?: string

  // File connections
  filePath?: string
  ftpHost?: string
  ftpUser?: string
  ftpPassword?: string

  // Advanced
  connectionString?: string
  useSSL?: boolean
  additionalProperties?: Record<string, string>
}

export interface ValidationStatus {
  filesValid: boolean
  connectionsValid: boolean
  warnings: string[]
  blockers: string[]
}

// ============================================================================
// Store Interface
// ============================================================================

interface MigrationWizardState {
  // Current step (1-4)
  currentStep: 1 | 2 | 3 | 4

  // Step 1: Project Info
  projectInfo: ProjectInfo

  // Step 2: Upload & Detection
  uploadedFiles: UploadedFile[]
  analysisResults: AnalysisResults | null

  // Step 3: Connections
  detectedConnections: DetectedConnection[]

  // Step 4: Review
  validationStatus: ValidationStatus

  // Wizard state
  canProceed: boolean
  isSaving: boolean
  savedDraftId?: string

  // Actions
  setCurrentStep: (step: 1 | 2 | 3 | 4) => void
  nextStep: () => void
  prevStep: () => void

  // Step 1 actions
  setProjectInfo: (info: Partial<ProjectInfo>) => void
  validateStep1: () => boolean

  // Step 2 actions
  addFiles: (files: File[]) => void
  removeFile: (fileId: string) => void
  updateFileProgress: (fileId: string, progress: number) => void
  updateFileStatus: (fileId: string, status: UploadedFile['status']) => void
  setAnalysisResults: (results: AnalysisResults) => void
  validateStep2: () => boolean

  // Step 3 actions
  setDetectedConnections: (connections: DetectedConnection[]) => void
  updateConnection: (name: string, updates: Partial<DetectedConnection>) => void
  linkConnection: (name: string, existingConnectionId: string) => void
  configureConnection: (name: string, config: ConnectionConfig) => void
  testConnection: (name: string) => Promise<void>
  validateStep3: () => boolean

  // Step 4 actions
  updateValidationStatus: (status: Partial<ValidationStatus>) => void
  validateStep4: () => boolean

  // Global actions
  saveDraft: () => Promise<void>
  loadDraft: (draftId: string) => Promise<void>
  reset: () => void
  startMigration: () => Promise<string> // Returns migration ID
}

// ============================================================================
// Initial State
// ============================================================================

const initialState = {
  currentStep: 1 as const,

  projectInfo: {
    name: '',
    sourceSystem: 'informatica_10.5' as const,
    targetSystem: 'talend' as const,
  },

  uploadedFiles: [],
  analysisResults: null,
  detectedConnections: [],

  validationStatus: {
    filesValid: false,
    connectionsValid: false,
    warnings: [],
    blockers: [],
  },

  canProceed: false,
  isSaving: false,
}

// ============================================================================
// Store Implementation
// ============================================================================

export const useMigrationWizardStore = create<MigrationWizardState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // ====================================================================
        // Navigation
        // ====================================================================

        setCurrentStep: (step) => {
          set({ currentStep: step }, false, 'setCurrentStep')
        },

        nextStep: () => {
          const { currentStep, validateStep1, validateStep2, validateStep3 } = get()

          // Validate current step before proceeding
          let canProceed = false
          if (currentStep === 1) canProceed = validateStep1()
          else if (currentStep === 2) canProceed = validateStep2()
          else if (currentStep === 3) canProceed = validateStep3()

          if (!canProceed) {
            console.warn(`Cannot proceed from step ${currentStep} - validation failed`)
            return
          }

          if (currentStep < 4) {
            set({ currentStep: (currentStep + 1) as 1 | 2 | 3 | 4 }, false, 'nextStep')
          }
        },

        prevStep: () => {
          const { currentStep } = get()
          if (currentStep > 1) {
            set({ currentStep: (currentStep - 1) as 1 | 2 | 3 | 4 }, false, 'prevStep')
          }
        },

        // ====================================================================
        // Step 1: Project Info
        // ====================================================================

        setProjectInfo: (info) => {
          set((state) => ({
            projectInfo: { ...state.projectInfo, ...info },
          }), false, 'setProjectInfo')
        },

        validateStep1: () => {
          const { projectInfo } = get()

          // Project name is required and must be at least 3 characters
          if (!projectInfo.name || projectInfo.name.trim().length < 3) {
            return false
          }

          return true
        },

        // ====================================================================
        // Step 2: Upload & Detection
        // ====================================================================

        addFiles: (files) => {
          const newFiles: UploadedFile[] = files.map((file) => ({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadProgress: 0,
            status: 'pending',
          }))

          set((state) => ({
            uploadedFiles: [...state.uploadedFiles, ...newFiles],
          }), false, 'addFiles')
        },

        removeFile: (fileId) => {
          set((state) => ({
            uploadedFiles: state.uploadedFiles.filter((f) => f.id !== fileId),
          }), false, 'removeFile')
        },

        updateFileProgress: (fileId, progress) => {
          set((state) => ({
            uploadedFiles: state.uploadedFiles.map((f) =>
              f.id === fileId ? { ...f, uploadProgress: progress } : f
            ),
          }), false, 'updateFileProgress')
        },

        updateFileStatus: (fileId, status) => {
          set((state) => ({
            uploadedFiles: state.uploadedFiles.map((f) =>
              f.id === fileId ? { ...f, status } : f
            ),
          }), false, 'updateFileStatus')
        },

        setAnalysisResults: (results) => {
          set({ analysisResults: results }, false, 'setAnalysisResults')
        },

        validateStep2: () => {
          const { uploadedFiles, analysisResults } = get()

          // Must have at least 1 file uploaded
          if (uploadedFiles.length === 0) {
            return false
          }

          // All files must be uploaded successfully
          const allUploaded = uploadedFiles.every(
            (f) => f.status === 'uploaded' || f.status === 'analyzed'
          )
          if (!allUploaded) {
            return false
          }

          // Analysis must be complete
          if (!analysisResults || analysisResults.status !== 'complete') {
            return false
          }

          // Must not have blocking errors
          if (analysisResults.globalErrors.length > 0) {
            return false
          }

          return true
        },

        // ====================================================================
        // Step 3: Connections
        // ====================================================================

        setDetectedConnections: (connections) => {
          set({ detectedConnections: connections }, false, 'setDetectedConnections')
        },

        updateConnection: (name, updates) => {
          set((state) => ({
            detectedConnections: state.detectedConnections.map((conn) =>
              conn.name === name ? { ...conn, ...updates } : conn
            ),
          }), false, 'updateConnection')
        },

        linkConnection: (name, existingConnectionId) => {
          set((state) => ({
            detectedConnections: state.detectedConnections.map((conn) =>
              conn.name === name
                ? { ...conn, linkedConnectionId: existingConnectionId, configStatus: 'linked' }
                : conn
            ),
          }), false, 'linkConnection')
        },

        configureConnection: (name, config) => {
          set((state) => ({
            detectedConnections: state.detectedConnections.map((conn) =>
              conn.name === name
                ? { ...conn, config, configStatus: 'configured' }
                : conn
            ),
          }), false, 'configureConnection')
        },

        testConnection: async (name) => {
          const { detectedConnections, updateConnection } = get()
          const connection = detectedConnections.find((c) => c.name === name)

          if (!connection) return

          // Update status to testing
          updateConnection(name, { configStatus: 'configured' })

          try {
            // TODO: Call actual API to test connection
            const startTime = Date.now()

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000))

            const duration = Date.now() - startTime

            // Success
            updateConnection(name, {
              configStatus: 'tested_success',
              testResult: {
                success: true,
                message: 'Connection successful',
                duration,
                timestamp: new Date(),
              },
            })
          } catch (error) {
            // Failure
            updateConnection(name, {
              configStatus: 'tested_failure',
              testResult: {
                success: false,
                message: error instanceof Error ? error.message : 'Connection failed',
                timestamp: new Date(),
              },
            })
          }
        },

        validateStep3: () => {
          const { detectedConnections } = get()

          // If no connections detected, that's OK (can proceed without)
          if (detectedConnections.length === 0) {
            return true
          }

          // At least one connection should be configured or linked
          const hasConfiguredConnection = detectedConnections.some(
            (conn) =>
              conn.configStatus === 'linked' ||
              conn.configStatus === 'configured' ||
              conn.configStatus === 'tested_success'
          )

          // Can proceed even without connections configured (with warning)
          // For strict validation, change this to require at least one
          return true
        },

        // ====================================================================
        // Step 4: Review
        // ====================================================================

        updateValidationStatus: (status) => {
          set((state) => ({
            validationStatus: { ...state.validationStatus, ...status },
          }), false, 'updateValidationStatus')
        },

        validateStep4: () => {
          const { validationStatus } = get()

          // Must not have blocking errors
          if (validationStatus.blockers.length > 0) {
            return false
          }

          // Files and connections must be valid
          return validationStatus.filesValid
        },

        // ====================================================================
        // Global Actions
        // ====================================================================

        saveDraft: async () => {
          set({ isSaving: true }, false, 'saveDraft:start')

          try {
            const state = get()

            // TODO: Call API to save draft
            const draftId = `draft-${Date.now()}`

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            set({ savedDraftId: draftId, isSaving: false }, false, 'saveDraft:success')
          } catch (error) {
            set({ isSaving: false }, false, 'saveDraft:error')
            throw error
          }
        },

        loadDraft: async (draftId) => {
          try {
            // TODO: Call API to load draft
            // const draft = await api.loadDraft(draftId)

            // For now, no-op
            console.log('Loading draft:', draftId)
          } catch (error) {
            console.error('Failed to load draft:', error)
            throw error
          }
        },

        reset: () => {
          set(initialState, false, 'reset')
        },

        startMigration: async () => {
          const state = get()

          // Final validation
          if (!state.validateStep4()) {
            throw new Error('Cannot start migration - validation failed')
          }

          set({ isSaving: true }, false, 'startMigration:start')

          try {
            // TODO: Call API to create migration
            const migrationId = `migration-${Date.now()}`

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000))

            set({ isSaving: false }, false, 'startMigration:success')

            return migrationId
          } catch (error) {
            set({ isSaving: false }, false, 'startMigration:error')
            throw error
          }
        },
      }),
      {
        name: 'migration-wizard-storage',
        partialize: (state) => ({
          // Only persist necessary data
          currentStep: state.currentStep,
          projectInfo: state.projectInfo,
          savedDraftId: state.savedDraftId,
        }),
      }
    ),
    { name: 'MigrationWizardStore' }
  )
)
