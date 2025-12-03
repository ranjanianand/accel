/**
 * Excel Export Utility
 * Generates comprehensive Discovery Report with 16 sheets
 */

import ExcelJS from 'exceljs'
import { AnalysisResults, ConnectionConfig } from '@/stores/setup-store'

// Mock data structures for sheets that aren't in current store
interface DetailedMapping {
  mappingName: string
  sourceQualifier: string
  connections: string
  program: string
  transformations: string[]
  complexity: number
  pattern: string
}

interface Expression {
  mappingName: string
  transformationName: string
  informaticaExpression: string
  talendExpression: string
  conversionStatus: 'Auto' | 'Manual' | 'Review Required'
  complexity: 'Simple' | 'Medium' | 'Complex'
}

interface Dependency {
  parentJob: string
  childJob: string
  dependencyType: 'Sequential' | 'Conditional' | 'Parallel'
  executionOrder: number
}

interface DataLineage {
  sourceTable: string
  sourceColumn: string
  transformations: string[]
  targetTable: string
  targetColumn: string
  businessRule?: string
}

interface BusinessRule {
  ruleId: string
  ruleName: string
  category: string
  description: string
  mappings: string[]
  validationRequired: boolean
}

interface Lookup {
  name: string
  type: 'Connected' | 'Unconnected'
  sourceConnection: string
  lookupTable: string
  condition: string
  usedInMappings: number
}

interface Session {
  sessionName: string
  workflowName: string
  mappingName: string
  connections: string[]
  parameters: Record<string, string>
}

interface Parameter {
  name: string
  type: string
  defaultValue: string
  usedIn: string[]
  scope: 'Global' | 'Workflow' | 'Session'
}

interface ComplexityDetail {
  mappingName: string
  complexityScore: number
  factors: {
    transformationCount: number
    expressionComplexity: number
    lookupCount: number
    connectionCount: number
  }
  estimatedEffort: number
}

interface Risk {
  riskId: string
  category: string
  description: string
  impact: 'High' | 'Medium' | 'Low'
  probability: 'High' | 'Medium' | 'Low'
  affectedMappings: string[]
  mitigation: string
}

interface MigrationWave {
  wave: number
  priority: 'High' | 'Medium' | 'Low'
  mappings: string[]
  estimatedEffort: number
  dependencies: string[]
}

interface QualityMetric {
  metric: string
  target: string
  validationMethod: string
  acceptanceCriteria: string
}

export interface DiscoveryExportData {
  projectName: string
  analysisResults: AnalysisResults
  connections: ConnectionConfig[]
  // Optional extended data (will use mock data if not provided)
  detailedMappings?: DetailedMapping[]
  expressions?: Expression[]
  dependencies?: Dependency[]
  dataLineage?: DataLineage[]
  businessRules?: BusinessRule[]
  lookups?: Lookup[]
  sessions?: Session[]
  parameters?: Parameter[]
  complexityDetails?: ComplexityDetail[]
  risks?: Risk[]
  migrationWaves?: MigrationWave[]
  qualityMetrics?: QualityMetric[]
}

export async function generateDiscoveryExcel(data: DiscoveryExportData): Promise<Blob> {
  const workbook = new ExcelJS.Workbook()

  // Set workbook properties
  workbook.creator = 'Migration Accelerator'
  workbook.created = new Date()
  workbook.modified = new Date()

  // Generate all sheets
  await createSummarySheet(workbook, data)
  await createDetailedMappingsSheet(workbook, data)
  await createTransformationsSheet(workbook, data)
  await createConnectionsSheet(workbook, data)
  await createExpressionsSheet(workbook, data)
  await createDependenciesSheet(workbook, data)
  await createDataLineageSheet(workbook, data)
  await createBusinessRulesSheet(workbook, data)
  await createLookupsSheet(workbook, data)
  await createSessionsSheet(workbook, data)
  await createParametersSheet(workbook, data)
  await createFlatFilesSheet(workbook, data)
  await createComplexityAnalysisSheet(workbook, data)
  await createRisksSheet(workbook, data)
  await createMigrationWavesSheet(workbook, data)
  await createQualityMetricsSheet(workbook, data)

  // Generate buffer and return as Blob
  const buffer = await workbook.xlsx.writeBuffer()
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
}

