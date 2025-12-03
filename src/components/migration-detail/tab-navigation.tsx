'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import {
  BarChart3,
  FileCode,
  CheckCircle2,
  FolderOpen,
  AlertTriangle
} from 'lucide-react'

export interface TabNavigationProps {
  migrationId: string
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'technical', label: 'Technical', icon: FileCode },
  { id: 'validation', label: 'Validation', icon: CheckCircle2 },
  { id: 'issues', label: 'Review', icon: AlertTriangle },
  { id: 'files', label: 'Files', icon: FolderOpen },
]

export function TabNavigation({ migrationId }: TabNavigationProps) {
  const pathname = usePathname()
  // Extract tab from pathname - if path is /migrations/[id], it's overview
  const pathParts = pathname.split('/')
  const lastPart = pathParts[pathParts.length - 1]
  const currentTab = lastPart === migrationId ? 'overview' : lastPart

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex items-center px-6 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = currentTab === tab.id
          const href = `/migrations/${migrationId}${tab.id === 'overview' ? '' : `/${tab.id}`}`
          const Icon = tab.icon

          return (
            <Link
              key={tab.id}
              href={href}
              className={clsx(
                'relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 border-b-2',
                {
                  'text-gray-900 border-gray-900': isActive,
                  'text-gray-500 border-transparent hover:text-gray-700': !isActive,
                }
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
