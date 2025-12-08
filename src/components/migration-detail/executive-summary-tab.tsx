'use client'

import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Clock, Target, Zap, CheckCircle2, AlertCircle, Briefcase, Layers, ArrowRightLeft, Download, FileText, AlertTriangle, TrendingDown, Eye } from 'lucide-react'
import { type ExecutiveSummaryData } from '@/lib/mock-migration-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export interface ExecutiveSummaryTabProps {
  data: ExecutiveSummaryData
}

export function ExecutiveSummaryTab({ data }: ExecutiveSummaryTabProps) {
  const router = useRouter()
  const { migration, metrics, breakdown, achievements, timeline, patternDistribution, sourceTarget } = data

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Description and Tags */}
        {(migration.description || (migration.tags && migration.tags.length > 0)) && (
          <div className="space-y-3">
            {migration.description && (
              <div>
                <p className="text-sm text-gray-700 leading-relaxed">{migration.description}</p>
              </div>
            )}
            {migration.tags && migration.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {migration.tags.map((tag, idx) => (
                  <Badge key={idx} variant="default" className="text-xs bg-blue-50 text-blue-700 border-blue-200 px-2.5 py-0.5">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Metrics Grid - Clean & Minimal */}
        <div className="grid grid-cols-5 gap-6">
          <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-1">{metrics.totalJobs}</div>
            <div className="text-sm text-gray-600">Total Jobs</div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-1">
              {formatNumber(metrics.timeSavings.min)}-{formatNumber(metrics.timeSavings.max)}h
            </div>
            <div className="text-sm text-gray-600">Time Saved</div>
            <div className="text-xs text-gray-500 mt-1">vs manual migration</div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Target className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-1">{metrics.qualityScore}%</div>
            <div className="text-sm text-gray-600">Quality Score</div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Zap className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-1">{metrics.automationRate}%</div>
            <div className="text-sm text-gray-600">Automation Rate</div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <TrendingDown className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-1">78%</div>
            <div className="text-sm text-gray-600">Error Reduction</div>
            <div className="text-xs text-gray-500 mt-1">vs manual migration</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center gap-4 py-4 border-y border-gray-200 bg-gray-50">
          <Button variant="secondary" className="gap-2" onClick={() => router.push(`/preview/${migration.id}`)}>
            <Eye className="h-4 w-4" />
            View Conversion Preview
          </Button>
          <Link href={`/migrations/${migration.id}/validation`}>
            <Button variant="secondary" className="gap-2">
              <FileText className="h-4 w-4" />
              View Validation Results
            </Button>
          </Link>
          <Link href={`/migrations/${migration.id}/issues`}>
            <Button variant="secondary" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Review Issues (2)
            </Button>
          </Link>
          <Button variant="secondary" className="gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>

        {/* Source/Target Summary & Pattern Distribution */}
        <div className="grid grid-cols-2 gap-6">
          {/* Source/Target Summary */}
          <Card className="border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-gray-400" />
                <CardTitle className="text-lg font-semibold text-gray-900">Source → Target</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Source Platform</div>
                  <div className="text-sm font-medium text-gray-900">{sourceTarget.source.platform} {sourceTarget.source.version}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Target Platform</div>
                  <div className="text-sm font-medium text-gray-900">{sourceTarget.target.platform} {sourceTarget.target.version}</div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-xs text-gray-500 mb-3">Generated Assets</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-gray-200 rounded p-3">
                      <div className="text-xs text-gray-500">Jobs</div>
                      <div className="text-lg font-semibold text-gray-900">{sourceTarget.generated.jobs}</div>
                    </div>
                    <div className="border border-gray-200 rounded p-3">
                      <div className="text-xs text-gray-500">Connections</div>
                      <div className="text-lg font-semibold text-gray-900">{sourceTarget.generated.connections}</div>
                    </div>
                    <div className="border border-gray-200 rounded p-3">
                      <div className="text-xs text-gray-500">Routines</div>
                      <div className="text-lg font-semibold text-gray-900">{sourceTarget.generated.routines}</div>
                    </div>
                    <div className="border border-gray-200 rounded p-3">
                      <div className="text-xs text-gray-500">Contexts</div>
                      <div className="text-lg font-semibold text-gray-900">{sourceTarget.generated.contexts}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pattern Distribution */}
          <Card className="border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-gray-400" />
                <CardTitle className="text-lg font-semibold text-gray-900">Pattern Distribution</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patternDistribution.map((pattern, index) => {
                  const colors = [
                    'bg-blue-500',
                    'bg-emerald-500',
                    'bg-indigo-500',
                    'bg-cyan-500',
                    'bg-violet-500'
                  ]
                  const color = colors[index % colors.length]

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-700">{pattern.pattern}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{pattern.count} jobs</span>
                          <span className="font-medium text-gray-900">{pattern.percentage}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all`}
                          style={{ width: `${pattern.percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Migration Summary */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Migration Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Total Jobs with Visual Split */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Total Jobs</span>
                    <span className="text-2xl font-semibold text-gray-900">{metrics.totalJobs}</span>
                  </div>

                  {/* Visual breakdown bar with percentages */}
                  <div className="relative">
                    <div className="h-12 bg-gray-50 rounded-lg overflow-hidden flex border border-gray-200">
                      <div
                        className="bg-emerald-100 border-r border-emerald-200"
                        style={{ width: `${(metrics.automatedJobs / metrics.totalJobs) * 100}%` }}
                      ></div>
                      <div
                        className="bg-blue-50"
                        style={{ width: `${(metrics.manualJobs / metrics.totalJobs) * 100}%` }}
                      ></div>
                    </div>
                    {/* Percentage labels */}
                    <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                      <span className="text-xs font-semibold text-emerald-700">
                        {Math.round((metrics.automatedJobs / metrics.totalJobs) * 100)}%
                      </span>
                      <span className="text-xs font-semibold text-blue-700">
                        {Math.round((metrics.manualJobs / metrics.totalJobs) * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-emerald-200"></div>
                      <span className="text-gray-600">Automated</span>
                      <span className="font-medium text-gray-900 ml-auto">{metrics.automatedJobs}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-blue-200"></div>
                      <span className="text-gray-600">Manual Review</span>
                      <span className="font-medium text-gray-900 ml-auto">{metrics.manualJobs}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="text-sm font-medium text-gray-700 mb-4">By Complexity</div>
                  <div className="flex items-center gap-6">
                    {/* Legend on left */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                          <span className="text-gray-600">Low</span>
                        </div>
                        <span className="font-medium text-gray-900">{breakdown.lowComplexity.count} jobs</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-gray-600">Medium</span>
                        </div>
                        <span className="font-medium text-gray-900">{breakdown.mediumComplexity.count} jobs</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                          <span className="text-gray-600">High</span>
                        </div>
                        <span className="font-medium text-gray-900">{breakdown.highComplexity.count} jobs</span>
                      </div>
                    </div>

                    {/* Donut Chart on right */}
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <svg viewBox="0 0 100 100" className="transform -rotate-90">
                        {/* Background circle */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="20" />
                        {(() => {
                          const total = breakdown.lowComplexity.count + breakdown.mediumComplexity.count + breakdown.highComplexity.count
                          const lowPercent = (breakdown.lowComplexity.count / total) * 100
                          const mediumPercent = (breakdown.mediumComplexity.count / total) * 100
                          const highPercent = (breakdown.highComplexity.count / total) * 100

                          const circumference = 2 * Math.PI * 40
                          const lowDash = (lowPercent / 100) * circumference
                          const mediumDash = (mediumPercent / 100) * circumference
                          const highDash = (highPercent / 100) * circumference

                          const offset = 0

                          return (
                            <>
                              {/* Low complexity segment */}
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="20"
                                strokeDasharray={`${lowDash} ${circumference - lowDash}`}
                                strokeDashoffset={-offset}
                              />
                              {/* Medium complexity segment */}
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="20"
                                strokeDasharray={`${mediumDash} ${circumference - mediumDash}`}
                                strokeDashoffset={-(offset + lowDash)}
                              />
                              {/* High complexity segment */}
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="#6366f1"
                                strokeWidth="20"
                                strokeDasharray={`${highDash} ${circumference - highDash}`}
                                strokeDashoffset={-(offset + lowDash + mediumDash)}
                              />
                            </>
                          )
                        })()}
                      </svg>
                      {/* Center text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-xl font-semibold text-gray-900">{metrics.totalJobs}</div>
                          <div className="text-xs text-gray-500">Jobs</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Bar Chart */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Migration Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Stacked Horizontal Bar */}
                <div>
                  <div className="flex h-12 rounded-lg overflow-hidden border border-gray-200">
                    {timeline.map((stage, index) => {
                      const colors = [
                        'bg-blue-500',
                        'bg-emerald-500',
                        'bg-indigo-500',
                        'bg-cyan-500',
                        'bg-teal-500'
                      ]
                      const color = colors[index % colors.length]

                      return (
                        <div
                          key={index}
                          className={`${color} flex items-center justify-center relative group`}
                          style={{ width: `${stage.percentage}%` }}
                        >
                          <span className="text-xs font-medium text-white">{stage.percentage}%</span>
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            {stage.stage}: {stage.duration} min
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Legend with stage details */}
                <div className="space-y-2">
                  {timeline.map((stage, index) => {
                    const colors = [
                      { bg: 'bg-blue-500', text: 'text-blue-700' },
                      { bg: 'bg-emerald-500', text: 'text-emerald-700' },
                      { bg: 'bg-indigo-500', text: 'text-indigo-700' },
                      { bg: 'bg-cyan-500', text: 'text-cyan-700' },
                      { bg: 'bg-teal-500', text: 'text-teal-700' }
                    ]
                    const color = colors[index % colors.length]

                    return (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${color.bg}`}></div>
                          <span className="text-gray-700">{stage.stage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{stage.duration} min</span>
                          <span className={`font-medium ${color.text}`}>{stage.percentage}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="font-medium text-sm text-gray-700">Total Duration</span>
                  <span className="font-semibold text-gray-900">{migration.duration} minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Benefits & Achievements */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Key Benefits & Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {/* Benefits */}
              <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">78% error reduction vs manual migration</span>
              </div>
              <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">15 minutes vs 3-4 weeks delivery time</span>
              </div>
              <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Production-ready with full validation</span>
              </div>

              {/* Achievements */}
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  {achievement.type === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-sm text-gray-700">{achievement.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