// Helper function to style header row
function styleHeaderRow(row: ExcelJS.Row) {
  row.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  row.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2563EB' } // Blue
  }
  row.alignment = { vertical: 'middle', horizontal: 'center' }
  row.height = 25
}

// 1. Summary Sheet
async function createSummarySheet(workbook: ExcelJS.Workbook, data: DiscoveryExportData) {
  const sheet = workbook.addWorksheet('Summary', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  })

  // Header
  sheet.columns = [
    { header: 'Category', key: 'category', width: 30 },
    { header: 'Count / Value', key: 'value', width: 20 }
  ]
  styleHeaderRow(sheet.getRow(1))

  // Data rows
  const rows = [
    { category: 'Project Name', value: data.projectName },
    { category: 'Analysis Date', value: new Date().toLocaleDateString() },
    { category: '', value: '' }, // Separator
    { category: 'OBJECT COUNTS', value: '' },
    { category: 'Total Mappings', value: data.analysisResults.objectCounts.mappings },
    { category: 'Workflows', value: data.analysisResults.objectCounts.workflows },
    { category: 'Sessions', value: data.analysisResults.objectCounts.sessions },
    { category: 'Mapplets', value: data.analysisResults.objectCounts.mapplets },
    { category: 'Sources', value: data.analysisResults.objectCounts.sources },
    { category: 'Targets', value: data.analysisResults.objectCounts.targets },
    { category: '', value: '' }, // Separator
    { category: 'MIGRATION METRICS', value: '' },
    { category: 'Automation Rate', value: `${data.analysisResults.automationRate}%` },
    { category: 'Time Savings (hours)', value: data.analysisResults.timeSavingsEstimate },
    { category: 'Average Complexity', value: data.analysisResults.complexity.average },
    { category: '', value: '' }, // Separator
    { category: 'COMPLEXITY DISTRIBUTION', value: '' },
    { category: 'Low Complexity', value: data.analysisResults.complexity.distribution.low },
    { category: 'Medium Complexity', value: data.analysisResults.complexity.distribution.medium },
    { category: 'High Complexity', value: data.analysisResults.complexity.distribution.high },
    { category: '', value: '' }, // Separator
    { category: 'CONNECTIONS', value: '' },
    { category: 'Total Connections', value: data.connections.length },
    { category: 'Database Connections', value: data.connections.filter(c => c.type !== 'Flat File').length },
    { category: 'File Connections', value: data.connections.filter(c => c.type === 'Flat File').length },
  ]

  rows.forEach(row => sheet.addRow(row))

  // Style category headers
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      const cell = row.getCell(1)
      if (cell.value && typeof cell.value === 'string' && cell.value === cell.value.toUpperCase()) {
        row.font = { bold: true }
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE5E7EB' } // Gray
        }
      }
    }
  })
}

// 2. Detailed Mappings Sheet
async function createDetailedMappingsSheet(workbook: ExcelJS.Workbook, data: DiscoveryExportData) {
  const sheet = workbook.addWorksheet('DetailedMappings', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  })

  sheet.columns = [
    { header: 'Mapping Name', key: 'mappingName', width: 35 },
    { header: 'Source Qualifier', key: 'sourceQualifier', width: 30 },
    { header: 'Connections', key: 'connections', width: 30 },
    { header: 'Program', key: 'program', width: 25 },
    { header: 'Transformation Count', key: 'transformationCount', width: 20 },
    { header: 'Complexity Score', key: 'complexity', width: 18 },
    { header: 'Pattern', key: 'pattern', width: 25 }
  ]
  styleHeaderRow(sheet.getRow(1))

  // Use provided data or generate mock data
  const mappings = data.detailedMappings || generateMockMappings(data)
  mappings.forEach(mapping => {
    sheet.addRow({
      mappingName: mapping.mappingName,
      sourceQualifier: mapping.sourceQualifier,
      connections: mapping.connections,
      program: mapping.program,
      transformationCount: mapping.transformations.length,
      complexity: mapping.complexity,
      pattern: mapping.pattern
    })
  })
}

