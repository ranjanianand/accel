import { TextareaHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          'input-base min-h-[80px] resize-y',
          {
            'border-status-error focus:ring-status-error': error,
          },
          className
        )}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'
