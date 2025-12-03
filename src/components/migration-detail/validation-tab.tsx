import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

export interface ValidationData {
  qualityScore: number
  validations: {
    type: string
    status: 'passed' | 'failed' | 'warning'
    expected: string
    actual: string
    variance?: string
  }[]
  reconciliation: {
    rowCount: { source: number; target: number; match: boolean }
    aggregates: { column: string; source: string; target: string; match: boolean }[]
    samples: { passed: number; total: number; percentage: number }
  }
}

export function ValidationTab({ data }: { data: ValidationData }) {
  const getStatusIcon = (status: 'passed' | 'failed' | 'warning') => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="h-5 w-5 text-status-success" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-status-error" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-status-warning" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Quality Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Quality Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-semibold">{data.qualityScore}%</div>
              <div className="text-sm text-status-success mt-1">
                Exceeds target of 99.5%
              </div>
            </div>
            <Badge variant="success" className="text-lg px-4 py-2">
              PASSED
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Validation Results */}
      <Card>
        <CardHeader>
          <CardTitle>Validation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.validations.map((validation, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded border border-border"
              >
                {getStatusIcon(validation.status)}
                <div className="flex-1">
                  <div className="font-medium">{validation.type}</div>
                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                      <span className="text-foreground-secondary">Expected: </span>
                      <span>{validation.expected}</span>
                    </div>
                    <div>
                      <span className="text-foreground-secondary">Actual: </span>
                      <span>{validation.actual}</span>
                    </div>
                    {validation.variance && (
                      <div className="col-span-2">
                        <span className="text-foreground-secondary">Variance: </span>
                        <span className="text-status-warning">{validation.variance}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge
                  variant={
                    validation.status === 'passed'
                      ? 'success'
                      : validation.status === 'failed'
                      ? 'error'
                      : 'warning'
                  }
                >
                  {validation.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Row Count Reconciliation */}
      <Card>
        <CardHeader>
          <CardTitle>Row Count Reconciliation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded bg-background-secondary">
            <div className="flex items-center gap-8">
              <div>
                <div className="text-sm text-foreground-secondary">Source Rows</div>
                <div className="text-2xl font-semibold mt-1">
                  {formatNumber(data.reconciliation.rowCount.source)}
                </div>
              </div>
              <div className="text-foreground-tertiary">→</div>
              <div>
                <div className="text-sm text-foreground-secondary">Target Rows</div>
                <div className="text-2xl font-semibold mt-1">
                  {formatNumber(data.reconciliation.rowCount.target)}
                </div>
              </div>
            </div>
            <Badge variant={data.reconciliation.rowCount.match ? 'success' : 'error'}>
              {data.reconciliation.rowCount.match ? 'MATCH' : 'MISMATCH'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Aggregate Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Aggregate Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.reconciliation.aggregates.map((agg, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded border border-border"
              >
                <div className="flex items-center gap-8 flex-1">
                  <div className="w-32">
                    <div className="text-sm font-medium">{agg.column}</div>
                  </div>
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1">
                      <div className="text-xs text-foreground-secondary">Source</div>
                      <div className="text-sm font-mono">{agg.source}</div>
                    </div>
                    <div className="text-foreground-tertiary">→</div>
                    <div className="flex-1">
                      <div className="text-xs text-foreground-secondary">Target</div>
                      <div className="text-sm font-mono">{agg.target}</div>
                    </div>
                  </div>
                </div>
                {agg.match ? (
                  <CheckCircle2 className="h-5 w-5 text-status-success" />
                ) : (
                  <XCircle className="h-5 w-5 text-status-error" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sample Data Match */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Data Match</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground-secondary">
                Matched {data.reconciliation.samples.passed} of {data.reconciliation.samples.total} samples
              </span>
              <span className="text-xl font-semibold">
                {data.reconciliation.samples.percentage}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-background-tertiary">
              <div
                className="h-full bg-status-success transition-all duration-300"
                style={{ width: `${data.reconciliation.samples.percentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
