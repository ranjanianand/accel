import { LabelHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={clsx(
          'block text-sm font-medium text-foreground mb-1.5',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-status-error ml-1">*</span>}
      </label>
    )
  }
)

Label.displayName = 'Label'
