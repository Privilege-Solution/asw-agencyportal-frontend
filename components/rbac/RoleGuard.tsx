"use client"

import React from 'react'
import { useAuth } from '@/lib/auth-context'
import { UserRole, Permission, View } from '@/lib/types/roles'

interface RoleGuardProps {
  children: React.ReactNode
  // Role-based access
  requiredRole?: UserRole
  allowedRoles?: UserRole[]
  // Permission-based access
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  // View-based access  
  requiredView?: View
  requiredViews?: View[]
  // Fallback content
  fallback?: React.ReactNode
  // Show loading while checking auth
  showLoadingFallback?: boolean
}

/**
 * Role-based access control component
 * Only renders children if user has required permissions/roles/views
 */
export function RoleGuard({
  children,
  requiredRole,
  allowedRoles,
  requiredPermission,
  requiredPermissions = [],
  requiredView,
  requiredViews = [],
  fallback = null,
  showLoadingFallback = false
}: RoleGuardProps) {
  const { user, isLoading, hasPermission, canAccessView } = useAuth()

  // Show loading fallback if still checking auth
  if (isLoading && showLoadingFallback) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    )
  }

  // No user = no access
  if (!user) {
    return <>{fallback}</>
  }

  // Check role-based access
  if (requiredRole && user.role > requiredRole) {
    return <>{fallback}</>
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <>{fallback}</>
  }

  // Check single permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>
  }

  // Check multiple permissions (ALL required)
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    )
    if (!hasAllPermissions) {
      return <>{fallback}</>
    }
  }

  // Check single view access
  if (requiredView && !canAccessView(requiredView)) {
    return <>{fallback}</>
  }

  // Check multiple views (ALL required)
  if (requiredViews.length > 0) {
    const hasAllViews = requiredViews.every(view => 
      canAccessView(view)
    )
    if (!hasAllViews) {
      return <>{fallback}</>
    }
  }

  // All checks passed - render children
  return <>{children}</>
}

/**
 * Convenience components for common role checks
 */
export function SuperAdminOnly({ children, fallback = null }: { children: React.ReactNode, fallback?: React.ReactNode }) {
  return (
    <RoleGuard requiredRole={1} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function AdminAndUp({ children, fallback = null }: { children: React.ReactNode, fallback?: React.ReactNode }) {
  return (
    <RoleGuard requiredRole={2} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function AgencyOnly({ children, fallback = null }: { children: React.ReactNode, fallback?: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[3]} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}
