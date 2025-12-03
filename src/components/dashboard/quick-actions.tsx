import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Upload, FileText } from 'lucide-react'

export function QuickActions() {
  return (
    <div className="flex items-center justify-center gap-4 py-6 border-y border-border bg-background-secondary">
      <Link href="/migrations/new">
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          New Migration
        </Button>
      </Link>
      <Link href="/migrations/import">
        <Button variant="secondary" size="lg" className="gap-2">
          <Upload className="h-5 w-5" />
          Import Batch
        </Button>
      </Link>
      <Link href="/reports/generate">
        <Button variant="secondary" size="lg" className="gap-2">
          <FileText className="h-5 w-5" />
          Generate Report
        </Button>
      </Link>
    </div>
  )
}
