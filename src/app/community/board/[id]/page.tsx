'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import { getPostById, deletePost, getCommentsByPostId, addComment, deleteComment } from '@/data/mockData'
import { useAuth } from '@/contexts/AuthContext'
import { Post, Comment } from '@/types'

export default function BoardDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [post, setPost] = useState<Post | undefined>(undefined)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const foundPost = getPostById(params.id as string)
    setPost(foundPost)
    if (foundPost) {
      setComments(getCommentsByPostId(params.id as string))
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

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    addComment({
      content: newComment.trim(),
      post_id: params.id as string,
      author_id: user.id,
      author_name: user.name,
    })

    setNewComment('')
    setComments(getCommentsByPostId(params.id as string))
  }

  const handleDeleteComment = (commentId: string) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return
    deleteComment(commentId)
    setComments(getCommentsByPostId(params.id as string))
  }

  const handleDeletePost = () => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    deletePost(params.id as string)
    router.push('/community/board')
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

  if (!post) {
    return (
      <AppLayout>
        <div className="w-full">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">게시글을 찾을 수 없습니다.</p>
            <button
              onClick={() => router.push('/community/board')}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </AppLayout>
    )
  }

  const isAuthor = user?.id === post.author_id

  return (
    <AppLayout>
      <div className="w-full">
        {/* Back Button */}
        <button
          onClick={() => router.push('/community/board')}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>목록으로</span>
        </button>

        {/* Post Header */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              {post.type === 'notice' && (
                <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded">
                  공지
                </span>
              )}
              <h1 className="text-xl font-bold text-gray-900">{post.title}</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{post.author_name}</span>
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-6">
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Actions */}
          {isAuthor && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
              <Link
                href={`/community/board/${params.id}/edit`}
                className="text-blue-600 hover:text-blue-700"
              >
                수정
              </Link>
              <button
                onClick={handleDeletePost}
                className="text-red-600 hover:text-red-700"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">댓글 {comments.length}개</h2>
          </div>

          {/* Comment List */}
          <div className="divide-y divide-gray-100">
            {comments.map(comment => (
              <div key={comment.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{comment.author_name}</span>
                    <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                  </div>
                  {user?.id === comment.author_id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                댓글이 없습니다.
              </div>
            )}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                등록
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
