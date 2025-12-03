'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export interface QualityMetric {
  label: string
  value: string
  status: 'success' | 'warning' | 'error'
  reviewCount?: number
}

export interface QualityScoreProps {
  score: number
  target: number
  trend: string
  metrics: QualityMetric[]
}

export function QualityScore({ score, target, trend, metrics }: QualityScoreProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Quality Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-4xl font-semibold">{score}%</div>
            <div className="text-sm text-status-success mt-1">{trend}</div>
          </div>
          <div className="text-right text-sm text-foreground-secondary">
            🎯 Target: {target}%
          </div>
        </div>

        <div className="h-32 flex items-end justify-between gap-1 border-b border-border pb-2">
          {/* Simple bar chart visualization */}
          {[99.5, 99.6, 99.7, 99.8, 99.7, 99.9, 99.7].map((value, i) => (
            <div
              key={i}
              className="flex-1 bg-foreground rounded-t transition-all hover:opacity-80"
              style={{ height: `${value - 95}%` }}
              title={`${value}%`}
            />
          ))}
        </div>

        <div className="space-y-3 pt-2">
          <div className="text-sm font-medium">Last 7 Days:</div>
          {metrics.map((metric) => (
            <div key={metric.label} className="flex items-center justify-between text-sm">
              <span className="text-foreground-secondary">
                {metric.status === 'success' && '✓ '}
                {metric.status === 'warning' && '⚠ '}
                {metric.status === 'error' && '✗ '}
                {metric.label}
              </span>
              <span className={metric.status === 'warning' ? 'text-status-warning' : ''}>
                {metric.value}
                {metric.reviewCount && ` (review ${metric.reviewCount} jobs)`}
              </span>
            </div>
          ))}
        </div>

        <Link
          href="/reports/validation"
          className="block text-sm text-foreground hover:underline mt-4"
        >
          View Validation Details →
        </Link>
      </CardContent>
    </Card>
  )
}
