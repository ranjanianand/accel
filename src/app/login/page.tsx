'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogIn, Loader2, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login({ email, password })
      // AuthContext login handles navigation to /dashboard
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-background-secondary/30 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative">
        {/* Card with glassmorphism effect */}
        <div className="bg-background/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl shadow-black/5 p-8">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center mb-8 gap-3">
            <Link href="/" className="group">
              <img
                src="/images/av_logo.png"
                alt="Aixvenus Logo"
                className="h-32 w-32 object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <span className="text-2xl font-bold tracking-tight">Migration Accelerator</span>
          </div>

          {/* Header */}
          <div className="space-y-2 text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-foreground-secondary">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-200">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@test.com"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                  className="h-11 px-4 bg-background border-border focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="h-11 px-4 bg-background border-border focus:border-primary transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-foreground hover:bg-foreground/90 text-background font-medium shadow-lg shadow-foreground/10 transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign in
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-sm text-foreground-secondary">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-foreground font-medium hover:text-primary transition-colors"
              >
                Contact Sales
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <p className="mt-8 text-center text-xs text-foreground-tertiary">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-foreground-secondary transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-foreground-secondary transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
