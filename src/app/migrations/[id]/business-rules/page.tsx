import { BusinessRulesTab } from '@/components/migration-detail/business-rules-tab'

async function getBusinessRules(id: string) {
  // Mock data - replace with actual API call
  return [
    {
      id: '1',
      name: 'Customer Status Derivation',
      description: 'Determine customer status based on account balance and transaction history',
      source: 'EXP_Transform.CUSTOMER_STATUS',
      status: 'passed' as const,
      testCases: [
        {
          input: 'balance=5000, txn_count=10',
          expectedOutput: 'GOLD',
          actualOutput: 'GOLD',
          passed: true,
        },
        {
          input: 'balance=500, txn_count=2',
          expectedOutput: 'SILVER',
          actualOutput: 'SILVER',
          passed: true,
        },
      ],
    },
    {
      id: '2',
      name: 'Address Standardization',
      description: 'Standardize address format according to USPS guidelines',
      source: 'EXP_Transform.STD_ADDRESS',
      status: 'needs_review' as const,
      testCases: [
        {
          input: '123 Main St.',
          expectedOutput: '123 MAIN STREET',
          actualOutput: '123 MAIN ST',
          passed: false,
        },
        {
          input: 'Apt 5B',
          expectedOutput: 'APT 5B',
          actualOutput: 'APT 5B',
          passed: true,
        },
      ],
    },
    {
      id: '3',
      name: 'Date of Birth Validation',
      description: 'Validate DOB is within acceptable range and format',
      source: 'EXP_Transform.VALIDATE_DOB',
      status: 'passed' as const,
      testCases: [
        {
          input: '1985-06-15',
          expectedOutput: 'VALID',
          actualOutput: 'VALID',
          passed: true,
        },
        {
          input: '2025-01-01',
          expectedOutput: 'INVALID',
          actualOutput: 'INVALID',
          passed: true,
        },
      ],
    },
  ]
}

export default async function BusinessRulesPage({ params }: { params: { id: string } }) {
  const rules = await getBusinessRules(params.id)

  return <BusinessRulesTab rules={rules} />
}