// 3. Transformations Sheet
async function createTransformationsSheet(workbook: ExcelJS.Workbook, data: DiscoveryExportData) {
  const sheet = workbook.addWorksheet('Transformations', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  })

  sheet.columns = [
    { header: 'Mapping Name', key: 'mappingName', width: 35 },
    { header: 'Transformation Name', key: 'transformationName', width: 35 },
    { header: 'Type', key: 'type', width: 20 },
    { header: 'Talend Component', key: 'talendComponent', width: 25 },
    { header: 'Conversion Status', key: 'status', width: 20 }
  ]
  styleHeaderRow(sheet.getRow(1))

  // Generate mock transformations from mappings
  const mappings = data.detailedMappings || generateMockMappings(data)
  mappings.forEach(mapping => {
    mapping.transformations.forEach(trans => {
      sheet.addRow({
        mappingName: mapping.mappingName,
        transformationName: trans,
        type: getTransformationType(trans),
        talendComponent: getTalendComponent(trans),
        status: 'Auto-Convertible'
      })
    })
  })
}

// 4. Connections Sheet (Security-conscious - no credentials)
async function createConnectionsSheet(workbook: ExcelJS.Workbook, data: DiscoveryExportData) {
  const sheet = workbook.addWorksheet('Connections', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  })

  sheet.columns = [
    { header: 'Connection Name', key: 'name', width: 30 },
    { header: 'Type', key: 'type', width: 20 },
    { header: 'Used in Mappings', key: 'usageCount', width: 20 },
    { header: 'Reusability', key: 'reusability', width: 15 },
    { header: 'Migration Impact', key: 'impact', width: 20 },
    { header: 'Test Status', key: 'testStatus', width: 15 }
  ]
  styleHeaderRow(sheet.getRow(1))

  data.connections.forEach(conn => {
    sheet.addRow({
      name: conn.name,
      type: conn.type,
      usageCount: Math.floor(Math.random() * 20) + 1, // Mock usage count
      reusability: conn.type === 'Flat File' ? 'Low' : 'High',
      impact: 'Medium',
      testStatus: conn.tested ? (conn.testSuccess ? 'Passed' : 'Failed') : 'Not Tested'
    })
  })
}

// 5. Expressions Sheet
async function createExpressionsSheet(workbook: ExcelJS.Workbook, data: DiscoveryExportData) {
  const sheet = workbook.addWorksheet('Expressions', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  })

  sheet.columns = [
    { header: 'Mapping Name', key: 'mappingName', width: 30 },
    { header: 'Transformation', key: 'transformation', width: 25 },
    { header: 'Informatica Expression', key: 'informaticaExpr', width: 40 },
    { header: 'Talend Expression', key: 'talendExpr', width: 40 },
    { header: 'Conversion Status', key: 'status', width: 20 },
    { header: 'Complexity', key: 'complexity', width: 15 }
  ]
  styleHeaderRow(sheet.getRow(1))

  const expressions = data.expressions || generateMockExpressions(data)
  expressions.forEach(expr => sheet.addRow(expr))
}

// 6. Dependencies Sheet
async function createDependenciesSheet(workbook: ExcelJS.Workbook, data: DiscoveryExportData) {
  const sheet = workbook.addWorksheet('Dependencies', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  })

  sheet.columns = [
    { header: 'Parent Job', key: 'parentJob', width: 35 },
    { header: 'Child Job', key: 'childJob', width: 35 },
    { header: 'Dependency Type', key: 'dependencyType', width: 20 },
    { header: 'Execution Order', key: 'executionOrder', width: 18 }
  ]
  styleHeaderRow(sheet.getRow(1))

  const dependencies = data.dependencies || generateMockDependencies(data)
  dependencies.forEach(dep => sheet.addRow(dep))
}

// 7. Data Lineage Sheet
async function createDataLineageSheet(workbook: ExcelJS.Workbook, data: DiscoveryExportData) {
  const sheet = workbook.addWorksheet('DataLineage', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  })

  sheet.columns = [
    { header: 'Source Table', key: 'sourceTable', width: 30 },
    { header: 'Source Column', key: 'sourceColumn', width: 25 },
    { header: 'Transformations Applied', key: 'transformations', width: 50 },
    { header: 'Target Table', key: 'targetTable', width: 30 },
    { header: 'Target Column', key: 'targetColumn', width: 25 },
    { header: 'Business Rule', key: 'businessRule', width: 40 }
  ]
  styleHeaderRow(sheet.getRow(1))

  const lineage = data.dataLineage || generateMockDataLineage(data)
  lineage.forEach(item => {
    sheet.addRow({
      sourceTable: item.sourceTable,
      sourceColumn: item.sourceColumn,
      transformations: item.transformations.join(' → '),
      targetTable: item.targetTable,
      targetColumn: item.targetColumn,
      businessRule: item.businessRule || 'N/A'
    })
  })
}

