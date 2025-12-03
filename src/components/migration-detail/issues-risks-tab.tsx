import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { type IssuesData } from '@/lib/mock-migration-data'

export function IssuesRisksTab({ data }: { data: IssuesData }) {
  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Manual Review Summary ({data.manualReviews.length} jobs)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.manualReviews.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-sm text-gray-900">{item.jobName}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="default" className="bg-gray-100 text-gray-700 border-0">
                          {item.complexity} complexity
                        </Badge>
                        <Badge variant={item.status === 'resolved' ? 'success' : 'default'} className={item.status === 'resolved' ? '' : 'bg-gray-100 text-gray-700 border-0'}>
                          {item.status}
                        </Badge>
                        <Badge variant="default" className="bg-gray-100 text-gray-700 border-0">
                          {item.riskLevel} risk
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {item.timeSpent} min
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Reason:</span>
                      <span className="text-gray-600 ml-2">{item.reason}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Details:</span>
                      <span className="text-gray-600 ml-2">{item.details}</span>
                    </div>
                    <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                      <CheckCircle2 className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item.resolution}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-gray-400" />
              <CardTitle className="text-lg font-semibold text-gray-900">Warnings & Recommendations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.warnings.map((warning, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="font-medium text-sm text-gray-900 mb-2">{warning.description}</div>
                  <div className="text-sm text-gray-600 mb-1">Impact: {warning.impact}</div>
                  <div className="text-sm text-gray-600">Action: {warning.action}</div>
                </div>
              ))}
              <div className="p-4 border border-gray-200 rounded-lg text-center bg-gray-50">
                <CheckCircle2 className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                <div className="font-medium text-sm text-gray-900">NO CRITICAL ISSUES FOUND</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Risk Assessment Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Category</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Likelihood</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Mitigation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.riskMatrix.map((risk, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{risk.category}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="default" className="bg-gray-100 text-gray-700 border-0">
                          {risk.severity}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{risk.likelihood}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{risk.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 border border-gray-200 rounded-lg text-center bg-gray-50">
              <div className="font-medium text-sm text-gray-900">Overall Risk Rating: VERY LOW</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Audit Trail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.auditTrail.map((entry, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-b-0 last:pb-0">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-semibold border border-gray-200">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">{entry.timestamp.toLocaleTimeString()}</div>
                    <div className="text-sm font-medium text-gray-900 mt-0.5">{entry.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
