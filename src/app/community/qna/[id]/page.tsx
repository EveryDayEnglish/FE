'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import { getQuestionById, deleteQuestion, getAnswersByQuestionId, addAnswer, deleteAnswer } from '@/data/mockData'
import { useAuth } from '@/contexts/AuthContext'
import { Question, Answer } from '@/types'

export default function QnADetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isTeacher } = useAuth()
  const [question, setQuestion] = useState<Question | undefined>(undefined)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [newAnswer, setNewAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const foundQuestion = getQuestionById(params.id as string)
    setQuestion(foundQuestion)
    if (foundQuestion) {
      setAnswers(getAnswersByQuestionId(params.id as string))
    }
    setIsLoading(false)
  }, [params.id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAnswer.trim() || !user) return

    addAnswer({
      content: newAnswer.trim(),
      question_id: params.id as string,
      author_id: user.id,
      author_name: user.name,
    })

    setNewAnswer('')
    // Reload data to reflect changes including status update
    const updatedQuestion = getQuestionById(params.id as string)
    setQuestion(updatedQuestion)
    setAnswers(getAnswersByQuestionId(params.id as string))
  }

  const handleDeleteAnswer = (answerId: string) => {
    if (!confirm('답변을 삭제하시겠습니까?')) return
    deleteAnswer(answerId)
    setAnswers(getAnswersByQuestionId(params.id as string))
  }

  const handleDeleteQuestion = () => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    deleteQuestion(params.id as string)
    router.push('/community/qna')
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

  if (!question) {
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

  const isAuthor = user?.id === question.author_id

  return (
    <AppLayout>
      <div className="w-full">
        {/* Back Button */}
        <button
          onClick={() => router.push('/community/qna')}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>목록으로</span>
        </button>

        {/* Question Header */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded ${
                  question.status === 'answered'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}
              >
                {question.status === 'answered' ? '답변완료' : '대기중'}
              </span>
              <h1 className="text-xl font-bold text-gray-900">{question.title}</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{question.author_name}</span>
              <span>{formatDate(question.created_at)}</span>
            </div>
          </div>

          {/* Question Content */}
          <div className="p-6">
            <p className="text-gray-700 whitespace-pre-wrap">{question.content}</p>
          </div>

          {/* Actions */}
          {isAuthor && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
              <Link
                href={`/community/qna/${params.id}/edit`}
                className="text-blue-600 hover:text-blue-700"
              >
                수정
              </Link>
              <button
                onClick={handleDeleteQuestion}
                className="text-red-600 hover:text-red-700"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {/* Answers Section */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">답변 {answers.length}개</h2>
          </div>

          {/* Answer List */}
          <div className="divide-y divide-gray-100">
            {answers.map(answer => (
              <div key={answer.id} className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded">
                      선생님
                    </span>
                    <span className="font-medium text-gray-900">{answer.author_name}</span>
                    <span className="text-sm text-gray-500">{formatDate(answer.created_at)}</span>
                  </div>
                  {user?.id === answer.author_id && (
                    <button
                      onClick={() => handleDeleteAnswer(answer.id)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{answer.content}</p>
              </div>
            ))}
            {answers.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                아직 답변이 없습니다.
              </div>
            )}
          </div>

          {/* Answer Form - Only for teachers */}
          {isTeacher && (
            <form onSubmit={handleSubmitAnswer} className="p-4 border-t border-gray-200">
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="답변을 입력하세요"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  답변 등록
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