// 8. Business Rules Sheet
async function createBusinessRulesSheet(workbook: ExcelJS.Workbook, data: DiscoveryExportData) {
  const sheet = workbook.addWorksheet('BusinessRules', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  })

  sheet.columns = [
    { header: 'Rule ID', key: 'ruleId', width: 15 },
    { header: 'Rule Name', key: 'ruleName', width: 30 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Description', key: 'description', width: 50 },
    { header: 'Affected Mappings', key: 'mappings', width: 40 },
    { header: 'Validation Required', key: 'validation', width: 20 }
  ]
  styleHeaderRow(sheet.getRow(1))

  const rules = data.businessRules || generateMockBusinessRules(data)
  rules.forEach(rule => {
    sheet.addRow({
      ruleId: rule.ruleId,
      ruleName: rule.ruleName,
      category: rule.category,
      description: rule.description,
      mappings: rule.mappings.join(', '),
      validation: rule.validationRequired ? 'Yes' : 'No'
    })
  })
}

// 9. Lookups Sheet
async function createLookupsSheet(workbook: ExcelJS.Workbook, data: DiscoveryExportData) {
  const sheet = workbook.addWorksheet('Lookups', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  })

  sheet.columns = [
    { header: 'Lookup Name', key: 'name', width: 30 },
    { header: 'Type', key: 'type', width: 15 },
    { header: 'Source Connection', key: 'connection', width: 25 },
    { header: 'Lookup Table', key: 'table', width: 25 },
    { header: 'Condition', key: 'condition', width: 40 },
    { header: 'Used In Mappings', key: 'usage', width: 18 }
  ]
  styleHeaderRow(sheet.getRow(1))

  const lookups = data.lookups || generateMockLookups(data)
  lookups.forEach(lookup => sheet.addRow(lookup))
}

// 10. Sessions/Workflows Sheet
async function createSessionsSheet(workbook: ExcelJS.Workbook, data: DiscoveryExportData) {
  const sheet = workbook.addWorksheet('Sessions', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  })

  sheet.columns = [
    { header: 'Session Name', key: 'sessionName', width: 30 },
    { header: 'Workflow Name', key: 'workflowName', width: 30 },
    { header: 'Mapping Name', key: 'mappingName', width: 30 },
    { header: 'Connections Used', key: 'connections', width: 40 },
    { header: 'Key Parameters', key: 'parameters', width: 50 }
  ]
  styleHeaderRow(sheet.getRow(1))

  const sessions = data.sessions || generateMockSessions(data)
  sessions.forEach(session => {
    sheet.addRow({
      sessionName: session.sessionName,
      workflowName: session.workflowName,
      mappingName: session.mappingName,
      connections: session.connections.join(', '),
      parameters: Object.entries(session.parameters).map(([k, v]) => `${k}=${v}`).join('; ')
    })
  })
}

// 11. Parameters/Variables Sheet
async function createParametersSheet(workbook: ExcelJS.Workbook, data: DiscoveryExportData) {
  const sheet = workbook.addWorksheet('Parameters', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  })

  sheet.columns = [
    { header: 'Parameter Name', key: 'name', width: 30 },
    { header: 'Type', key: 'type', width: 15 },
    { header: 'Default Value', key: 'defaultValue', width: 25 },
    { header: 'Scope', key: 'scope', width: 15 },
    { header: 'Used In', key: 'usedIn', width: 50 }
  ]
  styleHeaderRow(sheet.getRow(1))

  const parameters = data.parameters || generateMockParameters(data)
  parameters.forEach(param => {
    sheet.addRow({
      name: param.name,
      type: param.type,
      defaultValue: param.defaultValue,
      scope: param.scope,
      usedIn: param.usedIn.join(', ')
    })
  })
}

