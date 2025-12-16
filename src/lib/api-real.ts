/**
 * Real Backend API Client - Connected to FastAPI Database
 *
 * This replaces mock data with real API calls to the FastAPI backend.
 * Uses JWT authentication and connects to PostgreSQL database.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ============================================================================
// Types
// ============================================================================

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: {
    id: string
    email: string
    tenant_id: string
    tenant_name: string
    subscription_tier: string
  }
}

export interface User {
  id: string
  email: string
  tenant_id: string
  tenant_name: string
  subscription_tier: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  status: string
  created_at: string
  updated_at: string
  total_jobs: number
  completed_jobs: number
  failed_jobs: number
  complexity: number | null
  quality_score: number | null
  automation_rate: number | null
  source_path: string | null
  target_path: string | null
  tags: string[]
}

export interface ProjectCreate {
  name: string
  description?: string
  source_platform_version?: string
  target_platform_version?: string
  validation_threshold?: number
  enable_optimization?: boolean
}

export interface ProjectUpdate {
  name?: string
  description?: string
  status?: string
  tags?: string[]
  source_path?: string
  target_path?: string
}

export interface ProjectsListResponse {
  data: Project[]
  total: number
  page: number
  limit: number
}

export interface Job {
  id: string
  project_id: string
  informatica_mapping_name: string
  informatica_folder_path: string
  description: string | null
  status: string
  priority: number
  created_at: string
  updated_at: string
  complexity: number | null
  row_count: number | null
  business_rules_count: number
  business_rules_need_review: number
  automation_rate: number | null
  conversion_method: string | null
  manual_effort_hours: number | null
  tags: string[]
}

export interface JobCreate {
  project_id: string
  informatica_mapping_name: string
  informatica_folder_path: string
  description?: string
  priority?: number
  tags?: string[]
}

export interface JobsListResponse {
  data: Job[]
  total: number
  page: number
  limit: number
}

export interface DashboardStats {
  total_projects: {
    value: string
    label: string
    trend: string
    positive: boolean
  }
  total_jobs: {
    value: string
    label: string
    trend: string
    positive: boolean
  }
  completed_jobs: {
    value: string
    label: string
    trend: string
    positive: boolean
  }
  success_rate: {
    value: string
    label: string
    trend: string
    positive: boolean
  }
  avg_automation_rate: {
    value: string
    label: string
    trend: string
    positive: boolean
  }
}

export interface FileUploadResponse {
  filename: string
  original_filename: string
  size: number
  upload_path: string
  uploaded_at: string
}

export interface FileListResponse {
  files: FileUploadResponse[]
  total_count: number
  total_size: number
}

export interface FileAnalysisResponse {
  status: string
  object_counts: {
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
  automation_rate: number
  time_savings_estimate: number
  warnings: string[]
  errors: string[]
}

// ============================================================================
// API Client
// ============================================================================

class RealAPIClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    // Load token from localStorage on init (client-side only)
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
        // Also set cookie for middleware authentication check
        document.cookie = `auth-token=${token}; path=/; max-age=2592000; SameSite=Lax`
      } else {
        localStorage.removeItem('auth_token')
        // Clear cookie on logout
        document.cookie = 'auth-token=; path=/; max-age=0'
      }
    }
  }

  getToken(): string | null {
    return this.token
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: response.statusText,
      }))

      // Handle 401 Unauthorized - clear token
      if (response.status === 401) {
        this.setToken(null)
      }

      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T
    }

    return response.json()
  }

  // ========================================================================
  // Authentication
  // ========================================================================

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    this.setToken(response.access_token)
    return response
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/api/auth/me')
  }

  logout() {
    this.setToken(null)
  }

  // ========================================================================
  // Projects (replaces /api/v1/migrations)
  // ========================================================================

  async getProjects(params?: {
    status?: string
    search?: string
    page?: number
    limit?: number
  }): Promise<ProjectsListResponse> {
    const query = new URLSearchParams()
    if (params?.status) query.append('status', params.status)
    if (params?.search) query.append('search', params.search)
    if (params?.page) query.append('page', params.page.toString())
    if (params?.limit) query.append('limit', params.limit.toString())

    const endpoint = `/api/projects${query.toString() ? `?${query}` : ''}`
    return this.request<ProjectsListResponse>(endpoint)
  }

  async getProject(id: string): Promise<Project> {
    return this.request<Project>(`/api/projects/${id}`)
  }

  async createProject(data: ProjectCreate): Promise<Project> {
    return this.request<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProject(
    id: string,
    data: ProjectUpdate
  ): Promise<Project> {
    return this.request<Project>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProject(id: string): Promise<void> {
    await this.request<void>(`/api/projects/${id}`, {
      method: 'DELETE',
    })
  }

  // ========================================================================
  // Jobs
  // ========================================================================

  async getJobs(params?: {
    project_id?: string
    status?: string
    search?: string
    page?: number
    limit?: number
  }): Promise<JobsListResponse> {
    const query = new URLSearchParams()
    if (params?.project_id) query.append('project_id', params.project_id)
    if (params?.status) query.append('status', params.status)
    if (params?.search) query.append('search', params.search)
    if (params?.page) query.append('page', params.page.toString())
    if (params?.limit) query.append('limit', params.limit.toString())

    const endpoint = `/api/jobs${query.toString() ? `?${query}` : ''}`
    return this.request<JobsListResponse>(endpoint)
  }

  async getJob(id: string): Promise<Job> {
    return this.request<Job>(`/api/jobs/${id}`)
  }

  async createJob(data: JobCreate): Promise<Job> {
    return this.request<Job>('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateJob(id: string, data: Partial<JobCreate>): Promise<Job> {
    return this.request<Job>(`/api/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteJob(id: string): Promise<void> {
    await this.request<void>(`/api/jobs/${id}`, {
      method: 'DELETE',
    })
  }

  async analyzeJob(id: string): Promise<any> {
    return this.request(`/api/jobs/${id}/analyze`, {
      method: 'POST',
    })
  }

  async convertJob(id: string): Promise<any> {
    return this.request(`/api/jobs/${id}/convert`, {
      method: 'POST',
    })
  }

  // ========================================================================
  // Files
  // ========================================================================

  async uploadFiles(projectId: string, files: File[]): Promise<FileUploadResponse[]> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const url = `${this.baseUrl}/api/projects/${projectId}/files/upload`
    const headers: Record<string, string> = {}

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: response.statusText,
      }))

      if (response.status === 401) {
        this.setToken(null)
      }

      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async listFiles(projectId: string): Promise<FileListResponse> {
    return this.request<FileListResponse>(`/api/projects/${projectId}/files`)
  }

  async deleteFile(projectId: string, filename: string): Promise<void> {
    await this.request<void>(`/api/projects/${projectId}/files/${filename}`, {
      method: 'DELETE',
    })
  }

  async analyzeFiles(projectId: string): Promise<FileAnalysisResponse> {
    return this.request<FileAnalysisResponse>(`/api/projects/${projectId}/files/analyze`, {
      method: 'POST',
    })
  }

  // ========================================================================
  // Dashboard
  // ========================================================================

  async getDashboardStats(period: '7d' | '30d' | '90d' | 'all' = '30d'): Promise<DashboardStats> {
    return this.request<DashboardStats>(`/api/dashboard/stats?period=${period}`)
  }

  async getJobsOverTime(period: '7d' | '30d' | '90d' = '30d'): Promise<any> {
    return this.request(`/api/dashboard/charts/jobs-over-time?period=${period}`)
  }

  async getSuccessRate(period: '7d' | '30d' | '90d' = '30d'): Promise<any> {
    return this.request(`/api/dashboard/charts/success-rate?period=${period}`)
  }

  async getRecentActivity(limit: number = 10): Promise<any> {
    return this.request(`/api/dashboard/recent?limit=${limit}`)
  }

  async getQualityMetrics(): Promise<any> {
    return this.request('/api/dashboard/quality-metrics')
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const apiReal = new RealAPIClient(API_BASE_URL)

// ============================================================================
// Convenience exports for cleaner imports
// ============================================================================

export const authAPI = {
  login: (credentials: LoginRequest) => apiReal.login(credentials),
  getCurrentUser: () => apiReal.getCurrentUser(),
  logout: () => apiReal.logout(),
  isAuthenticated: () => apiReal.isAuthenticated(),
}

export const projectsAPI = {
  list: (params?: Parameters<typeof apiReal.getProjects>[0]) => apiReal.getProjects(params),
  get: (id: string) => apiReal.getProject(id),
  create: (data: ProjectCreate) => apiReal.createProject(data),
  update: (id: string, data: ProjectUpdate) => apiReal.updateProject(id, data),
  delete: (id: string) => apiReal.deleteProject(id),
}

export const jobsAPI = {
  list: (params?: Parameters<typeof apiReal.getJobs>[0]) => apiReal.getJobs(params),
  get: (id: string) => apiReal.getJob(id),
  create: (data: JobCreate) => apiReal.createJob(data),
  update: (id: string, data: Partial<JobCreate>) => apiReal.updateJob(id, data),
  delete: (id: string) => apiReal.deleteJob(id),
  analyze: (id: string) => apiReal.analyzeJob(id),
  convert: (id: string) => apiReal.convertJob(id),
}

export const filesAPI = {
  upload: (projectId: string, files: File[]) => apiReal.uploadFiles(projectId, files),
  list: (projectId: string) => apiReal.listFiles(projectId),
  delete: (projectId: string, filename: string) => apiReal.deleteFile(projectId, filename),
  analyze: (projectId: string) => apiReal.analyzeFiles(projectId),
}

export const dashboardAPI = {
  stats: (period?: Parameters<typeof apiReal.getDashboardStats>[0]) => apiReal.getDashboardStats(period),
  jobsOverTime: (period?: Parameters<typeof apiReal.getJobsOverTime>[0]) => apiReal.getJobsOverTime(period),
  successRate: (period?: Parameters<typeof apiReal.getSuccessRate>[0]) => apiReal.getSuccessRate(period),
  recentActivity: (limit?: number) => apiReal.getRecentActivity(limit),
  qualityMetrics: () => apiReal.getQualityMetrics(),
}
