import { USER_ROLES } from '@/lib/types/roles'

// Badge color utilities
export const getRoleBadgeColor = (roleId: number | null) => {
  switch (roleId) {
    case USER_ROLES.SUPER_ADMIN:
      return 'bg-red-100 text-red-800'
    case USER_ROLES.ADMIN:
      return 'bg-blue-100 text-blue-800'
    case USER_ROLES.AGENCY:
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const getTypeBadgeColor = (userType?: string) => {
  switch (userType) {
    case 'agency':
      return 'bg-purple-100 text-purple-800'
    case 'agent':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Permission utilities
export const canEditUser = (
  userType: string | undefined,
  isAdmin: boolean,
  isSuperAdmin: boolean,
  isAgency: boolean
): boolean => {
  return (
    (((isAdmin || isSuperAdmin) && userType === 'agency') || 
     (isAgency && userType === 'agent'))
  )
}

export const canDeleteUser = (
  userType: string | undefined,
  isAdmin: boolean,
  isSuperAdmin: boolean,
  isAgency: boolean
): boolean => {
  return (
    (((isAdmin || isSuperAdmin) && userType === 'agency') || 
     (isAgency && userType === 'agent'))
  )
}
