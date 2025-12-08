'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, FileText, AlertCircle, CheckCircle2, Play, Pause, Eye, ArrowRight, ExternalLink, X } from 'lucide-react'

type Stage = 'setup' | 'analysis' | 'discovery' | 'conversion' | 'completed'
type HealthStatus = 'healthy' | 'warning' | 'critical'
type ConnectionStatus = 'connected' | 'connecting' | 'failed' | 'validating'

interface Project {
  id: string
  name: string
  type: string
  stage: Stage
  progress: number
  totalJobs: number
  completedJobs: number
  automationRate: number
  timeElapsed: string
  timeRemaining?: string
  status: 'active' | 'paused' | 'attention-needed'
  attentionCount?: number
  startedAt: string
  health: HealthStatus

  // Stage-specific fields
  filesUploaded?: number  // Setup stage
  connectionStatus?: ConnectionStatus  // Analysis stage
  currentStep?: string  // Analysis stage
  patternsDetected?: number  // Discovery stage
  complexityBreakdown?: { simple: number; medium: number; complex: number }  // Discovery stage
  queuedJobs?: number  // Conversion stage
  failedJobs?: number  // Conversion stage
}

// Mock project data
const mockProjects: Project[] = [
  // Setup Stage - Fast, just configuration
  {
    id: 'proj-001',
    name: 'Customer Data Migration',
    type: 'CRM Integration',
    stage: 'setup',
    progress: 0,
    totalJobs: 87,
    completedJobs: 0,
    automationRate: 0,
    timeElapsed: '5 min',
    status: 'active',
    health: 'healthy',
    filesUploaded: 45,
    currentStep: 'Uploading XML files...',
    startedAt: '2025-12-05 09:15'
  },
  {
    id: 'proj-002',
    name: 'Legacy Finance System',
    type: 'ERP Migration',
    stage: 'setup',
    progress: 0,
    totalJobs: 124,
    completedJobs: 0,
    automationRate: 0,
    timeElapsed: '8 min',
    status: 'active',
    health: 'healthy',
    filesUploaded: 87,
    currentStep: 'Configuring connections...',
    startedAt: '2025-12-05 08:47'
  },

  // Analysis Stage - Connection validation critical
  {
    id: 'proj-003',
    name: 'Sales Analytics ETL',
    type: 'Data Warehouse',
    stage: 'analysis',
    progress: 0,
    totalJobs: 56,
    completedJobs: 0,
    automationRate: 0,
    timeElapsed: '1.5 hrs',
    status: 'attention-needed',
    health: 'critical',
    connectionStatus: 'failed',
    currentStep: 'Connection timeout',
    startedAt: '2025-12-05 08:05'
  },
  {
    id: 'proj-004',
    name: 'HR Database Consolidation',
    type: 'Multi-Source Integration',
    stage: 'analysis',
    progress: 0,
    totalJobs: 92,
    completedJobs: 0,
    automationRate: 0,
    timeElapsed: '12 min',
    timeRemaining: '8 min',
    status: 'active',
    health: 'healthy',
    connectionStatus: 'validating',
    currentStep: 'Validating schema mappings...',
    startedAt: '2025-12-05 08:30'
  },

  // Discovery Stage - Pattern detection
  {
    id: 'proj-005',
    name: 'Supply Chain Optimization',
    type: 'Logistics ETL',
    stage: 'discovery',
    progress: 88,
    totalJobs: 73,
    completedJobs: 0,
    automationRate: 95,
    timeElapsed: '45 min',
    timeRemaining: '8 min',
    status: 'active',
    health: 'healthy',
    patternsDetected: 8,
    complexityBreakdown: { simple: 32, medium: 34, complex: 7 },
    currentStep: 'Scanning 64/73 jobs',
    startedAt: '2025-12-05 07:10'
  },

  // Conversion Stage - Heavy processing
  {
    id: 'proj-006',
    name: 'Transaction Processing',
    type: 'Banking ETL',
    stage: 'conversion',
    progress: 45,
    totalJobs: 165,
    completedJobs: 74,
    automationRate: 94,
    timeElapsed: '3.5 hrs',
    timeRemaining: '4.2 hrs',
    status: 'attention-needed',
    health: 'warning',
    attentionCount: 3,
    failedJobs: 3,
    queuedJobs: 88,
    startedAt: '2025-12-05 05:45'
  },
  {
    id: 'proj-007',
    name: 'Inventory Management',
    type: 'Retail Integration',
    stage: 'conversion',
    progress: 22,
    totalJobs: 198,
    completedJobs: 44,
    automationRate: 92,
    timeElapsed: '1.8 hrs',
    timeRemaining: '6.5 hrs',
    status: 'active',
    health: 'warning',
    attentionCount: 1,
    failedJobs: 1,
    queuedJobs: 153,
    startedAt: '2025-12-05 07:30'
  },
  {
    id: 'proj-008',
    name: 'Marketing Data Lake',
    type: 'Big Data Migration',
    stage: 'conversion',
    progress: 67,
    totalJobs: 143,
    completedJobs: 96,
    automationRate: 96,
    timeElapsed: '4.2 hrs',
    timeRemaining: '2.1 hrs',
    status: 'active',
    health: 'healthy',
    queuedJobs: 47,
    failedJobs: 0,
    startedAt: '2025-12-05 05:00'
  },

  // Completed Stage
  {
    id: 'proj-009',
    name: 'Product Catalog Sync',
    type: 'E-commerce Integration',
    stage: 'completed',
    progress: 100,
    totalJobs: 48,
    completedJobs: 48,
    automationRate: 97,
    timeElapsed: '2.5 hrs',
    status: 'active',
    health: 'healthy',
    startedAt: '2025-12-05 06:45'
  },
  {
    id: 'proj-010',
    name: 'Regulatory Reporting',
    type: 'Compliance ETL',
    stage: 'completed',
    progress: 100,
    totalJobs: 67,
    completedJobs: 67,
    automationRate: 95,
    timeElapsed: '3.8 hrs',
    status: 'active',
    health: 'healthy',
    startedAt: '2025-12-05 05:30'
  },
  {
    id: 'proj-011',
    name: 'Customer 360 View',
    type: 'Master Data Management',
    stage: 'completed',
    progress: 100,
    totalJobs: 112,
    completedJobs: 112,
    automationRate: 93,
    timeElapsed: '5.2 hrs',
    status: 'active',
    health: 'healthy',
    startedAt: '2025-12-05 04:00'
  }
]

