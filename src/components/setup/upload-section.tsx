'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useSetupStore } from '@/stores/setup-store'
import { Button } from '@/components/ui/button'

export function SetupUploadSection() {
  const {
    projectStatus,
    uploadStatus,
    files,
    isUploadLocked,
    isAnalyzing,
    canAnalyze,
    addFiles,
    removeFile,
    startAnalysis,
    clearFiles,
  } = useSetupStore()

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
    disabled: isUploadLocked || projectStatus !== 'complete',
  })

  // Section not visible until project is complete
  if (projectStatus === 'incomplete') {
    return null
  }

  // Locked State
  if (uploadStatus === 'locked') {
    return (
      <div className="bg-background-secondary border border-border rounded-lg p-6 opacity-60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center">
            <span className="text-foreground-tertiary text-sm">🔒</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-foreground-secondary">
              File Upload & Detection
            </h2>
            <p className="text-xs text-foreground-tertiary">Locked after analysis started</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background border border-border rounded-lg p-6 animate-slide-down">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-accent-blue/10 flex items-center justify-center">
          <span className="text-accent-blue text-sm">2</span>
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-lg">File Upload & Detection</h2>
          <p className="text-xs text-foreground-secondary">
            Upload Informatica XML files for automatic analysis
          </p>
        </div>
        {files.length > 0 && !isUploadLocked && (
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
          transition-all duration-200
          ${
            isDragActive
              ? 'border-accent-blue bg-accent-blue/5'
              : 'border-border hover:border-border-hover hover:bg-background-secondary'
          }
          ${isUploadLocked || projectStatus !== 'complete' ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

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
                Drop Informatica XML files here, or{' '}
                <span className="text-accent-blue">browse</span>
              </p>
              <p className="text-xs text-foreground-tertiary">
                Supports: Mappings, Workflows, Sessions, Sources, Targets
              </p>
            </>
          )}
        </div>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium">
            Uploaded Files ({files.length})
          </p>

          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-background-secondary rounded border border-border"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-foreground-secondary">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                {/* Progress Bar */}
                {file.status === 'uploading' && (
                  <div className="flex-1 max-w-[200px]">
                    <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-blue transition-all duration-300"
                        style={{ width: `${file.uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center gap-2">
                  {file.status === 'uploaded' && (
                    <span className="text-status-success text-sm">✓</span>
                  )}
                  {file.status === 'uploading' && (
                    <span className="text-foreground-secondary text-xs">
                      {file.uploadProgress}%
                    </span>
                  )}
                  {file.status === 'error' && (
                    <span className="text-status-error text-sm">✗</span>
                  )}

                  {!isUploadLocked && (
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-foreground-tertiary hover:text-status-error transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analyze Button */}
      {canAnalyze() && !isAnalyzing && (
        <div className="mt-6 pt-6 border-t flex justify-end">
          <Button onClick={startAnalysis} size="lg">
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