// 12. Flat Files Sheet
async function createFlatFilesSheet(workbook: ExcelJS.Workbook, data: DiscoveryExportData) {
  const sheet = workbook.addWorksheet('FlatFiles', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  })

  sheet.columns = [
    { header: 'File Name', key: 'fileName', width: 40 },
    { header: 'File Type', key: 'fileType', width: 15 },
    { header: 'Description', key: 'description', width: 50 },
    { header: 'Used in Mappings', key: 'usageCount', width: 20 }
  ]
  styleHeaderRow(sheet.getRow(1))

  const flatFiles = data.analysisResults.flatFiles || []
  flatFiles.forEach(file => {
    sheet.addRow({
      fileName: file.fileName,
      fileType: file.fileType,
      description: file.description || 'N/A',
      usageCount: Math.floor(Math.random() * 10) + 1 // Mock usage
    })
  })
}

// 13. Complexity Analysis Sheet
async function createComplexityAnalysisSheet(workbook: ExcelJS.Workbook, data: DiscoveryExportData) {
  const sheet = workbook.addWorksheet('ComplexityAnalysis', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  })

  sheet.columns = [
    { header: 'Mapping Name', key: 'mappingName', width: 35 },
    { header: 'Complexity Score', key: 'score', width: 18 },
    { header: 'Transformation Count', key: 'transCount', width: 20 },
    { header: 'Expression Complexity', key: 'exprComplexity', width: 20 },
    { header: 'Lookup Count', key: 'lookupCount', width: 15 },
    { header: 'Connection Count', key: 'connCount', width: 18 },
    { header: 'Estimated Effort (hrs)', key: 'effort', width: 20 }
  ]
  styleHeaderRow(sheet.getRow(1))

  const complexityDetails = data.complexityDetails || generateMockComplexityDetails(data)
  complexityDetails.forEach(detail => {
    sheet.addRow({
      mappingName: detail.mappingName,
      score: detail.complexityScore,
      transCount: detail.factors.transformationCount,
      exprComplexity: detail.factors.expressionComplexity,
      lookupCount: detail.factors.lookupCount,
      connCount: detail.factors.connectionCount,
      effort: detail.estimatedEffort
    })
  })
}

// 14. Risks Sheet
async function createRisksSheet(workbook: ExcelJS.Workbook, data: DiscoveryExportData) {
  const sheet = workbook.addWorksheet('Risks', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  })

  sheet.columns = [
    { header: 'Risk ID', key: 'riskId', width: 12 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Description', key: 'description', width: 50 },
    { header: 'Impact', key: 'impact', width: 12 },
    { header: 'Probability', key: 'probability', width: 15 },
    { header: 'Affected Mappings', key: 'mappings', width: 40 },
    { header: 'Mitigation Strategy', key: 'mitigation', width: 50 }
  ]
  styleHeaderRow(sheet.getRow(1))

  const risks = data.risks || generateMockRisks(data)
  risks.forEach(risk => {
    sheet.addRow({
      riskId: risk.riskId,
      category: risk.category,
      description: risk.description,
      impact: risk.impact,
      probability: risk.probability,
      mappings: risk.affectedMappings.join(', '),
      mitigation: risk.mitigation
    })
  })
}

// 15. Migration Waves Sheet
async function createMigrationWavesSheet(workbook: ExcelJS.Workbook, data: DiscoveryExportData) {
  const sheet = workbook.addWorksheet('MigrationWaves', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  })

  sheet.columns = [
    { header: 'Wave Number', key: 'wave', width: 15 },
    { header: 'Priority', key: 'priority', width: 12 },
    { header: 'Mapping Count', key: 'count', width: 18 },
    { header: 'Mappings', key: 'mappings', width: 60 },
    { header: 'Estimated Effort (hrs)', key: 'effort', width: 20 },
    { header: 'Dependencies', key: 'dependencies', width: 40 }
  ]
  styleHeaderRow(sheet.getRow(1))

  const waves = data.migrationWaves || generateMockMigrationWaves(data)
  waves.forEach(wave => {
    sheet.addRow({
      wave: wave.wave,
      priority: wave.priority,
      count: wave.mappings.length,
      mappings: wave.mappings.join(', '),
      effort: wave.estimatedEffort,
      dependencies: wave.dependencies.join(', ')
    })
  })
}