const stageConfig = {
  setup: { label: 'Setup', color: 'bg-slate-100', icon: FileText },
  analysis: { label: 'Analysis', color: 'bg-blue-100', icon: FileText },
  discovery: { label: 'Discovery', color: 'bg-purple-100', icon: Eye },
  conversion: { label: 'Conversion', color: 'bg-orange-100', icon: Play },
  completed: { label: 'Completed', color: 'bg-green-100', icon: CheckCircle2 }
}

// Helper functions
const getHealthBorderColor = (health: HealthStatus) => {
  switch (health) {
    case 'healthy': return 'border-green-400'
    case 'warning': return 'border-yellow-400'
    case 'critical': return 'border-red-500'
    default: return 'border-slate-200'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500'
    case 'paused': return 'bg-yellow-500'
    case 'attention-needed': return 'bg-red-500'
    default: return 'bg-slate-500'
  }
}

const getConnectionStatusIcon = (status?: ConnectionStatus) => {
  if (!status) return null
  switch (status) {
    case 'connected': return '✓'
    case 'connecting': return '○'
    case 'validating': return '◐'
    case 'failed': return '✕'
    default: return null
  }
}

function ProjectCard({ project, onViewPipeline }: { project: Project; onViewPipeline: (project: Project) => void }) {
  const config = stageConfig[project.stage]

  const healthBorder = getHealthBorderColor(project.health)

  // Stage-specific content rendering
  const renderStageContent = () => {
    switch (project.stage) {
      case 'setup':
        return (
          <>
            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-slate-600">{project.currentStep || 'Configuring...'}</span>
            </div>
            {project.filesUploaded && (
              <div className="text-[13px] text-slate-600">
                <span className="font-medium">{project.filesUploaded}</span> files uploaded
              </div>
            )}
          </>
        )

      case 'analysis':
        return (
          <>
            {project.connectionStatus && (
              <div className="flex items-center gap-2 text-[13px]">
                <span className={`text-lg ${project.connectionStatus === 'failed' ? 'text-red-500' : 'text-blue-500'}`}>
                  {getConnectionStatusIcon(project.connectionStatus)}
                </span>
                <span className={project.connectionStatus === 'failed' ? 'text-red-600 font-medium' : 'text-slate-600'}>
                  {project.currentStep || 'Analyzing...'}
                </span>
              </div>
            )}
            {project.health === 'critical' && (
              <Badge variant="destructive" className="text-[13px] font-medium h-5 px-1.5">
                <AlertCircle className="w-2.5 h-2.5 mr-1" />
                STUCK - {project.timeElapsed}
              </Badge>
            )}
          </>
        )

      case 'discovery':
        return (
          <>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] text-slate-600 font-medium">{project.currentStep || 'Discovering patterns...'}</span>
                <span className="text-[13px] font-semibold text-slate-900">{project.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
            {project.patternsDetected !== undefined && (
              <div className="text-[13px] text-slate-600">
                <span className="font-medium">{project.patternsDetected}</span> patterns detected
              </div>
            )}
            {project.automationRate > 0 && (
              <div className="text-[13px]">
                <span className="font-medium text-green-600">{project.automationRate}%</span>
                <span className="text-slate-500"> automation predicted</span>
              </div>
            )}
          </>
        )

      case 'conversion':
        return (
          <>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] text-slate-600 font-medium">Converting jobs</span>
                <span className="text-[13px] font-semibold text-slate-900">{project.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[13px]">
              <div className="flex flex-col">
                <span className="text-slate-500 font-medium">Completed</span>
                <span className="font-semibold text-slate-900 text-[13px]">
                  {project.completedJobs}/{project.totalJobs}
                </span>
              </div>
              {project.queuedJobs !== undefined && (
                <div className="flex flex-col">
                  <span className="text-slate-500 font-medium">Queued</span>
                  <span className="font-semibold text-blue-600 text-[13px]">
                    {project.queuedJobs}
                  </span>
                </div>
              )}
            </div>
            {project.automationRate > 0 && (
              <div className="text-[13px]">
                <span className="font-medium text-green-600">{project.automationRate}%</span>
                <span className="text-slate-500"> automated</span>
              </div>
            )}
            {project.attentionCount && project.attentionCount > 0 && (
              <Badge variant="destructive" className="text-[13px] font-medium h-5 px-1.5">
                <AlertCircle className="w-2.5 h-2.5 mr-1" />
                {project.attentionCount} need{project.attentionCount > 1 ? '' : 's'} attention
              </Badge>
            )}
          </>
        )

      case 'completed':
        return (
          <>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-[13px] font-medium text-green-600">100% Complete</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[13px]">
              <div className="flex flex-col">
                <span className="text-slate-500 font-medium">Jobs</span>
                <span className="font-semibold text-slate-900 text-[13px]">
                  {project.totalJobs}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500 font-medium">Automation</span>
                <span className="font-semibold text-green-600 text-[13px]">
                  {project.automationRate}%
                </span>
              </div>
            </div>
            <div className="text-[13px] text-slate-600">
              Completed in {project.timeElapsed}
            </div>
          </>
        )
    }
  }

  return (
    <Card
      className={`p-3.5 bg-white hover:shadow-xl hover:scale-[1.01] transition-all duration-200 cursor-pointer group border-2 ${healthBorder} hover:border-blue-400`}
      onClick={() => onViewPipeline(project)}
    >
      <div className="space-y-2.5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-[14px] font-semibold text-slate-900 mb-0.5 group-hover:text-blue-600 transition-colors flex items-center gap-1.5 leading-tight">
              {project.name}
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-[13px] text-slate-500 leading-tight">{project.type}</p>
          </div>
          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(project.status)} mt-0.5 ${project.health === 'critical' ? 'animate-pulse' : ''}`} />
        </div>

        {/* Stage-specific content */}
        {renderStageContent()}

        {/* Time Info (shown for all stages except completed) */}
        {project.stage !== 'completed' && (
          <div className="flex items-center gap-1.5 text-[13px] text-slate-600">
            <Clock className="w-3 h-3" />
            <span className="font-medium">{project.timeElapsed}</span>
            {project.timeRemaining && (
              <>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">{project.timeRemaining} left</span>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

export default function ProjectsPage() {
  const router = useRouter()
  const [projects] = useState<Project[]>(mockProjects)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const projectsByStage = {
    setup: projects.filter(p => p.stage === 'setup'),
    analysis: projects.filter(p => p.stage === 'analysis'),
    discovery: projects.filter(p => p.stage === 'discovery'),
    conversion: projects.filter(p => p.stage === 'conversion'),
    completed: projects.filter(p => p.stage === 'completed')
  }

  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.stage !== 'completed').length
  const completedProjects = projects.filter(p => p.stage === 'completed').length

  const handleViewPipeline = (project: Project) => {
    setSelectedProject(project)
    setShowConfirmDialog(true)
  }

  const confirmNavigation = () => {
    if (selectedProject) {
      router.push(`/migrations/pipeline?project=${selectedProject.id}`)
    }
    setShowConfirmDialog(false)
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background pb-24">
        {/* Page Header */}
        <div className="px-6 py-3 border-b border-border bg-background-secondary">
          <div className="max-w-[1800px] mx-auto">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Migration Pipeline Monitor</h1>
              <p className="text-[13px] text-foreground-secondary mt-0.5">
                Real-time tracking of active migration workflows
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="px-6 py-3 bg-background-secondary border-b border-border">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-2xl font-bold tracking-tight text-foreground">{totalProjects}</div>
                <div className="text-sm text-foreground-secondary mt-0.5">Total Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-blue-600">{activeProjects}</div>
                <div className="text-sm text-foreground-secondary mt-0.5">Active Migrations</div>
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-green-600">{completedProjects}</div>
                <div className="text-sm text-foreground-secondary mt-0.5">Completed Today</div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Board */}
        <div className="px-6 py-6">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-5 gap-4">
              {/* Setup Column */}
              <div className="flex flex-col space-y-3">
                <div className={`${stageConfig.setup.color} rounded-lg p-3 flex-shrink-0`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-900">{stageConfig.setup.label}</h2>
                    <Badge variant="secondary" className="text-xs">{projectsByStage.setup.length}</Badge>
                  </div>
                </div>
                <div className="space-y-3 overflow-y-auto overflow-x-hidden scrollbar-thin" style={{ maxHeight: 'calc(100vh - 320px)' }}>
                  {projectsByStage.setup.map(project => (
                    <ProjectCard key={project.id} project={project} onViewPipeline={handleViewPipeline} />
                  ))}
                </div>
              </div>

              {/* Analysis Column */}
              <div className="flex flex-col space-y-3">
                <div className={`${stageConfig.analysis.color} rounded-lg p-3 flex-shrink-0`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-900">{stageConfig.analysis.label}</h2>
                    <Badge variant="secondary" className="text-xs">{projectsByStage.analysis.length}</Badge>
                  </div>
                </div>
                <div className="space-y-3 overflow-y-auto overflow-x-hidden scrollbar-thin" style={{ maxHeight: 'calc(100vh - 320px)' }}>
                  {projectsByStage.analysis.map(project => (
                    <ProjectCard key={project.id} project={project} onViewPipeline={handleViewPipeline} />
                  ))}
                </div>
              </div>

              {/* Discovery Column */}
              <div className="flex flex-col space-y-3">
                <div className={`${stageConfig.discovery.color} rounded-lg p-3 flex-shrink-0`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-900">{stageConfig.discovery.label}</h2>
                    <Badge variant="secondary" className="text-xs">{projectsByStage.discovery.length}</Badge>
                  </div>
                </div>
                <div className="space-y-3 overflow-y-auto overflow-x-hidden scrollbar-thin" style={{ maxHeight: 'calc(100vh - 320px)' }}>
                  {projectsByStage.discovery.map(project => (
                    <ProjectCard key={project.id} project={project} onViewPipeline={handleViewPipeline} />
                  ))}
                </div>
              </div>

              {/* Conversion Column */}
              <div className="flex flex-col space-y-3">
                <div className={`${stageConfig.conversion.color} rounded-lg p-3 flex-shrink-0`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-900">{stageConfig.conversion.label}</h2>
                    <Badge variant="secondary" className="text-xs">{projectsByStage.conversion.length}</Badge>
                  </div>
                </div>
                <div className="space-y-3 overflow-y-auto overflow-x-hidden scrollbar-thin" style={{ maxHeight: 'calc(100vh - 320px)' }}>
                  {projectsByStage.conversion.map(project => (
                    <ProjectCard key={project.id} project={project} onViewPipeline={handleViewPipeline} />
                  ))}
                </div>
              </div>

              {/* Completed Column */}
              <div className="flex flex-col space-y-3">
                <div className={`${stageConfig.completed.color} rounded-lg p-3 flex-shrink-0`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-900">{stageConfig.completed.label}</h2>
                    <Badge variant="secondary" className="text-xs">{projectsByStage.completed.length}</Badge>
                  </div>
                </div>
                <div className="space-y-3 overflow-y-auto overflow-x-hidden scrollbar-thin" style={{ maxHeight: 'calc(100vh - 320px)' }}>
                  {projectsByStage.completed.map(project => (
                    <ProjectCard key={project.id} project={project} onViewPipeline={handleViewPipeline} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Custom Full-Page Modal - 75vw x 75vh */}
      {selectedProject && showConfirmDialog && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
          onClick={() => setShowConfirmDialog(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-[75vw] h-[75vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Project Info */}
            <div className="px-6 py-4 border-b border-slate-100 bg-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{selectedProject.name}</h2>
                    <p className="text-sm text-slate-500 mt-1">{selectedProject.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs h-6 px-2.5 border-slate-200 text-slate-600">
                      {stageConfig[selectedProject.stage].label}
                    </Badge>
                    {selectedProject.health === 'critical' && (
                      <Badge variant="destructive" className="text-xs h-6 px-2.5">Critical</Badge>
                    )}
                    {selectedProject.health === 'warning' && (
                      <Badge variant="secondary" className="text-xs h-6 px-2.5 bg-amber-50 text-amber-700 border-amber-200">Warning</Badge>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content - With Auto-Scroll */}
            <div className="flex-1 px-6 py-5 overflow-y-auto">
              <div className="h-full">{/* Remove Card wrapper for cleaner look */}

                {/* Stage-specific content - Vercel Style */}
                <div className="flex flex-col gap-3">
                  {selectedProject.stage === 'setup' && (
                    <>
                      <div className="bg-blue-50/50 border border-blue-100 rounded-md p-4">
                        <div className="text-sm font-semibold text-blue-900 mb-2">Configuration in Progress</div>
                        <div className="text-[13px] text-blue-700 leading-relaxed">Project configuration and file upload in progress. Analysis will begin automatically once setup completes.</div>
                      </div>

                      <div className="flex gap-4 flex-1">
                        <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-md p-4">
                          <div className="text-sm font-semibold text-slate-700 mb-3">Current Status</div>
                          <div className="space-y-2.5">
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">Status</span>
                              <span className="text-[13px] font-medium text-slate-700">{selectedProject.currentStep}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">Files Uploaded</span>
                              <span className="text-[13px] font-medium text-slate-900">{selectedProject.filesUploaded} XML</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">Jobs Detected</span>
                              <span className="text-[13px] font-medium text-slate-900">{selectedProject.totalJobs} mappings</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">Duration</span>
                              <span className="text-[13px] font-medium text-slate-700">{selectedProject.timeElapsed}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-md p-4">
                          <div className="text-sm font-semibold text-slate-700 mb-3">Next Step</div>
                          <div className="text-[13px] text-slate-600 leading-relaxed">Once all files are uploaded and connections configured, the system will automatically proceed to Analysis stage.</div>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedProject.stage === 'analysis' && (
                    <>
                      <div className="bg-blue-50/50 border border-blue-100 rounded-md p-4">
                        <div className="text-sm font-semibold text-blue-900 mb-2">Analyzing Source Files</div>
                        <div className="text-[13px] text-blue-700 leading-relaxed">
                          System is analyzing source files, establishing database connections, and detecting transformation patterns.
                          This critical stage validates all dependencies before conversion begins.
                        </div>
                      </div>

                      <div className="flex gap-4 flex-1">
                        <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-md p-4">
                          <div className="text-sm font-semibold text-slate-700 mb-3">Connection Status</div>
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-lg ${selectedProject.connectionStatus === 'failed' ? 'text-red-500' : 'text-blue-500'}`}>
                                {getConnectionStatusIcon(selectedProject.connectionStatus)}
                              </span>
                              <div className="text-[13px] font-medium text-slate-700">
                                {selectedProject.connectionStatus === 'failed' ? 'Connection Failed' : selectedProject.currentStep}
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">Jobs to Analyze</span>
                              <span className="text-[13px] font-medium text-slate-900">{selectedProject.totalJobs}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">Time in Analysis</span>
                              <span className="text-[13px] font-medium text-slate-700">{selectedProject.timeElapsed}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">Normal Duration</span>
                              <span className="text-[13px] font-medium text-slate-600">10-30 minutes</span>
                            </div>
                          </div>
                        </div>

                        {selectedProject.health === 'critical' && (
                          <div className="flex-1 bg-red-50/50 border border-red-100 rounded-md p-4">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-semibold text-red-900 mb-2">Action Required: Project Stuck</div>
                                <div className="text-[13px] text-red-700 mb-2">Running for {selectedProject.timeElapsed} - exceeds normal analysis time.</div>
                                <div className="text-[13px] text-red-800 space-y-1">
                                  <div className="font-medium">Common causes:</div>
                                  <div>• Database connection timeout</div>
                                  <div>• Large file processing hang</div>
                                  <div>• Missing dependencies</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedProject.connectionStatus === 'failed' && !selectedProject.health && (
                          <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-md p-4">
                            <div className="text-sm font-semibold text-slate-700 mb-3">Next Step</div>
                            <div className="text-[13px] text-slate-600 leading-relaxed">
                              Check connection credentials and network access. Analysis will automatically resume once connections are validated.
                            </div>
                          </div>
                        )}

                        {selectedProject.connectionStatus === 'validating' && !selectedProject.health && (
                          <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-md p-4">
                            <div className="text-sm font-semibold text-slate-700 mb-3">Next Step</div>
                            <div className="text-[13px] text-slate-600 leading-relaxed">
                              Once all connections validate successfully, system will proceed to Discovery stage to detect patterns and complexity.
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {selectedProject.stage === 'discovery' && (
                    <>
                      <div className="bg-purple-50/50 border border-purple-100 rounded-md p-3">
                        <div className="text-[13px] font-medium text-purple-900 mb-1.5">Pattern Detection in Progress</div>
                        <div className="text-[13px] text-purple-700 leading-relaxed">
                          Pattern detection engine is analyzing {selectedProject.totalJobs} jobs to identify transformation patterns,
                          calculate complexity scores, and predict automation rates. This determines conversion strategy.
                        </div>
                      </div>

                      <div className="flex gap-3 flex-1">
                        <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-md p-3">
                          <div className="text-sm font-semibold text-slate-700 mb-3">Current Progress</div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">Current Task</span>
                              <span className="text-[13px] font-medium text-slate-700">{selectedProject.currentStep}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">Progress</span>
                              <span className="text-[13px] font-medium text-slate-900">{selectedProject.progress}% ({Math.round(selectedProject.progress * selectedProject.totalJobs / 100)}/{selectedProject.totalJobs})</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">Time Remaining</span>
                              <span className="text-[13px] font-medium text-slate-700">{selectedProject.timeRemaining}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-md p-3">
                          <div className="text-sm font-semibold text-slate-700 mb-3">Detection Results</div>
                          <div className="space-y-2">
                            <div>
                              <div className="text-[13px] text-slate-500 mb-1">Patterns Detected</div>
                              <div className="text-[13px] font-medium text-purple-600">{selectedProject.patternsDetected}</div>
                              <div className="text-[13px] text-slate-600">of 19 enterprise patterns</div>
                            </div>
                            <div>
                              <div className="text-[13px] text-slate-500 mb-1">Predicted Automation</div>
                              <div className="text-[13px] font-medium text-green-600">{selectedProject.automationRate}%</div>
                              <div className="text-[13px] text-slate-600">target: 92-97%</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-md p-3">
                          <div className="text-sm font-semibold text-slate-700 mb-3">Next Step</div>
                          <div className="text-[13px] text-slate-600 leading-relaxed">
                            Once pattern detection completes at 100%, system will automatically proceed to Conversion stage.
                            Complex jobs may be flagged for manual review after conversion.
                          </div>
                        </div>
                      </div>

                      {selectedProject.complexityBreakdown && (
                        <div className="flex gap-3">
                          <div className="flex-1 bg-green-50/50 border border-green-100 rounded-md p-3">
                            <div className="text-[13px] font-medium text-green-700">{selectedProject.complexityBreakdown.simple}</div>
                            <div className="text-[13px] text-green-600 font-medium">Simple</div>
                            <div className="text-[13px] text-green-700">Fast conversion</div>
                          </div>
                          <div className="flex-1 bg-yellow-50/50 border border-yellow-100 rounded-md p-3">
                            <div className="text-[13px] font-medium text-yellow-700">{selectedProject.complexityBreakdown.medium}</div>
                            <div className="text-[13px] text-yellow-600 font-medium">Medium</div>
                            <div className="text-[13px] text-yellow-700">Standard time</div>
                          </div>
                          <div className="flex-1 bg-orange-50/50 border border-orange-100 rounded-md p-3">
                            <div className="text-[13px] font-medium text-orange-700">{selectedProject.complexityBreakdown.complex}</div>
                            <div className="text-[13px] text-orange-600 font-medium">Complex</div>
                            <div className="text-[13px] text-orange-700">May need review</div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {selectedProject.stage === 'conversion' && (
                    <>
                      <div className="bg-orange-50/50 border border-orange-100 rounded-md p-3">
                        <div className="text-[13px] font-medium text-orange-900 mb-1.5">Automated Conversion Running</div>
                        <div className="text-[13px] text-orange-700 leading-relaxed">
                          Automated conversion engines are transforming {selectedProject.totalJobs} Informatica jobs to Talend format.
                          Jobs are processed in parallel queue with validation at each step.
                        </div>
                      </div>

                      <div className="flex gap-3 flex-1">
                        <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-md p-3">
                          <div className="text-sm font-semibold text-slate-700 mb-3">Overall Progress</div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">Progress</span>
                              <span className="text-[13px] font-medium text-slate-900">{selectedProject.progress}% ({selectedProject.completedJobs}/{selectedProject.totalJobs})</span>
                            </div>
                            {selectedProject.timeRemaining && (
                              <div className="flex justify-between items-center">
                                <span className="text-[13px] text-slate-500">Time Remaining</span>
                                <span className="text-[13px] font-medium text-slate-700">{selectedProject.timeRemaining}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">Automation Rate</span>
                              <span className="text-[13px] font-medium text-green-600">{selectedProject.automationRate}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-md p-3">
                          <div className="text-sm font-semibold text-slate-700 mb-3">Job Status</div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">✓ Completed</span>
                              <span className="text-[13px] font-medium text-green-700">{selectedProject.completedJobs}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">○ In Queue</span>
                              <span className="text-[13px] font-medium text-blue-700">{selectedProject.queuedJobs}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">✕ Failed</span>
                              <span className="text-[13px] font-medium text-red-700">{selectedProject.failedJobs || 0}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-md p-3">
                          <div className="text-sm font-semibold text-slate-700 mb-3">Next Step</div>
                          <div className="text-[13px] text-slate-600 leading-relaxed">
                            {selectedProject.attentionCount && selectedProject.attentionCount > 0 ? (
                              <>Conversion will continue running. Failed jobs can be reviewed and manually corrected during Validation stage.</>
                            ) : (
                              <>Once all {selectedProject.totalJobs} jobs complete conversion, system will automatically proceed to Validation stage.</>
                            )}
                          </div>
                        </div>
                      </div>

                      {selectedProject.attentionCount && selectedProject.attentionCount > 0 && (
                        <div className="bg-yellow-50/50 border border-yellow-100 rounded-md p-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-[13px] font-medium text-yellow-900 mb-1">Action Required</div>
                              <div className="text-[13px] text-yellow-700 mb-1.5">
                                {selectedProject.attentionCount} job{selectedProject.attentionCount > 1 ? 's' : ''} failed conversion and need manual review.
                              </div>
                              <div className="text-[13px] text-yellow-800 space-y-0.5">
                                <div className="font-medium">Common causes:</div>
                                <div>• Complex nested expressions</div>
                                <div>• Custom transformations</div>
                                <div>• Unsupported features</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {selectedProject.stage === 'completed' && (
                    <>
                      <div className="bg-green-50/50 border border-green-100 rounded-md p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-[13px] font-medium text-green-900">Migration Successfully Completed</span>
                        </div>
                        <div className="text-[13px] text-green-700 leading-relaxed">
                          All {selectedProject.totalJobs} jobs have been converted, validated, and optimized.
                          Talend jobs are ready for deployment to your target environment.
                        </div>
                      </div>

                      <div className="flex gap-3 flex-1">
                        <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-md p-3">
                          <div className="text-sm font-semibold text-slate-700 mb-3">Migration Summary</div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">Total Jobs Migrated</span>
                              <span className="text-[13px] font-medium text-slate-900">{selectedProject.totalJobs}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">Final Automation Rate</span>
                              <span className="text-[13px] font-medium text-green-600">{selectedProject.automationRate}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">Total Duration</span>
                              <span className="text-[13px] font-medium text-slate-700">{selectedProject.timeElapsed}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] text-slate-500">Completed Jobs</span>
                              <span className="text-[13px] font-medium text-green-600">{selectedProject.completedJobs}/{selectedProject.totalJobs}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-md p-3">
                          <div className="text-sm font-semibold text-slate-700 mb-3">Quality Validation</div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[13px] text-blue-600 font-medium">✓ Data Validated</span>
                              <span className="text-[13px] text-blue-700">99.7%+ accuracy</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[13px] text-purple-600 font-medium">✓ Quality Checked</span>
                              <span className="text-[13px] text-purple-700">All tests passed</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-md p-3">
                          <div className="text-sm font-semibold text-slate-700 mb-3">Next Steps</div>
                          <div className="text-[13px] text-slate-600 space-y-1">
                            <div>1. Download Talend jobs</div>
                            <div>2. Import into Studio/TAC</div>
                            <div>3. Review validation reports</div>
                            <div>4. Deploy to DEV for UAT</div>
                          </div>
                        </div>

                        <div className="flex-1 bg-blue-50/50 border border-blue-100 rounded-md p-3">
                          <div className="text-[13px] font-medium text-blue-900 mb-2.5">Deliverables Ready</div>
                          <div className="text-[13px] text-blue-800 space-y-0.5">
                            <div>• Talend job files</div>
                            <div>• Context configurations</div>
                            <div>• Data lineage docs</div>
                            <div>• Validation reports</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex-shrink-0 flex items-center justify-between gap-2">
              <div>
                {selectedProject.stage === 'conversion' && selectedProject.completedJobs > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => window.open('/preview/1', '_blank')}
                    className="h-8 text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1.5" />
                    Preview Converted Jobs ({selectedProject.completedJobs})
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmNavigation}
                  className="h-8 text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1.5" />
                  Open Pipeline
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
