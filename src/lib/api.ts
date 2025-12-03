/**
 * API client for Migration Accelerator backend
 * Centralized API calls to Python FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ApiError {
  message: string
  status: number
  details?: unknown
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const error: ApiError = {
          message: `API Error: ${response.statusText}`,
          status: response.status,
        }

        try {
          error.details = await response.json()
        } catch {
          // Response not JSON
        }

        throw error
      }

      return response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Unknown API error')
    }
  }

  // Dashboard APIs
  async getMetrics(period: string = '30d') {
    return this.request<{
      totalJobs: { value: number; trend: string }
      completed: { value: number; percentage: string }
      inProgress: { value: number; percentage: string }
      successRate: { value: string; trend: string; positive: boolean }
    }>(`/api/v1/metrics?period=${period}`)
  }

  async getUsageStats(period: string = '30d') {
    return this.request<Array<{
      label: string
      current: number
      limit: number
      percentage: number
    }>>(`/api/v1/usage?period=${period}`)
  }

  async getQualityScore(period: string = '7d') {
    return this.request<{
      score: number
      target: number
      trend: string
      metrics: Array<{
        label: string
        value: string
        status: 'success' | 'warning' | 'error'
        reviewCount?: number
      }>
    }>(`/api/v1/quality-score?period=${period}`)
  }

  async getAlerts(limit: number = 10) {
    return this.request<Array<{
      id: string
      migrationName: string
      severity: 'error' | 'warning'
      message: string
      timestamp: string
    }>>(`/api/v1/alerts?limit=${limit}`)
  }

  // Migrations APIs
  async getMigrations(params: {
    status?: string
    pattern?: string
    search?: string
    page?: number
    limit?: number
  }) {
    const query = new URLSearchParams()
    if (params.status) query.set('status', params.status)
    if (params.pattern) query.set('pattern', params.pattern)
    if (params.search) query.set('search', params.search)
    if (params.page) query.set('page', params.page.toString())
    if (params.limit) query.set('limit', params.limit.toString())

    return this.request<{
      data: Array<{
        id: string
        name: string
        pattern: string
        complexity: number
        status: 'completed' | 'in_progress' | 'failed' | 'pending_review'
        qualityScore?: number
        businessRules: number
        businessRulesNeedReview: number
        createdAt: string
        updatedAt: string
        progress?: number
      }>
      total: number
      page: number
      limit: number
    }>(`/api/v1/migrations?${query.toString()}`)
  }

  async getRecentMigrations(limit: number = 5) {
    return this.request<Array<{
      id: string
      name: string
      pattern: string
      complexity: number
      status: 'completed' | 'in_progress' | 'failed'
      validationScore?: number
      timestamp: string
      progress?: number
    }>>(`/api/v1/migrations/recent?limit=${limit}`)
  }

  async getMigration(id: string) {
    return this.request<{
      id: string
      name: string
      status: 'completed' | 'in_progress' | 'failed' | 'pending_review'
      pattern: string
      complexity: number
      qualityScore?: number
      updatedAt: string
    }>(`/api/v1/migrations/${id}`)
  }

  async createMigration(data: { file?: File; xmlContent?: string }) {
    const formData = new FormData()
    if (data.file) {
      formData.append('file', data.file)
    } else if (data.xmlContent) {
      formData.append('xml_content', data.xmlContent)
    }

    return this.request<{
      id: string
      message: string
    }>('/api/v1/migrations', {
      method: 'POST',
      headers: {},
      body: formData,
    })
  }

  async analyzeMigration(id: string) {
    return this.request<{
      mappingName: string
      pattern: string
      complexity: number
      estimatedTime: string
      transformations: number
      expressions: number
      lookups: number
      businessRules: number
      dependencies: string[]
      warnings: string[]
    }>(`/api/v1/migrations/${id}/analyze`, {
      method: 'POST',
    })
  }

  async convertMigration(id: string) {
    return this.request<{
      message: string
      jobId: string
    }>(`/api/v1/migrations/${id}/convert`, {
      method: 'POST',
    })
  }

  async deleteMigration(id: string) {
    return this.request<{ message: string }>(`/api/v1/migrations/${id}`, {
      method: 'DELETE',
    })
  }

  // Migration Detail APIs
  async getOverviewData(id: string) {
    return this.request(`/api/v1/migrations/${id}/overview`)
  }

  async getValidationData(id: string) {
    return this.request(`/api/v1/migrations/${id}/validation`)
  }

  async getBusinessRules(id: string) {
    return this.request(`/api/v1/migrations/${id}/business-rules`)
  }

  async getHistory(id: string) {
    return this.request(`/api/v1/migrations/${id}/history`)
  }

  // Settings APIs
  async getSettings(section: string) {
    return this.request(`/api/v1/settings/${section}`)
  }

  async updateSettings(section: string, data: unknown) {
    return this.request(`/api/v1/settings/${section}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }
}

export const api = new ApiClient(API_BASE_URL)
export type { ApiError }
