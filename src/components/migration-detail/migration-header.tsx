import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export interface MigrationHeaderProps {
  migration: {
    id: string
    name: string
    status: 'completed' | 'in_progress' | 'failed' | 'pending_review'
    totalJobs?: number
    complexity: number
    qualityScore?: number
    updatedAt: Date
  }
}

export function MigrationHeader({ migration }: MigrationHeaderProps) {
  const getStatusBadge = (status: typeof migration.status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>
      case 'in_progress':
        return <Badge variant="info">In Progress</Badge>
      case 'failed':
        return <Badge variant="error">Failed</Badge>
      case 'pending_review':
        return <Badge variant="warning">Pending Review</Badge>
    }
  }

  return (
    <div className="border-b border-border bg-background">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/migrations">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">{migration.name}</h1>
              {getStatusBadge(migration.status)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="danger" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
