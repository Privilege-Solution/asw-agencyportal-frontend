/**
 * Role-based access control types and constants
 */

// User role levels
export const USER_ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  AGENCY: 3
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

// Role names for display
export const ROLE_NAMES: Record<UserRole, string> = {
  [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.AGENCY]: 'Agency'
}

// Permission categories
export const PERMISSIONS = {
  // Site management
  SITE_SETTINGS: 'site_settings',
  USER_MANAGEMENT: 'user_management',
  
  // Data access
  VIEW_ALL_DATA: 'view_all_data',
  VIEW_OWN_DATA: 'view_own_data',
  
  // Dashboard sections
  ANALYTICS: 'analytics',
  LEADS: 'leads',
  REPORTS: 'reports',
  
  // API access
  API_ACCESS: 'api_access',
  
  // File operations
  FILE_UPLOAD: 'file_upload',
  FILE_EXPORT: 'file_export'
} as const

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS]

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [USER_ROLES.SUPER_ADMIN]: [
    PERMISSIONS.SITE_SETTINGS,
    PERMISSIONS.USER_MANAGEMENT,
    PERMISSIONS.VIEW_ALL_DATA,
    PERMISSIONS.ANALYTICS,
    PERMISSIONS.LEADS,
    PERMISSIONS.REPORTS,
    PERMISSIONS.API_ACCESS,
    PERMISSIONS.FILE_UPLOAD,
    PERMISSIONS.FILE_EXPORT
  ],
  
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.USER_MANAGEMENT,
    PERMISSIONS.VIEW_ALL_DATA,
    PERMISSIONS.ANALYTICS,
    PERMISSIONS.LEADS,
    PERMISSIONS.REPORTS,
    PERMISSIONS.API_ACCESS,
    PERMISSIONS.FILE_UPLOAD,
    PERMISSIONS.FILE_EXPORT
    // Note: No SITE_SETTINGS permission
  ],
  
  [USER_ROLES.AGENCY]: [
    PERMISSIONS.VIEW_OWN_DATA,
    PERMISSIONS.LEADS,
    PERMISSIONS.FILE_UPLOAD
    // Limited permissions - only their own data
    // Note: USER_MANAGEMENT permission for agencies is handled separately based on agency type
  ]
}

// Navigation/View definitions
export const VIEWS = {
  DASHBOARD: 'dashboard',
  LEADS: 'leads',
  ANALYTICS: 'analytics',
  REPORTS: 'reports',
  USER_MANAGEMENT: 'user_management',
  SITE_SETTINGS: 'site_settings',
  FILE_UPLOAD: 'file_upload',
  API_TEST: 'api_test'
} as const

export type View = typeof VIEWS[keyof typeof VIEWS]

// Role-based view access
export const ROLE_VIEWS: Record<UserRole, View[]> = {
  [USER_ROLES.SUPER_ADMIN]: [
    VIEWS.DASHBOARD,
    VIEWS.LEADS,
    VIEWS.ANALYTICS,
    VIEWS.REPORTS,
    VIEWS.USER_MANAGEMENT,
    VIEWS.SITE_SETTINGS,
    VIEWS.FILE_UPLOAD,
    VIEWS.API_TEST
  ],
  
  [USER_ROLES.ADMIN]: [
    VIEWS.DASHBOARD,
    VIEWS.LEADS,
    VIEWS.ANALYTICS,
    VIEWS.REPORTS,
    VIEWS.USER_MANAGEMENT,
    VIEWS.FILE_UPLOAD,
    VIEWS.API_TEST
    // No SITE_SETTINGS
  ],
  
  [USER_ROLES.AGENCY]: [
    VIEWS.DASHBOARD,
    VIEWS.LEADS,
    VIEWS.FILE_UPLOAD
    // Limited views
    // Note: USER_MANAGEMENT view for agencies is handled separately based on agency type
  ]
}

// Helper functions for agency-specific permissions
export const hasAgencyUserManagement = (userRoleID: number, agencyType?: string): boolean => {
  return userRoleID === USER_ROLES.AGENCY && agencyType === 'agency'
}

export const canAccessUserManagement = (userRoleID: number, agencyType?: string): boolean => {
  // Super admin and admin always have access
  if (userRoleID === USER_ROLES.SUPER_ADMIN || userRoleID === USER_ROLES.ADMIN) {
    return true
  }
  
  // Agency role with agency type also has access
  return hasAgencyUserManagement(userRoleID, agencyType)
}

// Helper type for user with role information
export interface UserWithRole {
  id: string
  email: string
  name: string
  role: UserRole
  subRole?: string // For agency sub-roles
  agencyId?: string // For agency users
  authMethod: 'microsoft' | 'email'
}
