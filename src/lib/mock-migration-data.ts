// Comprehensive mock data for migration results view

export interface ExecutiveSummaryData {
  migration: {
    id: string
    name: string
    description?: string
    tags?: string[]
    status: 'completed' | 'in_progress' | 'failed' | 'pending_review'
    completedAt: Date
    duration: number // minutes
    complexity: number
    qualityScore: number
  }
  metrics: {
    costSavings: number
    timeSavings: { min: number; max: number }
    qualityScore: number
    automationRate: number
    totalJobs: number
    automatedJobs: number
    manualJobs: number
  }
  breakdown: {
    lowComplexity: { count: number; automation: number }
    mediumComplexity: { count: number; automation: number }
    highComplexity: { count: number; automation: number }
  }
  roi: {
    investment: number
    savings: number
    netBenefit: number
    roiPercentage: number
    paybackMonths: number
  }
  achievements: Array<{ text: string; type: 'success' | 'warning' }>
  timeline: Array<{ stage: string; duration: number; percentage: number }>
  patternDistribution: Array<{ pattern: string; count: number; percentage: number }>
  sourceTarget: {
    source: { platform: string; version: string }
    target: { platform: string; version: string }
    generated: { jobs: number; connections: number; routines: number; contexts: number }
  }
}

export interface ComponentMapping {
  informaticaSource: string
  talendTarget: string
  pattern: string
  status: 'auto' | 'manual'
  complexity: 'low' | 'medium' | 'high'
}

export interface ExpressionConversion {
  informaticaExpr: string
  talendExpr: string
  conversionMethod: string
  complexity: 'low' | 'medium' | 'high'
}

export interface TechnicalDetailsData {
  componentMappings: ComponentMapping[]
  expressionConversions: ExpressionConversion[]
  dependencies: {
    criticalPath: Array<{ job: string; dependencies: string[] }>
    impactAnalysis: { totalChains: number; affectedJobs: number }
  }
  generatedFiles: {
    jobs: number
    connections: number
    routines: number
    contexts: number
    metadata: number
    totalSize: string
  }
}

export interface ValidationEngine {
  name: string
  score: number
  status: 'pass' | 'warning' | 'fail'
  details: {
    tested: number
    passed: number
    failed: number
    warnings: number
  }
  description: string
  expandedContent?: React.ReactNode
}

export interface ValidationResultsData {
  engines: ValidationEngine[]
  overallScore: number
  testEvidence: Array<{
    name: string
    format: string
    size: string
    downloadUrl: string
  }>
  optimizations: Array<{
    name: string
    jobsAffected: number
    percentageAffected: number
    improvement: string
  }>
}

export interface PerformanceMetric {
  jobName: string
  informatica: number // seconds
  talend: number // seconds
  improvement: number // percentage
}

export interface PerformanceData {
  executionTimes: PerformanceMetric[]
  resourceUtilization: {
    metric: string
    informatica: string
    talend: string
    change: string
  }[]
  optimizations: Array<{
    name: string
    jobsAffected: number
    percentageAffected: number
    improvement: string
  }>
}

export interface FileDeliverable {
  name: string
  description: string
  format: string
  size: string
  lastGenerated: Date
  downloadUrl: string
  type: 'primary' | 'documentation' | 'source'
}

export interface FilesData {
  primaryDeliverables: FileDeliverable[]
  documentation: FileDeliverable[]
  sourceFiles: FileDeliverable[]
  fileTree: any // Tree structure for file browser
}

export interface ManualReviewItem {
  jobName: string
  complexity: 'high' | 'medium' | 'low'
  reason: string
  details: string
  resolution: string
  timeSpent: number
  status: 'resolved' | 'pending'
  riskLevel: 'low' | 'medium' | 'high'
}

export interface IssuesData {
  manualReviews: ManualReviewItem[]
  warnings: Array<{
    description: string
    impact: string
    action: string
  }>
  riskMatrix: Array<{
    category: string
    severity: 'none' | 'low' | 'medium' | 'high' | 'critical'
    likelihood: string
    mitigation: string
  }>
  auditTrail: Array<{
    timestamp: Date
    event: string
  }>
}

export interface ExportData {
  templates: Array<{
    id: string
    name: string
    description: string
    format: string[]
  }>
}

