'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { UserProfile, UserRole } from '@/types'

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  isTeacher: boolean
  isStudent: boolean
  isLoggedIn: boolean
  signIn: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (username: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user storage key
const STORAGE_KEY = 'everyday_english_user'
const USERS_KEY = 'everyday_english_users'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem(STORAGE_KEY)
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const getUsers = (): UserProfile[] => {
    const users = localStorage.getItem(USERS_KEY)
    return users ? JSON.parse(users) : []
  }

  const saveUsers = (users: UserProfile[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }

  const signIn = async (username: string, _password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const users = getUsers()
    const foundUser = users.find(u => u.username === username)

    if (!foundUser) {
      return { success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' }
    }

    // In real app, we'd check password hash. For mock, just check if user exists
    setUser(foundUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foundUser))
    return { success: true }
  }

  const signUp = async (
    username: string,
    _password: string,
    name: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const users = getUsers()

    // Check if username already exists
    if (users.find(u => u.username === username)) {
      return { success: false, error: '이미 사용 중인 아이디입니다.' }
    }

    const newUser: UserProfile = {
      id: crypto.randomUUID(),
      username,
      name,
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    users.push(newUser)
    saveUsers(users)

    return { success: true }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
    isLoggedIn: !!user,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
