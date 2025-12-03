'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { formatNumber } from '@/lib/utils'

export interface UsageData {
  label: string
  current: number
  limit: number
  percentage: number
}

export interface UsageChartProps {
  data: UsageData[]
  className?: string
}

export function UsageChart({ data, className }: UsageChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Usage - Last 30 Days</CardTitle>
          <Select defaultValue="30d" className="w-auto h-8 text-xs">
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground-secondary">{item.label}</span>
              <span className="text-xs text-foreground-tertiary">
                {formatNumber(item.current)} / {formatNumber(item.limit)}
              </span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-background-tertiary">
              <div
                className="h-full bg-foreground transition-all duration-300"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <div className="text-right text-xs text-foreground-tertiary mt-1">
              {item.percentage.toFixed(2)}%
            </div>
          </div>
        ))}
        <button className="mt-4 text-sm text-foreground hover:underline">
          Upgrade Plan →
        </button>
      </CardContent>
    </Card>
  )
}
