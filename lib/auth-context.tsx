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
  login: (method: AuthMethod, userData?: Partial<User>, token?: string) => Promise<void>
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
      console.log('🔍 AuthProvider: Checking authentication...');
      
      try {
        const savedUser = cookieUtils.getAuthUser()
        const authToken = cookieUtils.getAuthToken()        
        
        console.log('🔍 AuthProvider: Saved user:', savedUser ? 'exists' : 'null');
        console.log('🔍 AuthProvider: Auth token:', authToken ? 'exists' : 'null');
        
        if (savedUser && authToken) {
          // Set saved user first for immediate UI
          setUser(savedUser)
          console.log('🔍 AuthProvider: Set saved user for immediate UI');
          
          // Then fetch fresh user data from API to ensure role is up to date
          try {
            const response = await fetch('/api/user', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
              }
            })

            if (response.ok) {
              const freshUserData = await response.json()
              const userData = freshUserData.data
              
              console.log('🔍 AuthProvider: Fresh user data received:', userData);
              
              // Use the user data directly from the data object
              const actualUserData = userData
              
              // Update with fresh data
              const updatedUser: User = {
                id: actualUserData.id || actualUserData.employeeId || savedUser.id,
                email: actualUserData.email || savedUser.email,
                displayName: actualUserData.displayName || actualUserData.givenName || savedUser.displayName,
                givenName: actualUserData.givenName || savedUser.givenName,
                surename: actualUserData.surename || savedUser.surename,
                userRoleID: actualUserData.userRoleID,
                userRoleName: actualUserData.userRoleName,
                departmentID: actualUserData.departmentID,
                departmentName: actualUserData.departmentName,
                jobTitle: actualUserData.jobTitle,
                projectIDs: actualUserData.projectIDs,
                createBy: actualUserData.createBy,
                createDate: actualUserData.createDate,
                updateBy: actualUserData.updateBy,
                updateDate: actualUserData.updateDate,
                isActive: actualUserData.isActive,
                // Preserve agency-specific fields if they exist
                agencyID: actualUserData.agencyID || savedUser.agencyID,
                agencyName: actualUserData.agencyName || savedUser.agencyName,
                agencyType: actualUserData.agencyType || savedUser.agencyType,
                agencyTypeID: actualUserData.agencyTypeID || savedUser.agencyTypeID,
                refCode: actualUserData.refCode || savedUser.refCode
              }
              
              console.log('🔍 AuthProvider: Updated user object:', updatedUser);
              
              // Validate userRoleID - must be 1, 2, or 3
              if (!actualUserData?.userRoleID || ![1, 2, 3].includes(actualUserData.userRoleID)) {
                console.error('❌ Invalid or missing userRoleID detected:', actualUserData?.userRoleID, '- Logging out user')
                logout()
                return
              }
              
              setUser(updatedUser)
              cookieUtils.setAuthUser(updatedUser)
              console.log('🔍 AuthProvider: Successfully updated user data');
            } else {
              console.error('❌ AuthProvider: API response not ok:', response.status, response.statusText);
              const errorText = await response.text();
              console.error('❌ AuthProvider: Error details:', errorText);
            }
          } catch (apiError) {
            console.warn('⚠️ AuthProvider: Could not refresh user data from API:', apiError)
            console.log('🔍 AuthProvider: Keeping saved user data as fallback');
            // Keep using saved user data if API fails
          }
        }
      } catch (error) {
        console.error('❌ AuthProvider: Error checking authentication:', error)
        cookieUtils.removeAuthUser()
      } finally {
        setIsLoading(false)
        console.log('🔍 AuthProvider: Authentication check completed');
      }
    }    

    checkAuth()
  }, [])

  const login = async (method: AuthMethod, userData?: Partial<User>, token?: string) => {
    console.log('🔄 User data:', userData)
    
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
      isActive: userData?.isActive || false,
      // Agency-specific fields (if provided)
      agencyID: userData?.agencyID,
      agencyName: userData?.agencyName,
      agencyType: userData?.agencyType,
      agencyTypeID: userData?.agencyTypeID,
      refCode: userData?.refCode
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