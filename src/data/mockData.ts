import { Post, Question, Comment, Answer, Category, CategoryTreeNode, Resource } from '@/types'

const POSTS_KEY = 'everyday_english_posts'
const QUESTIONS_KEY = 'everyday_english_questions'
const COMMENTS_KEY = 'everyday_english_comments'
const ANSWERS_KEY = 'everyday_english_answers'
const CATEGORIES_KEY = 'everyday_english_categories'
const RESOURCES_KEY = 'everyday_english_resources'

const initialPosts: Post[] = [
  {
    id: '1',
    title: '[공지] 2024년 겨울학기 수업 안내',
    content: '겨울학기 수업 일정을 안내드립니다.\n\n1. 수업 시작일: 2024년 1월 20일\n2. 수업 시간: 매주 월/수/금 오후 3시\n3. 준비물: 교재, 노트, 필기구\n\n많은 참여 부탁드립니다.',
    type: 'notice',
    author_id: 'teacher1',
    author_name: '김선생',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: '[공지] 설날 연휴 휴강 안내',
    content: '설날 연휴 기간 휴강 안내드립니다.\n\n휴강 기간: 2월 9일 ~ 2월 12일\n\n즐거운 명절 보내세요!',
    type: 'notice',
    author_id: 'teacher1',
    author_name: '김선생',
    created_at: '2024-01-14T09:00:00Z',
    updated_at: '2024-01-14T09:00:00Z',
  },
  {
    id: '3',
    title: '영어 단어 암기 팁 공유합니다',
    content: '효과적인 영어 단어 암기 방법을 공유합니다.\n\n1. 하루에 10개씩 꾸준히\n2. 예문과 함께 암기\n3. 복습은 1일, 3일, 7일 후에\n4. 직접 문장 만들어보기\n\n화이팅!',
    type: 'general',
    author_id: 'student1',
    author_name: '이학생',
    created_at: '2024-01-13T15:30:00Z',
    updated_at: '2024-01-13T15:30:00Z',
  },
  {
    id: '4',
    title: '이번 주 숙제 관련 질문',
    content: '숙제 범위가 어디까지인가요?\n교재 몇 페이지까지 해가면 되나요?',
    type: 'general',
    author_id: 'student2',
    author_name: '박학생',
    created_at: '2024-01-12T14:00:00Z',
    updated_at: '2024-01-12T14:00:00Z',
  },
  {
    id: '5',
    title: '스터디 그룹 모집합니다',
    content: '토익 스터디 그룹원 모집합니다.\n\n- 인원: 4명\n- 시간: 매주 토요일 오전 10시\n- 장소: 학원 스터디룸\n\n관심있으신 분 댓글 남겨주세요!',
    type: 'general',
    author_id: 'student3',
    author_name: '최학생',
    created_at: '2024-01-11T11:00:00Z',
    updated_at: '2024-01-11T11:00:00Z',
  },
]

const initialQuestions: Question[] = [
  {
    id: '1',
    title: 'to부정사와 동명사 구분이 어려워요',
    content: 'to부정사와 동명사를 언제 써야 하는지 구분이 안됩니다.\n\n예를 들어 want to go는 되는데 want going은 왜 안되나요?\n\n그리고 enjoy는 왜 동명사만 쓰나요?',
    status: 'answered',
    author_id: 'student1',
    author_name: '이학생',
    created_at: '2024-01-15T14:00:00Z',
    updated_at: '2024-01-15T15:00:00Z',
  },
  {
    id: '2',
    title: '관계대명사 which와 that의 차이',
    content: 'which와 that은 어떤 차이가 있나요?\n\n둘 다 사물을 가리킬 때 쓰는 것 같은데 언제 which를 쓰고 언제 that을 쓰나요?',
    status: 'answered',
    author_id: 'student2',
    author_name: '박학생',
    created_at: '2024-01-14T11:00:00Z',
    updated_at: '2024-01-14T13:00:00Z',
  },
  {
    id: '3',
    title: '현재완료 vs 과거시제',
    content: '현재완료와 과거시제를 구분하는 방법이 궁금합니다.\n\nI have eaten lunch와 I ate lunch의 차이가 뭔가요?',
    status: 'pending',
    author_id: 'student3',
    author_name: '최학생',
    created_at: '2024-01-13T16:30:00Z',
    updated_at: '2024-01-13T16:30:00Z',
  },
  {
    id: '4',
    title: '가정법 과거와 과거완료',
    content: '가정법이 너무 헷갈립니다.\n\nIf I were you와 If I had been you의 차이가 뭔가요?\n\n도와주세요!',
    status: 'pending',
    author_id: 'student1',
    author_name: '이학생',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
  },
  {
    id: '5',
    title: '분사구문 만드는 방법',
    content: '분사구문으로 문장을 바꾸는 방법을 알고 싶어요.\n\n접속사 + 주어 + 동사 형태를 어떻게 분사구문으로 바꾸나요?',
    status: 'pending',
    author_id: 'student2',
    author_name: '박학생',
    created_at: '2024-01-11T09:00:00Z',
    updated_at: '2024-01-11T09:00:00Z',
  },
]

