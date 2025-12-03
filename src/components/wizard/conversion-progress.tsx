'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Loader2 } from 'lucide-react'

export interface ConversionStep {
  id: string
  title: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  message?: string
}

export interface ConversionProgressProps {
  migrationId: string
  onComplete?: (success: boolean) => void
}

export function ConversionProgress({ migrationId, onComplete }: ConversionProgressProps) {
  const [progress, setProgress] = useState(0)
  const [steps, setSteps] = useState<ConversionStep[]>([
    { id: '1', title: 'Parsing Informatica XML', status: 'pending' },
    { id: '2', title: 'Analyzing transformations', status: 'pending' },
    { id: '3', title: 'Converting expressions', status: 'pending' },
    { id: '4', title: 'Mapping components', status: 'pending' },
    { id: '5', title: 'Extracting business rules', status: 'pending' },
    { id: '6', title: 'Generating Talend job', status: 'pending' },
    { id: '7', title: 'Running validations', status: 'pending' },
  ])
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    // Simulate real-time conversion progress with Server-Sent Events
    // In production, this would connect to your API
    const eventSource = new EventSource(`/api/migrations/${migrationId}/stream`)

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      setProgress(data.percentage)
      setLogs((prev) => [...prev, data.message])

      if (data.stepId) {
        setSteps((prev) =>
          prev.map((step) =>
            step.id === data.stepId
              ? { ...step, status: data.stepStatus, message: data.message }
              : step
          )
        )
      }

      if (data.completed) {
        eventSource.close()
        onComplete?.(data.success)
      }
    }

    return () => eventSource.close()
  }, [migrationId, onComplete])

  const getStepIcon = (status: ConversionStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-status-success" />
      case 'in_progress':
        return <Loader2 className="h-5 w-5 text-status-info animate-spin" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-border" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} showLabel className="mb-2" />
          <div className="text-sm text-foreground-secondary">
            {progress < 100 ? 'Converting...' : 'Conversion complete!'}
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex items-start gap-3 p-3 rounded bg-background-secondary"
              >
                {getStepIcon(step.status)}
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{step.title}</div>
                  {step.message && (
                    <div className="text-sm text-foreground-secondary mt-1">
                      {step.message}
                    </div>
                  )}
                </div>
                <Badge
                  variant={
                    step.status === 'completed'
                      ? 'success'
                      : step.status === 'in_progress'
                      ? 'info'
                      : 'default'
                  }
                >
                  {step.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 overflow-y-auto rounded border border-border bg-background-secondary p-3 font-mono text-xs">
            {logs.map((log, index) => (
              <div key={index} className="text-foreground-secondary">
                <span className="text-foreground-tertiary mr-2">
                  [{new Date().toLocaleTimeString()}]
                </span>
                {log}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
