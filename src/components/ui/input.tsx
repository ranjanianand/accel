import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          'input-base',
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

Input.displayName = 'Input'