// Initialize data in localStorage if not exists
const initializeData = () => {
  if (typeof window === 'undefined') return

  if (!localStorage.getItem(POSTS_KEY)) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(initialPosts))
  }
  if (!localStorage.getItem(QUESTIONS_KEY)) {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(initialQuestions))
  }
}

// Posts
export const getPosts = (): Post[] => {
  if (typeof window === 'undefined') return initialPosts
  initializeData()
  const data = localStorage.getItem(POSTS_KEY)
  return data ? JSON.parse(data) : initialPosts
}

export const getPostById = (id: string): Post | undefined => {
  return getPosts().find(p => p.id === id)
}

export const addPost = (post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Post => {
  const posts = getPosts()
  const newPost: Post = {
    ...post,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  posts.unshift(newPost)
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
  return newPost
}

export const updatePost = (id: string, data: Partial<Post>): Post | undefined => {
  const posts = getPosts()
  const index = posts.findIndex(p => p.id === id)
  if (index === -1) return undefined

  posts[index] = {
    ...posts[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
  return posts[index]
}

export const deletePost = (id: string): boolean => {
  const posts = getPosts()
  const filtered = posts.filter(p => p.id !== id)
  if (filtered.length === posts.length) return false
  localStorage.setItem(POSTS_KEY, JSON.stringify(filtered))
  return true
}

export const getRecentPosts = (count: number = 5): Post[] => {
  return getPosts()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, count)
}

// Questions
export const getQuestions = (): Question[] => {
  if (typeof window === 'undefined') return initialQuestions
  initializeData()
  const data = localStorage.getItem(QUESTIONS_KEY)
  return data ? JSON.parse(data) : initialQuestions
}

export const getQuestionById = (id: string): Question | undefined => {
  return getQuestions().find(q => q.id === id)
}

export const addQuestion = (question: Omit<Question, 'id' | 'created_at' | 'updated_at' | 'status'>): Question => {
  const questions = getQuestions()
  const newQuestion: Question = {
    ...question,
    id: crypto.randomUUID(),
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  questions.unshift(newQuestion)
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions))
  return newQuestion
}

export const updateQuestion = (id: string, data: Partial<Question>): Question | undefined => {
  const questions = getQuestions()
  const index = questions.findIndex(q => q.id === id)
  if (index === -1) return undefined

  questions[index] = {
    ...questions[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions))
  return questions[index]
}

export const deleteQuestion = (id: string): boolean => {
  const questions = getQuestions()
  const filtered = questions.filter(q => q.id !== id)
  if (filtered.length === questions.length) return false
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(filtered))
  return true
}

export const getRecentQuestions = (count: number = 5): Question[] => {
  return getQuestions()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, count)
}

// Comments
const initialComments: Comment[] = [
  { id: '1', post_id: '1', content: '감사합니다! 일정 확인했습니다.', author_id: 'student1', author_name: '이학생', created_at: '2024-01-15T11:00:00Z', updated_at: '2024-01-15T11:00:00Z' },
  { id: '2', post_id: '1', content: '겨울학기 기대됩니다~', author_id: 'student2', author_name: '박학생', created_at: '2024-01-15T12:00:00Z', updated_at: '2024-01-15T12:00:00Z' },
  { id: '3', post_id: '3', content: '좋은 정보 감사합니다!', author_id: 'student3', author_name: '최학생', created_at: '2024-01-13T16:00:00Z', updated_at: '2024-01-13T16:00:00Z' },
]

const initializeComments = () => {
  if (typeof window === 'undefined') return
  if (!localStorage.getItem(COMMENTS_KEY)) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(initialComments))
  }
}

export const getCommentsByPostId = (postId: string): Comment[] => {
  if (typeof window === 'undefined') return initialComments.filter(c => c.post_id === postId)
  initializeComments()
  const data = localStorage.getItem(COMMENTS_KEY)
  const comments: Comment[] = data ? JSON.parse(data) : initialComments
  return comments
    .filter(c => c.post_id === postId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
}

export const addComment = (comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): Comment => {
  initializeComments()
  const data = localStorage.getItem(COMMENTS_KEY)
  const comments: Comment[] = data ? JSON.parse(data) : initialComments
  const newComment: Comment = {
    ...comment,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  comments.push(newComment)
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments))
  return newComment
}

