"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { UserRole, Permission, View } from '@/lib/types/roles'
import { ROLE_NAMES } from '@/lib/types/roles'

interface RoleProtectionOptions {
  requiredRole?: UserRole
  allowedRoles?: UserRole[]
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  requiredView?: View
  requiredViews?: View[]
  redirectTo?: string
  showAccessDenied?: boolean
}

/**
 * Higher-order component for role-based route protection
 */
export function withRoleProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: RoleProtectionOptions = {}
) {
  const {
    requiredRole,
    allowedRoles,
    requiredPermission,
    requiredPermissions = [],
    requiredView,
    requiredViews = [],
    redirectTo = '/auth/login',
    showAccessDenied = true
  } = options

  return function ProtectedComponent(props: P) {
    const { user, isLoading, hasPermission, canAccessView } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !user) {
        // Not authenticated - redirect to login
        router.push(redirectTo)
        return
      }

      if (user && !checkAccess()) {
        // Authenticated but no access - redirect or show access denied
        if (showAccessDenied) {
          router.push('/access-denied')
        } else {
          router.push('/dashboard')
        }
      }
    }, [user, isLoading, router])

    const checkAccess = (): boolean => {
      if (!user) return false

      // Check role-based access
      if (requiredRole && user.role > requiredRole) {
        return false
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        return false
      }

      // Check permission-based access
      if (requiredPermission && !hasPermission(requiredPermission)) {
        return false
      }

      if (requiredPermissions.length > 0) {
        const hasAllPermissions = requiredPermissions.every(permission => 
          hasPermission(permission)
        )
        if (!hasAllPermissions) {
          return false
        }
      }

      // Check view-based access
      if (requiredView && !canAccessView(requiredView)) {
        return false
      }

      if (requiredViews.length > 0) {
        const hasAllViews = requiredViews.every(view => 
          canAccessView(view)
        )
        if (!hasAllViews) {
          return false
        }
      }

      return true
    }

    // Show loading state
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    // No user or no access
    if (!user || !checkAccess()) {
      return null // Will redirect via useEffect
    }

    // All checks passed - render the component
    return <WrappedComponent {...props} />
  }
}

/**
 * Convenience HOCs for common role protections
 */
export function withSuperAdminProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<RoleProtectionOptions, 'requiredRole'> = {}
) {
  return withRoleProtection(WrappedComponent, {
    ...options,
    requiredRole: 1
  })
}

export function withAdminProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<RoleProtectionOptions, 'requiredRole'> = {}
) {
  return withRoleProtection(WrappedComponent, {
    ...options,
    requiredRole: 2
  })
}

export function withAgencyProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<RoleProtectionOptions, 'allowedRoles'> = {}
) {
  return withRoleProtection(WrappedComponent, {
    ...options,
    allowedRoles: [3]
  })
}
