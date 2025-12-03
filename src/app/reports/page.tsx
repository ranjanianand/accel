import { Header } from '@/components/layout/header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import Link from 'next/link'

// Mock data - replace with actual API calls
async function getReports() {
  return [
    {
      id: '1',
      name: 'November 2024 Migration Summary',
      type: 'Monthly Summary',
      generatedAt: new Date('2024-11-29T00:00:00'),
      status: 'ready',
      metrics: {
        totalMigrations: 247,
        completed: 221,
        failed: 12,
        pending: 14,
        avgQualityScore: 98.4,
        avgComplexity: 67,
      },
    },
    {
      id: '2',
      name: 'Quality Validation Report - Week 47',
      type: 'Quality Report',
      generatedAt: new Date('2024-11-25T00:00:00'),
      status: 'ready',
      metrics: {
        totalValidations: 8456,
        passed: 8321,
        failed: 135,
        avgAccuracy: 98.4,
        criticalIssues: 8,
      },
    },
    {
      id: '3',
      name: 'Business Rules Analysis - Q4 2024',
      type: 'Business Rules',
      generatedAt: new Date('2024-11-20T00:00:00'),
      status: 'ready',
      metrics: {
        totalRules: 1847,
        automated: 1652,
        needReview: 195,
        avgTestCoverage: 94.2,
      },
    },
    {
      id: '4',
      name: 'Expression Conversion Analytics',
      type: 'Analytics',
      generatedAt: new Date('2024-11-15T00:00:00'),
      status: 'ready',
      metrics: {
        totalExpressions: 185420,
        simpleConversions: 142350,
        complexConversions: 43070,
        failedConversions: 1247,
        successRate: 99.3,
      },
    },
    {
      id: '5',
      name: 'Performance Benchmarks - November',
      type: 'Performance',
      generatedAt: new Date('2024-11-10T00:00:00'),
      status: 'ready',
      metrics: {
        avgConversionTime: '3.2 min',
        avgValidationTime: '1.8 min',
        totalProcessingTime: '18,542 min',
        throughput: '42 jobs/hour',
      },
    },
    {
      id: '6',
      name: 'Pattern Distribution Analysis',
      type: 'Analytics',
      generatedAt: new Date('2024-11-05T00:00:00'),
      status: 'ready',
      metrics: {
        scdType2: 412,
        factLoad: 568,
        cdc: 347,
        lookup: 189,
        aggregation: 231,
        dimensionLoad: 100,
      },
    },
    {
      id: '7',
      name: 'Error Trends and Root Cause Analysis',
      type: 'Error Analysis',
      generatedAt: new Date('2024-11-01T00:00:00'),
      status: 'ready',
      metrics: {
        totalErrors: 342,
        rowCountMismatches: 124,
        expressionFailures: 89,
        businessRuleFailures: 76,
        schemaIssues: 53,
      },
    },
    {
      id: '8',
      name: 'December 2024 Forecast',
      type: 'Forecast',
      generatedAt: new Date('2024-11-28T00:00:00'),
      status: 'generating',
      metrics: {
        projectedMigrations: 285,
        estimatedCompletionRate: 96.5,
        estimatedProcessingTime: '21,450 min',
      },
    },
  ]
}

async function getReportStats() {
  return {
    totalReports: 127,
    reportsThisMonth: 18,
    avgGenerationTime: '2.4 min',
    storageUsed: '3.2 GB',
  }
}

export default async function ReportsPage() {
  const reports = await getReports()
  const stats = await getReportStats()

  return (
    <>
      <Header />

      <main className="p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Reports</h1>
            <p className="text-sm text-foreground-secondary mt-1">
              Generated reports and analytics for migration activities
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="gap-2">
              <FileText className="h-4 w-4" />
              Generate Custom Report
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          <Card className="p-5">
            <CardContent className="space-y-3 p-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">Total Reports</span>
                <FileText className="h-4 w-4 text-foreground-secondary" />
              </div>
              <div className="text-3xl font-bold">{stats.totalReports}</div>
              <div className="text-xs text-foreground-tertiary">All time</div>
            </CardContent>
          </Card>

          <Card className="p-5">
            <CardContent className="space-y-3 p-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">This Month</span>
                <TrendingUp className="h-4 w-4 text-status-success" />
              </div>
              <div className="text-3xl font-bold">{stats.reportsThisMonth}</div>
              <div className="text-xs text-status-success">+3 vs last month</div>
            </CardContent>
          </Card>

          <Card className="p-5">
            <CardContent className="space-y-3 p-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">Avg Generation Time</span>
                <Clock className="h-4 w-4 text-foreground-secondary" />
              </div>
              <div className="text-3xl font-bold">{stats.avgGenerationTime}</div>
              <div className="text-xs text-foreground-tertiary">Per report</div>
            </CardContent>
          </Card>

          <Card className="p-5">
            <CardContent className="space-y-3 p-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">Storage Used</span>
                <Download className="h-4 w-4 text-foreground-secondary" />
              </div>
              <div className="text-3xl font-bold">{stats.storageUsed}</div>
              <div className="text-xs text-foreground-tertiary">of 10 GB limit</div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-6 hover:bg-background-secondary transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{report.name}</h3>
                        {report.status === 'ready' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-status-success/10 text-status-success border border-status-success/20">
                            <CheckCircle2 className="h-3 w-3" />
                            Ready
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-status-info/10 text-status-info border border-status-info/20">
                            <Clock className="h-3 w-3" />
                            Generating
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-foreground-secondary mb-3">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" />
                          {report.type}
                        </span>
                        <span>
                          Generated {report.generatedAt.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Report Metrics */}
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        {Object.entries(report.metrics).slice(0, 4).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <div className="text-foreground-tertiary capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            <div className="font-semibold mt-0.5">
                              {typeof value === 'number' ? value.toLocaleString() : value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-6">
                      <Link href={report.id === '1' ? '/reports/monthly' : '#'}>
                        <Button variant="secondary" size="sm" className="gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          View
                        </Button>
                      </Link>
                      <Button variant="secondary" size="sm" className="gap-1.5">
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Types Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Available Report Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded bg-background-secondary flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">Monthly Summary</div>
                  <div className="text-xs text-foreground-secondary mt-0.5">
                    Overall migration statistics and trends for the month
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded bg-background-secondary flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">Quality Report</div>
                  <div className="text-xs text-foreground-secondary mt-0.5">
                    Validation results, data quality metrics, and accuracy scores
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded bg-background-secondary flex items-center justify-center shrink-0">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">Error Analysis</div>
                  <div className="text-xs text-foreground-secondary mt-0.5">
                    Error trends, root cause analysis, and resolution patterns
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded bg-background-secondary flex items-center justify-center shrink-0">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">Analytics & Forecast</div>
                  <div className="text-xs text-foreground-secondary mt-0.5">
                    Pattern distribution, performance benchmarks, and predictions
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
