import { IssuesRisksTab } from '@/components/migration-detail/issues-risks-tab'
import { getMockMigrationData } from '@/lib/mock-migration-data'

export default async function IssuesRisksPage({ params }: { params: { id: string } }) {
  const data = getMockMigrationData(params.id)

  return <IssuesRisksTab data={data.issues} />
}
