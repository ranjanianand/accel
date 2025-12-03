'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { X } from 'lucide-react'

interface InviteMemberDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function InviteMemberDialog({ isOpen, onClose }: InviteMemberDialogProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('developer')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Reset and close
    setEmail('')
    setRole('developer')
    setIsSubmitting(false)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background rounded-lg shadow-lg z-50">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Invite Team Member</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email Address</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              We&apos;ll send them an invitation to join your team
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-role">Role</Label>
            <Select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full"
            >
              <option value="admin">Admin - Full access to all features</option>
              <option value="developer">Developer - Create and manage migrations</option>
              <option value="viewer">Viewer - Read-only access</option>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
