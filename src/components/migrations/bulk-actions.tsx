'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, Download, Trash2 } from 'lucide-react'

export function BulkActions() {
  const [selectedCount, setSelectedCount] = useState(0)

  if (selectedCount === 0) return null

  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-border bg-background-secondary">
      <span className="text-sm text-foreground-secondary">
        {selectedCount} selected
      </span>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Re-convert
        </Button>
        <Button variant="secondary" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button variant="danger" size="sm" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  )
}
