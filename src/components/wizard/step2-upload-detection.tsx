'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useMigrationWizardStore, UploadedFile } from '@/stores/migration-wizard-store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { wizardAPI } from '@/lib/api-client'

// ============================================================================
// File Upload Component
// ============================================================================

function FileUploadZone() {
  const { addFiles, updateFileProgress, updateFileStatus } = useMigrationWizardStore()
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Add files to store first (with pending status)
      addFiles(acceptedFiles)

      setIsUploading(true)

      try {
        // Upload files to backend
        const uploadedFiles = await wizardAPI.uploadFiles(acceptedFiles)

        // Update each file's status based on backend response
        uploadedFiles.forEach((uploadedFile) => {
          updateFileStatus(uploadedFile.id, 'uploaded')
          updateFileProgress(uploadedFile.id, 100)
        })
      } catch (error) {
        console.error('File upload failed:', error)
        // Mark files as error
        acceptedFiles.forEach((file, index) => {
          // Use a temporary ID based on file name
          const tempId = `${Date.now()}-${index}`
          updateFileStatus(tempId, 'error')
        })
      } finally {
        setIsUploading(false)
      }
    },
    [addFiles, updateFileProgress, updateFileStatus]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/xml': ['.xml', '.XML'],
      'application/zip': ['.zip'],
      'text/plain': ['.param'],
    },
    multiple: true,
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200
        ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-primary"
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
        <div>
          <p className="text-base font-medium text-foreground mb-1">
            {isDragActive ? 'Drop files here' : 'Drag & drop Informatica files'}
          </p>
          <p className="text-sm text-muted-foreground">
            or <span className="text-primary font-medium">browse</span> to upload
          </p>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Supported formats: XML, ZIP, .param files</p>
          <p>Upload multiple files or folders at once</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// File List Component
// ============================================================================

