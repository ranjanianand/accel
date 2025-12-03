import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { MigrationsViewWrapper } from '@/components/migrations/migrations-view-wrapper'
import { type MigrationRow } from '@/components/migrations/types'
import { Pagination } from '@/components/migrations/pagination'
import { Plus, Download } from 'lucide-react'
import Link from 'next/link'

// Mock data - replace with actual API calls
async function getMigrations(searchParams: {
  status?: string
  pattern?: string
  search?: string
  page?: string
}): Promise<{ data: MigrationRow[]; total: number }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const mockData: MigrationRow[] = [
    {
      id: '1',
      name: 'DIM_CUSTOMER_SCD2_LOAD',
      description: 'Customer dimension with Slowly Changing Dimension Type 2 implementation, tracking historical changes to customer attributes over time.',
      tags: ['Production', 'SCD Type 2', 'High Priority'],
      pattern: 'SCD Type 2',
      complexity: 73,
      status: 'completed',
      qualityScore: 99.7,
      businessRules: 18,
      businessRulesNeedReview: 0,
      createdAt: new Date('2024-11-28T08:15:00'),
      updatedAt: new Date('2024-11-28T09:42:00'),
      rowCount: 2450000,
      executionDuration: 87,
      sourcePath: 'PROD_REPO/Customer_Mappings/m_Customer_SCD2',
      targetPath: 'TalendProject/Jobs/DIM_CUSTOMER_SCD2_LOAD',
      sourceVersion: 'PowerCenter 10.5',
      targetVersion: 'Talend 8.0',
      validation: {
        dataLineage: 99.7,
        businessRules: 100,
        performance: 98.2,
        errorHandling: 99.5,
        dataQuality: 99.8,
        schemaMatch: 100,
      },
      automationRate: 95,
      conversionMethod: 'AST Parser',
      manualEffortRequired: 2,
    },
    {
      id: '2',
      name: 'FACT_SALES_DAILY_AGG',
      description: 'Daily sales fact aggregation with complex business rules for revenue calculation, discount handling, and multi-currency support.',
      tags: ['Sales', 'Aggregation', 'Daily Process'],
      pattern: 'Fact Load',
      complexity: 82,
      status: 'in_progress',
      businessRules: 23,
      businessRulesNeedReview: 5,
      createdAt: new Date('2024-11-29T04:20:00'),
      updatedAt: new Date('2024-11-29T05:18:00'),
      progress: 67,
      rowCount: 8750000,
      executionDuration: 58,
      sourcePath: 'PROD_REPO/Sales_Aggregations/wf_Daily_Sales_Agg',
      targetPath: 'TalendProject/Jobs/FACT_SALES_DAILY_AGG',
      sourceVersion: 'PowerCenter 10.5',
      targetVersion: 'Talend 8.0',
      automationRate: 93,
      conversionMethod: 'Pattern Matching',
    },
    {
      id: '3',
      name: 'DIM_PRODUCT_MASTER_LOAD',
      description: 'Product master dimension load with hierarchical category structure and product attribute management. Requires schema validation review.',
      tags: ['Product', 'Master Data', 'Needs Review'],
      pattern: 'Dimension Load',
      complexity: 68,
      status: 'failed',
      businessRules: 14,
      businessRulesNeedReview: 0,
      createdAt: new Date('2024-11-28T16:30:00'),
      updatedAt: new Date('2024-11-29T03:12:00'),
      rowCount: 125000,
      executionDuration: 12,
      errorTypes: ['Schema', 'Validation'],
      sourcePath: 'PROD_REPO/Product_Master/m_Product_Dimension',
      targetPath: 'TalendProject/Jobs/DIM_PRODUCT_MASTER_LOAD',
      sourceVersion: 'PowerCenter 10.2',
      targetVersion: 'Talend 8.0',
      errorDetails: [
        { type: 'Schema Mismatch', count: 3, severity: 'high' },
        { type: 'Data Type Conversion', count: 7, severity: 'medium' },
        { type: 'Validation Rule', count: 2, severity: 'critical' },
      ],
      automationRate: 87,
      conversionMethod: 'AST Parser',
      manualEffortRequired: 8,
    },
    {
      id: '4',
      name: 'STG_PRODUCT_HIERARCHY_CDC',
      pattern: 'CDC',
      complexity: 91,
      status: 'completed',
      qualityScore: 99.9,
      businessRules: 31,
      businessRulesNeedReview: 0,
      createdAt: new Date('2024-11-28T11:00:00'),
      updatedAt: new Date('2024-11-29T04:25:00'),
      rowCount: 4320000,
      executionDuration: 124,
      sourcePath: 'PROD_REPO/Staging/CDC/wf_Product_Hierarchy_CDC',
      targetPath: 'TalendProject/Jobs/STG_PRODUCT_HIERARCHY_CDC',
      sourceVersion: 'PowerCenter 10.5',
      targetVersion: 'Talend 8.0',
      validation: {
        dataLineage: 99.9,
        businessRules: 100,
        performance: 97.8,
        errorHandling: 100,
        dataQuality: 99.7,
        schemaMatch: 100,
      },
      automationRate: 97,
      conversionMethod: 'AST Parser',
      manualEffortRequired: 1,
    },
    {
      id: '5',
      name: 'STG_INVENTORY_SNAPSHOT_CDC',
      pattern: 'CDC',
      complexity: 85,
      status: 'pending_review',
      qualityScore: 97.8,
      businessRules: 27,
      businessRulesNeedReview: 8,
      createdAt: new Date('2024-11-28T14:45:00'),
      updatedAt: new Date('2024-11-29T02:33:00'),
      rowCount: 1850000,
      executionDuration: 52,
      sourcePath: 'PROD_REPO/Staging/CDC/wf_Inventory_Snapshot',
      targetPath: 'TalendProject/Jobs/STG_INVENTORY_SNAPSHOT_CDC',
      sourceVersion: 'PowerCenter 10.5',
      targetVersion: 'Talend 8.0',
      validation: {
        dataLineage: 97.8,
        businessRules: 96.5,
        performance: 99.1,
        errorHandling: 98.2,
        dataQuality: 97.3,
        schemaMatch: 98.8,
      },
      automationRate: 92,
      conversionMethod: 'Pattern Matching',
      manualEffortRequired: 3,
    },
    {
      id: '6',
      name: 'LKP_CURRENCY_EXCHANGE_RATES',
      pattern: 'Lookup',
      complexity: 38,
      status: 'completed',
      qualityScore: 100,
      businessRules: 6,
      businessRulesNeedReview: 0,
      createdAt: new Date('2024-11-28T13:20:00'),
      updatedAt: new Date('2024-11-29T02:15:00'),
      rowCount: 850,
      executionDuration: 2,
      sourcePath: 'PROD_REPO/Reference_Data/lkp_Currency_Exchange',
      targetPath: 'TalendProject/Lookups/LKP_CURRENCY_EXCHANGE_RATES',
      sourceVersion: 'PowerCenter 10.5',
      targetVersion: 'Talend 8.0',
      validation: {
        dataLineage: 100,
        businessRules: 100,
        performance: 100,
        errorHandling: 100,
        dataQuality: 100,
        schemaMatch: 100,
      },
      automationRate: 98,
      conversionMethod: 'Pattern Matching',
    },
    {
      id: '7',
      name: 'FACT_ORDER_LINE_ITEMS',
      pattern: 'Fact Load',
      complexity: 76,
      status: 'completed',
      qualityScore: 98.4,
      businessRules: 19,
      businessRulesNeedReview: 0,
      createdAt: new Date('2024-11-27T22:00:00'),
      updatedAt: new Date('2024-11-28T23:47:00'),
      rowCount: 15200000,
      executionDuration: 143,
      sourcePath: 'PROD_REPO/Facts/m_Order_Line_Items_Fact',
      targetPath: 'TalendProject/Jobs/FACT_ORDER_LINE_ITEMS',
      sourceVersion: 'PowerCenter 10.5',
      targetVersion: 'Talend 8.0',
      validation: {
        dataLineage: 98.4,
        businessRules: 99.2,
        performance: 96.8,
        errorHandling: 98.9,
        dataQuality: 98.1,
        schemaMatch: 99.0,
      },
      automationRate: 94,
      conversionMethod: 'AST Parser',
      manualEffortRequired: 2,
    },
    {
      id: '8',
      name: 'DIM_TIME_CALENDAR_LOAD',
      pattern: 'Dimension Load',
      complexity: 42,
      status: 'completed',
      qualityScore: 100,
      businessRules: 8,
      businessRulesNeedReview: 0,
      createdAt: new Date('2024-11-27T19:15:00'),
      updatedAt: new Date('2024-11-28T20:52:00'),
      rowCount: 3650,
      executionDuration: 5,
      sourcePath: 'PROD_REPO/Dimensions/m_Time_Calendar',
      targetPath: 'TalendProject/Jobs/DIM_TIME_CALENDAR_LOAD',
      sourceVersion: 'PowerCenter 10.5',
      targetVersion: 'Talend 8.0',
      automationRate: 99,
      conversionMethod: 'Pattern Matching',
    },
    {
      id: '9',
      name: 'AGG_CUSTOMER_LIFETIME_VALUE',
      pattern: 'Aggregation',
      complexity: 94,
      status: 'completed',
      qualityScore: 99.2,
      businessRules: 42,
      businessRulesNeedReview: 0,
      createdAt: new Date('2024-11-27T15:30:00'),
      updatedAt: new Date('2024-11-28T18:25:00'),
      rowCount: 875000,
      executionDuration: 96,
      sourcePath: 'PROD_REPO/Analytics/agg_Customer_LTV',
      targetPath: 'TalendProject/Jobs/AGG_CUSTOMER_LIFETIME_VALUE',
      sourceVersion: 'PowerCenter 10.5',
      targetVersion: 'Talend 8.0',
      automationRate: 92,
      conversionMethod: 'AST Parser',
      manualEffortRequired: 4,
    },
    {
      id: '10',
      name: 'STG_SUPPLIER_MASTER_CDC',
      pattern: 'CDC',
      complexity: 79,
      status: 'pending_review',
      qualityScore: 96.5,
      businessRules: 21,
      businessRulesNeedReview: 6,
      createdAt: new Date('2024-11-27T12:00:00'),
      updatedAt: new Date('2024-11-28T15:18:00'),
      rowCount: 42500,
      executionDuration: 18,
      sourcePath: 'PROD_REPO/Staging/CDC/wf_Supplier_Master_CDC',
      targetPath: 'TalendProject/Jobs/STG_SUPPLIER_MASTER_CDC',
      sourceVersion: 'PowerCenter 10.5',
      targetVersion: 'Talend 8.0',
      automationRate: 90,
      conversionMethod: 'Pattern Matching',
      manualEffortRequired: 5,
    },
    {
      id: '11',
      name: 'FACT_INVENTORY_TRANSACTIONS',
      pattern: 'Fact Load',
      complexity: 71,
      status: 'completed',
      qualityScore: 99.1,
      businessRules: 16,
      businessRulesNeedReview: 0,
      createdAt: new Date('2024-11-27T09:45:00'),
      updatedAt: new Date('2024-11-28T11:33:00'),
      rowCount: 6340000,
      executionDuration: 78,
      sourcePath: 'PROD_REPO/Facts/m_Inventory_Transactions',
      targetPath: 'TalendProject/Jobs/FACT_INVENTORY_TRANSACTIONS',
      sourceVersion: 'PowerCenter 10.5',
      targetVersion: 'Talend 8.0',
      automationRate: 96,
      conversionMethod: 'AST Parser',
      manualEffortRequired: 1,
    },
    {
      id: '12',
      name: 'DIM_GEOGRAPHY_HIERARCHY',
      pattern: 'Dimension Load',
      complexity: 65,
      status: 'completed',
      qualityScore: 98.8,
      businessRules: 13,
      businessRulesNeedReview: 0,
      createdAt: new Date('2024-11-27T07:20:00'),
      updatedAt: new Date('2024-11-28T08:57:00'),
      rowCount: 12400,
      executionDuration: 8,
      sourcePath: 'PROD_REPO/Dimensions/m_Geography_Hierarchy',
      targetPath: 'TalendProject/Jobs/DIM_GEOGRAPHY_HIERARCHY',
      sourceVersion: 'PowerCenter 10.5',
      targetVersion: 'Talend 8.0',
      automationRate: 97,
      conversionMethod: 'Pattern Matching',
    },
  ]

  // Apply filters
  let filteredData = mockData

  // Status filter
  if (searchParams.status && searchParams.status !== 'All Status') {
    const statusValue = searchParams.status.toLowerCase().replace(' ', '_')
    filteredData = filteredData.filter((m) => m.status === statusValue)
  }

  // Pattern filter
  if (searchParams.pattern && searchParams.pattern !== 'All Patterns') {
    filteredData = filteredData.filter((m) => m.pattern === searchParams.pattern)
  }

  // Search filter (searches in name, description, tags, sourcePath, targetPath)
  if (searchParams.search) {
    const searchLower = searchParams.search.toLowerCase()
    filteredData = filteredData.filter((m) => {
      return (
        m.name.toLowerCase().includes(searchLower) ||
        m.description?.toLowerCase().includes(searchLower) ||
        m.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        m.sourcePath?.toLowerCase().includes(searchLower) ||
        m.targetPath?.toLowerCase().includes(searchLower) ||
        m.pattern.toLowerCase().includes(searchLower)
      )
    })
  }

  return {
    data: filteredData,
    total: filteredData.length,
  }
}

export default async function MigrationsPage({
  searchParams,
}: {
  searchParams: { status?: string; pattern?: string; search?: string; page?: string }
}) {
  const page = parseInt(searchParams.page || '1')
  const { data: migrations, total } = await getMigrations(searchParams)

  return (
    <>
      <Header />

      <main className="bg-gray-50 min-h-screen">
        {/* Page Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div>
            <h1 className="text-2xl font-semibold">Migrations</h1>
            <p className="text-sm text-foreground-secondary mt-1">
              Manage and monitor your Informatica to Talend migrations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/migrations/pipeline">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Migration
              </Button>
            </Link>
          </div>
        </div>

        {/* View Wrapper (Search, Filters, Card/List Toggle) */}
        <MigrationsViewWrapper migrations={migrations} />

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / 50)}
          totalItems={total}
          itemsPerPage={50}
        />
      </main>
    </>
  )
}
