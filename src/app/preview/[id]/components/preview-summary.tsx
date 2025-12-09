import { PreviewStats } from '../page'

interface PreviewSummaryProps {
  stats: PreviewStats
}

export function PreviewSummary({ stats }: PreviewSummaryProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-center" title="Total jobs">
        <div className="text-lg font-bold text-gray-900">{stats.total_jobs}</div>
        <div className="text-xs text-gray-500">Total</div>
      </div>

      <div className="text-center" title="Average confidence score">
        <div className="text-lg font-bold text-emerald-600">
          {stats.avg_confidence.toFixed(1)}%
        </div>
        <div className="text-xs text-gray-500">Quality</div>
      </div>

      <div className="text-center" title="High confidence jobs (≥90%)">
        <div className="text-lg font-bold text-green-600">
          {stats.high_confidence_count}
        </div>
        <div className="text-xs text-gray-500">High</div>
      </div>

      <div className="text-center" title="Needs review (<90%)">
        <div className="text-lg font-bold text-amber-600">
          {stats.needs_review_count}
        </div>
        <div className="text-xs text-gray-500">Review</div>
      </div>

      <div className="text-center" title={`${stats.jobs_with_preview} of ${stats.total_jobs} completed`}>
        <div className="text-lg font-bold text-blue-600">
          {((stats.jobs_with_preview / stats.total_jobs) * 100).toFixed(0)}%
        </div>
        <div className="text-xs text-gray-500">Progress</div>
      </div>
    </div>
  )
}
