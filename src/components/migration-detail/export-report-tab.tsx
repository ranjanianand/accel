import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, Mail, Presentation } from 'lucide-react'
import { type ExportData } from '@/lib/mock-migration-data'

export function ExportReportTab({ data }: { data: ExportData }) {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Export Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow border-2 border-gray-200 hover:border-blue-400">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        {template.format[0] === 'PDF' && <FileText className="h-6 w-6 text-blue-600" />}
                        {template.format[0] === 'HTML' && <Mail className="h-6 w-6 text-blue-600" />}
                        {template.format.includes('ZIP') && <Download className="h-6 w-6 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {template.format.map((fmt) => (
                            <Button key={fmt} variant="secondary" size="sm" className="gap-2">
                              <Download className="h-3 w-3" />
                              {fmt}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Custom Report Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Report Type</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option>Executive Summary (4 pages)</option>
                <option>Technical Deep Dive (28 pages)</option>
                <option>Comprehensive Report (42 pages)</option>
                <option>Custom Selection</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Include Sections</label>
              <div className="grid grid-cols-2 gap-2">
                {['Executive Summary', 'Business Metrics', 'Technical Details', 'Validation Results', 'Performance', 'Data Lineage', 'Risk Assessment', 'Files List'].map((section) => (
                  <label key={section} className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-white cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">{section}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Output Format</label>
              <div className="flex flex-wrap gap-2">
                {['PDF', 'PowerPoint', 'Excel', 'HTML', 'All Formats (ZIP)'].map((format) => (
                  <label key={format} className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer">
                    <input type="radio" name="format" defaultChecked={format === 'PDF'} />
                    <span className="text-sm font-medium">{format}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1 gap-2">
                <Download className="h-4 w-4" />
                Generate Report
              </Button>
              <Button variant="secondary" className="gap-2">
                <Presentation className="h-4 w-4" />
                Preview
              </Button>
              <Button variant="secondary" className="gap-2">
                <Mail className="h-4 w-4" />
                Schedule Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
