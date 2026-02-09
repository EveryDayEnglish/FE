'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface HeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export default function Header({ sidebarOpen, onToggleSidebar }: HeaderProps) {
  const { user, isTeacher, isLoggedIn, signOut } = useAuth()

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Section - Toggle + Logo */}
          <div className="flex items-center">
            {isLoggedIn && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors mr-2"
                title={sidebarOpen ? '사이드바 닫기' : '사이드바 열기'}
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {sidebarOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            )}

            <Link href={isLoggedIn ? "/dashboard" : "/"} className="text-xl font-bold text-blue-600">
              EveryDay English
            </Link>
          </div>

          {/* Center Section - Navigation */}
          {isLoggedIn && (
            <nav className="hidden md:flex items-center gap-6">
              {isTeacher && (
                <Link
                  href="/resources/teacher"
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  선생님 자료실
                </Link>
              )}
              <Link
                href="/resources/shared"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                공유 자료실
              </Link>
              <Link
                href="/community/board"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                게시판
              </Link>
              <Link
                href="/community/qna"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Q&A
              </Link>
            </nav>
          )}

          {/* Right Section - User Info */}
          {isLoggedIn && (
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-sm">
                <span className="font-medium">{user?.name}</span>
                <span className="ml-1 text-gray-400">({isTeacher ? '선생님' : '학생'})</span>
              </span>
              <button
                onClick={signOut}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
