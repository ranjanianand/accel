'use client'

import { useState } from 'react'
import { useMigrationWizardStore, DetectedConnection, ConnectionConfig } from '@/stores/migration-wizard-store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

// ============================================================================
// Connection Configuration Component
// ============================================================================

interface ConnectionConfigFormProps {
  connection: DetectedConnection
  onSave: (config: ConnectionConfig) => void
  onCancel: () => void
}

function ConnectionConfigForm({ connection, onSave, onCancel }: ConnectionConfigFormProps) {
  const [config, setConfig] = useState<ConnectionConfig>(
    connection.config || {
      host: '',
      port: undefined,
      database: '',
      schema: '',
      username: '',
      password: '',
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(config)
  }

  const isDatabaseConnection = ['Oracle', 'SQL Server', 'MySQL', 'PostgreSQL', 'DB2'].includes(
    connection.type
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4 p-4 bg-muted/50 rounded-lg">
      <h4 className="text-sm font-medium text-foreground">Configure {connection.name}</h4>

      {isDatabaseConnection ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`host-${connection.name}`} required>
                Host
              </Label>
              <Input
                id={`host-${connection.name}`}
                type="text"
                placeholder="localhost"
                value={config.host || ''}
                onChange={(e) => setConfig({ ...config, host: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor={`port-${connection.name}`} required>
                Port
              </Label>
              <Input
                id={`port-${connection.name}`}
                type="number"
                placeholder={connection.type === 'Oracle' ? '1521' : '3306'}
                value={config.port || ''}
                onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`database-${connection.name}`} required>
                Database / SID
              </Label>
              <Input
                id={`database-${connection.name}`}
                type="text"
                placeholder="ORCL"
                value={config.database || ''}
                onChange={(e) => setConfig({ ...config, database: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor={`schema-${connection.name}`}>Schema</Label>
              <Input
                id={`schema-${connection.name}`}
                type="text"
                placeholder="DW_SCHEMA"
                value={config.schema || ''}
                onChange={(e) => setConfig({ ...config, schema: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`username-${connection.name}`} required>
                Username
              </Label>
              <Input
                id={`username-${connection.name}`}
                type="text"
                placeholder="admin"
                value={config.username || ''}
                onChange={(e) => setConfig({ ...config, username: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor={`password-${connection.name}`} required>
                Password
              </Label>
              <Input
                id={`password-${connection.name}`}
                type="password"
                placeholder="••••••••"
                value={config.password || ''}
                onChange={(e) => setConfig({ ...config, password: e.target.value })}
                required
              />
            </div>
          </div>
        </>
      ) : (
        <div>
          <Label htmlFor={`filepath-${connection.name}`} required>
            File Path / URL
          </Label>
          <Input
            id={`filepath-${connection.name}`}
            type="text"
            placeholder="/data/files or ftp://server.com"
            value={config.filePath || ''}
            onChange={(e) => setConfig({ ...config, filePath: e.target.value })}
            required
          />
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" size="sm">
          Save Configuration
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

// ============================================================================
// Connection Card Component
// ============================================================================

interface ConnectionCardProps {
  connection: DetectedConnection
}

function ConnectionCard({ connection }: ConnectionCardProps) {
  const { updateConnection, configureConnection, testConnection } = useMigrationWizardStore()
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  const handleSaveConfig = (config: ConnectionConfig) => {
    configureConnection(connection.name, config)
    setIsConfiguring(false)
  }

  const handleTest = async () => {
    setIsTesting(true)
    await testConnection(connection.name)
    setIsTesting(false)
  }

  const getStatusBadge = () => {
    switch (connection.configStatus) {
      case 'unconfigured':
        return <Badge className="bg-gray-100 text-gray-800">Not Configured</Badge>
      case 'configured':
        return <Badge className="bg-blue-100 text-blue-800">Configured</Badge>
      case 'tested_success':
        return <Badge className="bg-green-100 text-green-800">✓ Tested</Badge>
      case 'tested_failure':
        return <Badge className="bg-red-100 text-red-800">✗ Failed</Badge>
      case 'linked':
        return <Badge className="bg-purple-100 text-purple-800">Linked</Badge>
    }
  }

  const getTypeIcon = () => {
    const iconClass = "w-5 h-5"
    switch (connection.type) {
      case 'Oracle':
      case 'SQL Server':
      case 'MySQL':
      case 'PostgreSQL':
      case 'DB2':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        )
      case 'Flat File':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'FTP':
      case 'HTTP':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
          {getTypeIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-foreground">{connection.name}</h4>
            {getStatusBadge()}
          </div>
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>Type: {connection.type}</p>
            <p>
              Used in {connection.usedInMappings} mapping{connection.usedInMappings !== 1 ? 's' : ''}
              {connection.usedInWorkflows > 0 && `, ${connection.usedInWorkflows} workflow${connection.usedInWorkflows !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Test Result */}
          {connection.testResult && (
            <div className={`mt-2 text-xs p-2 rounded ${connection.testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {connection.testResult.message}
              {connection.testResult.duration && ` (${connection.testResult.duration}ms)`}
            </div>
          )}

          {/* Configuration Form */}
          {isConfiguring && (
            <ConnectionConfigForm
              connection={connection}
              onSave={handleSaveConfig}
              onCancel={() => setIsConfiguring(false)}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {connection.configStatus === 'unconfigured' && (
            <Button size="sm" onClick={() => setIsConfiguring(true)}>
              Configure
            </Button>
          )}
          {(connection.configStatus === 'configured' || connection.configStatus === 'tested_failure') && (
            <>
              <Button size="sm" onClick={handleTest} disabled={isTesting}>
                {isTesting ? 'Testing...' : 'Test'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsConfiguring(true)}>
                Edit
              </Button>
            </>
          )}
          {connection.configStatus === 'tested_success' && (
            <Button size="sm" variant="ghost" onClick={() => setIsConfiguring(true)}>
              Reconfigure
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function Step3Connections() {
  const { detectedConnections, validateStep3, nextStep, prevStep } = useMigrationWizardStore()

  const canProceed = validateStep3()

  const configuredCount = detectedConnections.filter(
    (c) =>
      c.configStatus === 'configured' ||
      c.configStatus === 'tested_success' ||
      c.configStatus === 'linked'
  ).length

  const testedCount = detectedConnections.filter(
    (c) => c.configStatus === 'tested_success'
  ).length

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Connection Configuration
        </h2>
        <p className="text-muted-foreground">
          Configure connections detected in your Informatica files. Test connections to ensure
          they&apos;re working correctly.
        </p>
      </div>

      {/* Summary */}
      {detectedConnections.length > 0 && (
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {detectedConnections.length} connection{detectedConnections.length !== 1 ? 's' : ''} detected
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Configured:</span>{' '}
                <span className="font-medium text-foreground">
                  {configuredCount}/{detectedConnections.length}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Tested:</span>{' '}
                <span className="font-medium text-foreground">
                  {testedCount}/{detectedConnections.length}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* No Connections */}
      {detectedConnections.length === 0 && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Connections Detected</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            No database or file connections were found in your uploaded files. You can proceed
            to the next step.
          </p>
        </Card>
      )}

      {/* Connection List */}
      {detectedConnections.length > 0 && (
        <div className="space-y-3">
          {detectedConnections.map((connection) => (
            <ConnectionCard key={connection.name} connection={connection} />
          ))}
        </div>
      )}

      {/* Info Box */}
      {detectedConnections.length > 0 && configuredCount < detectedConnections.length && (
        <Card className="p-4 mt-6 bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <div className="text-blue-600 mt-0.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 mb-1">Optional Configuration</h4>
              <p className="text-sm text-blue-700">
                You can configure connections now or later. Configured connections enable connection
                testing and validation before migration.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between gap-3 pt-6 mt-6 border-t">
        <Button variant="secondary" onClick={prevStep}>
          ← Back to Upload
        </Button>
        <Button onClick={nextStep} disabled={!canProceed}>
          Continue to Review →
        </Button>
      </div>
    </div>
  )
}
