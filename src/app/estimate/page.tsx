"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, Calculator, TrendingUp, AlertTriangle } from 'lucide-react'

interface CertaintyScoreResult {
  project_name: string
  overall_certainty: number
  risk_level: string
  success_probability: number
  estimated_duration_days: number
  estimated_cost: number
  top_risks: Array<{
    factor: string
    severity: string
    impact: string
    mitigation: string
  }>
}

export default function EstimatePage() {
  const [calculating, setCalculating] = useState(false)
  const [result, setResult] = useState<CertaintyScoreResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Sample project data for demo
  const sampleProjectData = {
    project_name: "Enterprise CRM Migration",
    mappings: [
      {
        mapping_name: "m_CUSTOMER_LOAD",
        complexity_score: 0.65,
        transformation_count: 12,
        has_custom_logic: true,
        uses_lookup: true
      },
      {
        mapping_name: "m_ORDER_PROCESSING",
        complexity_score: 0.82,
        transformation_count: 18,
        has_custom_logic: true,
        uses_lookup: true
      },
      {
        mapping_name: "m_INVENTORY_SYNC",
        complexity_score: 0.45,
        transformation_count: 8,
        has_custom_logic: false,
        uses_lookup: false
      }
    ]
  }

  const calculateCertaintyScore = async () => {
    setCalculating(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/api/analysis/certainty-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sampleProjectData)
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate certainty score')
    } finally {
      setCalculating(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'LOW': return 'text-green-600'
      case 'MEDIUM': return 'text-yellow-600'
      case 'HIGH': return 'text-orange-600'
      case 'CRITICAL': return 'text-red-600'
      default: return 'text-slate-600'
    }
  }

  const getRiskBadgeVariant = (level: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (level.toUpperCase()) {
      case 'LOW': return 'default'
      case 'MEDIUM': return 'secondary'
      case 'HIGH': return 'outline'
      case 'CRITICAL': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Migration Certainty Score™ Calculator
        </h1>
        <p className="text-slate-600">
          AI-powered risk assessment and success prediction for your migration project
        </p>
      </div>

      {/* Input Section */}
      <Card className="p-6 bg-white mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Project Analysis
            </h2>
            <p className="text-sm text-slate-600">
              Upload your Informatica project metadata or use sample data
            </p>
          </div>
          <Button
            onClick={calculateCertaintyScore}
            disabled={calculating}
            className="flex items-center gap-2"
          >
            {calculating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4" />
                Calculate Score
              </>
            )}
          </Button>
        </div>

        {/* Sample Data Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Upload className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Demo Mode</h3>
              <p className="text-sm text-blue-700 mb-2">
                Click &quot;Calculate Score&quot; to analyze sample Enterprise CRM Migration project with 3 mappings
              </p>
              <div className="text-xs text-blue-600">
                In production: Upload Informatica XML files for real project analysis
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
                <p className="text-xs text-red-600 mt-2">
                  Make sure the backend API is running at http://localhost:8000
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Results Section */}
      {result && (
        <>
          {/* Overall Score Card */}
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 mb-8">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-slate-700 mb-4">
                Overall Migration Certainty Score
              </h2>
              <div className="text-7xl font-bold text-blue-600 mb-4">
                {result.overall_certainty.toFixed(1)}%
              </div>
              <div className="flex items-center justify-center gap-4 mb-6">
                <Badge
                  variant={getRiskBadgeVariant(result.risk_level)}
                  className="text-lg px-4 py-1"
                >
                  {result.risk_level} Risk
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-1">
                  {(result.success_probability * 100).toFixed(0)}% Success Probability
                </Badge>
              </div>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Based on analysis of {sampleProjectData.mappings.length} mappings,
                considering complexity, custom logic, and transformation patterns
              </p>
            </div>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-600">Estimated Duration</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {result.estimated_duration_days} days
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Based on project complexity and team velocity
              </p>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calculator className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-600">Estimated Cost</div>
                  <div className="text-2xl font-bold text-slate-900">
                    ${result.estimated_cost.toLocaleString()}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Total project cost including automation savings
              </p>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-600">Risk Factors</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {result.top_risks.length}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Identified risks requiring attention
              </p>
            </Card>
          </div>

          {/* Top Risk Factors */}
          <Card className="p-6 bg-white">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Top Risk Factors & Mitigation Strategies
            </h2>

            <div className="space-y-4">
              {result.top_risks.map((risk, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-semibold text-slate-900">
                          {risk.factor}
                        </span>
                        <Badge variant={getRiskBadgeVariant(risk.severity)}>
                          {risk.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">
                        <span className="font-medium">Impact:</span> {risk.impact}
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <p className="text-sm text-green-900">
                          <span className="font-medium">Mitigation:</span> {risk.mitigation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Confidence Explanation */}
          <Card className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 mt-8 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              How is the Certainty Score Calculated?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
              <div>
                <h4 className="font-semibold mb-2">Analysis Factors:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Mapping complexity scores (0-1)</li>
                  <li>Transformation count and types</li>
                  <li>Custom logic presence</li>
                  <li>Lookup usage patterns</li>
                  <li>Historical success rates</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Score Interpretation:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>90-100%: Very High Confidence</li>
                  <li>75-89%: High Confidence</li>
                  <li>60-74%: Moderate Confidence</li>
                  <li>Below 60%: Review Required</li>
                </ul>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Call to Action */}
      {!result && !calculating && (
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 text-center">
          <Calculator className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Ready to Assess Your Migration?
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Get instant risk assessment and success prediction powered by our Migration Certainty Score™ engine
          </p>
          <Button
            onClick={calculateCertaintyScore}
            size="lg"
            className="text-lg px-8 py-6"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Calculate Certainty Score
          </Button>
        </Card>
      )}
    </div>
  )
}
