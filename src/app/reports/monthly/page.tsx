import { Header } from '@/components/layout/header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, ChevronLeft, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'

export default function MonthlyReportPage() {
  const reportData = {
    period: 'November 2024',
    generatedAt: new Date('2024-11-29T00:00:00'),
    summary: {
      totalMigrations: 247,
      completed: 221,
      failed: 12,
      pending: 14,
      avgQualityScore: 98.4,
      avgComplexity: 67,
      totalProcessingTime: '18,542 min',
      avgConversionTime: '3.2 min',
    },
    weeklyTrend: [
      { week: 'Week 1', migrations: 58, completed: 52, failed: 3, pending: 3 },
      { week: 'Week 2', migrations: 62, completed: 56, failed: 2, pending: 4 },
      { week: 'Week 3', migrations: 64, completed: 59, failed: 4, pending: 1 },
      { week: 'Week 4', migrations: 63, completed: 54, failed: 3, pending: 6 },
    ],
    patternBreakdown: [
      { pattern: 'Fact Load', count: 72, percentage: 29.1, avgTime: '3.1 min', successRate: 98.6 },
      { pattern: 'SCD Type 2', count: 58, percentage: 23.5, avgTime: '4.2 min', successRate: 97.8 },
      { pattern: 'CDC', count: 45, percentage: 18.2, avgTime: '5.8 min', successRate: 96.2 },
      { pattern: 'Dimension Load', count: 38, percentage: 15.4, avgTime: '2.4 min', successRate: 99.2 },
      { pattern: 'Aggregation', count: 24, percentage: 9.7, avgTime: '6.3 min', successRate: 95.4 },
      { pattern: 'Lookup', count: 10, percentage: 4.0, avgTime: '1.8 min', successRate: 99.7 },
    ],
    complexityDistribution: [
      { range: 'Low (0-40%)', count: 42, percentage: 17.0, color: 'bg-status-success' },
      { range: 'Medium (41-70%)', count: 128, percentage: 51.8, color: 'bg-status-warning' },
      { range: 'High (71-100%)', count: 77, percentage: 31.2, color: 'bg-status-error' },
    ],
    topPerformers: [
      { name: 'LKP_CURRENCY_EXCHANGE_RATES', pattern: 'Lookup', time: '1.2 min', quality: 100 },
      { name: 'DIM_TIME_CALENDAR_LOAD', pattern: 'Dimension Load', time: '1.8 min', quality: 100 },
      { name: 'FACT_ORDER_LINE_ITEMS', pattern: 'Fact Load', time: '2.6 min', quality: 99.8 },
      { name: 'DIM_CUSTOMER_SCD2_LOAD', pattern: 'SCD Type 2', time: '3.8 min', quality: 99.7 },
      { name: 'STG_PRODUCT_HIERARCHY_CDC', pattern: 'CDC', time: '5.1 min', quality: 99.9 },
    ],
    issues: [
      { migration: 'DIM_PRODUCT_MASTER_LOAD', issue: 'Row count mismatch', severity: 'error' },
      { migration: 'AGG_SALES_SUMMARY', issue: 'Aggregate validation warning', severity: 'warning' },
      { migration: 'STG_INVENTORY_CDC', issue: 'Complex expression needs review', severity: 'warning' },
    ],
  }

  return (
    <>
      <Header />

      <main className="p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Report Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/reports">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Reports
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold">Monthly Migration Summary</h1>
              <p className="text-sm text-foreground-secondary mt-1">
                {reportData.period} • Generated {reportData.generatedAt.toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>

        {/* Executive Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-foreground-secondary mb-1">Total Migrations</div>
                <div className="text-3xl font-bold">{reportData.summary.totalMigrations}</div>
                <div className="text-xs text-status-success mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +18% vs Oct
                </div>
              </div>
              <div>
                <div className="text-sm text-foreground-secondary mb-1">Completed</div>
                <div className="text-3xl font-bold text-status-success">{reportData.summary.completed}</div>
                <div className="text-xs text-foreground-tertiary mt-1">
                  {((reportData.summary.completed / reportData.summary.totalMigrations) * 100).toFixed(1)}% completion rate
                </div>
              </div>
              <div>
                <div className="text-sm text-foreground-secondary mb-1">Failed</div>
                <div className="text-3xl font-bold text-status-error">{reportData.summary.failed}</div>
                <div className="text-xs text-foreground-tertiary mt-1">
                  {((reportData.summary.failed / reportData.summary.totalMigrations) * 100).toFixed(1)}% failure rate
                </div>
              </div>
              <div>
                <div className="text-sm text-foreground-secondary mb-1">Avg Quality Score</div>
                <div className="text-3xl font-bold">{reportData.summary.avgQualityScore}%</div>
                <div className="text-xs text-status-success mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +1.2% vs target
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-border">
              <div>
                <div className="text-sm text-foreground-secondary mb-1">Avg Complexity</div>
                <div className="text-xl font-semibold">{reportData.summary.avgComplexity}%</div>
              </div>
              <div>
                <div className="text-sm text-foreground-secondary mb-1">Total Processing Time</div>
                <div className="text-xl font-semibold">{reportData.summary.totalProcessingTime}</div>
              </div>
              <div>
                <div className="text-sm text-foreground-secondary mb-1">Avg Conversion Time</div>
                <div className="text-xl font-semibold">{reportData.summary.avgConversionTime}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Migration Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.weeklyTrend.map((week) => (
                <div key={week.week}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{week.week}</span>
                    <span className="text-sm text-foreground-secondary">
                      {week.migrations} migrations
                    </span>
                  </div>
                  <div className="flex gap-1 h-8">
                    <div
                      className="bg-status-success rounded-sm flex items-center justify-center text-xs text-white font-medium"
                      style={{ width: `${(week.completed / week.migrations) * 100}%` }}
                    >
                      {week.completed > 10 && `${week.completed}`}
                    </div>
                    <div
                      className="bg-status-error rounded-sm flex items-center justify-center text-xs text-white font-medium"
                      style={{ width: `${(week.failed / week.migrations) * 100}%` }}
                    >
                      {week.failed > 0 && `${week.failed}`}
                    </div>
                    <div
                      className="bg-status-warning rounded-sm flex items-center justify-center text-xs text-white font-medium"
                      style={{ width: `${(week.pending / week.migrations) * 100}%` }}
                    >
                      {week.pending > 0 && `${week.pending}`}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-status-success">✓ {week.completed} completed</span>
                    <span className="text-status-error">✗ {week.failed} failed</span>
                    <span className="text-status-warning">⏳ {week.pending} pending</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pattern Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Migration Pattern Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.patternBreakdown.map((pattern) => (
                <div key={pattern.pattern} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{pattern.pattern}</span>
                      <Badge variant="default">{pattern.count} migrations</Badge>
                      <span className="text-sm text-foreground-secondary">
                        {pattern.percentage}% of total
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-foreground-tertiary">Avg Time: </span>
                        <span className="font-semibold">{pattern.avgTime}</span>
                      </div>
                      <div>
                        <span className="text-foreground-tertiary">Success Rate: </span>
                        <span className="font-semibold text-status-success">{pattern.successRate}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-status-success"
                      style={{ width: `${pattern.successRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Complexity Distribution */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Complexity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.complexityDistribution.map((item) => (
                  <div key={item.range}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{item.range}</span>
                      <span className="text-sm font-semibold">{item.count} ({item.percentage}%)</span>
                    </div>
                    <div className="h-10 bg-background-tertiary rounded-lg overflow-hidden">
                      <div
                        className={`h-full ${item.color} flex items-center justify-center text-sm font-medium text-white`}
                        style={{ width: `${item.percentage}%` }}
                      >
                        {item.count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Migrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.topPerformers.map((migration, idx) => (
                  <div key={migration.name} className="flex items-center gap-3 p-3 rounded-lg bg-background-secondary">
                    <div className="h-8 w-8 rounded-full bg-status-success text-white flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{migration.name}</div>
                      <div className="text-xs text-foreground-secondary">{migration.pattern}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-status-success">{migration.quality}%</div>
                      <div className="text-xs text-foreground-tertiary">{migration.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Issues & Action Items */}
        <Card>
          <CardHeader>
            <CardTitle>Issues Requiring Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.issues.map((issue) => (
                <div
                  key={issue.migration}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={issue.severity === 'error' ? 'error' : 'warning'}>
                      {issue.severity}
                    </Badge>
                    <div>
                      <div className="font-medium">{issue.migration}</div>
                      <div className="text-sm text-foreground-secondary">{issue.issue}</div>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Investigate
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
