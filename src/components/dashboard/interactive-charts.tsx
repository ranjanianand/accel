'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface TooltipData {
  x: number
  y: number
  date: string
  value: string
  visible: boolean
}

// Migration Volume Chart
export function MigrationVolumeChart({ data, dateLabels }: { data: number[], dateLabels: string[] }) {
  const [tooltip, setTooltip] = useState<TooltipData>({ x: 0, y: 0, date: '', value: '', visible: false })

  const handleMouseMove = (e: React.MouseEvent<SVGRectElement>, index: number) => {
    const svgContainer = e.currentTarget.ownerSVGElement?.parentElement
    if (!svgContainer) return

    const rect = svgContainer.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setTooltip({
      x,
      y,
      date: `Nov ${dateLabels[index]}`,
      value: `${data[index]} jobs`,
      visible: true
    })
  }

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false })
  }

  return (
    <Card className="border border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-base font-medium">Migration Volume</div>
        </div>
        <div className="h-48 relative">
          <div className="flex gap-2 h-full">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between text-[9px] text-muted-foreground py-1">
              <span>35</span>
              <span>25</span>
              <span>15</span>
              <span>10</span>
            </div>

            <div className="flex-1 relative">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                onMouseLeave={handleMouseLeave}
              >
                {/* Grid */}
                <line x1="0" y1="0" x2="100" y2="0" stroke="#e5e7eb" strokeWidth="0.3" />
                <line x1="0" y1="33" x2="100" y2="33" stroke="#e5e7eb" strokeWidth="0.3" />
                <line x1="0" y1="66" x2="100" y2="66" stroke="#e5e7eb" strokeWidth="0.3" />
                <line x1="0" y1="100" x2="100" y2="100" stroke="#e5e7eb" strokeWidth="0.3" />

                {/* Bars */}
                {data.map((val, i) => {
                  const barWidth = 100 / data.length
                  const x = i * barWidth + barWidth * 0.25
                  const width = barWidth * 0.5
                  const height = ((val - 10) / 25) * 100

                  return (
                    <rect
                      key={i}
                      x={x}
                      y={100 - height}
                      width={width}
                      height={height}
                      fill="#3b82f6"
                      rx="0.5"
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onMouseMove={(e) => handleMouseMove(e, i)}
                      onMouseLeave={handleMouseLeave}
                    />
                  )
                })}
              </svg>

              {/* Tooltip */}
              {tooltip.visible && (
                <div
                  className="absolute bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg text-gray-900 text-xs px-3 py-2 rounded-lg pointer-events-none z-10 whitespace-nowrap"
                  style={{
                    left: `${tooltip.x}px`,
                    top: `${tooltip.y - 50}px`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="font-semibold text-gray-700">{tooltip.date}</div>
                  <div className="text-blue-600 font-medium">{tooltip.value}</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
            <span>Nov 16</span>
            <span>Nov 29</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Success Rate Trend Chart
export function SuccessRateTrendChart({ data, dateLabels }: { data: number[], dateLabels: string[] }) {
  const [tooltip, setTooltip] = useState<TooltipData>({ x: 0, y: 0, date: '', value: '', visible: false })

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const relativeX = (x / rect.width) * 100

    // Find closest data point
    const index = Math.round((relativeX / 100) * (data.length - 1))
    const clampedIndex = Math.max(0, Math.min(data.length - 1, index))

    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      date: `Nov ${dateLabels[clampedIndex]}`,
      value: `${data[clampedIndex]}%`,
      visible: true
    })
  }

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false })
  }

  return (
    <Card className="border border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-base font-medium">Success Rate Trend</div>
        </div>
        <div className="h-48 relative">
          <div className="flex gap-2 h-full">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between text-[9px] text-muted-foreground py-1">
              <span>96%</span>
              <span>92%</span>
              <span>88%</span>
              <span>86%</span>
            </div>

            <div className="flex-1 relative">
              <svg
                className="w-full h-full cursor-crosshair"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#000" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Grid */}
                <line x1="0" y1="0" x2="100" y2="0" stroke="#e5e7eb" strokeWidth="0.3" />
                <line x1="0" y1="33" x2="100" y2="33" stroke="#e5e7eb" strokeWidth="0.3" />
                <line x1="0" y1="66" x2="100" y2="66" stroke="#e5e7eb" strokeWidth="0.3" />
                <line x1="0" y1="100" x2="100" y2="100" stroke="#e5e7eb" strokeWidth="0.3" />

                {/* Area */}
                <path
                  d={`M 0,${100 - ((data[0] - 86) / 10 * 100)} ${data.map((rate, i) =>
                    `L ${(i / (data.length - 1)) * 100},${100 - ((rate - 86) / 10 * 100)}`
                  ).join(' ')} L 100,100 L 0,100 Z`}
                  fill="url(#areaGradient)"
                />

                {/* Line */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1"
                  points={data.map((rate, i) =>
                    `${(i / (data.length - 1)) * 100},${100 - ((rate - 86) / 10 * 100)}`
                  ).join(' ')}
                />
              </svg>

              {/* Tooltip */}
              {tooltip.visible && (
                <div
                  className="absolute bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg text-gray-900 text-xs px-3 py-2 rounded-lg pointer-events-none z-10 whitespace-nowrap"
                  style={{
                    left: `${tooltip.x}px`,
                    top: `${tooltip.y - 50}px`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="font-semibold text-gray-700">{tooltip.date}</div>
                  <div className="text-green-600 font-medium">{tooltip.value}</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
            <span>Nov 16</span>
            <span>Nov 29</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Quality Validation Metrics Chart
export function QualityValidationChart({
  data,
  dateLabels
}: {
  data: { rowCount: number[], aggregate: number[], sample: number[] },
  dateLabels: string[]
}) {
  const [tooltip, setTooltip] = useState<TooltipData & { rowCount: string, aggregate: string, sample: string }>({
    x: 0, y: 0, date: '', value: '', visible: false, rowCount: '', aggregate: '', sample: ''
  })

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const relativeX = (x / rect.width) * 100

    // Find closest data point
    const index = Math.round((relativeX / 100) * (data.rowCount.length - 1))
    const clampedIndex = Math.max(0, Math.min(data.rowCount.length - 1, index))

    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      date: `Nov ${dateLabels[clampedIndex]}`,
      value: '',
      rowCount: `Row Count: ${data.rowCount[clampedIndex].toFixed(1)}%`,
      aggregate: `Aggregate: ${data.aggregate[clampedIndex].toFixed(1)}%`,
      sample: `Sample: ${data.sample[clampedIndex].toFixed(1)}%`,
      visible: true
    })
  }

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false })
  }

  return (
    <Card className="border border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-base font-medium">Quality Validation Metrics</div>
          <div className="text-xs text-muted-foreground">
            Target: <span className="font-semibold text-green-600">99.5%</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-1 rounded-full bg-blue-600" />
            <span className="text-muted-foreground">Row Count Match</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-1 rounded-full bg-purple-600" />
            <span className="text-muted-foreground">Aggregate Match</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-1 rounded-full bg-green-600" />
            <span className="text-muted-foreground">Sample Match</span>
          </div>
        </div>

        <div className="h-40 relative">
          <div className="flex gap-2 h-full">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between text-[9px] text-muted-foreground py-1">
              <span>100%</span>
              <span>97%</span>
              <span>95%</span>
              <span>93%</span>
            </div>

            <div className="flex-1 relative">
              <svg
                className="w-full h-full cursor-crosshair"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Grid */}
                <line x1="0" y1="0" x2="100" y2="0" stroke="#e5e7eb" strokeWidth="0.3" />
                <line x1="0" y1="33" x2="100" y2="33" stroke="#e5e7eb" strokeWidth="0.3" />
                <line x1="0" y1="66" x2="100" y2="66" stroke="#e5e7eb" strokeWidth="0.3" />
                <line x1="0" y1="100" x2="100" y2="100" stroke="#e5e7eb" strokeWidth="0.3" />

                {/* Row Count - top line */}
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="1.5"
                  points={data.rowCount.map((val, i) =>
                    `${(i / (data.rowCount.length - 1)) * 100},${100 - ((val - 93) / 7 * 100)}`
                  ).join(' ')}
                />

                {/* Aggregate - middle line */}
                <polyline
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="1.5"
                  points={data.aggregate.map((val, i) =>
                    `${(i / (data.aggregate.length - 1)) * 100},${100 - ((val - 93) / 7 * 100)}`
                  ).join(' ')}
                />

                {/* Sample - bottom line */}
                <polyline
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="1.5"
                  points={data.sample.map((val, i) =>
                    `${(i / (data.sample.length - 1)) * 100},${100 - ((val - 93) / 7 * 100)}`
                  ).join(' ')}
                />
              </svg>

              {/* Tooltip */}
              {tooltip.visible && (
                <div
                  className="absolute bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg text-gray-900 text-xs px-3 py-2 rounded-lg pointer-events-none z-10 whitespace-nowrap"
                  style={{
                    left: `${tooltip.x}px`,
                    top: `${tooltip.y - 65}px`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="font-semibold text-gray-700 mb-1">{tooltip.date}</div>
                  <div className="text-blue-600 font-medium">{tooltip.rowCount}</div>
                  <div className="text-purple-600 font-medium">{tooltip.aggregate}</div>
                  <div className="text-green-600 font-medium">{tooltip.sample}</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
            <span>Nov 16</span>
            <span>Nov 29</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Processing Time Chart
export function ProcessingTimeChart({ data, dateLabels }: { data: number[], dateLabels: string[] }) {
  const [tooltip, setTooltip] = useState<TooltipData>({ x: 0, y: 0, date: '', value: '', visible: false })

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const relativeX = (x / rect.width) * 100

    // Find closest data point
    const index = Math.round((relativeX / 100) * (data.length - 1))
    const clampedIndex = Math.max(0, Math.min(data.length - 1, index))

    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      date: `Nov ${dateLabels[clampedIndex]}`,
      value: `${data[clampedIndex].toFixed(1)}m`,
      visible: true
    })
  }

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false })
  }

  return (
    <Card className="border border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-base font-medium">Avg Processing Time</div>
        </div>

        {/* Current value and target */}
        <div className="flex items-center gap-4 mb-3">
          <div>
            <div className="text-2xl font-semibold">3.0m</div>
            <div className="text-xs text-muted-foreground">Current</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Target: 3.5m</div>
            <div className="text-xs text-green-600">14% faster</div>
          </div>
        </div>

        <div className="h-40 relative">
          <div className="flex gap-2 h-full">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between text-[9px] text-muted-foreground py-1">
              <span>5.5m</span>
              <span>4.5m</span>
              <span>3.5m</span>
              <span>3.0m</span>
            </div>

            <div className="flex-1 relative">
              <svg
                className="w-full h-full cursor-crosshair"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Grid */}
                <line x1="0" y1="0" x2="100" y2="0" stroke="#e5e7eb" strokeWidth="0.3" />
                <line x1="0" y1="33" x2="100" y2="33" stroke="#e5e7eb" strokeWidth="0.3" />
                <line x1="0" y1="66" x2="100" y2="66" stroke="#e5e7eb" strokeWidth="0.3" />
                <line x1="0" y1="100" x2="100" y2="100" stroke="#e5e7eb" strokeWidth="0.3" />

                {/* Target threshold line at 3.5m */}
                <line
                  x1="0"
                  y1="80"
                  x2="100"
                  y2="80"
                  stroke="#f59e0b"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />

                {/* Line */}
                <polyline
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="1.5"
                  points={data.map((time, i) =>
                    `${(i / (data.length - 1)) * 100},${100 - ((time - 3) / 2.5 * 100)}`
                  ).join(' ')}
                />

                {/* Dots */}
                {data.map((time, i) => (
                  <circle
                    key={i}
                    cx={(i / (data.length - 1)) * 100}
                    cy={100 - ((time - 3) / 2.5 * 100)}
                    r="1"
                    fill="#6366f1"
                  />
                ))}
              </svg>

              {/* Tooltip */}
              {tooltip.visible && (
                <div
                  className="absolute bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg text-gray-900 text-xs px-3 py-2 rounded-lg pointer-events-none z-10 whitespace-nowrap"
                  style={{
                    left: `${tooltip.x}px`,
                    top: `${tooltip.y - 50}px`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="font-semibold text-gray-700">{tooltip.date}</div>
                  <div className="text-indigo-600 font-medium">{tooltip.value}</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
            <span>Nov 16</span>
            <span>Nov 29</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
