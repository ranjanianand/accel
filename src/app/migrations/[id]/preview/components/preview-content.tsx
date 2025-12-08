"use client"

import { useState } from 'react'
import { PreviewJob } from '../page'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, FileCode, ChevronDown, ChevronRight } from 'lucide-react'

interface PreviewContentProps {
  job: PreviewJob
}

export function PreviewContent({ job }: PreviewContentProps) {
  const [showTransformations, setShowTransformations] = useState(false)

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
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-mono">
              {job.job_name}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Pattern: {job.pattern_detected || 'Unknown'} • Created: {new Date(job.created_at).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-lg border ${getConfidenceColor(job.confidence_level)}`}>
              <div className="text-xs font-medium">Confidence Score</div>
              <div className="text-2xl font-bold">{job.confidence_score.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Warnings */}
        {job.warnings && job.warnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-amber-900 mb-1">
                {job.warnings.length} Warning{job.warnings.length > 1 ? 's' : ''}
              </div>
              <div className="space-y-1">
                {job.warnings.map((warning, idx) => (
                  <div key={idx} className="text-xs text-amber-700">• {warning}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transformations Summary */}
        {job.transformations && (
          <div className="mt-3">
            <button
              onClick={() => setShowTransformations(!showTransformations)}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              {showTransformations ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              Component Transformations ({Object.keys(job.transformations).length})
            </button>

            {showTransformations && (
              <div className="mt-2 bg-slate-50 rounded-lg p-4 space-y-2">
                {Object.entries(job.transformations).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-medium text-slate-900">{key}:</span>{' '}
                      <span className="text-slate-600">{JSON.stringify(value).substring(0, 100)}...</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Split View */}
      <div className="flex-1 grid grid-cols-2 divide-x divide-slate-200 overflow-hidden">
        {/* Left - Informatica XML */}
        <div className="flex flex-col bg-white">
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-3 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Informatica XML (Source)</span>
            <Badge className="ml-auto text-xs bg-blue-100 text-blue-700 border-blue-200">
              PowerCenter
            </Badge>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap break-words">
              <code>{formatXML(job.informatica_xml)}</code>
            </pre>
          </div>
        </div>

        {/* Right - Talend XML */}
        <div className="flex flex-col bg-white">
          <div className="bg-green-50 border-b border-green-200 px-4 py-3 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-900">Talend XML (Generated)</span>
            <Badge className="ml-auto text-xs bg-green-100 text-green-700 border-green-200">
              .item file
            </Badge>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap break-words">
              <code>{formatXML(job.talend_xml)}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple XML formatter
function formatXML(xml: string): string {
  try {
    // Basic indentation for readability
    let formatted = ''
    let indent = 0
    const tab = '  '

    xml.split(/>\s*</).forEach(node => {
      if (node.match(/^\/\w/)) indent-- // Closing tag
      formatted += tab.repeat(indent) + '<' + node + '>\n'
      if (node.match(/^<?\w[^>]*[^\/]$/)) indent++ // Opening tag
    })

    return formatted.substring(1, formatted.length - 2)
  } catch (e) {
    return xml // Return original if formatting fails
  }
}
