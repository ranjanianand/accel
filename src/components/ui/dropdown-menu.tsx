'use client'

import * as React from 'react'
import { clsx } from 'clsx'

export interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'start' | 'end'
}

const DropdownContext = React.createContext<{ close: () => void } | null>(null)

export function DropdownMenu({ trigger, children, align = 'end' }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const close = React.useCallback(() => {
    setOpen(false)
  }, [])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <DropdownContext.Provider value={{ close }}>
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setOpen(!open)
          }}
        >
          {trigger}
        </div>
        {open && (
          <div
            className={clsx(
              'absolute top-full mt-2 z-[100]',
              'min-w-[160px] rounded-lg border border-gray-200 bg-white shadow-xl',
              'py-1',
              align === 'end' ? 'right-0' : 'left-0'
            )}
            style={{ boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  )
}

export interface DropdownMenuItemProps {
  onClick?: () => void
  children: React.ReactNode
  icon?: React.ReactNode
  variant?: 'default' | 'danger'
  disabled?: boolean
}

export function DropdownMenuItem({
  onClick,
  children,
  icon,
  variant = 'default',
  disabled = false,
}: DropdownMenuItemProps) {
  const context = React.useContext(DropdownContext)

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick()
    }
    context?.close()
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={clsx(
        'w-full flex items-center gap-2 px-3 py-2 text-sm text-left',
        'transition-colors duration-150',
        {
          'text-gray-700 hover:bg-gray-50': variant === 'default' && !disabled,
          'text-red-600 hover:bg-red-50': variant === 'danger' && !disabled,
          'text-gray-400 cursor-not-allowed': disabled,
        }
      )}
    >
      {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  )
}

export function DropdownMenuSeparator() {
  return <div className="h-px bg-gray-200 my-1" />
}
