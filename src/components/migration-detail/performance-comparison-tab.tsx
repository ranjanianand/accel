import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import { type PerformanceData } from '@/lib/mock-migration-data'

export function PerformanceComparisonTab({ data }: { data: PerformanceData }) {
  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
      </div>
    </div>
  )
}
