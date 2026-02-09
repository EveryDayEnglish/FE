// User Roles
export type UserRole = 'teacher' | 'student'

// User Profile
export interface UserProfile {
  id: string
  username: string
  name: string
  role: UserRole
  created_at: string
  updated_at: string
}

// Category Access Type
export type CategoryAccess = 'teacher_only' | 'public'

// Category
export interface Category {
  id: string
  name: string
  description: string | null
  access: CategoryAccess
  parent_id: string | null  // null이면 최상위 카테고리
  created_at: string
  updated_at: string
}

// Tree 구조용 카테고리
export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[]
}

// File/Resource
export interface Resource {
  id: string
  name: string
  file_data: string  // Base64 encoded file data
  file_size: number
  file_type: string
  category_id: string
  uploaded_by: string
  uploaded_by_name: string
  created_at: string
}

// Post Type
export type PostType = 'notice' | 'general'

// Post
export interface Post {
  id: string
  title: string
  content: string
  type: PostType
  author_id: string
  author_name?: string
  created_at: string
  updated_at: string
}

// Comment
export interface Comment {
  id: string
  content: string
  post_id: string
  author_id: string
  author_name?: string
  created_at: string
  updated_at: string
}

// Question Status
export type QuestionStatus = 'pending' | 'answered'

// Question (Q&A)
export interface Question {
  id: string
  title: string
  content: string
  status: QuestionStatus
  author_id: string
  author_name?: string
  created_at: string
  updated_at: string
}

// Answer
export interface Answer {
  id: string
  content: string
  question_id: string
  author_id: string
  author_name?: string
  created_at: string
  updated_at: string
}
