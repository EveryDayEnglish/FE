'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import { getPosts } from '@/data/mockData'
import { Post, PostType } from '@/types'

export default function BoardPage() {
  const [filter, setFilter] = useState<'all' | PostType>('all')
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    setPosts(getPosts())
  }, [])

  const filteredPosts = filter === 'all'
    ? posts
    : posts.filter(post => post.type === filter)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <AppLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">게시판</h1>
          <Link
            href="/community/board/write"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            글쓰기
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
            <div className="flex gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`font-medium ${filter === 'all' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                전체
              </button>
              <button
                onClick={() => setFilter('notice')}
                className={`font-medium ${filter === 'notice' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                공지사항
              </button>
              <button
                onClick={() => setFilter('general')}
                className={`font-medium ${filter === 'general' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                일반
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredPosts.map(post => (
              <Link
                key={post.id}
                href={`/community/board/${post.id}`}
                className="block px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {post.type === 'notice' && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded">
                      공지
                    </span>
                  )}
                  <span className="text-gray-900 font-medium">{post.title}</span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <span>{post.author_name}</span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </Link>
            ))}
            {filteredPosts.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                게시글이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
