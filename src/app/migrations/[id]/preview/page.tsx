"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { JobList } from './components/job-list'
import { PreviewContent } from './components/preview-content'
import { PreviewSummary } from './components/preview-summary'
import { Search, Filter, Download, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export interface PreviewJob {
  id: number
  job_name: string
  confidence_score: number
  confidence_level: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW'
  pattern_detected: string
  informatica_xml: string
  talend_xml: string
  transformations: any
  warnings: string[]
  created_at: string
}

export interface PreviewStats {
  total_jobs: number
  jobs_with_preview: number
  avg_confidence: number
  high_confidence_count: number
  needs_review_count: number
  very_high_count: number
  high_count: number
  medium_count: number
  low_count: number
}

type FilterType = 'all' | 'very_high' | 'high' | 'medium' | 'low' | 'needs_review'

export default function PreviewPage() {
  const params = useParams()
  const router = useRouter()
  const migrationId = params.id as string

  const [jobs, setJobs] = useState<PreviewJob[]>([])
  const [stats, setStats] = useState<PreviewStats | null>(null)
  const [selectedJob, setSelectedJob] = useState<PreviewJob | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)

  // Fetch preview data with polling
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/preview/${migrationId}`)
        if (response.ok) {
          const data = await response.json()
          setJobs(data.jobs || [])
          setStats(data.stats || null)
          if (!selectedJob && data.jobs && data.jobs.length > 0) {
            setSelectedJob(data.jobs[0])
          }
        }
      } catch (error) {
        console.error('Failed to fetch preview:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPreview()
    const interval = setInterval(fetchPreview, 30000) // Poll every 30s

    return () => clearInterval(interval)
  }, [migrationId])

  // Filter and search jobs
  const filteredJobs = jobs.filter(job => {
    // Search filter
    if (searchQuery && !job.job_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Confidence filter
    if (activeFilter === 'all') return true
    if (activeFilter === 'needs_review') {
      return job.confidence_level === 'MEDIUM' || job.confidence_level === 'LOW'
    }
    return job.confidence_level === activeFilter.toUpperCase()
  })

  const handleExportPDF = async () => {
    alert('PDF export will be implemented in Week 2')
  }

  const handleExportExcel = async () => {
    alert('Excel export will be implemented in Week 2')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push(`/dashboard`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Conversion Preview
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Side-by-side comparison of Informatica → Talend conversions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={handleExportExcel}>
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        {stats && <PreviewSummary stats={stats} />}
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Left Sidebar - Job List (30%) */}
        <div className="w-[30%] border-r border-slate-200 bg-white flex flex-col">
          {/* Search and Filter */}
          <div className="p-4 border-b border-slate-200 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All ({stats?.total_jobs || 0})
              </button>
              <button
                onClick={() => setActiveFilter('very_high')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  activeFilter === 'very_high'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Very High ({stats?.very_high_count || 0})
              </button>
              <button
                onClick={() => setActiveFilter('high')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  activeFilter === 'high'
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                High ({stats?.high_count || 0})
              </button>
              <button
                onClick={() => setActiveFilter('needs_review')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  activeFilter === 'needs_review'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Needs Review ({stats?.needs_review_count || 0})
              </button>
            </div>
          </div>

          {/* Job List */}
          <JobList
            jobs={filteredJobs}
            selectedJob={selectedJob}
            onSelectJob={setSelectedJob}
            loading={loading}
          />
        </div>

        {/* Right Side - Preview Content (70%) */}
        <div className="w-[70%] bg-slate-50">
          {selectedJob ? (
            <PreviewContent job={selectedJob} />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              <div className="text-center">
                <div className="text-6xl mb-4">📋</div>
                <div className="text-lg font-medium">No job selected</div>
                <div className="text-sm">Select a job from the list to view conversion preview</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
