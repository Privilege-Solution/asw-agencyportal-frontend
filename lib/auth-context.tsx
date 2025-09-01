"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { cookieUtils } from './cookie-utils'
import { UserRole, USER_ROLES } from './types/roles'
import { hasPermission, canAccessView, getUserPermissions, getUserViews } from './rbac'
import type { Permission, View } from './types/roles'
import { User } from '@/app/types'

export type AuthMethod = 'microsoft' | 'email'

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

  // Check for existing authentication on mount and fetch fresh user data
  useEffect(() => {
    const checkAuth = async () => {      
      try {
        const savedUser = cookieUtils.getAuthUser()
        const authToken = cookieUtils.getAuthToken()
        
        if (savedUser && authToken) {
          // Set saved user first for immediate UI
          setUser(savedUser)
          
          // Then fetch fresh user data from API to ensure role is up to date
          try {
            const response = await fetch('/api/user', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            })

            if (response.ok) {
              const freshUserData = await response.json()
              const userData = freshUserData.data
              console.log('🔄 Refreshed user data from API:', userData)
              console.log('📊 Role mapping check:', {
                apiUserRoleID: userData.userRoleID,
                apiMappedRole: userData.userRoleName,
                savedUserRole: savedUser.userRoleName
              })
              
              // Update with fresh data
              const updatedUser: User = {
                id: userData.id || userData.employeeId || savedUser.id,
                email: userData.email || savedUser.email,
                displayName: userData.displayName || userData.givenName || savedUser.displayName,
                givenName: userData.givenName || savedUser.givenName,
                surename: userData.surename || savedUser.surename,
                userRoleID: userData.userRoleID,
                userRoleName: userData.userRoleName,
                departmentID: userData.departmentID,
                departmentName: userData.departmentName,
                jobTitle: userData.jobTitle,
                projectIDs: userData.projectIDs,
                createBy: userData.createBy,
                createDate: userData.createDate,
                updateBy: userData.updateBy,
                updateDate: userData.updateDate,
                isActive: userData.isActive
              }

              console.log('ffetched user data', userData);
              
              // Validate userRoleID - must be 1, 2, or 3
              if (![1, 2, 3].includes(userData.userRoleID)) {
                console.error('❌ Invalid userRoleID detected:', userData.userRoleID, '- Logging out user')
                logout()
                return
              }
              
              console.log('✅ Updated user with fresh data:', {
                userRoleID: updatedUser.userRoleID,
                role: updatedUser.userRoleID === 1 ? USER_ROLES.SUPER_ADMIN : updatedUser.userRoleID === 2 ? USER_ROLES.ADMIN : USER_ROLES.AGENCY,
                userRoleName: updatedUser.userRoleName
              })
              
              setUser(updatedUser)
              cookieUtils.setAuthUser(updatedUser)
            }
          } catch (apiError) {
            console.warn('Could not refresh user data from API:', apiError)
            // Keep using saved user data if API fails
          }
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
    console.log('🔄 User data:', userData)
    
    const userData2 = fetch('/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log('🔄 User data2:', data)
    })
    
    // Validate userRoleID - must be 1, 2, or 3 (null/undefined not allowed)
    if (!userData?.userRoleID || ![1, 2, 3].includes(userData.userRoleID)) {
      console.error('❌ Invalid or missing userRoleID detected:', userData?.userRoleID, '- Login denied')
      return // Don't login, don't logout (user was never logged in)
    }
    
    // Map userRoleID to role
    const role: UserRole = userData.userRoleID === 1 ? USER_ROLES.SUPER_ADMIN : 
                          userData.userRoleID === 2 ? USER_ROLES.ADMIN : 
                          USER_ROLES.AGENCY

    console.log('🔄 Login mapping:', {
      userRoleID: userData.userRoleID,
      finalRole: role,
      mapping: `userRoleID ${userData.userRoleID} -> role ${role}`
    })

    const newUser: User = {
      id: userData?.id || 'user-' + Date.now(),
      email: userData?.email || '',
      displayName: userData?.displayName || userData?.givenName || userData?.surename || 'User',
      givenName: userData?.givenName || '',
      surename: userData?.surename || '',
      userRoleID: userData?.userRoleID || 0,
      userRoleName: userData?.userRoleName || '',
      departmentID: userData?.departmentID || 0,
      departmentName: userData?.departmentName || '',
      jobTitle: userData?.jobTitle || '',
      projectIDs: userData?.projectIDs || [],
      createBy: userData?.createBy || '',
      createDate: userData?.createDate || '',
      updateBy: userData?.updateBy || '',
      updateDate: userData?.updateDate || '',
      isActive: userData?.isActive || false
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
    if (user?.userRoleID === 1) {
      // MSAL logout will be handled in the Microsoft component
    }
  }

  const setAuthMethod = (method: AuthMethod | null) => {
    setCurrentAuthMethod(method)
  }

  // Role-based helper functions
  const userHasPermission = (permission: Permission) => {
    if (!user || !user.userRoleID) return false
    return hasPermission(user.userRoleID as UserRole, permission)
  }

  const userCanAccessView = (view: View) => {
    if (!user || !user.userRoleID) return false
    return canAccessView(user.userRoleID as UserRole, view)
  }

  const userGetPermissions = () => {
    if (!user || !user.userRoleID) return []
    return getUserPermissions(user.userRoleID as UserRole)
  }

  const userGetViews = () => {
    if (!user || !user.userRoleID) return []
    return getUserViews(user.userRoleID as UserRole)
  }

  const userIsSuperAdmin = () => {
    if (!user) return false
    return user.userRoleID === USER_ROLES.SUPER_ADMIN
  }

  const userIsAdmin = () => {
    if (!user) return false
    return user.userRoleID === USER_ROLES.ADMIN || user.userRoleID === USER_ROLES.SUPER_ADMIN
  }

  const userIsAgency = () => {
    if (!user) return false
    return user.userRoleID === USER_ROLES.AGENCY
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