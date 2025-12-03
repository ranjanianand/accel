import { HTMLAttributes, forwardRef, ThHTMLAttributes, TdHTMLAttributes } from 'react'
import { clsx } from 'clsx'

export const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative w-full overflow-auto">
        <table
          ref={ref}
          className={clsx('w-full caption-bottom text-sm', className)}
          {...props}
        />
      </div>
    )
  }
)
Table.displayName = 'Table'

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={clsx('border-b border-border', className)}
        {...props}
      />
    )
  }
)
TableHeader.displayName = 'TableHeader'

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={clsx('[&_tr:last-child]:border-0', className)}
        {...props}
      />
    )
  }
)
TableBody.displayName = 'TableBody'

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={clsx(
          'border-b border-border transition-colors hover:bg-background-secondary',
          className
        )}
        {...props}
      />
    )
  }
)
TableRow.displayName = 'TableRow'

export const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={clsx(
          'h-12 px-4 text-left align-middle font-medium text-foreground-secondary',
          className
        )}
        {...props}
      />
    )
  }
)
TableHead.displayName = 'TableHead'

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={clsx('p-4 align-middle', className)}
        {...props}
      />
    )
  }
)
TableCell.displayName = 'TableCell'
