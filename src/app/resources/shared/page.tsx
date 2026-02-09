'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AppLayout from '@/components/layout/AppLayout'
import {
  getPublicCategoryTree,
  getPublicCategories,
  addCategory,
  deleteCategory,
  getResourcesByCategory,
  addResource,
  deleteResource,
  formatFileSize
} from '@/data/mockData'
import { CategoryTreeNode, CategoryAccess, Resource } from '@/types'

interface CategoryTreeItemProps {
  node: CategoryTreeNode
  level: number
  expandedIds: Set<string>
  selectedCategoryId: string | null
  onToggle: (id: string) => void
  onSelect: (id: string) => void
  onAddChild?: (parentId: string) => void
  onDelete?: (id: string, name: string) => void
  isTeacher: boolean
}

function CategoryTreeItem({
  node,
  level,
  expandedIds,
  selectedCategoryId,
  onToggle,
  onSelect,
  onAddChild,
  onDelete,
  isTeacher
}: CategoryTreeItemProps) {
  const isExpanded = expandedIds.has(node.id)
  const hasChildren = node.children.length > 0
  const isSelected = selectedCategoryId === node.id

  return (
    <div>
      <div
        className={`flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer ${isSelected ? 'bg-green-50' : ''}`}
        style={{ paddingLeft: `${level * 24 + 12}px` }}
        onClick={() => onSelect(node.id)}
      >
        <div className="flex items-center gap-2 flex-1">
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggle(node.id)
              }}
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <svg
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <div className="w-6 h-6" />
          )}
          <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <span className={`font-medium ${isSelected ? 'text-green-600' : 'text-gray-900'}`}>{node.name}</span>
          </div>
        </div>
        {isTeacher && (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAddChild?.(node.id)
              }}
              className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
              title="하위 카테고리 추가"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(node.id, node.name)
              }}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
              title="삭제"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div>
          {node.children.map(child => (
            <CategoryTreeItem
              key={child.id}
              node={child}
              level={level + 1}
              expandedIds={expandedIds}
              selectedCategoryId={selectedCategoryId}
              onToggle={onToggle}
              onSelect={onSelect}
              onAddChild={onAddChild}
              onDelete={onDelete}
              isTeacher={isTeacher}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function SharedResourcesPage() {
  const { user, isTeacher } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [categoryTree, setCategoryTree] = useState<CategoryTreeNode[]>([])
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [files, setFiles] = useState<Resource[]>([])

  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [parentId, setParentId] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDesc, setNewCategoryDesc] = useState('')

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    if (selectedCategoryId) {
      setFiles(getResourcesByCategory(selectedCategoryId))
    } else {
      setFiles([])
    }
  }, [selectedCategoryId])

  const loadCategories = () => {
    setCategoryTree(getPublicCategoryTree())
    const allCategories = getPublicCategories()
    const rootIds = allCategories.filter(c => c.parent_id === null).map(c => c.id)
    setExpandedIds(prev => new Set([...prev, ...rootIds]))
  }

  const handleToggle = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleSelectCategory = (id: string) => {
    setSelectedCategoryId(id)
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      alert('카테고리 이름을 입력해주세요.')
      return
    }

    addCategory({
      name: newCategoryName.trim(),
      description: newCategoryDesc.trim() || null,
      access: 'public' as CategoryAccess,
      parent_id: parentId,
    })

    loadCategories()
    if (parentId) {
      setExpandedIds(prev => new Set([...prev, parentId]))
    }
    setNewCategoryName('')
    setNewCategoryDesc('')
    setParentId(null)
    setShowCategoryModal(false)
  }

  const handleAddChild = (parentIdToAdd: string) => {
    setParentId(parentIdToAdd)
    setShowCategoryModal(true)
  }

  const handleDeleteCategory = (id: string, name: string) => {
    if (!confirm(`"${name}" 카테고리와 하위 카테고리, 파일을 모두 삭제하시겠습니까?`)) return
    deleteCategory(id)
    if (selectedCategoryId === id) {
      setSelectedCategoryId(null)
    }
    loadCategories()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedCategoryId || !user) return

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하만 업로드 가능합니다.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      addResource({
        name: file.name,
        file_data: base64,
        file_size: file.size,
        file_type: file.type,
        category_id: selectedCategoryId,
        uploaded_by: user.id,
        uploaded_by_name: user.name,
      })
      setFiles(getResourcesByCategory(selectedCategoryId))
    }
    reader.readAsDataURL(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDownload = (resource: Resource) => {
    const link = document.createElement('a')
    link.href = resource.file_data
    link.download = resource.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDeleteFile = (id: string, name: string) => {
    if (!confirm(`"${name}" 파일을 삭제하시겠습니까?`)) return
    deleteResource(id)
    if (selectedCategoryId) {
      setFiles(getResourcesByCategory(selectedCategoryId))
    }
  }

  const getParentName = (id: string | null): string => {
    if (!id) return ''
    const allCategories = getPublicCategories()
    const parent = allCategories.find(c => c.id === id)
    return parent?.name || ''
  }

  const getSelectedCategoryName = (): string => {
    if (!selectedCategoryId) return ''
    const allCategories = getPublicCategories()
    const category = allCategories.find(c => c.id === selectedCategoryId)
    return category?.name || ''
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
    if (fileType.includes('pdf')) {
      return (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
    return (
      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }

  return (
    <AppLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">공유 자료실</h1>
          {isTeacher && (
            <button
              onClick={() => {
                setParentId(null)
                setShowCategoryModal(true)
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              최상위 카테고리 추가
            </button>
          )}
        </div>

        <div className="flex gap-6">
          {/* 카테고리 트리 */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white shadow rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">카테고리</h2>
              </div>
              {categoryTree.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  카테고리가 없습니다.
                </div>
              ) : (
                <div className="p-2">
                  {categoryTree.map(node => (
                    <CategoryTreeItem
                      key={node.id}
                      node={node}
                      level={0}
                      expandedIds={expandedIds}
                      selectedCategoryId={selectedCategoryId}
                      onToggle={handleToggle}
                      onSelect={handleSelectCategory}
                      onAddChild={handleAddChild}
                      onDelete={handleDeleteCategory}
                      isTeacher={isTeacher}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 파일 목록 */}
          <div className="flex-1">
            <div className="bg-white shadow rounded-lg">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-gray-900">
                  {selectedCategoryId ? `${getSelectedCategoryName()} 파일` : '카테고리를 선택하세요'}
                </h2>
                {selectedCategoryId && isTeacher && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                    >
                      파일 업로드
                    </button>
                  </>
                )}
              </div>

              {!selectedCategoryId ? (
                <div className="p-8 text-center text-gray-500">
                  왼쪽에서 카테고리를 선택하면 파일 목록이 표시됩니다.
                </div>
              ) : files.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  이 카테고리에 파일이 없습니다.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {files.map(file => (
                    <div key={file.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.file_type)}
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.file_size)} · {file.uploaded_by_name} · {formatDate(file.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(file)}
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                          title="다운로드"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                        {isTeacher && (
                          <button
                            onClick={() => handleDeleteFile(file.id, file.name)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                            title="삭제"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Category Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {parentId ? '하위 카테고리 추가' : '최상위 카테고리 추가'}
                </h2>
                {parentId && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-500">상위 카테고리: </span>
                    <span className="text-sm font-medium text-gray-900">{getParentName(parentId)}</span>
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      카테고리 이름 *
                    </label>
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="카테고리 이름을 입력하세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      설명 (선택)
                    </label>
                    <textarea
                      value={newCategoryDesc}
                      onChange={(e) => setNewCategoryDesc(e.target.value)}
                      placeholder="카테고리 설명을 입력하세요"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    공유 자료실에 추가되는 카테고리는 전체 공개됩니다.
                  </p>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowCategoryModal(false)
                    setNewCategoryName('')
                    setNewCategoryDesc('')
                    setParentId(null)
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
