'use client'

import { LayoutGrid, List } from 'lucide-react'

export type ViewMode = 'card' | 'list'

export interface ViewToggleProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center rounded-md border border-gray-300 bg-white shadow-sm h-9">
      <button
        onClick={() => onViewChange('card')}
        className={`
          px-2.5 py-1.5 text-sm font-medium transition-all duration-150 h-full flex items-center
          ${
            currentView === 'card'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }
          rounded-l-md
        `}
        aria-label="Card view"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`
          px-2.5 py-1.5 text-sm font-medium transition-all duration-150 h-full flex items-center
          ${
            currentView === 'list'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }
          rounded-r-md border-l border-gray-300
        `}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  )
}
