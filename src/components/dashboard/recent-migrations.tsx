import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package } from 'lucide-react'

export interface Migration {
  id: string
  name: string
  pattern: string
  complexity: number
  status: 'completed' | 'in_progress' | 'failed'
  validationScore?: number
  timestamp: string
  progress?: number
}

export interface RecentMigrationsProps {
  data: Migration[]
}

export function RecentMigrations({ data }: RecentMigrationsProps) {
  const getStatusBadge = (status: Migration['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>
      case 'in_progress':
        return <Badge variant="info">In Progress</Badge>
      case 'failed':
        return <Badge variant="error">Failed</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Migrations</CardTitle>
          <Link href="/migrations" className="text-sm text-foreground-secondary hover:underline">
            View All →
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((migration) => (
          <Link
            key={migration.id}
            href={`/migrations/${migration.id}`}
            className="block p-4 rounded border border-border hover:bg-background-secondary transition-colors"
          >
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 mt-0.5 text-foreground-secondary" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{migration.name}</div>
                <div className="flex items-center gap-2 mt-1 text-xs text-foreground-secondary">
                  <span>[{migration.pattern}]</span>
                  <span>•</span>
                  <span>Complexity: {migration.complexity}%</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(migration.status)}
                  <span className="text-xs text-foreground-tertiary">{migration.timestamp}</span>
                </div>
                {migration.status === 'in_progress' && migration.progress && (
                  <div className="mt-2">
                    <div className="h-1 w-full overflow-hidden rounded-full bg-background-tertiary">
                      <div
                        className="h-full bg-foreground transition-all duration-300"
                        style={{ width: `${migration.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-foreground-tertiary mt-1">
                      Estimated: 2 min remaining
                    </div>
                  </div>
                )}
                {migration.validationScore && migration.status === 'completed' && (
                  <div className="text-xs text-status-success mt-1">
                    ✓ Validation passed ({migration.validationScore}%)
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
