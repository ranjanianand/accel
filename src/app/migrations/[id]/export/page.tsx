import { ExportReportTab } from '@/components/migration-detail/export-report-tab'
import { getMockMigrationData } from '@/lib/mock-migration-data'

export default async function ExportReportPage({ params }: { params: { id: string } }) {
  const data = getMockMigrationData(params.id)

  return <ExportReportTab data={data.export} />
}
