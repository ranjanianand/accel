import { PreviewStats } from '../page'

interface PreviewSummaryProps {
  stats: PreviewStats
}

export function PreviewSummary({ stats }: PreviewSummaryProps) {
  return (
    <div className="flex items-center gap-8 text-sm">
      <div className="flex items-baseline gap-2" title="Total number of jobs in this migration">
        <span className="text-gray-500">Total:</span>
        <span className="text-2xl font-bold text-gray-900">{stats.total_jobs}</span>
      </div>

      <div className="flex items-baseline gap-2" title="Average conversion confidence score across all jobs">
        <span className="text-gray-500">Avg Quality:</span>
        <span className="text-2xl font-bold text-emerald-600">
          {stats.avg_confidence.toFixed(1)}%
        </span>
      </div>

      <div className="flex items-baseline gap-2" title="Jobs with confidence score ≥90% (ready for production)">
        <span className="text-gray-500">High Confidence:</span>
        <span className="text-2xl font-bold text-green-600">
          {stats.high_confidence_count}
        </span>
      </div>

      <div className="flex items-baseline gap-2" title="Jobs with warnings or confidence score <90% (requires manual review)">
        <span className="text-gray-500">Needs Review:</span>
        <span className="text-2xl font-bold text-amber-600">
          {stats.needs_review_count}
        </span>
      </div>

      <div className="flex items-baseline gap-2" title={`${stats.jobs_with_preview} of ${stats.total_jobs} jobs have completed conversion`}>
        <span className="text-gray-500">Progress:</span>
        <span className="text-2xl font-bold text-blue-600">
          {((stats.jobs_with_preview / stats.total_jobs) * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  )
}