// Generate mock data
export function getMockMigrationData(id: string): {
  executive: ExecutiveSummaryData
  technical: TechnicalDetailsData
  validation: ValidationResultsData
  performance: PerformanceData
  files: FilesData
  issues: IssuesData
  export: ExportData
} {
  return {
    executive: {
      migration: {
        id,
        name: 'Customer DWH Migration',
        description: 'Complete migration of Customer Data Warehouse including dimension loads, fact tables, CDC processes, and aggregation jobs from Informatica PowerCenter to Talend. Includes 65 jobs across multiple complexity levels with 97% automation rate.',
        tags: ['Production', 'Customer DWH', 'High Priority', 'SCD Type 2'],
        status: 'completed',
        completedAt: new Date('2024-11-28T09:42:00'),
        duration: 15,
        complexity: 67,
        qualityScore: 99.8,
      },
      metrics: {
        costSavings: 175000,
        timeSavings: { min: 410, max: 520 },
        qualityScore: 99.7,
        automationRate: 97,
        totalJobs: 65,
        automatedJobs: 63,
        manualJobs: 2,
      },
      breakdown: {
        lowComplexity: { count: 15, automation: 100 },
        mediumComplexity: { count: 42, automation: 97 },
        highComplexity: { count: 8, automation: 75 },
      },
      roi: {
        investment: 15000,
        savings: 175000,
        netBenefit: 160000,
        roiPercentage: 1067,
        paybackMonths: 1.2,
      },
      achievements: [
        { text: 'Migrated 65 jobs from Informatica PowerCenter 10.5 to Talend 8.0', type: 'success' },
        { text: '99.7% validation pass rate across 6 quality dimensions', type: 'success' },
        { text: 'Zero data loss - 100% data lineage preservation verified', type: 'success' },
        { text: 'All business rules validated and preserved', type: 'success' },
        { text: 'Performance optimized - 28% faster than Informatica baseline', type: 'success' },
        { text: '2 jobs required manual expert review (45 minutes total effort)', type: 'warning' },
      ],
      timeline: [
        { stage: 'Setup', duration: 2, percentage: 13 },
        { stage: 'Analysis', duration: 3, percentage: 20 },
        { stage: 'Discovery', duration: 2, percentage: 13 },
        { stage: 'Conversion', duration: 5, percentage: 33 },
        { stage: 'Validation', duration: 3, percentage: 20 },
      ],
      patternDistribution: [
        { pattern: 'SCD Type 2', count: 18, percentage: 28 },
        { pattern: 'Expression Transform', count: 15, percentage: 23 },
        { pattern: 'Lookup', count: 12, percentage: 18 },
        { pattern: 'Aggregation', count: 10, percentage: 15 },
        { pattern: 'Filter', count: 10, percentage: 15 },
      ],
      sourceTarget: {
        source: { platform: 'Informatica PowerCenter', version: '10.5' },
        target: { platform: 'Talend', version: '8.0' },
        generated: { jobs: 65, connections: 12, routines: 8, contexts: 4 },
      },
    },
    technical: {
      componentMappings: [
        { informaticaSource: 'SQ_CUSTOMER_SRC', talendTarget: 'tOracleInput_1', pattern: 'Source Qualifier', status: 'auto', complexity: 'low' },
        { informaticaSource: 'EXP_CUSTOMER_XFORM', talendTarget: 'tMap_1', pattern: 'Expression', status: 'auto', complexity: 'medium' },
        { informaticaSource: 'LKP_ADDRESS', talendTarget: 'tMap_1 (Lookup)', pattern: 'Lookup', status: 'auto', complexity: 'medium' },
        { informaticaSource: 'FIL_ACTIVE_ONLY', talendTarget: 'tFilterRow_1', pattern: 'Filter', status: 'auto', complexity: 'low' },
        { informaticaSource: 'AGG_SALES_TOTAL', talendTarget: 'tAggregateRow_1', pattern: 'Aggregation', status: 'manual', complexity: 'high' },
        { informaticaSource: 'UPD_STRATEGY_SCD2', talendTarget: 'tMap_2', pattern: 'Update Strategy', status: 'auto', complexity: 'high' },
        { informaticaSource: 'TGT_CUSTOMER_DIM', talendTarget: 'tOracleOutput_1', pattern: 'Target', status: 'auto', complexity: 'low' },
      ],
      expressionConversions: [
        { informaticaExpr: "TO_DATE('2024-01-15', 'YYYY-MM-DD')", talendExpr: 'TalendDate.parseDate("2024-01-15", "yyyy-MM-dd")', conversionMethod: 'AST Parser', complexity: 'low' },
        { informaticaExpr: 'IIF(ISNULL(FIELD), 0, FIELD)', talendExpr: '(FIELD == null ? 0 : FIELD)', conversionMethod: 'AST Parser', complexity: 'low' },
        { informaticaExpr: "DECODE(STATUS, 'A', 'Active', 'I', 'Inactive', 'Unknown')", talendExpr: 'switch statement', conversionMethod: 'AST Parser', complexity: 'medium' },
        { informaticaExpr: 'LOOKUP(LKP_RATES, CURRENCY_ID)', talendExpr: 'tMap lookup table', conversionMethod: 'Pattern Matching', complexity: 'medium' },
      ],
      dependencies: {
        criticalPath: [
          { job: 'LKP_CURRENCY_RATES', dependencies: [] },
          { job: 'DIM_CUSTOMER_MASTER', dependencies: ['LKP_CURRENCY_RATES'] },
          { job: 'FACT_CUSTOMER_ORDERS', dependencies: ['DIM_CUSTOMER_MASTER', 'DIM_PRODUCT_MASTER'] },
          { job: 'AGG_CUSTOMER_LTV', dependencies: ['FACT_CUSTOMER_ORDERS'] },
        ],
        impactAnalysis: { totalChains: 23, affectedJobs: 45 },
      },
      generatedFiles: {
        jobs: 65,
        connections: 5,
        routines: 12,
        contexts: 3,
        metadata: 8,
        totalSize: '45 MB',
      },
    },
    validation: {
      engines: [
        {
          name: 'Data Lineage Validation',
          score: 99.7,
          status: 'pass',
          details: { tested: 99, passed: 98, failed: 0, warnings: 1 },
          description: 'Source-to-target mapping verification',
        },
        {
          name: 'Business Rules Validation',
          score: 100,
          status: 'pass',
          details: { tested: 34, passed: 34, failed: 0, warnings: 0 },
          description: 'Transformation logic verification',
        },
        {
          name: 'Error Handling Validation',
          score: 99.5,
          status: 'pass',
          details: { tested: 12, passed: 12, failed: 0, warnings: 0 },
          description: 'Error scenario testing',
        },
        {
          name: 'Performance Validation',
          score: 98.2,
          status: 'pass',
          details: { tested: 65, passed: 64, failed: 0, warnings: 1 },
          description: 'Benchmark comparison',
        },
        {
          name: 'Data Quality Validation',
          score: 99.8,
          status: 'pass',
          details: { tested: 5, passed: 5, failed: 0, warnings: 0 },
          description: 'Quality checks',
        },
        {
          name: 'Security Validation',
          score: 100,
          status: 'pass',
          details: { tested: 5, passed: 5, failed: 0, warnings: 0 },
          description: 'Security compliance',
        },
      ],
      overallScore: 99.7,
      testEvidence: [
        { name: 'Data Validation Report.pdf', format: 'PDF', size: '2.4 MB', downloadUrl: '#' },
        { name: 'Performance Benchmark Results.xlsx', format: 'Excel', size: '850 KB', downloadUrl: '#' },
        { name: 'Quality Assurance Summary.docx', format: 'Word', size: '1.2 MB', downloadUrl: '#' },
        { name: 'Security Compliance Checklist.pdf', format: 'PDF', size: '450 KB', downloadUrl: '#' },
      ],
      optimizations: [
        { name: 'Bulk Loading', jobsAffected: 58, percentageAffected: 90, improvement: '40-60% performance improvement' },
        { name: 'Connection Pooling', jobsAffected: 52, percentageAffected: 85, improvement: '15-25% latency reduction' },
        { name: 'Parallel Execution', jobsAffected: 38, percentageAffected: 62, improvement: '30-50% time savings' },
        { name: 'Lookup Caching', jobsAffected: 42, percentageAffected: 68, improvement: '50-70% lookup speed improvement' },
      ],
    },
    performance: {
      executionTimes: [
        { jobName: 'FACT_SALES_DAILY_AGG', informatica: 87, talend: 58, improvement: 33 },
        { jobName: 'DIM_CUSTOMER_SCD2', informatica: 124, talend: 78, improvement: 37 },
        { jobName: 'AGG_CUSTOMER_LTV', informatica: 96, talend: 72, improvement: 25 },
        { jobName: 'STG_PRODUCT_CDC', informatica: 52, talend: 38, improvement: 27 },
      ],
      resourceUtilization: [
        { metric: 'CPU Usage', informatica: '65%', talend: '48%', change: '-26%' },
        { metric: 'Memory', informatica: '4.2 GB', talend: '3.1 GB', change: '-26%' },
        { metric: 'Disk I/O', informatica: '850 MB/s', talend: '1,120 MB/s', change: '+32%' },
        { metric: 'Network', informatica: '45 Mbps', talend: '52 Mbps', change: '+16%' },
      ],
      optimizations: [
        { name: 'Bulk Loading', jobsAffected: 58, percentageAffected: 90, improvement: '40-60% performance improvement' },
        { name: 'Connection Pooling', jobsAffected: 52, percentageAffected: 85, improvement: '15-25% latency reduction' },
        { name: 'Parallel Execution', jobsAffected: 38, percentageAffected: 62, improvement: '30-50% time savings' },
        { name: 'Lookup Caching', jobsAffected: 42, percentageAffected: 68, improvement: '50-70% lookup speed improvement' },
      ],
    },
    files: {
      primaryDeliverables: [
        {
          name: 'Complete Talend Project',
          description: 'Includes: 65 jobs, metadata, routines, contexts, screenshots',
          format: 'ZIP',
          size: '45 MB',
          lastGenerated: new Date('2024-11-28T09:42:00'),
          downloadUrl: '#',
          type: 'primary',
        },
        {
          name: 'Discovery Analysis Report',
          description: 'Pre-migration analysis: 65 jobs identified, dependencies mapped, complexity assessed, conversion patterns detected',
          format: 'PDF',
          size: '3.2 MB',
          lastGenerated: new Date('2024-11-28T08:20:00'),
          downloadUrl: '#',
          type: 'primary',
        },
        {
          name: 'Migration Report',
          description: 'Complete migration documentation including executive summary, technical guide, component mappings, and validation results',
          format: 'PDF',
          size: '8.5 MB',
          lastGenerated: new Date('2024-11-28T09:42:00'),
          downloadUrl: '#',
          type: 'primary',
        },
      ],
      documentation: [],
      sourceFiles: [],
      fileTree: {}, // Mock tree structure
    },
    issues: {
      manualReviews: [
        {
          jobName: 'FACT_SALES_AGGREGATION',
          complexity: 'high',
          reason: 'Custom Java Code Detected',
          details: 'Custom Java routines for complex aggregations required validation of business logic preservation',
          resolution: 'Expert reviewed and validated (15 mins)',
          timeSpent: 15,
          status: 'resolved',
          riskLevel: 'low',
        },
        {
          jobName: 'AGG_MONTHLY_SALES',
          complexity: 'medium',
          reason: 'Unconnected Lookup Transformation',
          details: 'Unconnected lookups with custom return logic required manual conversion to Java routine',
          resolution: 'Expert converted and tested (30 mins)',
          timeSpent: 30,
          status: 'resolved',
          riskLevel: 'low',
        },
      ],
      warnings: [
        {
          description: '1 data type precision mismatch (DECIMAL vs NUMBER)',
          impact: 'Minimal, precision preserved',
          action: 'Document in deployment notes',
        },
        {
          description: '3 performance optimizations pending',
          impact: 'Optional 5-10% performance gain',
          action: 'Apply during next optimization cycle',
        },
      ],
      riskMatrix: [
        { category: 'Data Loss', severity: 'none', likelihood: '0%', mitigation: 'N/A' },
        { category: 'Business Logic Error', severity: 'low', likelihood: '<1%', mitigation: 'Tested' },
        { category: 'Performance Issues', severity: 'low', likelihood: '<5%', mitigation: 'Optimized' },
        { category: 'Deployment Failure', severity: 'low', likelihood: '<2%', mitigation: 'Validated' },
        { category: 'Rollback Required', severity: 'low', likelihood: '<1%', mitigation: 'Plan ready' },
      ],
      auditTrail: [
        { timestamp: new Date('2024-11-28T08:15:00'), event: 'Setup stage completed' },
        { timestamp: new Date('2024-11-28T08:18:00'), event: 'Analysis completed (65 jobs detected)' },
        { timestamp: new Date('2024-11-28T08:20:00'), event: 'Discovery completed (23 dependency chains)' },
        { timestamp: new Date('2024-11-28T08:25:00'), event: 'Wave 1 conversion complete (15 jobs, 100% auto)' },
        { timestamp: new Date('2024-11-28T08:27:00'), event: 'Wave 2 conversion complete (42 jobs, 97% auto)' },
        { timestamp: new Date('2024-11-28T08:30:00'), event: 'Wave 3 conversion complete (8 jobs, 75% auto)' },
        { timestamp: new Date('2024-11-28T09:10:00'), event: 'Manual review: FACT_SALES_AGGREGATION (15 min)' },
        { timestamp: new Date('2024-11-28T09:40:00'), event: 'Manual review: AGG_MONTHLY_SALES (30 min)' },
        { timestamp: new Date('2024-11-28T09:42:00'), event: 'Migration COMPLETED' },
      ],
    },
    export: {
      templates: [
        { id: 'executive', name: 'Executive Dashboard', description: 'Perfect for: CXO presentation, board meetings', format: ['PDF'] },
        { id: 'technical', name: 'Technical Handover Package', description: 'Perfect for: Implementation team, DevOps', format: ['PDF', 'ZIP'] },
        { id: 'compliance', name: 'Compliance Audit Bundle', description: 'Perfect for: QA, compliance, regulatory audits', format: ['PDF', 'Excel'] },
        { id: 'stakeholder', name: 'Stakeholder Email Summary', description: 'Perfect for: Project update, status reporting', format: ['HTML', 'PDF'] },
      ],
    },
  }
}
