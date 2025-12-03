export function SystemStatus() {
  return (
    <div className="flex items-center gap-6 border-b border-border bg-background-secondary px-6 py-2 text-sm">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-status-success" />
        <span className="text-foreground-secondary">All systems operational</span>
      </div>
      <div className="flex items-center gap-2 text-foreground-tertiary">
        <span>API: 45ms</span>
      </div>
      <div className="flex items-center gap-2 text-foreground-tertiary">
        <span>Queue: 3 jobs</span>
      </div>
    </div>
  )
}
