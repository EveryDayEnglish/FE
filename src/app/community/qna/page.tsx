'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import { getQuestions } from '@/data/mockData'
import { Question, QuestionStatus } from '@/types'

export default function QnAPage() {
  const [filter, setFilter] = useState<'all' | QuestionStatus>('all')
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    setQuestions(getQuestions())
  }, [])

  const filteredQuestions = filter === 'all'
    ? questions
    : questions.filter(q => q.status === filter)

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
          <h1 className="text-2xl font-bold text-gray-900">Q&A</h1>
          <Link
            href="/community/qna/write"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            질문하기
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
                onClick={() => setFilter('pending')}
                className={`font-medium ${filter === 'pending' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                대기중
              </button>
              <button
                onClick={() => setFilter('answered')}
                className={`font-medium ${filter === 'answered' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                답변완료
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredQuestions.map(question => (
              <Link
                key={question.id}
                href={`/community/qna/${question.id}`}
                className="block px-6 py-4 hover:bg-gray-50 transition-colors"
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
                  <span className="text-gray-900 font-medium">{question.title}</span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <span>{question.author_name}</span>
                  <span>{formatDate(question.created_at)}</span>
                </div>
              </Link>
            ))}
            {filteredQuestions.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                질문이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
