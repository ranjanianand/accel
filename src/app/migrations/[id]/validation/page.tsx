import { ValidationResultsTab } from '@/components/migration-detail/validation-results-tab'
import { getMockMigrationData } from '@/lib/mock-migration-data'

export default async function ValidationResultsPage({ params }: { params: { id: string } }) {
  const data = getMockMigrationData(params.id)

  return <ValidationResultsTab data={data.validation} />
}
