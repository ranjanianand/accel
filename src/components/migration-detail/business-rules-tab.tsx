import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle } from 'lucide-react'

export interface BusinessRule {
  id: string
  name: string
  description: string
  source: string
  testCases: {
    input: string
    expectedOutput: string
    actualOutput: string
    passed: boolean
  }[]
  status: 'passed' | 'failed' | 'needs_review'
}

export function BusinessRulesTab({ rules }: { rules: BusinessRule[] }) {
  const getStatusBadge = (status: BusinessRule['status']) => {
    switch (status) {
      case 'passed':
        return <Badge variant="success">All Tests Passed</Badge>
      case 'failed':
        return <Badge variant="error">Tests Failed</Badge>
      case 'needs_review':
        return <Badge variant="warning">Needs Review</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {rules.map((rule) => (
        <Card key={rule.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{rule.name}</CardTitle>
                <p className="text-sm text-foreground-secondary mt-1">
                  {rule.description}
                </p>
                <p className="text-xs text-foreground-tertiary mt-2 font-mono">
                  Source: {rule.source}
                </p>
              </div>
              {getStatusBadge(rule.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm font-medium">Test Cases</div>
              {rule.testCases.map((test, index) => (
                <div
                  key={index}
                  className="p-3 rounded border border-border bg-background-secondary"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-medium">Test Case {index + 1}</div>
                    {test.passed ? (
                      <div className="flex items-center gap-1 text-status-success text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Passed
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-status-error text-sm">
                        <XCircle className="h-4 w-4" />
                        Failed
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm font-mono">
                    <div>
                      <div className="text-xs text-foreground-secondary mb-1">Input</div>
                      <div className="p-2 rounded bg-background border border-border">
                        {test.input}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-foreground-secondary mb-1">Expected</div>
                      <div className="p-2 rounded bg-background border border-border">
                        {test.expectedOutput}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-foreground-secondary mb-1">Actual</div>
                      <div
                        className={`p-2 rounded border ${
                          test.passed
                            ? 'bg-status-success/10 border-status-success/20'
                            : 'bg-status-error/10 border-status-error/20'
                        }`}
                      >
                        {test.actualOutput}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
