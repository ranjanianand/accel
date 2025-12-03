'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useSetupStore } from '@/stores/setup-store'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function SetupProjectUploadSection() {
  const {
    projectInfo,
    files,
    isUploadLocked,
    isAnalyzing,
    canAnalyze,
    updateProjectInfo,
    addFiles,
    removeFile,
    startAnalysis,
    clearFiles,
  } = useSetupStore()

  const [name, setName] = useState(projectInfo.name)
  const [description, setDescription] = useState(projectInfo.description || '')
  const [sourceSystem, setSourceSystem] = useState(projectInfo.sourceSystem)
  const [tags, setTags] = useState(projectInfo.tags?.join(', ') || '')

  // Auto-save project info on change
  const handleProjectInfoChange = () => {
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
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      addFiles(acceptedFiles)
    },
    [addFiles]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/xml': ['.xml'],
      'application/xml': ['.xml'],
    },
    disabled: isUploadLocked,
  })

  const isProjectValid = name.length >= 3

  // Redirect to pipeline after analysis completes
  const handleAnalyze = async () => {
    await startAnalysis()
    // Analysis complete, redirect to pipeline
    window.location.href = '/migrations/pipeline'
  }

  return (
    <div className="bg-background border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-accent-blue/10 flex items-center justify-center">
          <span className="text-accent-blue text-sm">1</span>
        </div>
        <div>
          <h2 className="font-semibold text-lg">Setup & Analysis</h2>
          <p className="text-xs text-foreground-secondary">
            Configure project details, upload files, and run automated analysis
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* PROJECT INFORMATION */}
        <div>
          <h3 className="text-sm font-semibold text-foreground-secondary mb-4">Project Information</h3>

          {/* Row 1: Project Name (full width) */}
          <div className="mb-4">
            <Label htmlFor="name" required>
              Project Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Customer DWH Migration"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                handleProjectInfoChange()
              }}
              onBlur={handleProjectInfoChange}
              error={name.length > 0 && name.length < 3}
            />
            {name.length > 0 && name.length < 3 && (
              <p className="text-sm text-status-error mt-1">Minimum 3 characters</p>
            )}
          </div>

          {/* Row 2: Description (full width) */}
          <div className="mb-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional: Describe the scope and goals of this migration project..."
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                handleProjectInfoChange()
              }}
              onBlur={handleProjectInfoChange}
            />
          </div>

          {/* Row 3: Source System + Tags (2 columns) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sourceSystem" required>
                Source System
              </Label>
              <Select
                id="sourceSystem"
                value={sourceSystem}
                onChange={(e) => {
                  setSourceSystem(e.target.value as any)
                  handleProjectInfoChange()
                }}
              >
                <option value="informatica_9">Informatica PowerCenter 9.x</option>
                <option value="informatica_10">Informatica PowerCenter 10.x</option>
                <option value="informatica_10.5">Informatica PowerCenter 10.5+</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                type="text"
                placeholder="e.g., finance, high-priority"
                value={tags}
                onChange={(e) => {
                  setTags(e.target.value)
                  handleProjectInfoChange()
                }}
                onBlur={handleProjectInfoChange}
              />
              <p className="text-xs text-foreground-tertiary mt-1">
                Comma-separated tags for organization
              </p>
            </div>
          </div>
        </div>

        {/* FILE UPLOAD */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground-secondary">Upload Files</h3>
            {files.length > 0 && !isUploadLocked && (
              <Button onClick={clearFiles} variant="ghost" size="sm">
                Clear All
              </Button>
            )}
          </div>

          {/* Dropzone - Full Width */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-all duration-200 min-h-[180px] flex flex-col items-center justify-center
              ${
                isDragActive
                  ? 'border-accent-blue bg-accent-blue/5'
                  : 'border-border hover:border-border-hover hover:bg-background-secondary'
              }
              ${isUploadLocked ? 'opacity-50 cursor-not-allowed bg-background-tertiary' : ''}
            `}
          >
            <input {...getInputProps()} />

            {isUploadLocked ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-background-secondary flex items-center justify-center mb-2">
                  <span className="text-2xl">🔒</span>
                </div>
                <p className="text-sm font-medium text-foreground-secondary">
                  Upload locked after analysis
                </p>
                <p className="text-xs text-foreground-tertiary">
                  Files cannot be changed once analyzed
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-background-secondary flex items-center justify-center mb-2">
                  <svg
                    className="w-6 h-6 text-foreground-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>

                {isDragActive ? (
                  <p className="text-sm font-medium text-accent-blue">Drop XML files here...</p>
                ) : (
                  <>
                    <p className="text-sm font-medium">
                      Drop XML files here or{' '}
                      <span className="text-accent-blue">browse</span>
                    </p>
                    <p className="text-xs text-foreground-tertiary">
                      Mappings, Workflows, Sessions
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Uploaded Files - Summary + Expandable List */}
          {files.length > 0 && (
            <div className="space-y-3">
              {/* Files Summary */}
              <div className="flex items-center justify-between p-3 bg-background-secondary rounded border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-accent-blue/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {files.length} file{files.length !== 1 ? 's' : ''} uploaded
                    </p>
                    <p className="text-xs text-foreground-tertiary">
                      {(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB total
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {files.every(f => f.status === 'uploaded') && (
                    <span className="text-status-success text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      All uploaded
                    </span>
                  )}
                </div>
              </div>

              {/* File List - Compact table for many files */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="max-h-[240px] overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-background-secondary sticky top-0">
                      <tr>
                        <th className="text-left p-2 font-medium text-foreground-secondary">File Name</th>
                        <th className="text-right p-2 font-medium text-foreground-secondary w-20">Size</th>
                        <th className="text-center p-2 font-medium text-foreground-secondary w-16">Status</th>
                        {!isUploadLocked && <th className="w-10"></th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {files.map((file) => (
                        <tr key={file.id} className="hover:bg-background-secondary/50 transition-colors">
                          <td className="p-2">
                            <p className="truncate font-medium">{file.name}</p>
                          </td>
                          <td className="p-2 text-right text-foreground-tertiary">
                            {(file.size / 1024).toFixed(1)} KB
                          </td>
                          <td className="p-2 text-center">
                            {file.status === 'uploaded' && (
                              <span className="text-status-success">✓</span>
                            )}
                            {file.status === 'uploading' && (
                              <span className="text-foreground-tertiary">{file.uploadProgress}%</span>
                            )}
                          </td>
                          {!isUploadLocked && (
                            <td className="p-2 text-center">
                              <button
                                onClick={() => removeFile(file.id)}
                                className="text-foreground-tertiary hover:text-status-error transition-colors"
                                title="Remove file"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analyze Button */}
      {canAnalyze() && !isAnalyzing && (
        <div className="mt-6 pt-6 border-t flex justify-end">
          <Button onClick={handleAnalyze} size="lg" disabled={!isProjectValid}>
            Analyze {files.length} File{files.length !== 1 ? 's' : ''} →
          </Button>
        </div>
      )}

      {/* Analyzing State */}
      {isAnalyzing && (
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-center gap-3 py-4">
            <div className="w-5 h-5 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-foreground-secondary">
              Analyzing files and detecting patterns...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
