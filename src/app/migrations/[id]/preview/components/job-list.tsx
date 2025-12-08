import { PreviewJob } from '../page'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'

interface JobListProps {
  jobs: PreviewJob[]
  selectedJob: PreviewJob | null
  onSelectJob: (job: PreviewJob) => void
  loading: boolean
}

const getConfidenceBadge = (level: string) => {
  switch (level) {
    case 'VERY_HIGH':
      return <Badge className="bg-emerald-500 text-white text-xs">98%+</Badge>
    case 'HIGH':
      return <Badge className="bg-green-500 text-white text-xs">90-97%</Badge>
    case 'MEDIUM':
      return <Badge className="bg-amber-500 text-white text-xs">75-89%</Badge>
    case 'LOW':
      return <Badge className="bg-red-500 text-white text-xs">&lt;75%</Badge>
    default:
      return null
  }
}

export function JobList({ jobs, selectedJob, onSelectJob, loading }: JobListProps) {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-3" />
          <div className="text-sm text-slate-600">Loading preview data...</div>
        </div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-sm font-medium text-slate-700 mb-1">No jobs found</div>
          <div className="text-xs text-slate-500 mb-3">
            Try adjusting your search or filter criteria
          </div>
          <div className="text-xs text-slate-400 italic">
            Jobs will appear here once conversion completes
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-2 p-4">
        {jobs.map((job) => {
          const isSelected = selectedJob?.id === job.id

          return (
            <button
              key={job.id}
              onClick={() => onSelectJob(job)}
              className={`w-full text-left p-3 rounded-lg border transition-all relative ${
                isSelected
                  ? 'bg-blue-50 border-blue-300 shadow-md border-l-4 border-l-blue-600'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className="font-mono text-sm font-semibold text-slate-900 truncate"
                  title={job.job_name}
                >
                  {job.job_name}
                </span>
                {getConfidenceBadge(job.confidence_level)}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-600">{job.pattern_detected || 'Unknown'}</span>
                {job.warnings && job.warnings.length > 0 && (
                  <Badge className="text-xs text-amber-600 bg-amber-50 border-amber-300">
                    {job.warnings.length} warnings
                  </Badge>
                )}
              </div>

              <div className="mt-2 text-xs text-slate-500">
                Confidence: {job.confidence_score.toFixed(1)}%
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
