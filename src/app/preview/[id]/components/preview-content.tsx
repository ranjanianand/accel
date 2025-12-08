"use client"

import { useState, useEffect, useRef } from 'react'
import { PreviewJob } from '../page'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, FileCode, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react'
import { XMLHighlighter } from './xml-highlighter'

interface PreviewContentProps {
  job: PreviewJob
}

export function PreviewContent({ job }: PreviewContentProps) {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(true)
  const [copiedInformatica, setCopiedInformatica] = useState(false)
  const [copiedTalend, setCopiedTalend] = useState(false)
  const informaticaScrollRef = useRef<HTMLDivElement>(null)
  const talendScrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll both XML panels to top when job changes
  useEffect(() => {
    if (informaticaScrollRef.current) {
      informaticaScrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
    if (talendScrollRef.current) {
      talendScrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }, [job.id])

  const handleCopyXML = async (xml: string, type: 'informatica' | 'talend') => {
    try {
      await navigator.clipboard.writeText(xml)
      if (type === 'informatica') {
        setCopiedInformatica(true)
        setTimeout(() => setCopiedInformatica(false), 2000)
      } else {
        setCopiedTalend(true)
        setTimeout(() => setCopiedTalend(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'VERY_HIGH':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200'
      case 'HIGH':
        return 'text-green-700 bg-green-50 border-green-200'
      case 'MEDIUM':
        return 'text-amber-700 bg-amber-50 border-amber-200'
      case 'LOW':
        return 'text-red-700 bg-red-50 border-red-200'
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200'
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex-shrink-0">
        {isHeaderCollapsed ? (
          <button
            onClick={() => setIsHeaderCollapsed(false)}
            className="w-full flex items-center justify-between hover:bg-slate-50 -mx-4 -my-2 px-4 py-2 transition-colors"
          >
            <div className="flex items-center gap-3 text-sm">
              <span className="font-mono font-semibold text-slate-900">{job.job_name}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">{job.pattern_detected || 'Unknown'}</span>
              <span className="font-semibold text-emerald-600">{job.confidence_score.toFixed(1)}%</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        ) : (
          <>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-mono">
                  {job.job_name}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Pattern: {job.pattern_detected || 'Unknown'} • Created: {new Date(job.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className={`px-3 py-1.5 rounded-lg border ${getConfidenceColor(job.confidence_level)}`}>
                  <div className="text-xs font-medium">Confidence Score</div>
                  <div className="text-xl font-bold">{job.confidence_score.toFixed(1)}%</div>
                </div>
                <button
                  onClick={() => setIsHeaderCollapsed(true)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Collapse job details"
                >
                  <ChevronDown className="w-4 h-4 text-slate-400 rotate-180" />
                </button>
              </div>
            </div>

            {/* Warnings */}
            {job.warnings && job.warnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-amber-900 mb-0.5">
                    {job.warnings.length} Warning{job.warnings.length > 1 ? 's' : ''}
                  </div>
                  <div className="space-y-0.5">
                    {job.warnings.map((warning, idx) => (
                      <div key={idx} className="text-xs text-amber-700">• {warning}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Validation Results */}
            {job.validation && (
              <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
                <div className="text-xs font-medium text-blue-900 mb-1.5">
                  Validation Results
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${job.validation.data_lineage ? 'text-green-600' : 'text-red-600'}`} />
                    <span className="text-xs text-slate-700">Data Lineage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${job.validation.error_handling ? 'text-green-600' : 'text-red-600'}`} />
                    <span className="text-xs text-slate-700">Error Handling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${job.validation.business_rules.passed === job.validation.business_rules.total ? 'text-green-600' : 'text-amber-600'}`} />
                    <span className="text-xs text-slate-700">Business Rules ({job.validation.business_rules.passed}/{job.validation.business_rules.total})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${job.validation.performance ? 'text-green-600' : 'text-amber-600'}`} />
                    <span className="text-xs text-slate-700">Performance</span>
                  </div>
                </div>
              </div>
            )}

            {/* Transformations Summary */}
            {job.transformations && Object.keys(job.transformations).length > 0 && (
              <div className="mt-2 bg-slate-50 rounded-lg p-2">
                <div className="text-xs font-medium text-slate-700 mb-1">
                  Component Transformations ({Object.keys(job.transformations).length})
                </div>
                <div className="space-y-1.5">
                  {Object.entries(job.transformations).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-medium text-slate-900">{key}:</span>{' '}
                        <span className="text-slate-600">{JSON.stringify(value).substring(0, 100)}...</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Split View */}
      <div className="flex-1 grid grid-cols-2 divide-x divide-slate-200 overflow-hidden">
        {/* Left - Informatica XML */}
        <div className="flex flex-col bg-white relative overflow-hidden">
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center gap-2 flex-shrink-0">
            <FileCode className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Informatica XML (Source)</span>
            <Badge className="ml-auto text-xs bg-blue-100 text-blue-700 border-blue-200">
              PowerCenter
            </Badge>
            <button
              onClick={() => handleCopyXML(job.informatica_xml, 'informatica')}
              className="ml-2 p-1.5 hover:bg-blue-100 rounded transition-colors"
              title="Copy XML"
            >
              {copiedInformatica ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-blue-600" />
              )}
            </button>
          </div>
          <div ref={informaticaScrollRef} className="flex-1 overflow-auto p-2">
            <XMLHighlighter xml={job.informatica_xml} />
          </div>
          {/* Bottom fade mask */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        </div>

        {/* Right - Talend XML */}
        <div className="flex flex-col bg-white relative overflow-hidden">
          <div className="bg-green-50 border-b border-green-200 px-4 py-2 flex items-center gap-2 flex-shrink-0">
            <FileCode className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-900">Talend XML (Generated)</span>
            <Badge className="ml-auto text-xs bg-green-100 text-green-700 border-green-200">
              .item file
            </Badge>
            <button
              onClick={() => handleCopyXML(job.talend_xml, 'talend')}
              className="ml-2 p-1.5 hover:bg-green-100 rounded transition-colors"
              title="Copy XML"
            >
              {copiedTalend ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-green-600" />
              )}
            </button>
          </div>
          <div ref={talendScrollRef} className="flex-1 overflow-auto p-2">
            <XMLHighlighter xml={job.talend_xml} />
          </div>
          {/* Bottom fade mask */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  )
}
