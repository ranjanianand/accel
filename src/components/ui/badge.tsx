import { HTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'pending'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          'badge',
          {
            'border-status-success/20 bg-status-success/10 text-status-success': variant === 'success',
            'border-status-error/20 bg-status-error/10 text-status-error': variant === 'error',
            'border-status-warning/20 bg-status-warning/10 text-status-warning': variant === 'warning',
            'border-status-info/20 bg-status-info/10 text-status-info': variant === 'info',
            'border-status-pending/20 bg-status-pending/10 text-status-pending': variant === 'pending',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'
