'use client'

import { Header } from '@/components/layout/header'
import { ArrowRight, CheckCircle, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProductPage() {

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950/50">
          {/* Animated gradient orbs */}
          <div className="absolute top-0 -left-4 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-cyan-400/20 dark:from-blue-600/10 dark:to-cyan-600/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-purple-400/20 to-pink-400/20 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 left-1/3 w-[450px] h-[450px] bg-gradient-to-tr from-indigo-400/15 to-blue-400/15 dark:from-indigo-600/10 dark:to-blue-600/10 rounded-full blur-3xl"></div>

          {/* Dot pattern overlay (subtle) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(148_163_184/0.05)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_1px_1px,rgb(100_116_139/0.08)_1px,transparent_1px)] [background-size:24px_24px]"></div>

          <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 text-center relative z-10">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Migrate from Informatica<br />to Talend with 92-97% automation
            </h1>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto mb-12">
              Complete migrations in days, not months—with proven enterprise-grade results.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/setup">
                <Button size="lg" className="h-12 px-8">
                  Start Migrating
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8" disabled>
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="relative py-24 bg-gradient-to-r from-indigo-50/25 via-background to-purple-50/25 dark:from-indigo-950/8 dark:via-background dark:to-purple-950/8">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Get started in 3 steps.</h2>
              <p className="text-xl text-foreground-secondary">
                From assessment to production in weeks, not months.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="absolute -left-4 top-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div className="ml-12">
                  <h3 className="text-2xl font-bold mb-3">Assessment</h3>
                  <p className="text-foreground-secondary">
                    Upload your Informatica XML files. Our platform analyzes complexity, identifies patterns, and generates a detailed migration plan with timeline and cost estimate.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-4 top-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div className="ml-12">
                  <h3 className="text-2xl font-bold mb-3">Migration</h3>
                  <p className="text-foreground-secondary">
                    Automated conversion to Talend with validation at every step. Wave-based approach lets you test incrementally. Review and approve each phase before deployment.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-4 top-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div className="ml-12">
                  <h3 className="text-2xl font-bold mb-3">Production</h3>
                  <p className="text-foreground-secondary">
                    Deploy validated Talend jobs to production. Complete knowledge transfer and documentation. Ongoing support ensures smooth operation and team enablement.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <p className="text-sm text-foreground-secondary">
                Ready to get started? <Link href="/setup" className="text-primary hover:underline font-medium">Begin your assessment →</Link>
              </p>
            </div>
          </div>
        </section>

        {/* Product Screenshot - Discovery */}
        <section className="relative border-y border-border py-24 bg-gradient-to-br from-blue-50/30 via-background to-background dark:from-blue-950/10 dark:via-background dark:to-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-tight bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Instant dependency discovery.
                </h2>
                <p className="text-xl text-foreground-secondary mb-8">
                  Upload Informatica XML files. Our platform maps every dependency, connection, and transformation automatically.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <div className="font-medium mb-1">Full dependency graph</div>
                      <div className="text-sm text-foreground-secondary">Visualize all connections and relationships</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <div className="font-medium mb-1">Pattern detection</div>
                      <div className="text-sm text-foreground-secondary">Identifies migration complexity automatically</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product visual mockup */}
              <div className="relative">
                <div className="bg-background border-2 border-border rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs text-foreground-tertiary">Discovery Analysis</span>
                  </div>

                  {/* Simulated dependency graph */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                      <span className="text-sm font-medium">Customer_ETL_v2.xml</span>
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Source</span>
                    </div>
                    <div className="ml-6 space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-background-secondary rounded">
                        <div className="h-1 w-8 bg-border"></div>
                        <span className="text-xs">Product_Transform.xml</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-background-secondary rounded">
                        <div className="h-1 w-8 bg-border"></div>
                        <span className="text-xs">Data_Validation.xml</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-background-secondary rounded">
                        <div className="h-1 w-8 bg-border"></div>
                        <span className="text-xs">Error_Handler.xml</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                      <span className="text-foreground-secondary">Total dependencies found</span>
                      <span className="font-bold text-green-600">147 mappings</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Automated Conversion */}
        <section className="relative py-24 bg-gradient-to-bl from-purple-50/30 via-background to-background dark:from-purple-950/10 dark:via-background dark:to-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Product visual mockup */}
              <div className="relative order-2 md:order-1">
                <div className="bg-background border-2 border-border rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs text-foreground-tertiary">Conversion Progress</span>
                  </div>

                  {/* Conversion log */}
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>✓ Transformed Customer_ETL_v2 → Talend job</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>✓ Converted 47 expressions to Java</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>✓ Mapped 12 lookups to tMap components</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 animate-pulse">
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Product_Transform.xml...</span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border">
                      <div className="flex justify-between mb-1">
                        <span className="text-foreground-secondary">Progress</span>
                        <span className="font-medium">67%</span>
                      </div>
                      <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-tight bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  One-click conversion to Talend.
                </h2>
                <p className="text-xl text-foreground-secondary">
                  Our engine handles expressions, lookups, business logic—everything. Production-ready jobs in minutes, not months.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Validation */}
        <section className="relative border-y border-border py-24 bg-gradient-to-tr from-emerald-50/30 via-background to-background dark:from-emerald-950/10 dark:via-background dark:to-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-tight bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Validated for accuracy.
                </h2>
                <p className="text-xl text-foreground-secondary">
                  Every migration is tested. Data lineage, business rules, error handling—all validated automatically before deployment.
                </p>
              </div>

              {/* Validation results mockup */}
              <div className="relative">
                <div className="bg-background border-2 border-border rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs text-foreground-tertiary">Validation Report</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Data Lineage</span>
                      </div>
                      <span className="text-sm font-bold text-green-600">100%</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Business Rules</span>
                      </div>
                      <span className="text-sm font-bold text-green-600">99.8%</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Error Handling</span>
                      </div>
                      <span className="text-sm font-bold text-green-600">100%</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">99.7%</div>
                      <div className="text-xs text-foreground-secondary">Overall Accuracy</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Features */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Built for enterprise scale.</h2>
              <p className="text-xl text-foreground-secondary">
                Handle complex migrations with confidence.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-lg flex items-center justify-center mb-6">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Wave-based migration</h3>
                <p className="text-foreground-secondary leading-relaxed">
                  Migrate in phases. Test each wave before moving forward. Reduce risk with incremental deployment.
                </p>
              </div>

              <div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/30 rounded-lg flex items-center justify-center mb-6">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Complex pattern support</h3>
                <p className="text-foreground-secondary leading-relaxed">
                  Handles nested transformations, dynamic lookups, custom expressions, and business logic automatically.
                </p>
              </div>

              <div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-950/30 rounded-lg flex items-center justify-center mb-6">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Full audit trail</h3>
                <p className="text-foreground-secondary leading-relaxed">
                  Track every change. Review conversion decisions. Export detailed reports for compliance and review.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Compliance */}
        <section className="relative border-y border-border py-24 bg-gradient-to-tl from-slate-50/40 via-background to-background dark:from-slate-950/15 dark:via-background dark:to-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight bg-gradient-to-r from-slate-600 to-gray-600 dark:from-slate-400 dark:to-gray-400 bg-clip-text text-transparent">Enterprise-grade security.</h2>
              <p className="text-xl text-foreground-secondary">
                Built for regulated industries with strict compliance requirements.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background border border-border rounded-xl p-8">
                <h3 className="text-xl font-bold mb-4">Data Privacy</h3>
                <ul className="space-y-3 text-sm text-foreground-secondary">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Your data never leaves your infrastructure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>End-to-end encryption in transit and at rest</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>GDPR and CCPA compliant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Role-based access control</span>
                  </li>
                </ul>
              </div>

              <div className="bg-background border border-border rounded-xl p-8">
                <h3 className="text-xl font-bold mb-4">Compliance</h3>
                <ul className="space-y-3 text-sm text-foreground-secondary">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>SOC 2 Type II certified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>HIPAA compliant for healthcare</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>PCI DSS for financial services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Complete audit trail and logging</span>
                  </li>
                </ul>
              </div>

              <div className="bg-background border border-border rounded-xl p-8">
                <h3 className="text-xl font-bold mb-4">Enterprise Features</h3>
                <ul className="space-y-3 text-sm text-foreground-secondary">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Single Sign-On (SSO) integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>On-premise deployment option</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Custom SLA agreements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Dedicated support team</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="relative border-y border-border py-24 bg-gradient-to-br from-cyan-50/20 via-background to-indigo-50/20 dark:from-cyan-950/8 dark:via-background dark:to-indigo-950/8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">Trusted by data teams worldwide.</h2>
              <p className="text-xl text-foreground-secondary">
                From Fortune 500 to fast-growing startups.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Use case 1 */}
              <div className="bg-background border-2 border-border rounded-2xl p-8">
                <div className="text-sm font-medium text-blue-600 mb-3">FINANCIAL SERVICES</div>
                <h3 className="text-2xl font-bold mb-4">
                  Legacy modernization at scale
                </h3>
                <p className="text-foreground-secondary mb-6">
                  A Fortune 100 bank migrated 200+ ETL jobs from Informatica to Talend in 8 weeks. Reduced licensing costs by 60% while maintaining regulatory compliance.
                </p>
                <div className="flex items-center gap-6 pt-4 border-t border-border">
                  <div>
                    <div className="text-2xl font-bold">200+</div>
                    <div className="text-xs text-foreground-tertiary">Jobs migrated</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">8 weeks</div>
                    <div className="text-xs text-foreground-tertiary">Total time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">60%</div>
                    <div className="text-xs text-foreground-tertiary">Cost savings</div>
                  </div>
                </div>
              </div>

              {/* Use case 2 */}
              <div className="bg-background border-2 border-border rounded-2xl p-8">
                <div className="text-sm font-medium text-purple-600 mb-3">RETAIL</div>
                <h3 className="text-2xl font-bold mb-4">
                  Real-time data platform upgrade
                </h3>
                <p className="text-foreground-secondary mb-6">
                  Global retailer transformed their inventory management system. Migrated 150 workflows with zero downtime during peak season.
                </p>
                <div className="flex items-center gap-6 pt-4 border-t border-border">
                  <div>
                    <div className="text-2xl font-bold">150</div>
                    <div className="text-xs text-foreground-tertiary">Workflows</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-xs text-foreground-tertiary">Downtime</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="text-xs text-foreground-tertiary">Accuracy</div>
                  </div>
                </div>
              </div>

              {/* Use case 3 */}
              <div className="bg-background border-2 border-border rounded-2xl p-8">
                <div className="text-sm font-medium text-green-600 mb-3">HEALTHCARE</div>
                <h3 className="text-2xl font-bold mb-4">
                  HIPAA-compliant migration
                </h3>
                <p className="text-foreground-secondary mb-6">
                  Healthcare provider migrated patient data pipelines while maintaining strict compliance. Full audit trail for regulatory review.
                </p>
                <div className="flex items-center gap-6 pt-4 border-t border-border">
                  <div>
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-xs text-foreground-tertiary">Compliant</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">95</div>
                    <div className="text-xs text-foreground-tertiary">Jobs</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">5 weeks</div>
                    <div className="text-xs text-foreground-tertiary">Delivery</div>
                  </div>
                </div>
              </div>

              {/* Use case 4 */}
              <div className="bg-background border-2 border-border rounded-2xl p-8">
                <div className="text-sm font-medium text-orange-600 mb-3">MANUFACTURING</div>
                <h3 className="text-2xl font-bold mb-4">
                  Supply chain optimization
                </h3>
                <p className="text-foreground-secondary mb-6">
                  Manufacturing giant consolidated data from 12 systems. Migrated complex transformations with business logic preservation.
                </p>
                <div className="flex items-center gap-6 pt-4 border-t border-border">
                  <div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-foreground-tertiary">Systems</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">180</div>
                    <div className="text-xs text-foreground-tertiary">Jobs</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">97%</div>
                    <div className="text-xs text-foreground-tertiary">Automated</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Capabilities */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-tight bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                  Handle any complexity.
                </h2>
                <p className="text-xl text-foreground-secondary mb-8">
                  From simple mappings to nested transformations with dynamic logic.
                </p>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Expression conversion</h4>
                    <p className="text-sm text-foreground-secondary">
                      Automatically converts Informatica expressions to Java code. Handles nested functions, date operations, string manipulations.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Lookup transformation</h4>
                    <p className="text-sm text-foreground-secondary">
                      Connected and unconnected lookups converted to tMap components. Preserves caching strategies and performance optimizations.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Business rules</h4>
                    <p className="text-sm text-foreground-secondary">
                      Complex conditional logic, data quality rules, and validation constraints migrated accurately.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Error handling</h4>
                    <p className="text-sm text-foreground-secondary">
                      Session-level error handling converted to Talend job-level exception handling with logging.
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical specs mockup */}
              <div className="bg-background border-2 border-border rounded-xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-xs text-foreground-tertiary">Supported Transformations</span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 bg-background-secondary rounded">
                    <span>Expression Transformation</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background-secondary rounded">
                    <span>Aggregator</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background-secondary rounded">
                    <span>Joiner</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background-secondary rounded">
                    <span>Lookup (Connected/Unconnected)</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background-secondary rounded">
                    <span>Router</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background-secondary rounded">
                    <span>Sorter</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background-secondary rounded">
                    <span>Filter</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background-secondary rounded">
                    <span>Union Transformation</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border text-center">
                  <div className="text-sm text-foreground-secondary">Coverage</div>
                  <div className="text-2xl font-bold text-green-600">95%+ patterns</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="border-y border-border py-24 bg-background-secondary/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Why teams choose us.</h2>
              <p className="text-xl text-foreground-secondary">
                Superior automation. Faster delivery. Better outcomes.
              </p>
            </div>

            <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-xl">
              {/* Table Header */}
              <div className="grid md:grid-cols-4 gap-px bg-border">
                <div className="bg-background-secondary p-6">
                  <div className="text-sm font-semibold text-foreground-tertiary uppercase tracking-wide">Feature</div>
                </div>
                <div className="bg-background p-6">
                  <div className="text-sm font-semibold uppercase tracking-wide">Manual Migration</div>
                  <div className="text-xs text-foreground-tertiary mt-1">Traditional approach</div>
                </div>
                <div className="bg-background p-6">
                  <div className="text-sm font-semibold uppercase tracking-wide">Other Tools</div>
                  <div className="text-xs text-foreground-tertiary mt-1">Competitors</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6 border-2 border-blue-200 dark:border-blue-800">
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Migration Accelerator</div>
                  <div className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1 font-medium">Our platform</div>
                </div>
              </div>

              {/* Table Rows */}
              <div className="grid md:grid-cols-4 gap-px bg-border">
                {/* Automation Rate */}
                <div className="bg-background-secondary p-6">
                  <div className="text-sm font-medium">Automation Rate</div>
                  <div className="text-xs text-foreground-tertiary mt-1">Automated conversion</div>
                </div>
                <div className="bg-background p-6">
                  <div className="text-sm text-foreground-secondary">30-50%</div>
                </div>
                <div className="bg-background p-6">
                  <div className="text-sm text-foreground-secondary">70-80%</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-bold text-green-600">92-97%</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-px bg-border">
                {/* Time to Complete */}
                <div className="bg-background-secondary p-6">
                  <div className="text-sm font-medium">Time to Complete</div>
                  <div className="text-xs text-foreground-tertiary mt-1">For 100 jobs</div>
                </div>
                <div className="bg-background p-6">
                  <div className="text-sm text-foreground-secondary">6-9 months</div>
                </div>
                <div className="bg-background p-6">
                  <div className="text-sm text-foreground-secondary">3-4 months</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-bold text-green-600">6-8 weeks</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-px bg-border">
                {/* Error Rate */}
                <div className="bg-background-secondary p-6">
                  <div className="text-sm font-medium">Error Rate</div>
                  <div className="text-xs text-foreground-tertiary mt-1">Post-migration issues</div>
                </div>
                <div className="bg-background p-6">
                  <div className="text-sm text-foreground-secondary">40-60%</div>
                </div>
                <div className="bg-background p-6">
                  <div className="text-sm text-foreground-secondary">20-30%</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-bold text-green-600">8-12%</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-px bg-border">
                {/* Expression Handling */}
                <div className="bg-background-secondary p-6">
                  <div className="text-sm font-medium">Expression Handling</div>
                  <div className="text-xs text-foreground-tertiary mt-1">Complex expressions</div>
                </div>
                <div className="bg-background p-6">
                  <div className="text-sm text-foreground-secondary">Manual coding</div>
                </div>
                <div className="bg-background p-6">
                  <div className="text-sm text-foreground-secondary">Basic conversion</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-bold text-green-600">AST-based parsing</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-px bg-border">
                {/* Business Logic */}
                <div className="bg-background-secondary p-6">
                  <div className="text-sm font-medium">Business Logic</div>
                  <div className="text-xs text-foreground-tertiary mt-1">Rules preservation</div>
                </div>
                <div className="bg-background p-6">
                  <div className="text-sm text-foreground-secondary">Often lost</div>
                </div>
                <div className="bg-background p-6">
                  <div className="text-sm text-foreground-secondary">Partial</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-bold text-green-600">100% preserved</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-px bg-border">
                {/* Validation */}
                <div className="bg-background-secondary p-6">
                  <div className="text-sm font-medium">Validation</div>
                  <div className="text-xs text-foreground-tertiary mt-1">Quality assurance</div>
                </div>
                <div className="bg-background p-6">
                  <div className="text-sm text-foreground-secondary">Manual testing</div>
                </div>
                <div className="bg-background p-6">
                  <div className="text-sm text-foreground-secondary">Limited</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-bold text-green-600">Automated + Manual</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-px bg-border">
                {/* Support */}
                <div className="bg-background-secondary p-6">
                  <div className="text-sm font-medium">Support</div>
                  <div className="text-xs text-foreground-tertiary mt-1">Expert assistance</div>
                </div>
                <div className="bg-background p-6">
                  <div className="text-sm text-foreground-secondary">Internal only</div>
                </div>
                <div className="bg-background p-6">
                  <div className="text-sm text-foreground-secondary">Email only</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-bold text-green-600">Dedicated team</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Footer Note */}
            <div className="mt-6 text-center">
              <p className="text-sm text-foreground-tertiary">
                * Based on industry averages for 100-200 job migrations
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">What our customers say.</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background border border-border rounded-xl p-8">
                <div className="text-foreground-tertiary mb-4">"</div>
                <p className="text-foreground-secondary mb-6 leading-relaxed">
                  Migration Accelerator saved us 5 months. The automated validation caught issues we would have missed.
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    JD
                  </div>
                  <div>
                    <div className="font-medium text-sm">James Davis</div>
                    <div className="text-xs text-foreground-tertiary">VP Engineering, FinTech</div>
                  </div>
                </div>
              </div>

              <div className="bg-background border border-border rounded-xl p-8">
                <div className="text-foreground-tertiary mb-4">"</div>
                <p className="text-foreground-secondary mb-6 leading-relaxed">
                  We migrated 180 jobs in 7 weeks. The ROI was immediate. Best investment we made this year.
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    MC
                  </div>
                  <div>
                    <div className="font-medium text-sm">Maria Chen</div>
                    <div className="text-xs text-foreground-tertiary">Data Director, Retail</div>
                  </div>
                </div>
              </div>

              <div className="bg-background border border-border rounded-xl p-8">
                <div className="text-foreground-tertiary mb-4">"</div>
                <p className="text-foreground-secondary mb-6 leading-relaxed">
                  The dependency discovery alone was worth it. Saved weeks of manual documentation.
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    RP
                  </div>
                  <div>
                    <div className="font-medium text-sm">Raj Patel</div>
                    <div className="text-xs text-foreground-tertiary">Lead Architect, Healthcare</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border py-24 bg-background-secondary/30">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 text-center">
              <div>
                <div className="text-5xl font-bold mb-2">150+</div>
                <div className="text-sm text-foreground-secondary">Companies trust us</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">10K+</div>
                <div className="text-sm text-foreground-secondary">Jobs migrated</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">99.7%</div>
                <div className="text-sm text-foreground-secondary">Average accuracy</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">460h</div>
                <div className="text-sm text-foreground-secondary">Avg time saved</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">Frequently asked questions</h2>
            </div>

            <div className="space-y-6">
              <div className="border-b border-border pb-6">
                <h3 className="text-xl font-semibold mb-3">How long does a typical migration take?</h3>
                <p className="text-foreground-secondary leading-relaxed">
                  Most migrations complete in 6-8 weeks for 100-200 jobs. Timeline depends on complexity, number of jobs, and validation requirements. Our platform automates 92-97% of the work, dramatically reducing manual effort.
                </p>
              </div>

              <div className="border-b border-border pb-6">
                <h3 className="text-xl font-semibold mb-3">What Informatica components are supported?</h3>
                <p className="text-foreground-secondary leading-relaxed">
                  We support all major Informatica PowerCenter transformations including Expression, Aggregator, Joiner, Lookup (connected/unconnected), Router, Sorter, Filter, Union, and more. Coverage extends to 95%+ of enterprise ETL patterns.
                </p>
              </div>

              <div className="border-b border-border pb-6">
                <h3 className="text-xl font-semibold mb-3">How do you ensure data accuracy?</h3>
                <p className="text-foreground-secondary leading-relaxed">
                  Every migration includes automated validation across data lineage, business rules, and error handling. We achieve 99.7% average accuracy through comprehensive testing and comparison with source behavior.
                </p>
              </div>

              <div className="border-b border-border pb-6">
                <h3 className="text-xl font-semibold mb-3">Can we migrate in phases?</h3>
                <p className="text-foreground-secondary leading-relaxed">
                  Yes. Our wave-based approach lets you migrate incrementally, testing each phase before proceeding. This reduces risk and allows parallel operation of old and new systems during transition.
                </p>
              </div>

              <div className="border-b border-border pb-6">
                <h3 className="text-xl font-semibold mb-3">What if we have custom expressions or business logic?</h3>
                <p className="text-foreground-secondary leading-relaxed">
                  Our AST-based expression parser handles nested functions, custom logic, and complex transformations. Business rules are preserved and validated to ensure identical behavior in Talend.
                </p>
              </div>

              <div className="pb-6">
                <h3 className="text-xl font-semibold mb-3">What support do you provide?</h3>
                <p className="text-foreground-secondary leading-relaxed">
                  Dedicated migration team throughout the project. Includes planning, execution, validation, and post-migration support. Knowledge transfer ensures your team can maintain and extend the migrated jobs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative border-t border-border py-20 bg-gradient-to-br from-blue-50/20 via-background to-cyan-50/20 dark:from-blue-950/8 dark:via-background dark:to-cyan-950/8">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to migrate?</h2>
            <p className="text-lg text-foreground-secondary mb-10">
              Start with a free trial or contact us at <a href="mailto:sales@aixvenus.com" className="text-primary hover:underline font-medium">sales@aixvenus.com</a>
            </p>
            <div className="flex items-center justify-center">
              <Link href="/setup">
                <Button size="lg" className="h-12 px-8">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
