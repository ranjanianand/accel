"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, DollarSign, Users, TrendingUp, CheckCircle, XCircle, Zap } from 'lucide-react'

export default function ComparePage() {
  const [jobCount, setJobCount] = useState(100)

  // Calculations based on Migration Accelerator metrics
  const calculations = {
    // Manual Process (traditional migration)
    manual: {
      automationRate: 0.35, // 30-50% automation
      timePerJob: 8, // hours
      errorRate: 0.22, // 22% error rate
      costPerHour: 75, // USD per hour
      reworkFactor: 1.3 // 30% rework time
    },
    // Automated Process (Migration Accelerator)
    automated: {
      automationRate: 0.945, // 92-97% automation
      timePerJob: 0.8, // hours (7-12x faster)
      errorRate: 0.048, // 4.8% error rate (78% reduction)
      costPerHour: 75,
      reworkFactor: 1.05 // 5% rework time
    }
  }

  const manualTime = jobCount * calculations.manual.timePerJob * calculations.manual.reworkFactor
  const automatedTime = jobCount * calculations.automated.timePerJob * calculations.automated.reworkFactor

  const manualCost = manualTime * calculations.manual.costPerHour
  const automatedCost = automatedTime * calculations.automated.costPerHour

  const timeSaved = manualTime - automatedTime
  const costSaved = manualCost - automatedCost
  const roi = ((costSaved / automatedCost) * 100)
  const speedupFactor = (manualTime / automatedTime)

  const manualErrors = Math.round(jobCount * calculations.manual.errorRate)
  const automatedErrors = Math.round(jobCount * calculations.automated.errorRate)
  const errorReduction = ((1 - (automatedErrors / manualErrors)) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Before vs After: Migration Process Comparison
        </h1>
        <p className="text-slate-600">
          See the quantified impact of Migration Accelerator on your project
        </p>
      </div>

      {/* Job Count Selector */}
      <Card className="p-6 bg-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Project Scope
            </h2>
            <p className="text-sm text-slate-600">
              Adjust the number of jobs to see impact on your specific project
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setJobCount(Math.max(10, jobCount - 10))}
            >
              -10
            </Button>
            <div className="text-center min-w-[120px]">
              <div className="text-3xl font-bold text-blue-600">{jobCount}</div>
              <div className="text-xs text-slate-500">Informatica jobs</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setJobCount(jobCount + 10)}
            >
              +10
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <Clock className="w-8 h-8 text-green-600 mb-3" />
          <div className="text-2xl font-bold text-green-700 mb-1">
            {timeSaved.toFixed(0)}h
          </div>
          <div className="text-sm text-green-600">Time Saved</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <DollarSign className="w-8 h-8 text-blue-600 mb-3" />
          <div className="text-2xl font-bold text-blue-700 mb-1">
            ${costSaved.toLocaleString()}
          </div>
          <div className="text-sm text-blue-600">Cost Savings</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200">
          <TrendingUp className="w-8 h-8 text-purple-600 mb-3" />
          <div className="text-2xl font-bold text-purple-700 mb-1">
            {roi.toFixed(0)}%
          </div>
          <div className="text-sm text-purple-600">ROI</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
          <Zap className="w-8 h-8 text-orange-600 mb-3" />
          <div className="text-2xl font-bold text-orange-700 mb-1">
            {speedupFactor.toFixed(1)}x
          </div>
          <div className="text-sm text-orange-600">Faster</div>
        </Card>
      </div>

      {/* Side by Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Manual Process */}
        <Card className="p-6 bg-white border-2 border-red-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Manual Process</h2>
              <p className="text-sm text-slate-600">Traditional migration approach</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Automation Rate</span>
                <span className="text-lg font-bold text-red-600">
                  {(calculations.manual.automationRate * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${calculations.manual.automationRate * 100}%` }}
                />
              </div>
            </div>

            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Time</span>
                <span className="text-lg font-bold text-slate-900">
                  {manualTime.toFixed(0)} hours
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                ~{(manualTime / 160).toFixed(1)} months at 40h/week
              </p>
            </div>

            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Cost</span>
                <span className="text-lg font-bold text-slate-900">
                  ${manualCost.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                At ${calculations.manual.costPerHour}/hour loaded rate
              </p>
            </div>

            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Error Rate</span>
                <span className="text-lg font-bold text-red-600">
                  {(calculations.manual.errorRate * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                ~{manualErrors} jobs requiring rework
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Manual Work</span>
                <span className="text-lg font-bold text-red-600">
                  {((1 - calculations.manual.automationRate) * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Requires extensive manual coding and testing
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-900 mb-2 text-sm">Challenges:</h3>
            <ul className="text-xs text-red-700 space-y-1">
              <li>• High manual effort (50-70% of work)</li>
              <li>• Inconsistent quality across team</li>
              <li>• Lengthy testing and debugging cycles</li>
              <li>• Risk of human error in repetitive tasks</li>
            </ul>
          </div>
        </Card>

        {/* Automated Process */}
        <Card className="p-6 bg-white border-2 border-green-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">With Migration Accelerator</h2>
              <p className="text-sm text-slate-600">AI-powered automation platform</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Automation Rate</span>
                <span className="text-lg font-bold text-green-600">
                  {(calculations.automated.automationRate * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${calculations.automated.automationRate * 100}%` }}
                />
              </div>
            </div>

            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Time</span>
                <span className="text-lg font-bold text-slate-900">
                  {automatedTime.toFixed(0)} hours
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                ↓ {((1 - automatedTime / manualTime) * 100).toFixed(0)}% reduction
                (~{(automatedTime / 160).toFixed(1)} months)
              </p>
            </div>

            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Cost</span>
                <span className="text-lg font-bold text-slate-900">
                  ${automatedCost.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                ↓ ${costSaved.toLocaleString()} saved
              </p>
            </div>

            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Error Rate</span>
                <span className="text-lg font-bold text-green-600">
                  {(calculations.automated.errorRate * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                ↓ {errorReduction.toFixed(0)}% error reduction (~{automatedErrors} jobs)
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Manual Work</span>
                <span className="text-lg font-bold text-green-600">
                  {((1 - calculations.automated.automationRate) * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Focus only on business logic and edge cases
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2 text-sm">Benefits:</h3>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• 92-97% automation with AI engines</li>
              <li>• Consistent quality and standards</li>
              <li>• Built-in validation and testing</li>
              <li>• Focus team on high-value work</li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Detailed Metrics Breakdown */}
      <Card className="p-6 bg-white mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Detailed Impact Analysis for {jobCount} Jobs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Time Analysis */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-900">Time Analysis</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Manual approach:</span>
                <span className="font-semibold">{manualTime.toFixed(0)}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Accelerator:</span>
                <span className="font-semibold text-green-600">{automatedTime.toFixed(0)}h</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-600">Time saved:</span>
                  <span className="font-bold text-green-600">{timeSaved.toFixed(0)}h</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-600">Speedup factor:</span>
                  <span className="font-bold text-blue-600">{speedupFactor.toFixed(1)}x faster</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Analysis */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-slate-900">Cost Analysis</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Manual cost:</span>
                <span className="font-semibold">${manualCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Accelerator cost:</span>
                <span className="font-semibold text-green-600">${automatedCost.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-600">Cost savings:</span>
                  <span className="font-bold text-green-600">${costSaved.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-600">ROI:</span>
                  <span className="font-bold text-blue-600">{roi.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quality Analysis */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-slate-900">Quality Analysis</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Manual errors:</span>
                <span className="font-semibold text-red-600">{manualErrors} jobs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Accelerator errors:</span>
                <span className="font-semibold text-green-600">{automatedErrors} jobs</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-600">Error reduction:</span>
                  <span className="font-bold text-green-600">{errorReduction.toFixed(0)}%</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-600">Quality improvement:</span>
                  <span className="font-bold text-blue-600">
                    {((calculations.automated.automationRate / calculations.manual.automationRate) * 100 - 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Competitive Advantage */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Why Migration Accelerator Leads the Market
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Competitive Comparison</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span className="text-slate-600">Migration Accelerator</span>
                <Badge variant="default">92-97%</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span className="text-slate-600">Travinto X2XConverter</span>
                <Badge variant="secondary">~90%</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span className="text-slate-600">Artha B&apos;etl™</span>
                <Badge variant="outline">70%</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span className="text-slate-600">Manual/Custom</span>
                <Badge variant="outline">30-50%</Badge>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Key Differentiators</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>21 AI-powered migration engines</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>19 enterprise ETL patterns (95%+ coverage)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>200+ function mappings with AST parsing</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>99.7%+ data validation accuracy</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Real-time preview and certainty scoring</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
