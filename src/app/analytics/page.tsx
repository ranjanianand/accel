import { Header } from '@/components/layout/header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react'

export default function AnalyticsPage() {
  // Migration trends data
  const migrationTrends = [
    { month: 'Jul', total: 156, completed: 142, failed: 8, pending: 6 },
    { month: 'Aug', total: 178, completed: 164, failed: 7, pending: 7 },
    { month: 'Sep', total: 189, completed: 172, failed: 10, pending: 7 },
    { month: 'Oct', total: 209, completed: 187, failed: 12, pending: 10 },
    { month: 'Nov', total: 247, completed: 221, failed: 12, pending: 14 },
  ]

  // Pattern distribution
  const patternData = [
    { pattern: 'Fact Load', count: 568, percentage: 29.8, color: 'bg-blue-500' },
    { pattern: 'SCD Type 2', count: 412, percentage: 21.6, color: 'bg-purple-500' },
    { pattern: 'CDC', count: 347, percentage: 18.2, color: 'bg-green-500' },
    { pattern: 'Dimension Load', count: 298, percentage: 15.6, color: 'bg-yellow-500' },
    { pattern: 'Aggregation', count: 231, percentage: 12.1, color: 'bg-orange-500' },
    { pattern: 'Lookup', count: 189, percentage: 9.9, color: 'bg-pink-500' },
  ]

  // Success rate over time
  const successRates = [
    { month: 'Jul', rate: 91.0 },
    { month: 'Aug', rate: 92.1 },
    { month: 'Sep', rate: 91.0 },
    { month: 'Oct', rate: 89.5 },
    { month: 'Nov', rate: 89.4 },
  ]

  // Complexity breakdown
  const complexityData = [
    { range: 'Low (0-40%)', count: 342, percentage: 17.9 },
    { range: 'Medium (41-70%)', count: 1028, percentage: 53.9 },
    { range: 'High (71-100%)', count: 537, percentage: 28.2 },
  ]

  // Quality metrics trend
  const qualityTrend = [
    { month: 'Jul', rowMatch: 99.2, aggMatch: 98.1, sampleMatch: 96.8 },
    { month: 'Aug', rowMatch: 99.4, aggMatch: 98.3, sampleMatch: 97.1 },
    { month: 'Sep', rowMatch: 99.5, aggMatch: 98.5, sampleMatch: 97.4 },
    { month: 'Oct', rowMatch: 99.6, aggMatch: 98.6, sampleMatch: 97.0 },
    { month: 'Nov', rowMatch: 99.8, aggMatch: 98.7, sampleMatch: 97.2 },
  ]

  // Processing time by pattern
  const processingTimes = [
    { pattern: 'Lookup', avgTime: 1.8, maxTime: 3.2 },
    { pattern: 'Dimension Load', avgTime: 2.4, maxTime: 4.8 },
    { pattern: 'Fact Load', avgTime: 3.1, maxTime: 6.5 },
    { pattern: 'SCD Type 2', avgTime: 4.2, maxTime: 8.7 },
    { pattern: 'CDC', avgTime: 5.8, maxTime: 12.3 },
    { pattern: 'Aggregation', avgTime: 6.3, maxTime: 15.2 },
  ]

  const maxValue = Math.max(...migrationTrends.map(m => m.total))

  return (
    <>
      <Header />

      <main className="p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Analytics & Reports</h1>
            <p className="text-sm text-foreground-secondary mt-1">
              Visual insights and trends across all migration activities
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="gap-2">
              <Calendar className="h-4 w-4" />
              Last 6 Months
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Export Dashboard
            </Button>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-4 gap-6">
          <Card className="p-5">
            <CardContent className="space-y-3 p-0">
              <div className="text-sm text-foreground-secondary">Total Migrations</div>
              <div className="text-3xl font-bold">1,907</div>
              <div className="flex items-center gap-1 text-xs text-status-success">
                <TrendingUp className="h-3 w-3" />
                +22% vs last period
              </div>
            </CardContent>
          </Card>

          <Card className="p-5">
            <CardContent className="space-y-3 p-0">
              <div className="text-sm text-foreground-secondary">Avg Quality Score</div>
              <div className="text-3xl font-bold">98.6%</div>
              <div className="flex items-center gap-1 text-xs text-status-success">
                <TrendingUp className="h-3 w-3" />
                +1.3% improvement
              </div>
            </CardContent>
          </Card>

          <Card className="p-5">
            <CardContent className="space-y-3 p-0">
              <div className="text-sm text-foreground-secondary">Success Rate</div>
              <div className="text-3xl font-bold">89.4%</div>
              <div className="flex items-center gap-1 text-xs text-status-error">
                <TrendingDown className="h-3 w-3" />
                -1.6% vs target
              </div>
            </CardContent>
          </Card>

          <Card className="p-5">
            <CardContent className="space-y-3 p-0">
              <div className="text-sm text-foreground-secondary">Avg Processing Time</div>
              <div className="text-3xl font-bold">3.8m</div>
              <div className="flex items-center gap-1 text-xs text-status-success">
                <TrendingUp className="h-3 w-3" />
                15% faster
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Migration Volume Trend - Bar Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Migration Volume Trend</CardTitle>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-status-success" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-status-error" />
                  <span>Failed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-status-warning" />
                  <span>Pending</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {migrationTrends.map((month) => (
                <div key={month.month}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium w-12">{month.month}</span>
                    <span className="text-sm text-foreground-secondary">{month.total} migrations</span>
                  </div>
                  <div className="flex gap-1">
                    <div
                      className="bg-status-success h-10 rounded-sm flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(month.completed / maxValue) * 100}%` }}
                    >
                      {month.completed}
                    </div>
                    <div
                      className="bg-status-error h-10 rounded-sm flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(month.failed / maxValue) * 100}%` }}
                    >
                      {month.failed > 5 && month.failed}
                    </div>
                    <div
                      className="bg-status-warning h-10 rounded-sm flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(month.pending / maxValue) * 100}%` }}
                    >
                      {month.pending > 5 && month.pending}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          {/* Pattern Distribution - Donut/Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Pattern Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patternData.map((item) => (
                  <div key={item.pattern}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-sm ${item.color}`} />
                        <span className="text-sm font-medium">{item.pattern}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold">{item.count}</span>
                        <span className="text-xs text-foreground-tertiary ml-2">({item.percentage}%)</span>
                      </div>
                    </div>
                    <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Donut Chart Visualization */}
              <div className="mt-6 flex justify-center">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    {(() => {
                      let currentAngle = 0
                      return patternData.map((item, idx) => {
                        const percentage = item.percentage / 100
                        const angle = percentage * 360
                        const radius = 40
                        const innerRadius = 25

                        const startAngle = currentAngle
                        const endAngle = currentAngle + angle
                        currentAngle = endAngle

                        const x1 = 50 + radius * Math.cos((startAngle * Math.PI) / 180)
                        const y1 = 50 + radius * Math.sin((startAngle * Math.PI) / 180)
                        const x2 = 50 + radius * Math.cos((endAngle * Math.PI) / 180)
                        const y2 = 50 + radius * Math.sin((endAngle * Math.PI) / 180)

                        const x3 = 50 + innerRadius * Math.cos((endAngle * Math.PI) / 180)
                        const y3 = 50 + innerRadius * Math.sin((endAngle * Math.PI) / 180)
                        const x4 = 50 + innerRadius * Math.cos((startAngle * Math.PI) / 180)
                        const y4 = 50 + innerRadius * Math.sin((startAngle * Math.PI) / 180)

                        const largeArc = angle > 180 ? 1 : 0

                        const colorMap: Record<string, string> = {
                          'bg-blue-500': '#3b82f6',
                          'bg-purple-500': '#a855f7',
                          'bg-green-500': '#22c55e',
                          'bg-yellow-500': '#eab308',
                          'bg-orange-500': '#f97316',
                          'bg-pink-500': '#ec4899',
                        }

                        return (
                          <path
                            key={idx}
                            d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`}
                            fill={colorMap[item.color]}
                          />
                        )
                      })
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">1,907</div>
                      <div className="text-xs text-foreground-tertiary">Total</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Rate Trend - Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Success Rate Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2 border-b border-l border-border pb-0 pl-0">
                {successRates.map((month, idx) => (
                  <div key={month.month} className="flex-1 flex flex-col items-center">
                    <div className="w-full relative" style={{ height: '200px' }}>
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-status-success/20 to-status-success/5 rounded-t"
                        style={{ height: `${month.rate}%` }}
                      />
                      <div
                        className="absolute w-full flex justify-center"
                        style={{ bottom: `${month.rate}%` }}
                      >
                        <div className="h-2 w-2 rounded-full bg-status-success" />
                      </div>
                      <div
                        className="absolute w-full text-center text-xs font-semibold"
                        style={{ bottom: `${month.rate + 2}%` }}
                      >
                        {month.rate}%
                      </div>
                    </div>
                    <div className="text-xs text-foreground-secondary mt-2">{month.month}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-foreground-tertiary">
                <span>Jul 2024</span>
                <span>Nov 2024</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quality Metrics Trend - Multi-line Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Quality Validation Metrics</CardTitle>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span>Row Count Match</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500" />
                  <span>Aggregate Match</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span>Sample Match</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 relative border-b border-l border-border">
              {qualityTrend.map((month, idx) => (
                <div key={month.month} className="absolute" style={{ left: `${(idx / (qualityTrend.length - 1)) * 100}%`, bottom: 0, width: '1px', height: '100%' }}>
                  {/* Row Match */}
                  <div
                    className="absolute w-2 h-2 rounded-full bg-blue-500 -ml-1"
                    style={{ bottom: `${month.rowMatch - 94}%` }}
                  />
                  {/* Aggregate Match */}
                  <div
                    className="absolute w-2 h-2 rounded-full bg-purple-500 -ml-1"
                    style={{ bottom: `${month.aggMatch - 94}%` }}
                  />
                  {/* Sample Match */}
                  <div
                    className="absolute w-2 h-2 rounded-full bg-green-500 -ml-1"
                    style={{ bottom: `${month.sampleMatch - 94}%` }}
                  />
                </div>
              ))}
              <div className="absolute left-0 right-0 bottom-0 flex justify-between px-4">
                {qualityTrend.map((month) => (
                  <div key={month.month} className="text-xs text-foreground-secondary">
                    {month.month}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-500">99.8%</div>
                <div className="text-xs text-foreground-secondary">Row Count (Nov)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-500">98.7%</div>
                <div className="text-xs text-foreground-secondary">Aggregate (Nov)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">97.2%</div>
                <div className="text-xs text-foreground-secondary">Sample (Nov)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Time by Pattern - Horizontal Bar */}
        <Card>
          <CardHeader>
            <CardTitle>Average Processing Time by Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processingTimes.map((item) => (
                <div key={item.pattern}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium w-40">{item.pattern}</span>
                    <div className="flex-1 mx-4">
                      <div className="h-8 bg-background-tertiary rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-status-success to-status-warning rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${(item.avgTime / 6.3) * 100}%` }}
                        >
                          <span className="text-xs font-medium text-white">{item.avgTime}m</span>
                        </div>
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-status-error"
                          style={{ left: `${(item.maxTime / 15.2) * 100}%` }}
                          title={`Max: ${item.maxTime}m`}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-foreground-tertiary w-20 text-right">
                      Max: {item.maxTime}m
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Complexity Distribution - Stacked Bar */}
        <Card>
          <CardHeader>
            <CardTitle>Migration Complexity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-2 h-16">
                {complexityData.map((item, idx) => (
                  <div
                    key={item.range}
                    className={`${
                      idx === 0 ? 'bg-status-success' : idx === 1 ? 'bg-status-warning' : 'bg-status-error'
                    } rounded flex flex-col items-center justify-center text-white`}
                    style={{ width: `${item.percentage}%` }}
                  >
                    <span className="text-lg font-bold">{item.count}</span>
                    <span className="text-xs">{item.percentage}%</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {complexityData.map((item, idx) => (
                  <div key={item.range} className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded ${
                      idx === 0 ? 'bg-status-success' : idx === 1 ? 'bg-status-warning' : 'bg-status-error'
                    }`} />
                    <div>
                      <div className="text-sm font-medium">{item.range}</div>
                      <div className="text-xs text-foreground-secondary">{item.count} migrations</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
