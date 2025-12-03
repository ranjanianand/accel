import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export interface Alert {
  id: string
  migrationName: string
  severity: 'error' | 'warning'
  message: string
  timestamp: string
}

export interface AlertsWidgetProps {
  alerts: Alert[]
}

export function AlertsWidget({ alerts }: AlertsWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ⚠ Attention Required ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
            <div className="flex items-start gap-3">
              <AlertCircle className={`h-5 w-5 mt-0.5 ${alert.severity === 'error' ? 'text-status-error' : 'text-status-warning'}`} />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{alert.migrationName}</div>
                <div className="text-sm text-foreground-secondary mt-1">
                  {alert.message}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-foreground-tertiary">{alert.timestamp}</span>
                  <span className="text-xs">•</span>
                  <Link
                    href={`/migrations/${alert.id}`}
                    className="text-xs text-foreground hover:underline"
                  >
                    Review →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
