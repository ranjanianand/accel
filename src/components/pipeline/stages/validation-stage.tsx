'use client'

import { useEffect, useState } from 'react'
import { usePipelineStore } from '@/stores/pipeline-store'
import { Button } from '@/components/ui/button'
import { FileCode, Download, Play, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'

interface ValidationMetrics {
  dataLineageChecks: number
  totalLineageChecks: number
  businessRulesValidated: number
  totalBusinessRules: number
  errorHandlingVerified: number
  totalErrorHandling: number
  passRate: number
}

interface ManualJob {
  name: string
  reason: string
  complexity: 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
}

export function ValidationStage() {
  const { stages, updateStageProgress, completeStage, moveToNextStage } = usePipelineStore()
  const stageResult = stages['validation']
  const [testingStarted, setTestingStarted] = useState(false)
  const [expandedSections, setExpandedSections] = useState<{
    lineage: boolean
    businessRules: boolean
    errorHandling: boolean
  }>({
    lineage: false,
    businessRules: false,
    errorHandling: false
  })

  const isCompleted = stageResult.status === 'completed'

  // Auto-start testing when entering validation stage
  useEffect(() => {
    if (stageResult.status === 'in_progress' && !testingStarted && !isCompleted) {
      const autoStartTimer = setTimeout(() => {
        setTestingStarted(true)
      }, 800) // Brief delay for UX smoothness
      return () => clearTimeout(autoStartTimer)
    }
  }, [stageResult.status, testingStarted, isCompleted])

  const [metrics, setMetrics] = useState<ValidationMetrics>({
    dataLineageChecks: 0,
    totalLineageChecks: 89,
    businessRulesValidated: 0,
    totalBusinessRules: 34,
    errorHandlingVerified: 0,
    totalErrorHandling: 12,
    passRate: 0
  })

  const automatedJobsCount = 60

  // Mock validation details for QA/ETL experts
  const lineageValidations = [
    { table: 'CUSTOMER_MASTER', sourceColumns: 15, targetColumns: 15, mappings: 15, status: 'passed', dataType: 'Match', issues: [] },
    { table: 'ORDER_DETAIL', sourceColumns: 23, targetColumns: 23, mappings: 23, status: 'passed', dataType: 'Match', issues: [] },
    { table: 'PRODUCT_DIM', sourceColumns: 12, targetColumns: 12, mappings: 12, status: 'warning', dataType: 'Partial', issues: ['PRICE column: DECIMAL(10,2) → NUMBER(10,2)'] },
    { table: 'SALES_FACT', sourceColumns: 18, targetColumns: 18, mappings: 18, status: 'passed', dataType: 'Match', issues: [] },
    { table: 'INVENTORY_SNAPSHOT', sourceColumns: 21, targetColumns: 21, mappings: 21, status: 'passed', dataType: 'Match', issues: [] },
  ]

  const businessRuleValidations = [
    { rule: 'Customer Lifetime Value Calculation', description: 'SUM(orders.amount) WHERE customer_id = current', status: 'passed', verified: true, issues: [] },
    { rule: 'Date Range Validation', description: 'Order date BETWEEN 2020-01-01 AND CURRENT_DATE', status: 'passed', verified: true, issues: [] },
    { rule: 'Product Category Mapping', description: 'Map legacy category codes to new taxonomy', status: 'passed', verified: true, issues: [] },
    { rule: 'Sales Tax Calculation', description: 'IF(state IN tax_states) THEN amount * 0.08 ELSE 0', status: 'passed', verified: true, issues: [] },
    { rule: 'Discount Application Logic', description: 'Apply tier-based discounts based on customer segment', status: 'passed', verified: true, issues: [] },
    { rule: 'Inventory Stock Level Alert', description: 'Flag products with stock < reorder_threshold', status: 'passed', verified: true, issues: [] },
  ]

  const errorHandlingValidations = [
    { scenario: 'Null Value Handling', description: 'NULL columns handled with default values or rejection', tested: true, status: 'passed', coverage: '100%' },
    { scenario: 'Connection Timeout Recovery', description: 'Database connection retry with exponential backoff', tested: true, status: 'passed', coverage: '100%' },
    { scenario: 'Data Type Conversion Errors', description: 'Invalid type conversions logged and rejected', tested: true, status: 'passed', coverage: '100%' },
    { scenario: 'Referential Integrity Violations', description: 'Foreign key violations handled with error logging', tested: true, status: 'passed', coverage: '100%' },
    { scenario: 'Duplicate Key Handling', description: 'Primary key duplicates trigger merge or reject logic', tested: true, status: 'passed', coverage: '100%' },
    { scenario: 'File Access Failures', description: 'Missing files trigger notification and job suspension', tested: true, status: 'passed', coverage: '100%' },
  ]

  // Validation testing simulation
  useEffect(() => {
    if (testingStarted) {
      const interval = setInterval(() => {
        setMetrics((prev) => {
          const newLineage = Math.min(prev.dataLineageChecks + 5, prev.totalLineageChecks)
          const newRules = Math.min(prev.businessRulesValidated + 2, prev.totalBusinessRules)
          const newErrors = Math.min(prev.errorHandlingVerified + 1, prev.totalErrorHandling)

          const totalProgress =
            ((newLineage / prev.totalLineageChecks +
              newRules / prev.totalBusinessRules +
              newErrors / prev.totalErrorHandling) /
              3) *
            100

          const passRate =
            totalProgress === 100 ? 99.7 : (95 + (totalProgress / 100) * 4.7).toFixed(1)

          updateStageProgress('validation', Math.floor(totalProgress), 'Running validation checks...')

          if (
            newLineage === prev.totalLineageChecks &&
            newRules === prev.totalBusinessRules &&
            newErrors === prev.totalErrorHandling
          ) {
            clearInterval(interval)
            setTimeout(() => {
              completeStage('validation', {
                dataLineageChecks: newLineage,
                businessRulesValidated: newRules,
                errorHandlingVerified: newErrors,
                passRate: 99.7,
                issuesFound: 3
              })
            }, 500)
          }

          return {
            ...prev,
            dataLineageChecks: newLineage,
            businessRulesValidated: newRules,
            errorHandlingVerified: newErrors,
            passRate: parseFloat(passRate as string)
          }
        })
      }, 180)

      return () => clearInterval(interval)
    }
  }, [testingStarted])

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div>
        <h2 className="text-lg font-semibold mb-1">Validation Stage</h2>
        <p className="text-sm text-foreground-secondary">
          Automated quality assurance testing on all converted jobs
        </p>
      </div>

      {/* Validation Testing */}
      <div className="space-y-4">
        <div className="bg-background border border-border rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-base font-semibold mb-1">Automated Validation Testing</h3>
              <p className="text-sm text-foreground-secondary">
                Comprehensive quality assurance testing on all {automatedJobsCount} converted jobs
              </p>
            </div>

            {!testingStarted && stageResult.status !== 'completed' && (
              <div className="space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-2">🚀 Primary Validation Workflow</h4>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200 mb-2">
                    Testing auto-starts when entering Validation stage. This validates:
                  </p>
                  <ul className="text-sm text-emerald-800 dark:text-emerald-200 space-y-1">
                    <li>• <strong>Data Lineage:</strong> 89 source-to-target mappings verified</li>
                    <li>• <strong>Business Rules:</strong> 34 transformation rules validated</li>
                    <li>• <strong>Error Handling:</strong> 12 error scenarios tested</li>
                    <li>• <strong>Performance:</strong> Query execution benchmarks</li>
                  </ul>
                </div>

                <Button
                  onClick={() => setTestingStarted(true)}
                  variant="primary"
                  size="lg"
                  className="w-full gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Validation Testing
                </Button>
                <p className="text-xs text-center text-foreground-tertiary">
                  Most users complete the pipeline after testing passes (85-90% success rate)
                </p>
              </div>
            )}

            {testingStarted && (
              <div className="space-y-3">
                {/* Data Lineage - Expandable Details */}
                <div className="border border-border rounded overflow-hidden">
                  <button
                    onClick={() => setExpandedSections(prev => ({ ...prev, lineage: !prev.lineage }))}
                    className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Data Lineage Validation</span>
                        {expandedSections.lineage ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                      <span className="text-xs text-foreground-tertiary">
                        {metrics.dataLineageChecks} / {metrics.totalLineageChecks}
                      </span>
                    </div>
                    <div className="h-1 bg-background-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{
                          width: `${(metrics.dataLineageChecks / metrics.totalLineageChecks) * 100}%`
                        }}
                      />
                    </div>
                  </button>

                  {expandedSections.lineage && (
                    <div className="border-t border-border p-4 bg-gray-50 dark:bg-gray-900/20">
                      <div className="space-y-3">
                        <div className="text-xs text-foreground-secondary mb-2">
                          Source-to-target mapping validation across {lineageValidations.length} tables
                        </div>
                        {lineageValidations.map((validation, idx) => (
                          <div key={idx} className="bg-background border border-border rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {validation.status === 'passed' ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-amber-600" />
                                )}
                                <span className="text-sm font-medium">{validation.table}</span>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                validation.status === 'passed'
                                  ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                              }`}>
                                {validation.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs text-foreground-secondary">
                              <div>Source Cols: {validation.sourceColumns}</div>
                              <div>Target Cols: {validation.targetColumns}</div>
                              <div>Mappings: {validation.mappings}</div>
                            </div>
                            <div className="text-xs text-foreground-tertiary mt-1">
                              Data Type: {validation.dataType}
                            </div>
                            {validation.issues.length > 0 && (
                              <div className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                                {validation.issues.map((issue, i) => (
                                  <div key={i}>⚠️ {issue}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Business Rules - Expandable Details */}
                <div className="border border-border rounded overflow-hidden">
                  <button
                    onClick={() => setExpandedSections(prev => ({ ...prev, businessRules: !prev.businessRules }))}
                    className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Business Rules Validation</span>
                        {expandedSections.businessRules ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                      <span className="text-xs text-foreground-tertiary">
                        {metrics.businessRulesValidated} / {metrics.totalBusinessRules}
                      </span>
                    </div>
                    <div className="h-1 bg-background-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{
                          width: `${(metrics.businessRulesValidated / metrics.totalBusinessRules) * 100}%`
                        }}
                      />
                    </div>
                  </button>

                  {expandedSections.businessRules && (
                    <div className="border-t border-border p-4 bg-gray-50 dark:bg-gray-900/20">
                      <div className="space-y-3">
                        <div className="text-xs text-foreground-secondary mb-2">
                          Transformation logic and business rule preservation validation
                        </div>
                        {businessRuleValidations.map((rule, idx) => (
                          <div key={idx} className="bg-background border border-border rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {rule.status === 'passed' ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-amber-600" />
                                )}
                                <span className="text-sm font-medium">{rule.rule}</span>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                rule.status === 'passed'
                                  ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                              }`}>
                                {rule.verified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                            <div className="text-xs text-foreground-secondary font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                              {rule.description}
                            </div>
                            {rule.issues.length > 0 && (
                              <div className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                                {rule.issues.map((issue, i) => (
                                  <div key={i}>⚠️ {issue}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Handling - Expandable Details */}
                <div className="border border-border rounded overflow-hidden">
                  <button
                    onClick={() => setExpandedSections(prev => ({ ...prev, errorHandling: !prev.errorHandling }))}
                    className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Error Handling Verification</span>
                        {expandedSections.errorHandling ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                      <span className="text-xs text-foreground-tertiary">
                        {metrics.errorHandlingVerified} / {metrics.totalErrorHandling}
                      </span>
                    </div>
                    <div className="h-1 bg-background-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{
                          width: `${(metrics.errorHandlingVerified / metrics.totalErrorHandling) * 100}%`
                        }}
                      />
                    </div>
                  </button>

                  {expandedSections.errorHandling && (
                    <div className="border-t border-border p-4 bg-gray-50 dark:bg-gray-900/20">
                      <div className="space-y-3">
                        <div className="text-xs text-foreground-secondary mb-2">
                          Error scenario testing and exception handling verification
                        </div>
                        {errorHandlingValidations.map((errorTest, idx) => (
                          <div key={idx} className="bg-background border border-border rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {errorTest.status === 'passed' ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-amber-600" />
                                )}
                                <span className="text-sm font-medium">{errorTest.scenario}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-foreground-tertiary">Coverage: {errorTest.coverage}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  errorTest.status === 'passed'
                                    ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                                }`}>
                                  {errorTest.status}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-foreground-secondary">
                              {errorTest.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Pass Rate */}
                {metrics.passRate > 0 && (
                  <div className="border border-border rounded p-4">
                    <div className="text-center">
                      <p className="text-sm text-foreground-secondary mb-2">Current Pass Rate</p>
                      <p className="text-3xl font-semibold text-emerald-600">{metrics.passRate.toFixed(1)}%</p>
                    </div>
                  </div>
                )}

                {/* Live Log */}
                {!isCompleted && (
                  <div className="border border-border rounded p-4 font-mono text-xs">
                    <div className="space-y-1 text-foreground-tertiary">
                      <p>→ Validating source-target column mappings...</p>
                      <p>→ Checking business rule preservation...</p>
                      <p>→ Verifying error handling patterns...</p>
                      <p className="text-foreground">→ {stageResult.message}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

          {isCompleted && (
            <div className="border border-border bg-gray-50/50 dark:bg-gray-900/20 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                <span className="text-base font-semibold">Validation Complete</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-foreground-secondary mb-1">Pass Rate</p>
                  <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-500">
                    {stageResult.metrics?.passRate}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-foreground-secondary mb-1">Checks Run</p>
                  <p className="text-2xl font-semibold">135</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-foreground-secondary mb-1">Issues Found</p>
                  <p className="text-2xl font-semibold">
                    {stageResult.metrics?.issuesFound}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {isCompleted && (
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold mb-1">Validation Complete</h3>
                <p className="text-xs text-foreground-secondary">
                  All tests passed. Proceed to optimization or completion.
                </p>
              </div>
              <Button onClick={moveToNextStage} size="lg">
                Continue to Optimization →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
