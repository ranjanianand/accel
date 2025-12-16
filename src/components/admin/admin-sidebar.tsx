'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  Building2,
  Users,
  Activity,
  Server,
  FileText,
  Settings,
  LogOut
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Building2, label: 'Tenants', href: '/admin/tenants' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: Activity, label: 'Monitoring', href: '/admin/monitoring' },
  { icon: Server, label: 'System Health', href: '/admin/system-health' },
  { icon: FileText, label: 'Audit Log', href: '/admin/audit-log' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' }
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    // Clear admin token
    localStorage.removeItem('admin_token')
    sessionStorage.removeItem('admin_token')
    logout()
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-sm font-bold text-gray-900 mb-1">
          Migration Accelerator
        </h1>
        <p className="text-xs font-semibold text-gray-500 tracking-wider">
          SUPERADMIN
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-gray-100 text-gray-900 border-l-2 border-[#0070F3]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-900 truncate">
            {user?.name || 'Admin User'}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user?.email || 'admin@example.com'}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-3 h-3" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
