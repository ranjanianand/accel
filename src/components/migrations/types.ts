// Migration data types and interfaces

export interface ValidationMetrics {
  dataLineage: number      // Data lineage validation %
  businessRules: number    // Business rules validation %
  performance: number      // Performance vs baseline %
  errorHandling: number    // Error handling coverage %
  dataQuality: number      // Data quality checks %
  schemaMatch: number      // Schema matching %
}

export interface ErrorDetail {
  type: string
  count: number
  severity: 'critical' | 'high' | 'medium' | 'low'
}

export interface MigrationRow {
  id: string
  name: string
  description?: string  // Migration description/summary
  tags?: string[]       // Tags for categorization
  pattern: string
  totalJobs?: number  // Total number of jobs in this migration
  complexity: number
  status: 'completed' | 'in_progress' | 'failed' | 'pending_review'

  // Validation breakdown (replaces single qualityScore)
  validation?: ValidationMetrics
  qualityScore?: number  // Overall score (average of validation metrics)

  // Business rules
  businessRules: number
  businessRulesNeedReview: number

  // Timestamps
  createdAt: Date
  updatedAt: Date

  // Progress
  progress?: number

  // Data metrics
  rowCount?: number
  executionDuration?: number

  // Error details (enhanced)
  errorTypes?: string[]
  errorDetails?: ErrorDetail[]

  // Source/Target paths (enhanced)
  sourcePath?: string
  targetPath?: string
  sourceVersion?: string  // e.g., "PowerCenter 10.5"
  targetVersion?: string  // e.g., "Talend 8.0"

  // Automation metrics
  automationRate?: number           // % automated (92-97%)
  conversionMethod?: string         // "AST Parser" | "Pattern Matching" | "Manual"
  manualEffortRequired?: number     // Hours of manual work needed
}
