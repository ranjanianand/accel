import { PerformanceComparisonTab } from '@/components/migration-detail/performance-comparison-tab'
import { getMockMigrationData } from '@/lib/mock-migration-data'

export default async function PerformanceComparisonPage({ params }: { params: { id: string } }) {
  const data = getMockMigrationData(params.id)

  return <PerformanceComparisonTab data={data.performance} />
}
