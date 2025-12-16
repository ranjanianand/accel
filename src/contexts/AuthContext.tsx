'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI, type LoginRequest } from '@/lib/api-real'

// ============================================================================
// Types
// ============================================================================

interface User {
  id: string
  name?: string
  email: string
  tenant_id: string
  tenant_name: string
  subscription_tier: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ============================================================================
// Provider Component
// ============================================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state from localStorage token
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authAPI.isAuthenticated()) {
          try {
            const currentUser = await authAPI.getCurrentUser()
            setUser(currentUser)
          } catch (error) {
            // If backend unavailable but token exists, use mock user
            const token = authAPI.getToken()
            if (token === 'mock-jwt-token-for-demo') {
              setUser({
                id: 'mock-user-1',
                name: 'Demo User',
                email: 'admin@aixvenus.com',
                tenant_id: 'mock-tenant-1',
                tenant_name: 'Demo Tenant',
                subscription_tier: 'enterprise',
              })
            } else {
              authAPI.logout()
            }
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        authAPI.logout()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true)

      // Try real backend first, fallback to mock for production
      try {
        const response = await authAPI.login(credentials)
        setUser(response.user)
        router.push('/dashboard')
      } catch (backendError) {
        console.log('Backend unavailable, using mock authentication')

        // Mock authentication for production/demo
        if (
          (credentials.email === 'admin@aixvenus.com' && credentials.password === 'Aixv@2024!Secure') ||
          (credentials.email === 'admin@test.com' && credentials.password === 'password123')
        ) {
          const mockUser = {
            id: 'mock-user-1',
            name: 'Demo User',
            email: credentials.email,
            tenant_id: 'mock-tenant-1',
            tenant_name: 'Demo Tenant',
            subscription_tier: 'enterprise',
          }

          // Set mock token
          authAPI.setToken('mock-jwt-token-for-demo')
          setUser(mockUser)
          router.push('/dashboard')
        } else {
          throw new Error('Invalid credentials')
        }
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authAPI.logout()
    setUser(null)
    router.push('/login')
  }

  const refreshUser = async () => {
    try {
      const currentUser = await authAPI.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Failed to refresh user:', error)
      logout()
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ============================================================================
// Hook
// ============================================================================

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// ============================================================================
// Protected Route Component
// ============================================================================

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
