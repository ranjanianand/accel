import { Header } from '@/components/layout/header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, TrendingUp, Layers, Database, GitBranch, RotateCcw, ArrowUpDown } from 'lucide-react'

// Mock data - replace with actual API calls
async function getPatterns() {
  return [
    {
      id: '1',
      name: 'SCD Type 2',
      category: 'Dimension',
      icon: ArrowUpDown,
      description: 'Slowly Changing Dimension Type 2 with full history tracking',
      complexity: 'High',
      usageCount: 412,
      avgConversionTime: '4.2 min',
      successRate: 97.8,
      components: ['Source Qualifier', 'Expression', 'Filter', 'Update Strategy', 'Target'],
      businessRules: 'Track historical changes with effective dates, maintain surrogate keys, handle late-arriving dimensions',
      automationLevel: 94,
    },
    {
      id: '2',
      name: 'Fact Load',
      category: 'Fact',
      icon: Database,
      description: 'Transactional fact table load with dimension key lookups',
      complexity: 'Medium',
      usageCount: 568,
      avgConversionTime: '3.1 min',
      successRate: 98.9,
      components: ['Source Qualifier', 'Lookup', 'Expression', 'Aggregator', 'Target'],
      businessRules: 'Resolve dimension keys, handle measures and metrics, aggregate at grain level',
      automationLevel: 97,
    },
    {
      id: '3',
      name: 'CDC (Change Data Capture)',
      category: 'Incremental',
      icon: RotateCcw,
      description: 'Incremental load using change data capture mechanisms',
      complexity: 'High',
      usageCount: 347,
      avgConversionTime: '5.8 min',
      successRate: 96.2,
      components: ['Source Qualifier', 'Expression', 'Update Strategy', 'Router', 'Target'],
      businessRules: 'Detect inserts/updates/deletes, maintain change tracking, handle conflicts',
      automationLevel: 91,
    },
    {
      id: '4',
      name: 'Lookup',
      category: 'Reference',
      icon: GitBranch,
      description: 'Reference data lookup and enrichment pattern',
      complexity: 'Low',
      usageCount: 189,
      avgConversionTime: '1.8 min',
      successRate: 99.7,
      components: ['Source Qualifier', 'Lookup Transformation', 'Expression', 'Target'],
      businessRules: 'Join with reference tables, handle missing lookups, cache optimization',
      automationLevel: 98,
    },
    {
      id: '5',
      name: 'Aggregation',
      category: 'Transformation',
      icon: Layers,
      description: 'Pre-aggregated summary tables with grouping logic',
      complexity: 'High',
      usageCount: 231,
      avgConversionTime: '6.3 min',
      successRate: 95.4,
      components: ['Source Qualifier', 'Expression', 'Aggregator', 'Filter', 'Target'],
      businessRules: 'Group by dimensions, calculate measures, handle null values in aggregations',
      automationLevel: 89,
    },
    {
      id: '6',
      name: 'Dimension Load',
      category: 'Dimension',
      icon: Database,
      description: 'Standard dimension table load (Type 1 overwrite)',
      complexity: 'Low',
      usageCount: 298,
      avgConversionTime: '2.4 min',
      successRate: 99.2,
      components: ['Source Qualifier', 'Expression', 'Filter', 'Target'],
      businessRules: 'Overwrite existing records, maintain natural keys, handle duplicates',
      automationLevel: 96,
    },
    {
      id: '7',
      name: 'Type 1 Dimension',
      category: 'Dimension',
      icon: Database,
      description: 'Simple dimension overwrite without history',
      complexity: 'Low',
      usageCount: 156,
      avgConversionTime: '2.1 min',
      successRate: 99.5,
      components: ['Source Qualifier', 'Expression', 'Update Strategy', 'Target'],
      businessRules: 'Overwrite on update, no history tracking, simple key matching',
      automationLevel: 98,
    },
    {
      id: '8',
      name: 'Surrogate Key Generation',
      category: 'Utility',
      icon: GitBranch,
      description: 'Generate and manage surrogate keys for dimensions',
      complexity: 'Medium',
      usageCount: 523,
      avgConversionTime: '1.5 min',
      successRate: 99.8,
      components: ['Sequence Generator', 'Expression', 'Lookup'],
      businessRules: 'Generate unique keys, handle key lookup, maintain key sequences',
      automationLevel: 99,
    },
    {
      id: '9',
      name: 'Multi-Source Integration',
      category: 'Integration',
      icon: Layers,
      description: 'Integrate data from multiple heterogeneous sources',
      complexity: 'High',
      usageCount: 87,
      avgConversionTime: '7.8 min',
      successRate: 93.1,
      components: ['Multiple Source Qualifiers', 'Joiner', 'Union', 'Expression', 'Target'],
      businessRules: 'Merge from multiple sources, resolve conflicts, standardize formats',
      automationLevel: 84,
    },
    {
      id: '10',
      name: 'Data Quality Validation',
      category: 'Quality',
      icon: GitBranch,
      description: 'Validate data quality rules and business constraints',
      complexity: 'Medium',
      usageCount: 412,
      avgConversionTime: '2.9 min',
      successRate: 97.6,
      components: ['Source Qualifier', 'Expression', 'Filter', 'Router', 'Target'],
      businessRules: 'Validate formats, check ranges, enforce business rules, reject invalid records',
      automationLevel: 93,
    },
    {
      id: '11',
      name: 'Hierarchical Data Load',
      category: 'Dimension',
      icon: Layers,
      description: 'Load hierarchical organizational or product structures',
      complexity: 'High',
      usageCount: 124,
      avgConversionTime: '5.2 min',
      successRate: 94.8,
      components: ['Source Qualifier', 'Expression', 'Hierarchy Builder', 'Target'],
      businessRules: 'Maintain parent-child relationships, calculate levels, handle orphans',
      automationLevel: 88,
    },
    {
      id: '12',
      name: 'Slowly Changing Dimension Type 3',
      category: 'Dimension',
      icon: ArrowUpDown,
      description: 'Track limited history with previous value columns',
      complexity: 'Medium',
      usageCount: 78,
      avgConversionTime: '3.4 min',
      successRate: 96.9,
      components: ['Source Qualifier', 'Expression', 'Update Strategy', 'Target'],
      businessRules: 'Store previous value, update current value, maintain limited history',
      automationLevel: 92,
    },
  ]
}

