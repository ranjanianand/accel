'use client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, CheckCircle2 } from 'lucide-react'
import { type ValidationResultsData } from '@/lib/mock-migration-data'

export function ValidationResultsTab({ data }: { data: ValidationResultsData }) {
  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {/* Left: Overall Score */}
              <div className="flex items-baseline gap-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Overall Validation Score</div>
                  <div className="text-4xl font-bold text-gray-900">{data.overallScore}%</div>
                </div>
                <div className="text-sm text-gray-600">
                  Across {data.engines.length} quality dimensions
                </div>
              </div>

              {/* Right: Summary Stats */}
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{data.engines.reduce((acc, e) => acc + e.details.tested, 0)}</div>
                  <div className="text-xs text-gray-500 mt-1">Total Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{data.engines.reduce((acc, e) => acc + e.details.passed, 0)}</div>
                  <div className="text-xs text-gray-500 mt-1">Tests Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{data.engines.reduce((acc, e) => acc + e.details.warnings, 0)}</div>
                  <div className="text-xs text-gray-500 mt-1">Warnings</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.engines.map((engine, index) => {
            const colors = [
              'bg-blue-300',
              'bg-emerald-300',
              'bg-violet-300',
              'bg-amber-300',
              'bg-cyan-300',
              'bg-rose-300'
            ]
            const progressColor = colors[index % colors.length]

            return (
              <Card key={index} className="border-gray-200 hover:border-gray-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg font-semibold text-gray-900">{engine.name}</CardTitle>
                    <span className="text-lg font-semibold text-gray-900 flex-shrink-0">
                      {engine.score}%
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">{engine.description}</p>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">Pass Rate</span>
                        <span className="text-xs font-medium text-gray-900">{engine.details.passed}/{engine.details.tested}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`${progressColor} h-2 rounded-full transition-all`}
                          style={{ width: `${engine.score}%` }}
                        />
                      </div>
                    </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-gray-200 rounded p-3 bg-gray-50">
                      <div className="text-xs text-gray-500">Tested</div>
                      <div className="text-lg font-semibold text-gray-900">{engine.details.tested}</div>
                    </div>
                    <div className="border border-gray-200 rounded p-3 bg-gray-50">
                      <div className="text-xs text-gray-500">Passed</div>
                      <div className="text-lg font-semibold text-gray-900">{engine.details.passed}</div>
                    </div>
                    {engine.details.warnings > 0 && (
                      <div className="border border-gray-200 rounded p-3 bg-gray-50 col-span-2">
                        <div className="text-xs text-gray-500">Warnings</div>
                        <div className="text-lg font-semibold text-gray-900">{engine.details.warnings}</div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            )
          })}
        </div>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Migration Optimizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.optimizations.map((opt, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">{opt.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{opt.improvement}</div>
                    <div className="text-xs text-gray-500 mt-1">{opt.jobsAffected} jobs ({opt.percentageAffected}%)</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Test Evidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.testEvidence.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div>
                    <div className="font-medium text-sm text-gray-900">{doc.name}</div>
                    <div className="text-xs text-gray-500">{doc.format} • {doc.size}</div>
                  </div>
                  <Button variant="secondary" size="sm" className="gap-2">
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
