'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useSetupStore } from '@/stores/setup-store'
import { usePipelineStore } from '@/stores/pipeline-store'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function SetupStage() {
  const {
    projectInfo,
    files,
    analysisResults,
    connections,
    isUploadLocked,
    isAnalyzing,
    canAnalyze,
    updateProjectInfo,
    addFiles,
    removeFile,
    startAnalysis,
    clearFiles,
    updateConnection,
    testConnection,
  } = useSetupStore()

  const { completeStage, moveToNextStage } = usePipelineStore()

  const [name, setName] = useState(projectInfo.name)
  const [description, setDescription] = useState(projectInfo.description || '')
  const [sourceSystem, setSourceSystem] = useState(projectInfo.sourceSystem)
  const [tags, setTags] = useState(projectInfo.tags?.join(', ') || '')
  const [isTransitioning, setIsTransitioning] = useState(false)

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

  // Analysis handler - automatically proceeds after completion
  const handleAnalyze = async () => {
    setIsTransitioning(true)
    try {
      await startAnalysis()
      // Analysis complete, proceed to next stage
      completeStage('setup')
      moveToNextStage()
    } catch (error) {
      // Error is already handled in startAnalysis
      setIsTransitioning(false)
    }
  }

  const isLocked = isUploadLocked || isAnalyzing || analysisResults !== null
  const hasErrors = files.some((f) => f.status === 'error')
  const canProceed = canAnalyze() && !hasErrors && !isTransitioning

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      {!isLocked && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-900">
                Review carefully - cannot modify after starting analysis
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Once you start analysis, project info and uploaded files will be locked
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT INFORMATION */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h2 className="text-base font-semibold mb-4">Project Information</h2>

        <div className="space-y-4">
          {/* Project Name */}
          <div>
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
              disabled={isLocked}
            />
            {name.length > 0 && name.length < 3 && (
              <p className="text-sm text-status-error mt-1">Minimum 3 characters</p>
            )}
          </div>

          {/* Description */}
          <div>
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
              disabled={isLocked}
            />
          </div>

          {/* Source System + Tags */}
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
                disabled={isLocked}
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
                disabled={isLocked}
              />
              <p className="text-xs text-foreground-tertiary mt-1">
                Comma-separated tags
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FILE UPLOAD */}
      <div className="bg-background border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Upload Files</h2>
          {files.length > 0 && !isLocked && (
            <Button onClick={clearFiles} variant="ghost" size="sm">
              Clear All
            </Button>
          )}
        </div>

        {/* Dropzone */}
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
            ${isLocked ? 'opacity-50 cursor-not-allowed bg-background-tertiary' : ''}
          `}
        >
          <input {...getInputProps()} />

          {isLocked ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-background-secondary flex items-center justify-center mb-2">
                <span className="text-2xl">🔒</span>
              </div>
              <p className="text-sm font-medium text-foreground-secondary">
                Upload locked after analysis
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
                    Drop XML files here or <span className="text-accent-blue">browse</span>
                  </p>
                  <p className="text-xs text-foreground-tertiary">
                    Informatica XML exports (Mappings, Workflows, Sessions)
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="mt-4 space-y-3">
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
                    {(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {files.every((f) => f.status === 'uploaded') && (
                <span className="text-status-success text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  All uploaded
                </span>
              )}
            </div>

            {/* File List */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="max-h-[240px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-background-secondary sticky top-0">
                    <tr>
                      <th className="text-left p-2 font-medium text-foreground-secondary">File Name</th>
                      <th className="text-right p-2 font-medium text-foreground-secondary w-20">Size</th>
                      <th className="text-center p-2 font-medium text-foreground-secondary w-16">Status</th>
                      {!isLocked && <th className="w-10"></th>}
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
                          {file.status === 'uploaded' && <span className="text-status-success">✓</span>}
                          {file.status === 'uploading' && (
                            <span className="text-foreground-tertiary">{file.uploadProgress}%</span>
                          )}
                          {file.status === 'error' && (
                            <span className="text-status-error flex items-center justify-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </td>
                        {!isLocked && (
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

        {/* Error State - Allow Re-upload */}
        {hasErrors && (
          <div className="mt-6 pt-6 border-t">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">
                    File upload errors detected
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    Remove failed files and try uploading again
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        {canProceed && !isAnalyzing && (
          <div className="mt-6 pt-6 border-t flex justify-end">
            <Button onClick={handleAnalyze} size="lg" disabled={!isProjectValid || hasErrors}>
              Start Analysis →
            </Button>
          </div>
        )}

        {/* Analyzing State */}
        {isAnalyzing && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-center gap-3 py-4">
              <div className="w-5 h-5 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-foreground-secondary">
                Analyzing files and detecting patterns... This will proceed automatically.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