// 16. Quality Metrics Sheet
async function createQualityMetricsSheet(workbook: ExcelJS.Workbook, data: DiscoveryExportData) {
  const sheet = workbook.addWorksheet('QualityMetrics', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  })

  sheet.columns = [
    { header: 'Metric Name', key: 'metric', width: 30 },
    { header: 'Target Value', key: 'target', width: 20 },
    { header: 'Validation Method', key: 'method', width: 40 },
    { header: 'Acceptance Criteria', key: 'criteria', width: 50 }
  ]
  styleHeaderRow(sheet.getRow(1))

  const metrics = data.qualityMetrics || generateMockQualityMetrics()
  metrics.forEach(metric => sheet.addRow(metric))
}

// ============================================================================
// Mock Data Generators
// ============================================================================

function generateMockMappings(data: DiscoveryExportData): DetailedMapping[] {
  const count = data.analysisResults.objectCounts.mappings
  const patterns = data.analysisResults.patterns.map(p => p.name)

  return Array.from({ length: count }, (_, i) => ({
    mappingName: `m_${data.projectName.replace(/\s/g, '_')}_${String(i + 1).padStart(3, '0')}`,
    sourceQualifier: `SQ_Source_${i + 1}`,
    connections: data.connections[i % data.connections.length]?.name || 'Unknown',
    program: `Program_${Math.floor(i / 10) + 1}`,
    transformations: [
      'Expression',
      'Filter',
      i % 3 === 0 ? 'Lookup' : 'Aggregator',
      'Router'
    ],
    complexity: Math.floor(Math.random() * 100),
    pattern: patterns[i % patterns.length]
  }))
}

function generateMockExpressions(data: DiscoveryExportData): Expression[] {
  const mappingCount = Math.min(10, data.analysisResults.objectCounts.mappings)
  const expressions: Expression[] = []

  for (let i = 0; i < mappingCount; i++) {
    expressions.push({
      mappingName: `m_mapping_${i + 1}`,
      transformationName: `EXP_Transform_${i + 1}`,
      informaticaExpression: 'TO_DATE(INPUT_DATE, \'YYYY-MM-DD\')',
      talendExpression: 'TalendDate.parseDate("yyyy-MM-dd", INPUT_DATE)',
      conversionStatus: i % 3 === 0 ? 'Manual' : 'Auto',
      complexity: i % 2 === 0 ? 'Simple' : 'Medium'
    })
  }

  return expressions
}

function generateMockDependencies(data: DiscoveryExportData): Dependency[] {
  const count = Math.min(15, data.analysisResults.objectCounts.workflows)
  return Array.from({ length: count }, (_, i) => ({
    parentJob: `wf_parent_${i + 1}`,
    childJob: `wf_child_${i + 1}`,
    dependencyType: i % 2 === 0 ? 'Sequential' : 'Conditional',
    executionOrder: i + 1
  }))
}

function generateMockDataLineage(data: DiscoveryExportData): DataLineage[] {
  return [
    {
      sourceTable: 'CUSTOMERS',
      sourceColumn: 'CUST_ID',
      transformations: ['Deduplication', 'Validation'],
      targetTable: 'DIM_CUSTOMER',
      targetColumn: 'CUSTOMER_KEY'
    },
    {
      sourceTable: 'ORDERS',
      sourceColumn: 'ORDER_DATE',
      transformations: ['Date Format', 'Lookup Dimension'],
      targetTable: 'FACT_SALES',
      targetColumn: 'ORDER_DATE_KEY',
      businessRule: 'Convert to date key format YYYYMMDD'
    }
  ]
}

function generateMockBusinessRules(data: DiscoveryExportData): BusinessRule[] {
  return [
    {
      ruleId: 'BR001',
      ruleName: 'Customer Deduplication',
      category: 'Data Quality',
      description: 'Remove duplicate customer records based on email and phone',
      mappings: ['m_customer_load', 'm_customer_update'],
      validationRequired: true
    }
  ]
}

