'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Bell, User, Settings, LogOut, CheckCircle2, AlertCircle, Info, Check, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Cookies from 'js-cookie'

interface UserData {
  id: string
  username: string
  name: string
  email: string
}

export function Header() {
  const router = useRouter()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load user data from cookie
    const userCookie = Cookies.get('user')
    if (userCookie) {
      try {
        const parsed = JSON.parse(userCookie)
        setUser(parsed)
      } catch (error) {
        console.error('Failed to parse user cookie:', error)
        // Clear invalid cookie
        Cookies.remove('user')
        setUser(null)
      }
    }
  }, [])

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', { method: 'POST' })

      // Clear client-side cookies
      Cookies.remove('user')

      // Redirect to login
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect to login even if API call fails
      Cookies.remove('user')
      router.push('/login')
    }
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    setShowProfileMenu(false)
  }

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
    setShowNotifications(false)
  }

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Migration Completed Successfully',
      description: 'Customer_ETL_v2.xml converted to Talend job',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'error',
      title: 'Validation Error Detected',
      description: 'Data type mismatch in ProductMaster_Transform',
      time: '5 hours ago',
      read: false,
    },
    {
      id: 3,
      type: 'info',
      title: 'Weekly Migration Report',
      description: '15 migrations completed this week with 97% success rate',
      time: '1 day ago',
      read: true,
    },
  ])

  const handleMarkAsRead = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications(notifications.filter(n => n.id !== id))
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }

    if (showNotifications || showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications, showProfileMenu])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center gap-8 px-6">
        <Link href={user ? "/dashboard" : "/product"} className="flex items-center gap-3 mr-2 group">
          <img
            src="/images/av_logo.png"
            alt="Aixvenus Logo"
            className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span className="text-lg font-bold tracking-tight">Migration Accelerator</span>
        </Link>

        {user && (
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-md font-medium transition-colors hover:bg-background-secondary hover:text-foreground"
            >
              Overview
            </Link>
            <Link
              href="/migrations"
              className="px-3 py-1.5 rounded-md transition-colors hover:bg-background-secondary text-foreground-secondary hover:text-foreground"
            >
              Migrations
            </Link>
          </nav>
        )}

        <div className="ml-auto flex items-center gap-3">
          {user && (
            <>
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={toggleNotifications}
                  className="relative p-2 hover:bg-background-secondary rounded-md transition-all duration-200"
                >
                  <Bell className="h-5 w-5 text-foreground-secondary" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-status-error ring-2 ring-background" />
                </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-background border border-border z-[110]">
                  <div className="p-4 border-b border-border">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-3 p-4 border-b border-border hover:bg-background-secondary transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
                      >
                        <div className="mt-0.5">
                          {notification.type === 'success' && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                          {notification.type === 'error' && (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          )}
                          {notification.type === 'info' && (
                            <Info className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {!notification.read && (
                              <button
                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                              >
                                <Check className="h-3 w-3" />
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDelete(notification.id, e)}
                              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-border">
                    <Link
                      href="/settings/notifications"
                      className="block text-center text-sm text-primary hover:underline py-2"
                      onClick={() => setShowNotifications(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
            )}
              </div>

              <div className="relative" ref={profileRef}>
            <button
              onClick={toggleProfileMenu}
              className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-background-secondary rounded-md transition-all duration-200"
            >
              <div className="h-6 w-6 rounded-full bg-foreground flex items-center justify-center">
                <User className="h-4 w-4 text-background" />
              </div>
              <span className="text-sm font-medium">{user?.name || 'User'}</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-background border border-border z-[110]">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium">{user?.name || 'User'}</p>
                    <p className="text-xs text-foreground-secondary mt-0.5">{user?.email || ''}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-background-secondary transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-background-secondary transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
            )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
