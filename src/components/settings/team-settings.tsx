'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Trash2 } from 'lucide-react'
import { InviteMemberDialog } from './invite-member-dialog'

const teamMembers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Developer', status: 'Active' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'Pending' },
]

export function TeamSettings() {
  const [showInviteModal, setShowInviteModal] = useState(false)

  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between w-full gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle>Team Members</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your team members and their access levels
              </p>
            </div>
            <Button onClick={() => setShowInviteModal(true)} className="gap-2 flex-shrink-0">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded border border-border"
              >
                <div className="flex-1">
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-foreground-secondary">{member.email}</div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>
                    {member.status}
                  </Badge>
                  <Select defaultValue={member.role.toLowerCase()} className="w-32">
                    <option value="admin">Admin</option>
                    <option value="developer">Developer</option>
                    <option value="viewer">Viewer</option>
                  </Select>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3">Permission</th>
                  <th className="text-center p-3">Admin</th>
                  <th className="text-center p-3">Developer</th>
                  <th className="text-center p-3">Viewer</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Create migrations', admin: true, dev: true, viewer: false },
                  { name: 'Delete migrations', admin: true, dev: true, viewer: false },
                  { name: 'View migrations', admin: true, dev: true, viewer: true },
                  { name: 'Manage team', admin: true, dev: false, viewer: false },
                  { name: 'Change settings', admin: true, dev: false, viewer: false },
                  { name: 'View reports', admin: true, dev: true, viewer: true },
                ].map((perm, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="p-3">{perm.name}</td>
                    <td className="text-center p-3">
                      {perm.admin ? '✓' : '—'}
                    </td>
                    <td className="text-center p-3">
                      {perm.dev ? '✓' : '—'}
                    </td>
                    <td className="text-center p-3">
                      {perm.viewer ? '✓' : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invite Member Modal */}
      <InviteMemberDialog
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </div>
  )
}
