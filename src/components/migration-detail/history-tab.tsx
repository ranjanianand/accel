import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

export interface HistoryEvent {
  id: string
  type: 'created' | 'converted' | 'validated' | 'downloaded' | 'updated' | 'failed'
  user: string
  description: string
  timestamp: Date
  metadata?: Record<string, string>
}

export function HistoryTab({ events }: { events: HistoryEvent[] }) {
  const getEventIcon = (type: HistoryEvent['type']) => {
    switch (type) {
      case 'created':
        return '✨'
      case 'converted':
        return '🔄'
      case 'validated':
        return '✅'
      case 'downloaded':
        return '📥'
      case 'updated':
        return '📝'
      case 'failed':
        return '❌'
    }
  }

  const getEventBadge = (type: HistoryEvent['type']) => {
    const variants: Record<HistoryEvent['type'], 'default' | 'success' | 'error' | 'info'> = {
      created: 'info',
      converted: 'info',
      validated: 'success',
      downloaded: 'default',
      updated: 'default',
      failed: 'error',
    }

    return (
      <Badge variant={variants[type]}>
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    )
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={event.id} className="relative">
                {index !== events.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-px bg-border" />
                )}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background-secondary border border-border text-xl flex-shrink-0">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{event.description}</div>
                        <div className="text-sm text-foreground-secondary mt-1">
                          by {event.user} • {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                        </div>
                        {event.metadata && Object.keys(event.metadata).length > 0 && (
                          <div className="mt-2 p-3 rounded bg-background-secondary text-sm font-mono">
                            {Object.entries(event.metadata).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-2">
                                <span className="text-foreground-secondary">{key}:</span>
                                <span>{value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {getEventBadge(event.type)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
