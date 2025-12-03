import { ExecutiveSummaryTab } from '@/components/migration-detail/executive-summary-tab'
import { getMockMigrationData } from '@/lib/mock-migration-data'

export default async function MigrationDetailPage({ params }: { params: { id: string } }) {
  const data = getMockMigrationData(params.id)

  return <ExecutiveSummaryTab data={data.executive} />
}