async function getPatternStats() {
  return {
    totalPatterns: 19,
    activePatterns: 12,
    avgAutomationLevel: 93.8,
    totalUsage: 3425,
  }
}

export default async function PatternsPage() {
  const patterns = await getPatterns()
  const stats = await getPatternStats()

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low':
        return 'text-status-success'
      case 'Medium':
        return 'text-status-warning'
      case 'High':
        return 'text-status-error'
      default:
        return 'text-foreground-secondary'
    }
  }

  return (
    <>
      <Header />

      <main className="p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Migration Patterns</h1>
            <p className="text-sm text-foreground-secondary mt-1">
              Pre-configured migration patterns covering 95%+ of enterprise ETL scenarios
            </p>
          </div>
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Pattern Documentation
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          <Card className="p-5">
            <CardContent className="space-y-3 p-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">Total Patterns</span>
                <Layers className="h-4 w-4 text-foreground-secondary" />
              </div>
              <div className="text-3xl font-bold">{stats.totalPatterns}</div>
              <div className="text-xs text-foreground-tertiary">Enterprise coverage</div>
            </CardContent>
          </Card>

          <Card className="p-5">
            <CardContent className="space-y-3 p-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">Active Patterns</span>
                <TrendingUp className="h-4 w-4 text-status-success" />
              </div>
              <div className="text-3xl font-bold">{stats.activePatterns}</div>
              <div className="text-xs text-foreground-tertiary">Currently in use</div>
            </CardContent>
          </Card>

          <Card className="p-5">
            <CardContent className="space-y-3 p-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">Avg Automation</span>
                <GitBranch className="h-4 w-4 text-foreground-secondary" />
              </div>
              <div className="text-3xl font-bold">{stats.avgAutomationLevel}%</div>
              <div className="text-xs text-status-success">Industry leading</div>
            </CardContent>
          </Card>

          <Card className="p-5">
            <CardContent className="space-y-3 p-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">Total Usage</span>
                <Database className="h-4 w-4 text-foreground-secondary" />
              </div>
              <div className="text-3xl font-bold">{stats.totalUsage}</div>
              <div className="text-xs text-foreground-tertiary">Migrations applied</div>
            </CardContent>
          </Card>
        </div>

        {/* Patterns Grid */}
        <div className="grid grid-cols-1 gap-6">
          {patterns.map((pattern) => {
            const Icon = pattern.icon
            return (
              <Card key={pattern.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-background-secondary flex items-center justify-center shrink-0">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{pattern.name}</h3>
                          <Badge variant="default">{pattern.category}</Badge>
                          <span className={`text-sm font-medium ${getComplexityColor(pattern.complexity)}`}>
                            {pattern.complexity} Complexity
                          </span>
                        </div>
                        <p className="text-sm text-foreground-secondary mb-3">
                          {pattern.description}
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className="text-foreground-tertiary">Usage: </span>
                            <span className="font-semibold">{pattern.usageCount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-foreground-tertiary">Avg Time: </span>
                            <span className="font-semibold">{pattern.avgConversionTime}</span>
                          </div>
                          <div>
                            <span className="text-foreground-tertiary">Success Rate: </span>
                            <span className="font-semibold text-status-success">{pattern.successRate}%</span>
                          </div>
                          <div>
                            <span className="text-foreground-tertiary">Automation: </span>
                            <span className="font-semibold text-status-success">{pattern.automationLevel}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <div className="text-xs font-medium text-foreground-secondary mb-2">
                        Components
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {pattern.components.map((component) => (
                          <span
                            key={component}
                            className="inline-flex px-2 py-0.5 text-xs rounded bg-background-secondary text-foreground-secondary"
                          >
                            {component}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-foreground-secondary mb-2">
                        Business Rules
                      </div>
                      <p className="text-xs text-foreground-secondary leading-relaxed">
                        {pattern.businessRules}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Pattern Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Pattern Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="font-medium mb-2">Dimension Patterns</div>
                <div className="text-sm text-foreground-secondary space-y-1">
                  <div>• SCD Type 1 (Overwrite)</div>
                  <div>• SCD Type 2 (History Tracking)</div>
                  <div>• SCD Type 3 (Limited History)</div>
                  <div>• Hierarchical Dimensions</div>
                </div>
              </div>
              <div>
                <div className="font-medium mb-2">Fact Patterns</div>
                <div className="text-sm text-foreground-secondary space-y-1">
                  <div>• Transactional Fact Load</div>
                  <div>• Periodic Snapshot</div>
                  <div>• Accumulating Snapshot</div>
                  <div>• Factless Fact Tables</div>
                </div>
              </div>
              <div>
                <div className="font-medium mb-2">Utility Patterns</div>
                <div className="text-sm text-foreground-secondary space-y-1">
                  <div>• Surrogate Key Generation</div>
                  <div>• Data Quality Validation</div>
                  <div>• Multi-Source Integration</div>
                  <div>• Error Handling & Logging</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
