'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Filter, ChevronDown, ChevronRight } from 'lucide-react'
import { type TechnicalDetailsData } from '@/lib/mock-migration-data'
import { useState } from 'react'

export interface TechnicalDetailsTabProps {
  data: TechnicalDetailsData
}

export function TechnicalDetailsTab({ data }: TechnicalDetailsTabProps) {
  const [expandedExpression, setExpandedExpression] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'auto' | 'manual'>('all')

  const filteredMappings = data.componentMappings.filter(
    (m) => filterStatus === 'all' || m.status === filterStatus
  )

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Component Mapping Table */}
        <Card className="border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Component Mapping</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search components..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                  />
                </div>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1 bg-gray-50">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-1 text-sm rounded ${
                      filterStatus === 'all'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus('auto')}
                    className={`px-3 py-1 text-sm rounded ${
                      filterStatus === 'auto'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Auto
                  </button>
                  <button
                    onClick={() => setFilterStatus('manual')}
                    className={`px-3 py-1 text-sm rounded ${
                      filterStatus === 'manual'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Manual
                  </button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Informatica Source
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Talend Target
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pattern
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Complexity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMappings.map((mapping, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {mapping.informaticaSource}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{mapping.talendTarget}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <Badge variant="default" className="bg-gray-100 text-gray-700 border-0">
                          {mapping.pattern}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="default" className="bg-gray-100 text-gray-700 border-0">
                          {mapping.complexity}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={mapping.status === 'auto' ? 'success' : 'warning'}>
                          {mapping.status === 'auto' ? 'Auto' : 'Manual'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Total: {data.componentMappings.length} components |{' '}
              {data.componentMappings.filter((m) => m.status === 'auto').length} Auto |{' '}
              {data.componentMappings.filter((m) => m.status === 'manual').length} Manual
            </div>
          </CardContent>
        </Card>

        {/* Expression Conversions */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Expression Conversions ({data.expressionConversions.length} total)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.expressionConversions.map((expr, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
                >
                  <button
                    onClick={() => setExpandedExpression(expandedExpression === index ? null : index)}
                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {expandedExpression === index ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {expr.informaticaExpr.substring(0, 50)}
                        {expr.informaticaExpr.length > 50 ? '...' : ''}
                      </span>
                    </div>
                    <Badge variant="default" className="bg-gray-100 text-gray-700 border-0">
                      {expr.complexity}
                    </Badge>
                  </button>
                  {expandedExpression === index && (
                    <div className="p-4 bg-white space-y-3">
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">Informatica Expression</div>
                        <div className="bg-gray-100 p-3 rounded font-mono text-sm text-gray-900">
                          {expr.informaticaExpr}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">Talend Expression</div>
                        <div className="bg-gray-100 p-3 rounded font-mono text-sm text-gray-900 border border-gray-200">
                          {expr.talendExpr}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Conversion Method:</span>
                        <Badge variant="default" className="bg-gray-100 text-gray-700 border-0">
                          {expr.conversionMethod}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dependency Analysis */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Dependency Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                {data.dependencies.impactAnalysis.totalChains} dependency chains detected,{' '}
                {data.dependencies.impactAnalysis.affectedJobs} jobs affected by changes
              </div>
              <div className="space-y-3">
                {data.dependencies.criticalPath.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-semibold border border-gray-200">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{item.job}</div>
                      {item.dependencies.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Depends on: {item.dependencies.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generated Files */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Generated Files Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{data.generatedFiles.jobs}</div>
                <div className="text-sm text-gray-600">Job Files (.item)</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{data.generatedFiles.routines}</div>
                <div className="text-sm text-gray-600">Java Routines</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{data.generatedFiles.connections}</div>
                <div className="text-sm text-gray-600">DB Connections</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{data.generatedFiles.contexts}</div>
                <div className="text-sm text-gray-600">Context Groups</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{data.generatedFiles.metadata}</div>
                <div className="text-sm text-gray-600">Metadata Files</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{data.generatedFiles.totalSize}</div>
                <div className="text-sm text-gray-600">Total Size</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
