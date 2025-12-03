import { HistoryTab } from '@/components/migration-detail/history-tab'

async function getHistory(id: string) {
  // Mock data - replace with actual API call
  return [
    {
      id: '1',
      type: 'downloaded' as const,
      user: 'John Doe',
      description: 'Downloaded Talend job archive',
      timestamp: new Date('2024-11-28T14:30:00'),
    },
    {
      id: '2',
      type: 'validated' as const,
      user: 'System',
      description: 'Validation completed successfully',
      timestamp: new Date('2024-11-28T12:15:00'),
      metadata: {
        'Quality Score': '99.8%',
        'Validations Passed': '15/15',
      },
    },
    {
      id: '3',
      type: 'converted' as const,
      user: 'System',
      description: 'Conversion to Talend completed',
      timestamp: new Date('2024-11-28T12:10:00'),
      metadata: {
        'Duration': '2m 34s',
        'Automation Rate': '96%',
      },
    },
    {
      id: '4',
      type: 'created' as const,
      user: 'John Doe',
      description: 'Migration created from CustomerETL_v2.xml',
      timestamp: new Date('2024-11-28T12:00:00'),
      metadata: {
        'File Size': '245 KB',
        'Pattern Detected': 'SCD Type 2',
      },
    },
  ]
}

export default async function HistoryPage({ params }: { params: { id: string } }) {
  const events = await getHistory(params.id)

  return <HistoryTab events={events} />
}
