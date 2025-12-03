import { Header } from '@/components/layout/header'
import { MigrationHeader } from '@/components/migration-detail/migration-header'
import { TabNavigation } from '@/components/migration-detail/tab-navigation'

async function getMigration(id: string) {
  // Mock data - replace with actual API call
  return {
    id,
    name: 'CustomerETL_v2',
    status: 'completed' as const,
    pattern: 'SCD Type 2',
    complexity: 67,
    qualityScore: 99.8,
    updatedAt: new Date('2024-11-28T12:00:00'),
  }
}

export default async function MigrationLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const migration = await getMigration(params.id)

  return (
    <>
      <Header />
      <MigrationHeader migration={migration} />
      <TabNavigation migrationId={params.id} />
      {children}
    </>
  )
}
