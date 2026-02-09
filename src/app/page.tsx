'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const { isLoggedIn, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push('/dashboard')
    }
  }, [isLoggedIn, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <main className="text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          EveryDay English
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          학원 자료 관리 및 커뮤니티 플랫폼
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            회원가입
          </Link>
        </div>
      </main>
    </div>
  )
}
