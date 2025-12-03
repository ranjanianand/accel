'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMigrationWizardStore } from '@/stores/migration-wizard-store'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// ============================================================================
// Validation Schema
// ============================================================================

const projectInfoSchema = z.object({
  name: z
    .string()
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9_\s-]+$/, 'Only letters, numbers, spaces, dashes and underscores allowed'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  sourceSystem: z.enum(['informatica_9', 'informatica_10', 'informatica_10.5']),
  targetSystem: z.literal('talend'),
  tags: z.string().optional(),
})

type ProjectInfoFormData = z.infer<typeof projectInfoSchema>

// ============================================================================
// Component
// ============================================================================

export function Step1ProjectInfo() {
  const { projectInfo, setProjectInfo, nextStep } = useMigrationWizardStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProjectInfoFormData>({
    resolver: zodResolver(projectInfoSchema),
    mode: 'onChange',
    defaultValues: {
      name: projectInfo.name || '',
      description: projectInfo.description || '',
      sourceSystem: projectInfo.sourceSystem || 'informatica_10.5',
      targetSystem: 'talend',
      tags: projectInfo.tags?.join(', ') || '',
    },
  })

  const onSubmit = (data: ProjectInfoFormData) => {
    // Convert tags string to array
    const tags = data.tags
      ? data.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      : undefined

    // Update store
    setProjectInfo({
      name: data.name,
      description: data.description,
      sourceSystem: data.sourceSystem,
      targetSystem: data.targetSystem,
      tags,
    })

    // Move to next step
    nextStep()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Create Migration Project
        </h2>
        <p className="text-muted-foreground">
          Start your Informatica to Talend migration journey by providing basic project details.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Project Name */}
          <div>
            <Label htmlFor="name" required>
              Project Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Customer Data Warehouse Migration"
              error={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-status-error mt-1">{errors.name.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              A clear, descriptive name for your migration project
            </p>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the scope and goals of this migration project..."
              rows={4}
              error={!!errors.description}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-status-error mt-1">{errors.description.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Optional: Provide context about this migration for your team
            </p>
          </div>

          {/* Source System */}
          <div>
            <Label htmlFor="sourceSystem" required>
              Source System
            </Label>
            <Select
              id="sourceSystem"
              error={!!errors.sourceSystem}
              {...register('sourceSystem')}
            >
              <option value="informatica_9">Informatica PowerCenter 9.x</option>
              <option value="informatica_10">Informatica PowerCenter 10.x</option>
              <option value="informatica_10.5">Informatica PowerCenter 10.5+</option>
            </Select>
            {errors.sourceSystem && (
              <p className="text-sm text-status-error mt-1">{errors.sourceSystem.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Select your Informatica PowerCenter version
            </p>
          </div>

          {/* Target System */}
          <div>
            <Label htmlFor="targetSystem" required>
              Target System
            </Label>
            <Select
              id="targetSystem"
              disabled
              {...register('targetSystem')}
            >
              <option value="talend">Talend Open Studio / Data Integration</option>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Currently supporting Talend 7.x - 8.x
            </p>
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              type="text"
              placeholder="e.g., finance, high-priority, q4-2024"
              {...register('tags')}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optional: Comma-separated tags for project organization
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="text-blue-600 mt-0.5">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  What happens next?
                </h4>
                <p className="text-sm text-blue-700">
                  After creating your project, you&apos;ll upload Informatica XML files for
                  automatic analysis and pattern detection. Our platform will identify
                  mappings, workflows, connections, and estimate automation potential.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="submit" disabled={!isValid}>
              Continue to Upload →
            </Button>
          </div>
        </form>
      </Card>

      {/* Features Preview */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="p-4">
          <div className="text-3xl font-bold text-primary mb-1">92-97%</div>
          <div className="text-sm text-muted-foreground">Automation Rate</div>
        </div>
        <div className="p-4">
          <div className="text-3xl font-bold text-primary mb-1">&lt; 60s</div>
          <div className="text-sm text-muted-foreground">To Insights</div>
        </div>
        <div className="p-4">
          <div className="text-3xl font-bold text-primary mb-1">200+</div>
          <div className="text-sm text-muted-foreground">Function Mappings</div>
        </div>
      </div>
    </div>
  )
}
