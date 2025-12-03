'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, File, X } from 'lucide-react'

export interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  onXmlPaste: (xml: string) => void
}

export function FileUpload({ onFileSelect, onXmlPaste }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showPasteArea, setShowPasteArea] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.name.endsWith('.xml')) {
      setFile(droppedFile)
      onFileSelect(droppedFile)
    }
  }, [onFileSelect])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      onFileSelect(selectedFile)
    }
  }

  const clearFile = () => {
    setFile(null)
    onFileSelect(null)
  }

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging ? 'border-foreground bg-background-secondary' : 'border-border'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <CardContent className="py-12">
          {file ? (
            <div className="flex items-center justify-between p-4 rounded border border-border bg-background-secondary">
              <div className="flex items-center gap-3">
                <File className="h-8 w-8 text-foreground-secondary" />
                <div>
                  <div className="font-medium">{file.name}</div>
                  <div className="text-sm text-foreground-secondary">
                    {(file.size / 1024).toFixed(2)} KB
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={clearFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-background-secondary">
                <Upload className="h-8 w-8 text-foreground-secondary" />
              </div>
              <div>
                <p className="text-sm text-foreground-secondary">
                  Drag and drop your Informatica XML mapping file here
                </p>
                <p className="text-xs text-foreground-tertiary mt-1">or</p>
              </div>
              <label>
                <input
                  type="file"
                  accept=".xml"
                  className="hidden"
                  onChange={handleFileInput}
                />
                <Button variant="secondary" className="cursor-pointer" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-foreground-secondary">
        or{' '}
        <button
          className="text-foreground hover:underline"
          onClick={() => setShowPasteArea(!showPasteArea)}
        >
          paste XML directly
        </button>
      </div>

      {showPasteArea && (
        <Card>
          <CardContent className="p-4">
            <textarea
              className="w-full min-h-[200px] p-3 text-sm font-mono rounded border border-border bg-background resize-y focus:outline-none focus:ring-2 focus:ring-foreground"
              placeholder="Paste your Informatica XML mapping here..."
              onChange={(e) => onXmlPaste(e.target.value)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