export const deleteComment = (id: string): boolean => {
  initializeComments()
  const data = localStorage.getItem(COMMENTS_KEY)
  const comments: Comment[] = data ? JSON.parse(data) : initialComments
  const filtered = comments.filter(c => c.id !== id)
  if (filtered.length === comments.length) return false
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(filtered))
  return true
}

// Answers
const initialAnswers: Answer[] = [
  {
    id: '1',
    question_id: '1',
    content: 'to부정사는 주로 미래지향적이거나 목적을 나타낼 때 사용하고, 동명사는 일반적인 사실이나 과거의 경험을 나타낼 때 사용합니다.\n\n예시:\n- I want to go (미래 희망) ✓\n- I enjoy swimming (일반적 취미) ✓\n\n특정 동사에 따라 to부정사 또는 동명사만 쓰이는 경우도 있으니 주요 동사들을 암기해두시면 좋습니다.',
    author_id: 'teacher1',
    author_name: '김선생',
    created_at: '2024-01-15T15:00:00Z',
    updated_at: '2024-01-15T15:00:00Z',
  },
  {
    id: '2',
    question_id: '2',
    content: 'which는 비제한적 용법(콤마 뒤)에서 주로 사용되고, that은 제한적 용법에서 사용됩니다.\n\n제한적: The book that I read was interesting.\n비제한적: The book, which I bought yesterday, was interesting.\n\n비제한적 용법에서는 that을 쓸 수 없습니다.',
    author_id: 'teacher1',
    author_name: '김선생',
    created_at: '2024-01-14T13:00:00Z',
    updated_at: '2024-01-14T13:00:00Z',
  },
]

const initializeAnswers = () => {
  if (typeof window === 'undefined') return
  if (!localStorage.getItem(ANSWERS_KEY)) {
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(initialAnswers))
  }
}

export const getAnswersByQuestionId = (questionId: string): Answer[] => {
  if (typeof window === 'undefined') return initialAnswers.filter(a => a.question_id === questionId)
  initializeAnswers()
  const data = localStorage.getItem(ANSWERS_KEY)
  const answers: Answer[] = data ? JSON.parse(data) : initialAnswers
  return answers
    .filter(a => a.question_id === questionId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
}

export const addAnswer = (answer: Omit<Answer, 'id' | 'created_at' | 'updated_at'>): Answer => {
  initializeAnswers()
  const data = localStorage.getItem(ANSWERS_KEY)
  const answers: Answer[] = data ? JSON.parse(data) : initialAnswers
  const newAnswer: Answer = {
    ...answer,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  answers.push(newAnswer)
  localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers))

  // Update question status to answered
  updateQuestion(answer.question_id, { status: 'answered' })

  return newAnswer
}

export const deleteAnswer = (id: string): boolean => {
  initializeAnswers()
  const data = localStorage.getItem(ANSWERS_KEY)
  const answers: Answer[] = data ? JSON.parse(data) : initialAnswers
  const filtered = answers.filter(a => a.id !== id)
  if (filtered.length === answers.length) return false
  localStorage.setItem(ANSWERS_KEY, JSON.stringify(filtered))
  return true
}

// Categories
const initialCategories: Category[] = [
  // 공유 자료실 - 최상위 카테고리
  {
    id: '1',
    name: '문법 자료',
    description: '영어 문법 관련 학습 자료',
    access: 'public',
    parent_id: null,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
  {
    id: '1-1',
    name: '기초 문법',
    description: '영어 기초 문법',
    access: 'public',
    parent_id: '1',
    created_at: '2024-01-10T11:00:00Z',
    updated_at: '2024-01-10T11:00:00Z',
  },
  {
    id: '1-2',
    name: '고급 문법',
    description: '영어 고급 문법',
    access: 'public',
    parent_id: '1',
    created_at: '2024-01-10T12:00:00Z',
    updated_at: '2024-01-10T12:00:00Z',
  },
  {
    id: '2',
    name: '어휘 자료',
    description: '영어 단어 및 어휘 학습 자료',
    access: 'public',
    parent_id: null,
    created_at: '2024-01-09T10:00:00Z',
    updated_at: '2024-01-09T10:00:00Z',
  },
  {
    id: '2-1',
    name: '토익 어휘',
    description: '토익 필수 어휘',
    access: 'public',
    parent_id: '2',
    created_at: '2024-01-09T11:00:00Z',
    updated_at: '2024-01-09T11:00:00Z',
  },
  // 선생님 자료실
  {
    id: '3',
    name: '수업 계획서',
    description: '선생님 전용 수업 계획 자료',
    access: 'teacher_only',
    parent_id: null,
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z',
  },
  {
    id: '3-1',
    name: '주간 계획',
    description: '주간 수업 계획',
    access: 'teacher_only',
    parent_id: '3',
    created_at: '2024-01-08T11:00:00Z',
    updated_at: '2024-01-08T11:00:00Z',
  },
]

const initializeCategories = () => {
  if (typeof window === 'undefined') return
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(initialCategories))
  }
}

