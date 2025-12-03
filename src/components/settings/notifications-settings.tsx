'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, Info } from 'lucide-react'

export function NotificationsSettings() {
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [migrationComplete, setMigrationComplete] = useState(true)
  const [migrationError, setMigrationError] = useState(true)
  const [validationIssues, setValidationIssues] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(false)
  const [systemUpdates, setSystemUpdates] = useState(true)

  const recentNotifications = [
    {
      id: 1,
      type: 'success',
      title: 'Migration Completed Successfully',
      description: 'Customer_ETL_v2.xml converted to Talend job',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'error',
      title: 'Validation Error Detected',
      description: 'Data type mismatch in ProductMaster_Transform',
      time: '5 hours ago',
    },
    {
      id: 3,
      type: 'info',
      title: 'Weekly Migration Report',
      description: '15 migrations completed this week with 97% success rate',
      time: '1 day ago',
    },
  ]

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
              />
              <span>Enable email notifications</span>
            </label>
            <p className="text-xs text-foreground-tertiary mt-1 ml-6">
              Receive email alerts for migration events
            </p>
          </div>

          <div className="pt-4 border-t border-border space-y-3">
            <p className="text-sm font-medium">Notification Types</p>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={migrationComplete}
                onChange={(e) => setMigrationComplete(e.target.checked)}
                disabled={!emailEnabled}
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black disabled:opacity-50"
              />
              <span className={!emailEnabled ? 'text-foreground-tertiary' : ''}>
                Migration completion
              </span>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={migrationError}
                onChange={(e) => setMigrationError(e.target.checked)}
                disabled={!emailEnabled}
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black disabled:opacity-50"
              />
              <span className={!emailEnabled ? 'text-foreground-tertiary' : ''}>
                Migration errors
              </span>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={validationIssues}
                onChange={(e) => setValidationIssues(e.target.checked)}
                disabled={!emailEnabled}
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black disabled:opacity-50"
              />
              <span className={!emailEnabled ? 'text-foreground-tertiary' : ''}>
                Validation issues detected
              </span>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={weeklyReport}
                onChange={(e) => setWeeklyReport(e.target.checked)}
                disabled={!emailEnabled}
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black disabled:opacity-50"
              />
              <span className={!emailEnabled ? 'text-foreground-tertiary' : ''}>
                Weekly progress report
              </span>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={systemUpdates}
                onChange={(e) => setSystemUpdates(e.target.checked)}
                disabled={!emailEnabled}
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black disabled:opacity-50"
              />
              <span className={!emailEnabled ? 'text-foreground-tertiary' : ''}>
                System updates and maintenance
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-border">
            <Button>Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
