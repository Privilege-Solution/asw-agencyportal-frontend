"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { cookieUtils } from './cookie-utils'

export type AuthMethod = 'microsoft' | 'email'

export interface User {
  id: string
  email: string
  name: string
  authMethod: AuthMethod
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (method: AuthMethod, userData?: Partial<User>, token?: string) => void
  logout: () => void
  setAuthMethod: (method: AuthMethod | null) => void
  currentAuthMethod: AuthMethod | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentAuthMethod, setCurrentAuthMethod] = useState<AuthMethod | null>(null)

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = cookieUtils.getAuthUser()
        if (savedUser) {
          setUser(savedUser)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        cookieUtils.removeAuthUser()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = (method: AuthMethod, userData?: Partial<User>, token?: string) => {
    const newUser: User = {
      id: userData?.id || 'user-' + Date.now(),
      email: userData?.email || '',
      name: userData?.name || userData?.email || 'User',
      authMethod: method
    }
    
    setUser(newUser)
    cookieUtils.setAuthUser(newUser)
    
    // Store auth token if provided
    if (token) {
      cookieUtils.setAuthToken(token)
    }
    
    setCurrentAuthMethod(null) // Reset auth method selection
  }

  const logout = () => {
    setUser(null)
    cookieUtils.clearAllAuthCookies()
    setCurrentAuthMethod(null)
    
    // Additional cleanup for Microsoft auth if needed
    if (user?.authMethod === 'microsoft') {
      // MSAL logout will be handled in the Microsoft component
    }
  }

  const setAuthMethod = (method: AuthMethod | null) => {
    setCurrentAuthMethod(method)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    setAuthMethod,
    currentAuthMethod
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 