function generateMockLookups(data: DiscoveryExportData): Lookup[] {
  return [
    {
      name: 'LKP_CUSTOMER_DIM',
      type: 'Connected',
      sourceConnection: data.connections[0]?.name || 'Oracle_DW',
      lookupTable: 'DIM_CUSTOMER',
      condition: 'CUST_ID = SRC_CUST_ID',
      usedInMappings: 5
    }
  ]
}

function generateMockSessions(data: DiscoveryExportData): Session[] {
  return [
    {
      sessionName: 's_customer_load',
      workflowName: 'wf_daily_customer',
      mappingName: 'm_customer_etl',
      connections: [data.connections[0]?.name || 'Oracle_Src'],
      parameters: { BatchSize: '10000', ErrorThreshold: '100' }
    }
  ]
}

function generateMockParameters(data: DiscoveryExportData): Parameter[] {
  return [
    {
      name: '$$BATCH_DATE',
      type: 'Date',
      defaultValue: 'SYSDATE',
      usedIn: ['wf_daily_etl', 'wf_monthly_agg'],
      scope: 'Global'
    }
  ]
}

function generateMockComplexityDetails(data: DiscoveryExportData): ComplexityDetail[] {
  const count = Math.min(10, data.analysisResults.objectCounts.mappings)
  return Array.from({ length: count }, (_, i) => ({
    mappingName: `m_mapping_${i + 1}`,
    complexityScore: Math.floor(Math.random() * 100),
    factors: {
      transformationCount: Math.floor(Math.random() * 20) + 5,
      expressionComplexity: Math.floor(Math.random() * 50) + 10,
      lookupCount: Math.floor(Math.random() * 5),
      connectionCount: Math.floor(Math.random() * 3) + 1
    },
    estimatedEffort: Math.floor(Math.random() * 40) + 10
  }))
}

function generateMockRisks(data: DiscoveryExportData): Risk[] {
  return [
    {
      riskId: 'RISK001',
      category: 'Technical',
      description: 'Complex expressions may require manual verification',
      impact: 'Medium',
      probability: 'High',
      affectedMappings: ['m_mapping_1', 'm_mapping_5'],
      mitigation: 'Allocate extra testing time for expression validation'
    }
  ]
}

function generateMockMigrationWaves(data: DiscoveryExportData): MigrationWave[] {
  const totalMappings = data.analysisResults.objectCounts.mappings
  const waveSize = Math.ceil(totalMappings / 3)

  return [
    {
      wave: 1,
      priority: 'High',
      mappings: Array.from({ length: waveSize }, (_, i) => `m_mapping_${i + 1}`),
      estimatedEffort: waveSize * 8,
      dependencies: []
    },
    {
      wave: 2,
      priority: 'Medium',
      mappings: Array.from({ length: waveSize }, (_, i) => `m_mapping_${waveSize + i + 1}`),
      estimatedEffort: waveSize * 8,
      dependencies: ['Wave 1 completion']
    }
  ]
}

function generateMockQualityMetrics(): QualityMetric[] {
  return [
    {
      metric: 'Data Validation Pass Rate',
      target: '≥ 99.5%',
      validationMethod: 'Row count and column-level checksum comparison',
      acceptanceCriteria: 'All critical tables must match within 0.5% variance'
    },
    {
      metric: 'Business Rule Compliance',
      target: '100%',
      validationMethod: 'Automated business rule execution and comparison',
      acceptanceCriteria: 'All business rules must produce identical results'
    },
    {
      metric: 'Performance Baseline',
      target: 'Within 20% of Informatica',
      validationMethod: 'End-to-end job execution time measurement',
      acceptanceCriteria: 'Talend jobs complete within 120% of Informatica baseline'
    }
  ]
}

// Helper functions
function getTransformationType(transName: string): string {
  if (transName.includes('Expression')) return 'Expression'
  if (transName.includes('Filter')) return 'Filter'
  if (transName.includes('Lookup')) return 'Lookup'
  if (transName.includes('Aggregator')) return 'Aggregator'
  return 'Router'
}

function getTalendComponent(transName: string): string {
  const type = getTransformationType(transName)
  const mapping: Record<string, string> = {
    'Expression': 'tMap',
    'Filter': 'tFilterRow',
    'Lookup': 'tMap (lookup)',
    'Aggregator': 'tAggregateRow',
    'Router': 'tMap (multiple outputs)'
  }
  return mapping[type] || 'tMap'
}
