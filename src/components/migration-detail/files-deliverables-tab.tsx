import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, Package } from 'lucide-react'
import { type FilesData } from '@/lib/mock-migration-data'

export function FilesDeliverablesTab({ data }: { data: FilesData }) {
  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Primary Deliverables - The Solution */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Migration Deliverables</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Production-ready Talend jobs and comprehensive documentation</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.primaryDeliverables.map((file, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
                        {file.format === 'ZIP' && <Package className="h-6 w-6 text-gray-600" />}
                        {file.format === 'PDF' && <FileText className="h-6 w-6 text-gray-600" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-1">{file.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{file.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="font-medium">{file.format}</span>
                          <span>•</span>
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>Generated {file.lastGenerated.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="secondary" className="gap-2 flex-shrink-0">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
