'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from './Header'
import Sidebar from './Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

const SIDEBAR_KEY = 'everyday_english_sidebar'

export default function AppLayout({ children }: AppLayoutProps) {
  const { isLoading, isLoggedIn } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_KEY)
    if (saved !== null) {
      setSidebarOpen(saved === 'true')
    }
  }, [])

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login')
    }
  }, [isLoading, isLoggedIn, router])

  const handleToggleSidebar = () => {
    const newState = !sidebarOpen
    setSidebarOpen(newState)
    localStorage.setItem(SIDEBAR_KEY, String(newState))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} />
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 p-6 w-full">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
