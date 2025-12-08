'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface UserData {
  id: string
  username: string
  name: string
  email: string
}

interface AuthContextType {
  user: UserData | null
  loading: boolean
  login: (userData: UserData) => void
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Load user session on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const userCookie = Cookies.get('user')
        if (userCookie) {
          const parsed = JSON.parse(userCookie)
          setUser(parsed)
        }
      } catch (error) {
        console.error('Failed to parse user cookie:', error)
        Cookies.remove('user')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = (userData: UserData) => {
    setUser(userData)
    Cookies.set('user', JSON.stringify(userData), { expires: 7 }) // 7 days
  }

  const logout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear client-side state
      Cookies.remove('user')
      setUser(null)
      router.push('/login')
      router.refresh()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
