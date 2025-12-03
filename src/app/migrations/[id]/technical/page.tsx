import { TechnicalDetailsTab } from '@/components/migration-detail/technical-details-tab'
import { getMockMigrationData } from '@/lib/mock-migration-data'

export default async function TechnicalDetailsPage({ params }: { params: { id: string } }) {
  const data = getMockMigrationData(params.id)

  return <TechnicalDetailsTab data={data.technical} />
}
