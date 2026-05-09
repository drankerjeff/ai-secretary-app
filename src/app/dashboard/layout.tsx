'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <AuthGuard>
      <div className="flex h-full min-h-screen bg-background">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-border-subtle bg-background-elevated lg:block">
          <Sidebar />
        </aside>

        {/* Mobile slide-in menu */}
        <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

        {/* Main column */}
        <div className="flex flex-1 flex-col min-w-0">
          <Header onMenuClick={() => setMobileOpen(true)} />

          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
