import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

export interface MetricCardProps {
  title: string
  value: string | number
  subtitle: string
  trend?: {
    value: string
    positive: boolean
  }
  footer?: string
  icon?: React.ReactNode
}

export function MetricCard({ title, value, subtitle, trend, footer, icon }: MetricCardProps) {
  return (
    <Card className="p-5 hover:shadow-md transition-shadow duration-200">
      <CardContent className="space-y-4 p-0">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-medium text-foreground-secondary tracking-tight">{title}</h3>
          {icon}
        </div>

        <div>
          <div className="text-3xl font-bold tracking-tight">{value}</div>
          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <span className={`flex items-center gap-1 text-xs font-medium ${trend.positive ? 'text-status-success' : 'text-status-error'}`}>
                {trend.positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {trend.value}
              </span>
            )}
            <span className="text-xs text-foreground-tertiary">{subtitle}</span>
          </div>
        </div>

        {footer && (
          <div className="text-xs text-foreground-tertiary pt-3 border-t border-border">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
