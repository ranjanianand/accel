'use client'

import { useState } from 'react'
import { useSetupStore } from '@/stores/setup-store'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function SetupProjectSection() {
  const {
    projectInfo,
    projectStatus,
    isProjectCollapsed,
    updateProjectInfo,
    completeProject,
    editProject,
  } = useSetupStore()

  const [name, setName] = useState(projectInfo.name)
  const [description, setDescription] = useState(projectInfo.description || '')
  const [sourceSystem, setSourceSystem] = useState(projectInfo.sourceSystem)
  const [tags, setTags] = useState(projectInfo.tags?.join(', ') || '')

  const isValid = name.length >= 3

  const handleSave = () => {
    updateProjectInfo({
      name,
      description: description || undefined,
      sourceSystem,
      tags: tags
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined,
    })
    completeProject()
  }

  const handleEdit = () => {
    editProject()
  }

  // Collapsed State
  if (isProjectCollapsed && (projectStatus === 'complete' || projectStatus === 'locked')) {
    return (
      <div className="bg-background border border-border rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-status-success/10 flex items-center justify-center">
                <span className="text-status-success text-sm">✓</span>
              </div>
              <div>
                <h2 className="font-semibold text-lg">Project Information</h2>
                <p className="text-xs text-foreground-secondary">Completed</p>
              </div>
            </div>

            <div className="ml-11 space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-foreground-secondary min-w-[120px]">Project Name:</span>
                <span className="font-medium">{projectInfo.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-foreground-secondary min-w-[120px]">Source System:</span>
                <span className="font-medium">
                  {projectInfo.sourceSystem === 'informatica_9'
                    ? 'Informatica PowerCenter 9.x'
                    : projectInfo.sourceSystem === 'informatica_10'
                      ? 'Informatica PowerCenter 10.x'
                      : 'Informatica PowerCenter 10.5+'}
                </span>
              </div>
              {projectInfo.description && (
                <div className="flex gap-2">
                  <span className="text-foreground-secondary min-w-[120px]">Description:</span>
                  <span className="text-foreground-secondary">{projectInfo.description}</span>
                </div>
              )}
              {projectInfo.tags && projectInfo.tags.length > 0 && (
                <div className="flex gap-2">
                  <span className="text-foreground-secondary min-w-[120px]">Tags:</span>
                  <div className="flex gap-2 flex-wrap">
                    {projectInfo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="badge bg-background-tertiary text-foreground-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button onClick={handleEdit} variant="ghost" size="sm" disabled={projectStatus === 'locked'}>
            Edit
          </Button>
        </div>
      </div>
    )
  }

  // Locked State
  if (projectStatus === 'locked') {
    return (
      <div className="bg-background-secondary border border-border rounded-lg p-6 opacity-60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center">
            <span className="text-foreground-tertiary text-sm">🔒</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-foreground-secondary">Project Information</h2>
            <p className="text-xs text-foreground-tertiary">Locked after analysis</p>
          </div>
        </div>
      </div>
    )
  }

  // Expanded/Edit State
  return (
    <div className="bg-background border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-accent-blue/10 flex items-center justify-center">
          <span className="text-accent-blue text-sm">1</span>
        </div>
        <div>
          <h2 className="font-semibold text-lg">Project Information</h2>
          <p className="text-xs text-foreground-secondary">Configure migration project details</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Project Name */}
        <div>
          <Label htmlFor="name" required>
            Project Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="e.g., Customer Data Warehouse Migration"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={name.length > 0 && name.length < 3}
          />
          {name.length > 0 && name.length < 3 && (
            <p className="text-sm text-status-error mt-1">
              Project name must be at least 3 characters
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the scope and goals of this migration project..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Source System */}
        <div>
          <Label htmlFor="sourceSystem" required>
            Source System
          </Label>
          <Select
            id="sourceSystem"
            value={sourceSystem}
            onChange={(e) => setSourceSystem(e.target.value as any)}
          >
            <option value="informatica_9">Informatica PowerCenter 9.x</option>
            <option value="informatica_10">Informatica PowerCenter 10.x</option>
            <option value="informatica_10.5">Informatica PowerCenter 10.5+</option>
          </Select>
        </div>

        {/* Target System (Read-only) */}
        <div>
          <Label htmlFor="targetSystem">Target System</Label>
          <Select id="targetSystem" disabled>
            <option value="talend">Talend Open Studio / Data Integration</option>
          </Select>
          <p className="text-xs text-foreground-tertiary mt-1">Currently supporting Talend 7.x - 8.x</p>
        </div>

        {/* Tags */}
        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            type="text"
            placeholder="e.g., finance, high-priority, q4-2024"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <p className="text-xs text-foreground-tertiary mt-1">
            Optional: Comma-separated tags for project organization
          </p>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t flex justify-end">
          <Button onClick={handleSave} disabled={!isValid}>
            Save & Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
