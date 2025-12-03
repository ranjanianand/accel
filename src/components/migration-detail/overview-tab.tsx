import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export interface OverviewData {
  summary: {
    totalTransformations: number
    expressionsConverted: number
    lookupsConverted: number
    businessRulesExtracted: number
  }
  transformationMapping: {
    source: string
    target: string
    type: string
    status: 'auto' | 'manual'
  }[]
  manualReviewItems: {
    component: string
    issue: string
    severity: 'warning' | 'error'
  }[]
}

export function OverviewTab({ data }: { data: OverviewData }) {
  return (
    <div className="p-6 space-y-6">
      {/* Conversion Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded bg-background-secondary">
              <div className="text-sm text-foreground-secondary">Transformations</div>
              <div className="text-2xl font-semibold mt-1">
                {data.summary.totalTransformations}
              </div>
            </div>
            <div className="p-4 rounded bg-background-secondary">
              <div className="text-sm text-foreground-secondary">Expressions</div>
              <div className="text-2xl font-semibold mt-1">
                {data.summary.expressionsConverted}
              </div>
            </div>
            <div className="p-4 rounded bg-background-secondary">
              <div className="text-sm text-foreground-secondary">Lookups</div>
              <div className="text-2xl font-semibold mt-1">
                {data.summary.lookupsConverted}
              </div>
            </div>
            <div className="p-4 rounded bg-background-secondary">
              <div className="text-sm text-foreground-secondary">Business Rules</div>
              <div className="text-2xl font-semibold mt-1">
                {data.summary.businessRulesExtracted}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transformation Mapping */}
      <Card>
        <CardHeader>
          <CardTitle>Transformation Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.transformationMapping.map((mapping, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded border border-border hover:bg-background-secondary transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{mapping.source}</div>
                    <div className="text-xs text-foreground-tertiary">
                      {mapping.type}
                    </div>
                  </div>
                  <div className="text-foreground-tertiary">→</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{mapping.target}</div>
                    <div className="text-xs text-foreground-tertiary">Talend Component</div>
                  </div>
                </div>
                <Badge variant={mapping.status === 'auto' ? 'success' : 'warning'}>
                  {mapping.status === 'auto' ? 'Auto-converted' : 'Manual review'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manual Review Items */}
      {data.manualReviewItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-status-warning">
              <AlertCircle className="h-5 w-5" />
              Manual Review Required ({data.manualReviewItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.manualReviewItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded border ${
                    item.severity === 'error'
                      ? 'border-status-error/20 bg-status-error/10'
                      : 'border-status-warning/20 bg-status-warning/10'
                  }`}
                >
                  {item.severity === 'error' ? (
                    <AlertCircle className="h-5 w-5 text-status-error flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-status-warning flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{item.component}</div>
                    <div className="text-sm text-foreground-secondary mt-1">{item.issue}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
