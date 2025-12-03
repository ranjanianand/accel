import { FilesDeliverablesTab } from '@/components/migration-detail/files-deliverables-tab'
import { getMockMigrationData } from '@/lib/mock-migration-data'

export default async function FilesDeliverablesPage({ params }: { params: { id: string } }) {
  const data = getMockMigrationData(params.id)

  return <FilesDeliverablesTab data={data.files} />
}