export const getCategories = (): Category[] => {
  if (typeof window === 'undefined') return initialCategories
  initializeCategories()
  const data = localStorage.getItem(CATEGORIES_KEY)
  return data ? JSON.parse(data) : initialCategories
}

export const getCategoriesByAccess = (access: 'public' | 'teacher_only'): Category[] => {
  return getCategories().filter(c => c.access === access)
}

export const getPublicCategories = (): Category[] => {
  return getCategories().filter(c => c.access === 'public')
}

export const getTeacherCategories = (): Category[] => {
  return getCategories().filter(c => c.access === 'teacher_only')
}

// 트리 구조로 변환
export const buildCategoryTree = (categories: Category[]): CategoryTreeNode[] => {
  const map = new Map<string, CategoryTreeNode>()
  const roots: CategoryTreeNode[] = []

  // 모든 카테고리를 맵에 저장
  categories.forEach(cat => {
    map.set(cat.id, { ...cat, children: [] })
  })

  // 부모-자식 관계 설정
  categories.forEach(cat => {
    const node = map.get(cat.id)!
    if (cat.parent_id === null) {
      roots.push(node)
    } else {
      const parent = map.get(cat.parent_id)
      if (parent) {
        parent.children.push(node)
      } else {
        // 부모가 없으면 루트로 처리
        roots.push(node)
      }
    }
  })

  return roots
}

export const getPublicCategoryTree = (): CategoryTreeNode[] => {
  return buildCategoryTree(getPublicCategories())
}

export const getTeacherCategoryTree = (): CategoryTreeNode[] => {
  return buildCategoryTree(getTeacherCategories())
}

export const getCategoryById = (id: string): Category | undefined => {
  return getCategories().find(c => c.id === id)
}

export const getChildCategories = (parentId: string): Category[] => {
  return getCategories().filter(c => c.parent_id === parentId)
}

export const addCategory = (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Category => {
  initializeCategories()
  const categories = getCategories()
  const newCategory: Category = {
    ...category,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  categories.push(newCategory)
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
  return newCategory
}

export const updateCategory = (id: string, data: Partial<Category>): Category | undefined => {
  const categories = getCategories()
  const index = categories.findIndex(c => c.id === id)
  if (index === -1) return undefined

  categories[index] = {
    ...categories[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
  return categories[index]
}

export const deleteCategory = (id: string): boolean => {
  const categories = getCategories()
  // 하위 카테고리도 함께 삭제
  const toDelete = new Set<string>([id])

  const findChildren = (parentId: string) => {
    categories.forEach(c => {
      if (c.parent_id === parentId) {
        toDelete.add(c.id)
        findChildren(c.id)
      }
    })
  }
  findChildren(id)

  const filtered = categories.filter(c => !toDelete.has(c.id))
  if (filtered.length === categories.length) return false
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filtered))
  return true
}

// Resources (Files)
const getResources = (): Resource[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(RESOURCES_KEY)
  return data ? JSON.parse(data) : []
}

export const getResourcesByCategory = (categoryId: string): Resource[] => {
  return getResources().filter(r => r.category_id === categoryId)
}

export const getResourceById = (id: string): Resource | undefined => {
  return getResources().find(r => r.id === id)
}

export const addResource = (resource: Omit<Resource, 'id' | 'created_at'>): Resource => {
  const resources = getResources()
  const newResource: Resource = {
    ...resource,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }
  resources.push(newResource)
  localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources))
  return newResource
}

export const deleteResource = (id: string): boolean => {
  const resources = getResources()
  const filtered = resources.filter(r => r.id !== id)
  if (filtered.length === resources.length) return false
  localStorage.setItem(RESOURCES_KEY, JSON.stringify(filtered))
  return true
}

export const deleteResourcesByCategory = (categoryId: string): void => {
  const resources = getResources()
  const filtered = resources.filter(r => r.category_id !== categoryId)
  localStorage.setItem(RESOURCES_KEY, JSON.stringify(filtered))
}

// 파일 크기 포맷팅 헬퍼
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Legacy exports for compatibility
export const mockPosts = initialPosts
export const mockQuestions = initialQuestions
