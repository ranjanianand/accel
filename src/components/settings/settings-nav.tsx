'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { User, Users, Bell } from 'lucide-react'

const SETTINGS_TABS = [
  { id: 'account', label: 'Account', Icon: User },
  { id: 'team', label: 'Team', Icon: Users },
  { id: 'notifications', label: 'Notifications', Icon: Bell },
]

export function SettingsNav() {
  const pathname = usePathname()
  const currentTab = pathname.split('/').pop() || 'account'

  return (
    <nav className="border-b border-border">
      <div className="flex gap-1">
        {SETTINGS_TABS.map((tab) => {
          const isActive = currentTab === tab.id
          const href = `/settings/${tab.id === 'account' ? '' : tab.id}`
          const Icon = tab.Icon

          return (
            <Link
              key={tab.id}
              href={href}
              className={clsx(
                'flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors relative',
                {
                  'text-foreground': isActive,
                  'text-muted-foreground hover:text-foreground': !isActive,
                }
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
