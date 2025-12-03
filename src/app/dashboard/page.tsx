import { Header } from '@/components/layout/header'
import { SystemStatus } from '@/components/dashboard/system-status'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  MigrationVolumeChart,
  SuccessRateTrendChart,
  QualityValidationChart,
  ProcessingTimeChart
} from '@/components/dashboard/interactive-charts'

async function getMetrics() {
  return {
    totalJobs: 173,
    completed: 157,
    activeJobs: 9,
    successRate: 92,
    avgTime: 3,
    qualityScore: 98.6
  }
}

async function getPatternStats() {
  return [
    { name: 'Fact Load', count: 42, successRate: 95.2, avgTime: '3.1min' },
    { name: 'SCD Type 2', count: 28, successRate: 92.9, avgTime: '4.2min' },
    { name: 'CDC', count: 24, successRate: 91.7, avgTime: '5.8min' },
    { name: 'Dimension Load', count: 38, successRate: 94.7, avgTime: '2.4min' },
    { name: 'Aggregation', count: 18, successRate: 88.9, avgTime: '6.3min' },
    { name: 'Lookup', count: 23, successRate: 100.0, avgTime: '1.8min' },
  ]
}

export default async function DashboardPage() {
  const [metrics, patternStats] = await Promise.all([
    getMetrics(),
    getPatternStats(),
  ])

  // Chart data
  const migrationVolume = [12, 18, 15, 22, 19, 25, 21, 28, 24, 31, 27, 35, 32, 29]
  const successRateTrend = [88, 89, 87, 90, 89, 91, 90, 92, 91, 93, 92, 94, 93, 92]
  const processingTime = [5.2, 5.0, 4.8, 4.6, 4.5, 4.3, 4.1, 4.0, 3.8, 3.6, 3.5, 3.4, 3.2, 3.0]
  const failedJobs = [0, 1, 0, 0, 2, 0, 1, 0, 0, 3, 0, 1, 0, 0]

  // Generate date labels for 14 days
  const dateLabels = ['16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29']
  const failureReasons = [
    { reason: 'Data validation failed', count: 4, color: '#dc2626' },
    { reason: 'Connection timeout', count: 3, color: '#f97316' },
    { reason: 'Schema mismatch', count: 2, color: '#eab308' }
  ]
  const totalFailures = failureReasons.reduce((sum, r) => sum + r.count, 0)

  const qualityMetrics = {
    rowCount: [97, 97.5, 98, 98.2, 98.5, 98.7, 99, 99.2, 99.5, 99.6, 99.7, 99.75, 99.78, 99.8],
    aggregate: [95, 95.5, 96, 96.5, 97, 97.3, 97.6, 97.9, 98.2, 98.4, 98.5, 98.55, 98.65, 98.7],
    sample: [93, 93.5, 94, 94.3, 94.8, 95.2, 95.6, 96, 96.5, 96.8, 97, 97.05, 97.15, 97.2]
  }

  const patternDistribution = [
    { name: 'Fact Load', count: 42, color: '#3b82f6' },
    { name: 'SCD Type 2', count: 28, color: '#8b5cf6' },
    { name: 'CDC', count: 24, color: '#10b981' },
    { name: 'Dim Load', count: 38, color: '#f59e0b' },
    { name: 'Aggregation', count: 18, color: '#ef4444' },
    { name: 'Lookup', count: 23, color: '#ec4899' }
  ]

  const totalPatterns = patternDistribution.reduce((sum, p) => sum + p.count, 0)

  return (
    <>
      <Header />
      <SystemStatus />
      <main className="p-6 space-y-6 max-w-[1800px] mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">Last 14 Days • Nov 16 - Nov 29, 2024</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-md">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-3 text-xs hover:bg-white"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-3 text-xs hover:bg-white"
              >
                3 Days
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="h-7 px-3 text-xs bg-white text-foreground shadow-sm hover:bg-white border border-border"
              >
                14 Days
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-3 text-xs hover:bg-white"
              >
                30 Days
              </Button>
            </div>

            {/* Refresh Button */}
            <Button
              variant="outline"
              className="h-12 w-12 p-0 border-blue-400 hover:bg-blue-50 hover:border-blue-500"
              title="Refresh dashboard"
            >
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Top Metrics - 5 Cards */}
        <div className="grid grid-cols-5 gap-6">
          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-foreground">Total Jobs</div>
              </div>
              <div className="mt-2">
                <div className="text-3xl font-semibold">{metrics.totalJobs}</div>
                <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 2l4 4H2z" />
                  </svg>
                  <span>+12 today</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-foreground">Completed</div>
              </div>
              <div className="mt-2">
                <div className="text-3xl font-semibold">{metrics.completed}</div>
                <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M2 6h8M6 2v8" />
                  </svg>
                  <span>{((metrics.completed/metrics.totalJobs)*100).toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-foreground">Success Rate</div>
              </div>
              <div className="mt-2">
                <div className="text-3xl font-semibold">{metrics.successRate}%</div>
                <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 2l4 4H2z" />
                  </svg>
                  <span>+2.3% vs target</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-foreground">Avg Time</div>
              </div>
              <div className="mt-2">
                <div className="text-3xl font-semibold">{metrics.avgTime}m</div>
                <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 10l-4-4h8z" />
                  </svg>
                  <span>-15% faster</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-foreground">Active Jobs</div>
              </div>
              <div className="mt-2">
                <div className="text-3xl font-semibold">{metrics.activeJobs}</div>
                <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                  <svg className="h-3 w-3 animate-spin" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 2V0M6 12v-2M10 6h2M0 6h2M9.5 2.5l1.5-1.5M1 10l1.5-1.5M9.5 9.5l1.5 1.5M1 2l1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span>Running now</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid - 2x3 */}
        <div className="grid grid-cols-2 gap-6">

          {/* Migration Volume - Interactive bar chart */}
          <MigrationVolumeChart data={migrationVolume} dateLabels={dateLabels} />

          {/* Success Rate Trend - Interactive area chart */}
          <SuccessRateTrendChart data={successRateTrend} dateLabels={dateLabels} />

          {/* Quality Validation Metrics - Interactive multi-line */}
          <QualityValidationChart data={qualityMetrics} dateLabels={dateLabels} />

          {/* Pattern Distribution - Donut chart */}
          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-base font-medium">Pattern Distribution</div>
              </div>
              <div className="h-48 flex items-center gap-6">
                {/* Legend */}
                <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  {patternDistribution.map((pattern, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: pattern.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-foreground font-medium truncate">{pattern.name}</div>
                        <div className="text-muted-foreground text-[10px]">
                          {pattern.count} ({((pattern.count / totalPatterns) * 100).toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Donut Chart */}
                <div className="relative w-48 h-48 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {(() => {
                      let startAngle = 0
                      return patternDistribution.map((pattern, i) => {
                        const percentage = pattern.count / totalPatterns
                        const angle = percentage * 360
                        const endAngle = startAngle + angle

                        const startRad = (startAngle * Math.PI) / 180
                        const endRad = (endAngle * Math.PI) / 180

                        const x1 = 50 + 40 * Math.cos(startRad)
                        const y1 = 50 + 40 * Math.sin(startRad)
                        const x2 = 50 + 40 * Math.cos(endRad)
                        const y2 = 50 + 40 * Math.sin(endRad)

                        const largeArc = angle > 180 ? 1 : 0

                        const pathData = [
                          `M 50 50`,
                          `L ${x1} ${y1}`,
                          `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
                          `Z`
                        ].join(' ')

                        startAngle = endAngle

                        return (
                          <path
                            key={i}
                            d={pathData}
                            fill={pattern.color}
                            stroke="white"
                            strokeWidth="0.5"
                          />
                        )
                      })
                    })()}
                    {/* Center hole */}
                    <circle cx="50" cy="50" r="20" fill="white" />
                    {/* Total in center */}
                    <text x="50" y="48" textAnchor="middle" className="text-[8px] font-semibold fill-foreground" transform="rotate(90 50 50)">
                      {totalPatterns}
                    </text>
                    <text x="50" y="56" textAnchor="middle" className="text-[5px] fill-muted-foreground" transform="rotate(90 50 50)">
                      Total
                    </text>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avg Processing Time - Interactive line chart */}
          <ProcessingTimeChart data={processingTime} dateLabels={dateLabels} />

          {/* Pattern Health - Success rate + Quality + Speed per pattern */}
          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-base font-medium">Pattern Health</div>
                <div className="text-xs text-muted-foreground">Top 6 Patterns</div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Lookup', success: 99.1, quality: 99.8, speed: 1.8, status: 'excellent' },
                  { name: 'SCD Type 2', success: 98.2, quality: 99.1, speed: 4.2, status: 'excellent' },
                  { name: 'Dimension', success: 97.5, quality: 99.3, speed: 2.4, status: 'good' },
                  { name: 'Fact Load', success: 96.8, quality: 98.6, speed: 3.1, status: 'good' },
                  { name: 'CDC', success: 95.3, quality: 97.8, speed: 5.8, status: 'warning' },
                  { name: 'Aggregation', success: 94.7, quality: 98.2, speed: 6.3, status: 'warning' }
                ].map((pattern, i) => {
                  const statusColors: Record<string, string> = {
                    excellent: 'border-green-200 bg-green-50',
                    good: 'border-blue-200 bg-blue-50',
                    warning: 'border-yellow-200 bg-yellow-50'
                  }
                  const dotColors: Record<string, string> = {
                    excellent: 'bg-green-500',
                    good: 'bg-blue-500',
                    warning: 'bg-yellow-500'
                  }
                  return (
                    <div key={i} className={`p-3 rounded-md border ${statusColors[pattern.status]}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${dotColors[pattern.status]}`} />
                        <div className="text-xs font-medium truncate">{pattern.name}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground">Success</span>
                          <span className="font-semibold">{pattern.success}%</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground">Quality</span>
                          <span className="font-semibold">{pattern.quality}%</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground">Avg Time</span>
                          <span className="font-semibold">{pattern.speed}m</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Failed Jobs, Alerts, and Recently Completed - 3-Column Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Failed Jobs - Left column */}
          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-base font-medium">Failed Jobs</div>
              </div>

              {/* Summary metrics */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div>
                  <div className="text-xl font-semibold text-red-600">{totalFailures}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Total</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-green-600">67%</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Retry</div>
                </div>
                <div>
                  <div className="text-xl font-semibold">6/9</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Resolved</div>
                </div>
              </div>

              {/* Failure Reasons with horizontal bars */}
              <div className="space-y-3">
                {failureReasons.map((reason, i) => {
                  const percentage = (reason.count / totalFailures) * 100
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: reason.color }} />
                          <span className="text-foreground font-medium truncate">{reason.reason}</span>
                        </div>
                        <span className="text-muted-foreground text-[11px]">{reason.count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: reason.color
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Alerts - Middle column */}
          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-base font-medium">Alerts</div>
              </div>

              <div className="space-y-3">
                {/* Error Alert */}
                <div className="flex gap-3 p-3 bg-red-50/30 border border-red-100 rounded-md hover:bg-red-50/50 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-red-900">DIM_CUSTOMER_SCD2_LOAD</div>
                    <div className="text-xs text-red-700 mt-1">Row count mismatch detected</div>
                    <div className="text-[10px] text-red-600 mt-1">2 minutes ago</div>
                  </div>
                </div>

                {/* Warning Alert */}
                <div className="flex gap-3 p-3 bg-yellow-50/30 border border-yellow-100 rounded-md hover:bg-yellow-50/50 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-yellow-900">FACT_SALES_DAILY_AGG</div>
                    <div className="text-xs text-yellow-700 mt-1">5 business rules need review</div>
                    <div className="text-[10px] text-yellow-600 mt-1">15 minutes ago</div>
                  </div>
                </div>

                {/* Warning Alert */}
                <div className="flex gap-3 p-3 bg-yellow-50/30 border border-yellow-100 rounded-md hover:bg-yellow-50/50 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-yellow-900">STG_INVENTORY_SNAPSHOT_CDC</div>
                    <div className="text-xs text-yellow-700 mt-1">Expression verification required</div>
                    <div className="text-[10px] text-yellow-600 mt-1">1 hour ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recently Completed - Right column */}
          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-base font-medium">Recently Completed</div>
              </div>

              <div className="space-y-3">
                {/* Completed Job 1 */}
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border border-border">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">DIM_PRODUCT_HIERARCHY</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">SCD Type 2 • Quality: 99.7%</div>
                    <div className="text-[10px] text-muted-foreground">12 minutes ago</div>
                  </div>
                </div>

                {/* Completed Job 2 */}
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border border-border">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">LKP_CURRENCY_EXCHANGE</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Lookup • Quality: 100%</div>
                    <div className="text-[10px] text-muted-foreground">28 minutes ago</div>
                  </div>
                </div>

                {/* Completed Job 3 */}
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border border-border">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">FACT_ORDERS_DAILY_SUMMARY</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Aggregation • Quality: 98.9%</div>
                    <div className="text-[10px] text-muted-foreground">1 hour ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3">
              <Link href="/migrations/pipeline">
                <Button className="bg-foreground text-background hover:bg-foreground/90">
                  New Migration
                </Button>
              </Link>
              <Link href="/migrations">
                <Button variant="secondary">View All Migrations</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
