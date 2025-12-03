import { Header } from '@/components/layout/header'
import { SettingsNav } from '@/components/settings/settings-nav'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Settings</h1>
          <p className="text-sm text-foreground-secondary mt-2">
            Manage your account, team, and notification preferences
          </p>
        </div>

        <SettingsNav />

        <div className="mt-6">{children}</div>
      </main>
    </>
  )
}
