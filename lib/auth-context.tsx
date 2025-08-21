"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { cookieUtils } from './cookie-utils'
import { UserRole, USER_ROLES } from './types/roles'
import { hasPermission, canAccessView, getUserPermissions, getUserViews } from './rbac'
import type { Permission, View } from './types/roles'

export type AuthMethod = 'microsoft' | 'email'

export interface User {
  id: string
  email: string
  name: string
  authMethod: AuthMethod
  role: UserRole
  subRole?: string
  agencyId?: string
  // API response fields
  userRoleID?: number
  userRoleName?: string
  departmentID?: number
  departmentName?: string
  jobTitle?: string
  projectIDs?: number[]
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (method: AuthMethod, userData?: Partial<User>, token?: string) => void
  logout: () => void
  setAuthMethod: (method: AuthMethod | null) => void
  currentAuthMethod: AuthMethod | null
  // Role-based helper functions
  hasPermission: (permission: Permission) => boolean
  canAccessView: (view: View) => boolean
  getUserPermissions: () => Permission[]
  getUserViews: () => View[]
  isSuperAdmin: () => boolean
  isAdmin: () => boolean
  isAgency: () => boolean
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
    // Map userRoleID to our role system (for backward compatibility)
    let role: UserRole = USER_ROLES.AGENCY // Default role
    
    if (userData?.userRoleID === 1 || userData?.role === USER_ROLES.SUPER_ADMIN) {
      role = USER_ROLES.SUPER_ADMIN
    } else if (userData?.userRoleID === 2 || userData?.role === USER_ROLES.ADMIN) {
      role = USER_ROLES.ADMIN
    } else if (userData?.userRoleID === 3 || userData?.role === USER_ROLES.AGENCY) {
      role = USER_ROLES.AGENCY
    }

    const newUser: User = {
      id: userData?.id || 'user-' + Date.now(),
      email: userData?.email || '',
      name: userData?.name || userData?.email || 'User',
      authMethod: method,
      role,
      subRole: userData?.subRole,
      agencyId: userData?.agencyId,
      // Preserve API fields
      userRoleID: userData?.userRoleID,
      userRoleName: userData?.userRoleName,
      departmentID: userData?.departmentID,
      departmentName: userData?.departmentName,
      jobTitle: userData?.jobTitle,
      projectIDs: userData?.projectIDs
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

  // Role-based helper functions
  const userHasPermission = (permission: Permission) => {
    if (!user) return false
    return hasPermission(user.role, permission)
  }

  const userCanAccessView = (view: View) => {
    if (!user) return false
    return canAccessView(user.role, view)
  }

  const userGetPermissions = () => {
    if (!user) return []
    return getUserPermissions(user.role)
  }

  const userGetViews = () => {
    if (!user) return []
    return getUserViews(user.role)
  }

  const userIsSuperAdmin = () => {
    if (!user) return false
    return user.role === USER_ROLES.SUPER_ADMIN
  }

  const userIsAdmin = () => {
    if (!user) return false
    return user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPER_ADMIN
  }

  const userIsAgency = () => {
    if (!user) return false
    return user.role === USER_ROLES.AGENCY
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    setAuthMethod,
    currentAuthMethod,
    hasPermission: userHasPermission,
    canAccessView: userCanAccessView,
    getUserPermissions: userGetPermissions,
    getUserViews: userGetViews,
    isSuperAdmin: userIsSuperAdmin,
    isAdmin: userIsAdmin,
    isAgency: userIsAgency
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