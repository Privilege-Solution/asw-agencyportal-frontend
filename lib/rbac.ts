/**
 * Role-Based Access Control (RBAC) utility functions
 */

import { 
  UserRole, 
  Permission, 
  View, 
  USER_ROLES, 
  ROLE_PERMISSIONS, 
  ROLE_VIEWS,
  UserWithRole,
  canAccessUserManagement,
  PERMISSIONS,
  VIEWS
} from './types/roles'

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || []
  return rolePermissions.includes(permission)
}

/**
 * Enhanced permission check that considers agency type for specific permissions
 */
export const hasPermissionWithAgencyType = (
  userRole: UserRole, 
  permission: Permission, 
  agencyType?: string
): boolean => {
  // Handle special case for USER_MANAGEMENT permission with agency type
  if (permission === PERMISSIONS.USER_MANAGEMENT) {
    return canAccessUserManagement(userRole, agencyType)
  }
  
  // Default to standard permission check
  return hasPermission(userRole, permission)
}

/**
 * Check if a user can access a specific view
 */
export const canAccessView = (userRole: UserRole, view: View): boolean => {
  const roleViews = ROLE_VIEWS[userRole] || []
  return roleViews.includes(view)
}

/**
 * Enhanced view access check that considers agency type for specific views
 */
export const canAccessViewWithAgencyType = (
  userRole: UserRole, 
  view: View, 
  agencyType?: string
): boolean => {
  // Handle special case for USER_MANAGEMENT view with agency type
  if (view === VIEWS.USER_MANAGEMENT) {
    return canAccessUserManagement(userRole, agencyType)
  }
  
  // Default to standard view access check
  return canAccessView(userRole, view)
}

/**
 * Get all permissions for a user role
 */
export const getUserPermissions = (userRole: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[userRole] || []
}

/**
 * Get all accessible views for a user role
 */
export const getUserViews = (userRole: UserRole): View[] => {
  return ROLE_VIEWS[userRole] || []
}

/**
 * Check if user role is higher or equal to required role
 */
export const hasMinimumRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return userRole <= requiredRole // Lower number = higher privilege
}

/**
 * Check if user is super admin
 */
export const isSuperAdmin = (userRole: UserRole): boolean => {
  return userRole === USER_ROLES.SUPER_ADMIN
}

/**
 * Check if user is admin or higher
 */
export const isAdminOrHigher = (userRole: UserRole): boolean => {
  return userRole <= USER_ROLES.ADMIN
}

/**
 * Check if user is agency level
 */
export const isAgencyUser = (userRole: UserRole): boolean => {
  return userRole === USER_ROLES.AGENCY
}

/**
 * Filter array of items based on user permissions
 * Useful for filtering navigation items, features, etc.
 */
export const filterByPermissions = <T extends { permission?: Permission }>(
  items: T[],
  userRole: UserRole
): T[] => {
  return items.filter(item => 
    !item.permission || hasPermission(userRole, item.permission)
  )
}

/**
 * Filter array of items based on user views
 */
export const filterByViews = <T extends { view?: View }>(
  items: T[],
  userRole: UserRole
): T[] => {
  return items.filter(item => 
    !item.view || canAccessView(userRole, item.view)
  )
}

/**
 * Check if user can access data based on ownership
 * For agency users, they can only access their own data
 */
export const canAccessData = (
  user: UserWithRole,
  dataOwnerId?: string,
  dataAgencyId?: string
): boolean => {
  // Super admin and admin can access all data
  if (isAdminOrHigher(user.role)) {
    return true
  }

  // Agency users can only access their own data
  if (isAgencyUser(user.role)) {
    // If data has an owner ID, check if it matches the user
    if (dataOwnerId) {
      return dataOwnerId === user.id
    }
    
    // If data has an agency ID, check if it matches the user's agency
    if (dataAgencyId && user.agencyId) {
      return dataAgencyId === user.agencyId
    }
    
    // Default to deny access if no ownership info
    return false
  }

  return false
}

/**
 * Get role-based dashboard configuration
 */
export const getDashboardConfig = (userRole: UserRole) => {
  return {
    showSiteSettings: hasPermission(userRole, 'site_settings'),
    showUserManagement: hasPermission(userRole, 'user_management'),
    showAllData: hasPermission(userRole, 'view_all_data'),
    showAnalytics: canAccessView(userRole, 'analytics'),
    showReports: canAccessView(userRole, 'reports'),
    showApiTest: canAccessView(userRole, 'api_test')
  }
}

/**
 * Generate user-friendly error messages for access denial
 */
export const getAccessDeniedMessage = (userRole: UserRole, requiredRole?: UserRole): string => {
  if (requiredRole && userRole > requiredRole) {
    return `This feature requires ${requiredRole === USER_ROLES.SUPER_ADMIN ? 'Super Admin' : 'Admin'} privileges.`
  }
  
  return 'You do not have permission to access this resource.'
}
