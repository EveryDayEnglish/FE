'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface MenuItem {
  label: string
  href?: string
  icon: string
  children?: MenuItem[]
  teacherOnly?: boolean
}

const menuItems: MenuItem[] = [
  {
    label: '대시보드',
    href: '/dashboard',
    icon: '🏠',
  },
  {
    label: '자료실',
    icon: '📁',
    children: [
      {
        label: '선생님 자료실',
        href: '/resources/teacher',
        icon: '📚',
        teacherOnly: true,
      },
      {
        label: '공유 자료실',
        href: '/resources/shared',
        icon: '📂',
      },
    ],
  },
  {
    label: '커뮤니티',
    icon: '💬',
    children: [
      {
        label: '게시판',
        href: '/community/board',
        icon: '📋',
      },
      {
        label: 'Q&A',
        href: '/community/qna',
        icon: '❓',
      },
    ],
  },
]

interface SidebarProps {
  isOpen: boolean
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname()
  const { isTeacher } = useAuth()
  const [expandedItems, setExpandedItems] = useState<string[]>(['자료실', '커뮤니티'])

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    if (item.teacherOnly && !isTeacher) {
      return null
    }

    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.label)
    const paddingLeft = depth * 16 + 16

    if (hasChildren) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleExpand(item.label)}
            className="w-full flex items-center justify-between py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
            style={{ paddingLeft }}
          >
            <span className="flex items-center gap-2">
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </span>
            <span className={`transition-transform text-xs ${isExpanded ? 'rotate-90' : ''}`}>
              ▶
            </span>
          </button>
          {isExpanded && (
            <div className="ml-2">
              {item.children?.map(child => renderMenuItem(child, depth + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.href}
        href={item.href!}
        className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${
          isActive(item.href!)
            ? 'bg-blue-50 text-blue-600 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        style={{ paddingLeft }}
      >
        <span>{item.icon}</span>
        <span>{item.label}</span>
      </Link>
    )
  }

  if (!isOpen) {
    return null
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] flex-shrink-0">
      <nav className="p-4 space-y-1">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>
    </aside>
  )
}
