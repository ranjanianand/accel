import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'

export interface AnalysisResults {
  mappingName: string
  pattern: string
  complexity: number
  estimatedTime: string
  transformations: number
  expressions: number
  lookups: number
  businessRules: number
  dependencies: string[]
  warnings: string[]
}

export interface AnalysisResultsProps {
  results: AnalysisResults
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const getComplexityVariant = (complexity: number) => {
    if (complexity < 30) return 'success'
    if (complexity < 70) return 'warning'
    return 'error'
  }

  return (
    <div className="space-y-6">
      {/* Pattern Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-status-success" />
            Pattern Detected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold">{results.pattern}</div>
              <div className="text-sm text-foreground-secondary mt-1">
                {results.mappingName}
              </div>
            </div>
            <Badge variant={getComplexityVariant(results.complexity)}>
              {results.complexity}% Complexity
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Estimate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-status-info" />
            Conversion Estimate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-foreground-secondary">Estimated Time</div>
              <div className="text-xl font-semibold mt-1">{results.estimatedTime}</div>
            </div>
            <div>
              <div className="text-sm text-foreground-secondary">Automation Level</div>
              <div className="text-xl font-semibold mt-1">92-97%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Components Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Components Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between p-3 rounded bg-background-secondary">
              <span className="text-foreground-secondary">Transformations</span>
              <span className="font-medium">{results.transformations}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded bg-background-secondary">
              <span className="text-foreground-secondary">Expressions</span>
              <span className="font-medium">{results.expressions}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded bg-background-secondary">
              <span className="text-foreground-secondary">Lookups</span>
              <span className="font-medium">{results.lookups}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded bg-background-secondary">
              <span className="text-foreground-secondary">Business Rules</span>
              <span className="font-medium">{results.businessRules}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dependencies */}
      {results.dependencies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Dependencies Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.dependencies.map((dep, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded bg-background-secondary text-sm"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground-secondary" />
                  <span>{dep}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {results.warnings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-status-warning">
              <AlertCircle className="h-5 w-5" />
              Warnings ({results.warnings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.warnings.map((warning, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 rounded border border-status-warning/20 bg-status-warning/10 text-sm"
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
