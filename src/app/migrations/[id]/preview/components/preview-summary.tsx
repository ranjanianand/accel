import { PreviewStats } from '../page'
import { Card } from '@/components/ui/card'

interface PreviewSummaryProps {
  stats: PreviewStats
}

export function PreviewSummary({ stats }: PreviewSummaryProps) {
  return (
    <div className="grid grid-cols-5 gap-4">
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-sm text-blue-700 mb-1">Total Jobs</div>
        <div className="text-3xl font-bold text-blue-900">{stats.total_jobs}</div>
        <div className="text-xs text-blue-600 mt-1">
          {stats.jobs_with_preview} with preview
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100">
        <div className="text-sm text-emerald-700 mb-1">Avg Confidence</div>
        <div className="text-3xl font-bold text-emerald-900">
          {stats.avg_confidence.toFixed(1)}%
        </div>
        <div className="text-xs text-emerald-600 mt-1">
          conversion quality
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-sm text-green-700 mb-1">High Confidence</div>
        <div className="text-3xl font-bold text-green-900">
          {stats.high_confidence_count}
        </div>
        <div className="text-xs text-green-600 mt-1">
          {stats.very_high_count} very high, {stats.high_count} high
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="text-sm text-amber-700 mb-1">Needs Review</div>
        <div className="text-3xl font-bold text-amber-900">
          {stats.needs_review_count}
        </div>
        <div className="text-xs text-amber-600 mt-1">
          {stats.medium_count} medium, {stats.low_count} low
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="text-sm text-purple-700 mb-1">Completion</div>
        <div className="text-3xl font-bold text-purple-900">
          {((stats.jobs_with_preview / stats.total_jobs) * 100).toFixed(0)}%
        </div>
        <div className="text-xs text-purple-600 mt-1">
          preview generated
        </div>
      </Card>
    </div>
  )
}
