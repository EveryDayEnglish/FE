'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import { getRecentPosts, getRecentQuestions } from '@/data/mockData'
import { Post, Question } from '@/types'

export default function DashboardPage() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([])

  useEffect(() => {
    setRecentPosts(getRecentPosts(5))
    setRecentQuestions(getRecentQuestions(5))
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <AppLayout>
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">대시보드</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 최근 게시글 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">최근 게시글</h2>
              <Link href="/community/board" className="text-sm text-blue-600 hover:text-blue-700">
                더보기 →
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentPosts.map(post => (
                <Link
                  key={post.id}
                  href={`/community/board/${post.id}`}
                  className="block px-6 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {post.type === 'notice' && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded">
                        공지
                      </span>
                    )}
                    <span className="text-gray-900 truncate flex-1">{post.title}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <span>{post.author_name}</span>
                    <span>·</span>
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </Link>
              ))}
              {recentPosts.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">
                  게시글이 없습니다.
                </div>
              )}
            </div>
          </div>

          {/* 최근 Q&A */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">최근 Q&A</h2>
              <Link href="/community/qna" className="text-sm text-blue-600 hover:text-blue-700">
                더보기 →
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentQuestions.map(question => (
                <Link
                  key={question.id}
                  href={`/community/qna/${question.id}`}
                  className="block px-6 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${
                        question.status === 'answered'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {question.status === 'answered' ? '답변완료' : '대기중'}
                    </span>
                    <span className="text-gray-900 truncate flex-1">{question.title}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <span>{question.author_name}</span>
                    <span>·</span>
                    <span>{formatDate(question.created_at)}</span>
                  </div>
                </Link>
              ))}
              {recentQuestions.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">
                  질문이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
