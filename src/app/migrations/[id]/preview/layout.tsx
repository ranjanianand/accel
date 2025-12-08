import { ReactNode } from 'react'

export default function PreviewLayout({
  children,
}: {
  children: ReactNode
}) {
  // This layout completely bypasses the parent migration detail layout
  // Preview page will render as a standalone full-page experience
  // No Header, No MigrationHeader, No TabNavigation - just the preview page
  return <>{children}</>
}
