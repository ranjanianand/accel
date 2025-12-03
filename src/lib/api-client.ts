/**
 * API Client for Migration Wizard
 * Connects frontend to backend wizard endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ============================================================================
// Types (matching backend models)
// ============================================================================

export interface ProjectInfoCreate {
  name: string
  description?: string
  sourceSystem: string
  targetSystem: string
  tags?: string[]
  workspaceId?: string
  assignedTo?: string
}

export interface FileUploadResponse {
  id: string
  name: string
  size: number
  type: string
  status: string
  uploadProgress: number
}

export interface AnalysisResponse {
  status: string
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
  patterns: Array<{
    name: string
    count: number
    percentage: number
  }>
  complexity: {
    average: number
    distribution: {
      low: number
      medium: number
      high: number
    }
  }
  automationRate: number
  timeSavingsEstimate: number
  manualWorkEstimate: number
  files: Array<{
    name: string
    type: string
    pattern?: string
    complexity?: number
    status: string
    warnings?: string[]
    errors?: string[]
  }>
  globalWarnings: string[]
  globalErrors: string[]
  detectedConnections: Array<{
    name: string
    type: string
    usedInMappings: number
    usedInWorkflows: number
    configStatus: string
  }>
}

export interface ConnectionConfig {
  host?: string
  port?: number
  database?: string
  schema?: string
  username?: string
  password?: string
  filePath?: string
  ftpHost?: string
  ftpUser?: string
  ftpPassword?: string
  connectionString?: string
  useSSL?: boolean
  additionalProperties?: Record<string, string>
}

export interface ConnectionTestRequest {
  connectionName: string
  connectionType: string
  config: ConnectionConfig
}

export interface ConnectionTestResponse {
  success: boolean
  message: string
  duration?: number
}

export interface MigrationStartRequest {
  projectInfo: ProjectInfoCreate
  fileIds: string[]
  connectionConfigs?: Array<{
    name: string
    type: string
    config: ConnectionConfig
  }>
}

export interface MigrationStartResponse {
  migrationId: string
  status: string
  estimatedCompletionTime: string
}

// ============================================================================
// API Client Class
// ============================================================================

class WizardAPIClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  // ==========================================================================
  // Step 2: File Upload & Analysis
  // ==========================================================================

  async uploadFiles(files: File[]): Promise<FileUploadResponse[]> {
    const formData = new FormData()

    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await fetch(`${this.baseURL}/api/wizard/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'File upload failed')
    }

    return response.json()
  }

  async analyzeFiles(fileIds: string[]): Promise<AnalysisResponse> {
    const response = await fetch(`${this.baseURL}/api/wizard/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileIds }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Analysis failed')
    }

    return response.json()
  }

  // ==========================================================================
  // Step 3: Connection Testing
  // ==========================================================================

  async testConnection(
    connectionName: string,
    connectionType: string,
    config: ConnectionConfig
  ): Promise<ConnectionTestResponse> {
    const response = await fetch(`${this.baseURL}/api/wizard/connections/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        connectionName,
        connectionType,
        config,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Connection test failed')
    }

    return response.json()
  }

  // ==========================================================================
  // Step 4: Start Migration
  // ==========================================================================

  async startMigration(request: MigrationStartRequest): Promise<MigrationStartResponse> {
    const response = await fetch(`${this.baseURL}/api/wizard/migrations/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Migration start failed')
    }

    return response.json()
  }
}

// Export singleton instance
export const wizardAPI = new WizardAPIClient()