function FileList() {
  const { uploadedFiles, removeFile } = useMigrationWizardStore()

  if (uploadedFiles.length === 0) {
    return null
  }

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploaded':
      case 'analyzed':
        return 'bg-green-100 text-green-800'
      case 'uploading':
      case 'analyzing':
        return 'bg-blue-100 text-blue-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: UploadedFile['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'uploading':
        return 'Uploading'
      case 'uploaded':
        return 'Uploaded'
      case 'analyzing':
        return 'Analyzing'
      case 'analyzed':
        return 'Ready'
      case 'error':
        return 'Error'
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          Uploaded Files ({uploadedFiles.length})
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => uploadedFiles.forEach((f) => removeFile(f.id))}
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-2">
        {uploadedFiles.map((file) => (
          <Card key={file.id} className="p-3">
            <div className="flex items-center gap-3">
              {/* File Icon */}
              <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <Badge className={getStatusColor(file.status)}>
                    {getStatusLabel(file.status)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>

                {/* Progress Bar */}
                {(file.status === 'uploading' || file.status === 'analyzing') && (
                  <div className="mt-2">
                    <Progress value={file.uploadProgress} className="h-1" />
                  </div>
                )}

                {/* Error Message */}
                {file.status === 'error' && file.error && (
                  <p className="text-xs text-status-error mt-1">{file.error}</p>
                )}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFile(file.id)}
                className="flex-shrink-0 w-8 h-8 rounded hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Remove file"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Analysis Results Component
// ============================================================================

function AnalysisResults() {
  const { analysisResults } = useMigrationWizardStore()

  if (!analysisResults || analysisResults.status === 'idle') {
    return null
  }

  if (analysisResults.status === 'processing') {
    return (
      <Card className="p-6 mt-6">
        <div className="flex items-center gap-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          <div>
            <p className="text-sm font-medium text-foreground">Analyzing files...</p>
            <p className="text-xs text-muted-foreground mt-1">
              Detecting patterns, connections, and complexity
            </p>
          </div>
        </div>
      </Card>
    )
  }

  if (analysisResults.status === 'complete') {
    const totalObjects =
      analysisResults.objectCounts.mappings +
      analysisResults.objectCounts.workflows +
      analysisResults.objectCounts.sessions +
      analysisResults.objectCounts.mapplets

    return (
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Analysis Complete</h3>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground mb-1">{totalObjects}</div>
            <div className="text-xs text-muted-foreground">Objects Detected</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {analysisResults.patterns.length}
            </div>
            <div className="text-xs text-muted-foreground">Patterns Found</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {analysisResults.automationRate}%
            </div>
            <div className="text-xs text-muted-foreground">Automation</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground mb-1">
              {analysisResults.timeSavingsEstimate}h
            </div>
            <div className="text-xs text-muted-foreground">Time Savings</div>
          </Card>
        </div>

        {/* Object Breakdown */}
        <Card className="p-6">
          <h4 className="text-sm font-medium text-foreground mb-4">Object Types</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Mappings</span>
              <span className="text-sm font-medium text-foreground">
                {analysisResults.objectCounts.mappings}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Workflows</span>
              <span className="text-sm font-medium text-foreground">
                {analysisResults.objectCounts.workflows}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sessions</span>
              <span className="text-sm font-medium text-foreground">
                {analysisResults.objectCounts.sessions}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Mapplets</span>
              <span className="text-sm font-medium text-foreground">
                {analysisResults.objectCounts.mapplets}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sources</span>
              <span className="text-sm font-medium text-foreground">
                {analysisResults.objectCounts.sources}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Targets</span>
              <span className="text-sm font-medium text-foreground">
                {analysisResults.objectCounts.targets}
              </span>
            </div>
          </div>
        </Card>

        {/* Warnings/Errors */}
        {analysisResults.globalWarnings.length > 0 && (
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex gap-3">
              <div className="text-yellow-600 mt-0.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-yellow-900 mb-2">Warnings</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {analysisResults.globalWarnings.map((warning, idx) => (
                    <li key={idx}>• {warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    )
  }

  return null
}

// ============================================================================
// Main Component
// ============================================================================

export function Step2UploadDetection() {
  const {
    uploadedFiles,
    analysisResults,
    setAnalysisResults,
    setDetectedConnections,
    validateStep2,
    nextStep,
    prevStep
  } = useMigrationWizardStore()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setError(null)

    // Set status to processing
    setAnalysisResults({
      status: 'processing',
      objectCounts: {
        mappings: 0,
        workflows: 0,
        sessions: 0,
        mapplets: 0,
        sources: 0,
        targets: 0,
        connections: 0,
        transformations: 0,
      },
      patterns: [],
      complexity: {
        average: 0,
        distribution: { low: 0, medium: 0, high: 0 },
      },
      automationRate: 0,
      timeSavingsEstimate: 0,
      manualWorkEstimate: 0,
      files: [],
      globalWarnings: [],
      globalErrors: [],
    })

    try {
      // Get file IDs from uploaded files
      const fileIds = uploadedFiles.map((f) => f.id)

      // Call backend API to analyze files
      const analysis = await wizardAPI.analyzeFiles(fileIds)

      // Update store with analysis results
      setAnalysisResults(analysis)

      // Update detected connections
      if (analysis.detectedConnections && analysis.detectedConnections.length > 0) {
        setDetectedConnections(analysis.detectedConnections)
      }

    } catch (error) {
      console.error('Analysis failed:', error)
      setError(error instanceof Error ? error.message : 'Analysis failed')

      // Set error status
      setAnalysisResults({
        status: 'error',
        objectCounts: {
          mappings: 0,
          workflows: 0,
          sessions: 0,
          mapplets: 0,
          sources: 0,
          targets: 0,
          connections: 0,
          transformations: 0,
        },
        patterns: [],
        complexity: {
          average: 0,
          distribution: { low: 0, medium: 0, high: 0 },
        },
        automationRate: 0,
        timeSavingsEstimate: 0,
        manualWorkEstimate: 0,
        files: [],
        globalWarnings: [],
        globalErrors: [error instanceof Error ? error.message : 'Analysis failed'],
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const canProceed = validateStep2()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Upload & Auto-Detection
        </h2>
        <p className="text-muted-foreground">
          Upload your Informatica PowerCenter XML files for automatic analysis and pattern
          detection.
        </p>
      </div>

      {/* Upload Zone */}
      <FileUploadZone />

      {/* File List */}
      <FileList />

      {/* Analyze Button */}
      {uploadedFiles.length > 0 && (!analysisResults || analysisResults.status === 'idle') && (
        <div className="mt-6 flex justify-center">
          <Button onClick={handleAnalyze} disabled={isAnalyzing} size="lg">
            {isAnalyzing ? 'Analyzing...' : `Analyze ${uploadedFiles.length} Files`}
          </Button>
        </div>
      )}

      {/* Analysis Results */}
      <AnalysisResults />

      {/* Navigation */}
      <div className="flex justify-between gap-3 pt-6 mt-6 border-t">
        <Button variant="secondary" onClick={prevStep}>
          ← Back to Project Info
        </Button>
        <Button onClick={nextStep} disabled={!canProceed}>
          Continue to Connections →
        </Button>
      </div>
    </div>
  )
}
