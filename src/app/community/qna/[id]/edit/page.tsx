'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { useAuth } from '@/contexts/AuthContext'
import { getQuestionById, updateQuestion } from '@/data/mockData'

export default function QnAEditPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const question = getQuestionById(params.id as string)
    if (!question) {
      setNotFound(true)
      setIsLoading(false)
      return
    }

    // Check if user is the author
    if (question.author_id !== user?.id) {
      router.push(`/community/qna/${params.id}`)
      return
    }

    setTitle(question.title)
    setContent(question.content)
    setIsLoading(false)
  }, [params.id, user?.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('제목을 입력해주세요.')
      return
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      updateQuestion(params.id as string, {
        title: title.trim(),
        content: content.trim(),
      })

      router.push(`/community/qna/${params.id}`)
    } catch {
      alert('수정에 실패했습니다.')
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="w-full">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (notFound) {
    return (
      <AppLayout>
        <div className="w-full">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">질문을 찾을 수 없습니다.</p>
            <button
              onClick={() => router.push('/community/qna')}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">질문 수정</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
          <div className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="질문 제목을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                maxLength={100}
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                내용
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="궁금한 내용을 자세히 작성해주세요"
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '수정 중...' : '수정'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
