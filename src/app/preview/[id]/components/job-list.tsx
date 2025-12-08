import { useEffect, useRef } from 'react'
import { PreviewJob } from '../page'
import { Badge } from '@/components/ui/badge'
import { Loader2, FileText } from 'lucide-react'

interface JobListProps {
  jobs: PreviewJob[]
  selectedJob: PreviewJob | null
  onSelectJob: (job: PreviewJob) => void
  loading: boolean
}

const getConfidenceBadge = (score: number, level: string) => {
  const percentage = `${score.toFixed(score >= 90 ? 0 : 1)}%`

  switch (level) {
    case 'VERY_HIGH':
      return <Badge className="bg-emerald-500 text-white text-xs font-semibold px-2">{percentage}</Badge>
    case 'HIGH':
      return <Badge className="bg-green-500 text-white text-xs font-semibold px-2">{percentage}</Badge>
    case 'MEDIUM':
      return <Badge className="bg-amber-500 text-white text-xs font-semibold px-2">{percentage}</Badge>
    case 'LOW':
      return <Badge className="bg-red-500 text-white text-xs font-semibold px-2">{percentage}</Badge>
    default:
      return null
  }
}

export function JobList({ jobs, selectedJob, onSelectJob, loading }: JobListProps) {
  const selectedButtonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedJob || jobs.length === 0) return

      const currentIndex = jobs.findIndex(j => j.id === selectedJob.id)

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const nextIndex = Math.min(currentIndex + 1, jobs.length - 1)
        onSelectJob(jobs[nextIndex])
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prevIndex = Math.max(currentIndex - 1, 0)
        onSelectJob(jobs[prevIndex])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedJob, jobs, onSelectJob])

  // Auto-scroll to selected job within container (not browser window)
  useEffect(() => {
    if (selectedButtonRef.current && containerRef.current) {
      const button = selectedButtonRef.current
      const container = containerRef.current

      const buttonTop = button.offsetTop
      const buttonHeight = button.offsetHeight
      const containerHeight = container.clientHeight
      const containerScrollTop = container.scrollTop

      // Calculate if button is out of view
      const buttonBottom = buttonTop + buttonHeight
      const containerBottom = containerScrollTop + containerHeight

      if (buttonTop < containerScrollTop) {
        // Button is above visible area - scroll up
        container.scrollTo({
          top: buttonTop - 12, // 12px padding
          behavior: 'smooth'
        })
      } else if (buttonBottom > containerBottom) {
        // Button is below visible area - scroll down
        container.scrollTo({
          top: buttonBottom - containerHeight + 12, // 12px padding
          behavior: 'smooth'
        })
      }
    }
  }, [selectedJob])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
          <div className="text-sm font-medium text-gray-700">Loading preview data...</div>
          <div className="text-xs text-gray-500 mt-1">Please wait...</div>
        </div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-sm font-medium text-gray-700 mb-1">No jobs found</div>
          <div className="text-xs text-gray-500">
            Jobs will appear here once conversion completes
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-auto relative">
      <div className="space-y-2 p-3">
        {jobs.map((job) => {
          const isSelected = selectedJob?.id === job.id

          return (
            <button
              key={job.id}
              ref={isSelected ? selectedButtonRef : null}
              onClick={() => onSelectJob(job)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-blue-50 border-blue-400 shadow-sm'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className="font-mono text-sm font-bold text-gray-900 truncate"
                  title={job.job_name}
                >
                  {job.job_name}
                </span>
                {getConfidenceBadge(job.confidence_score, job.confidence_level)}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>{job.pattern_detected || 'Unknown'}</span>
              </div>

              {job.warnings && job.warnings.length > 0 && (
                <div className="mt-1.5">
                  <span className="text-xs text-amber-600">
                    {job.warnings.length} warning{job.warnings.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}

              <div className="mt-1.5 text-xs text-gray-500">
                Confidence: {job.confidence_score.toFixed(1)}%
              </div>
            </button>
          )
        })}
      </div>
      {/* Bottom fade mask */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
    </div>
  )
}
