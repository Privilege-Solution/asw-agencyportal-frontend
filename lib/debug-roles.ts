/**
 * Debug utilities for role mapping issues
 */

import { cookieUtils } from './cookie-utils'

export const debugRoles = () => {
  console.log('🔍 DEBUGGING ROLE MAPPING ISSUE')
  console.log('================================')
  
  // Check current user in cookies
  const cookieUser = cookieUtils.getAuthUser()
  console.log('👤 User from cookies:', cookieUser)
  
  if (cookieUser) {
    console.log('📊 Role Analysis:')
    console.log('  - userRoleID:', cookieUser.userRoleID)
    console.log('  - role (RBAC):', cookieUser.role)
    console.log('  - userRoleName:', cookieUser.userRoleName)
    
    console.log('🎯 Expected Mapping:')
    console.log('  - userRoleID 1 → role 1 (Super Admin)')
    console.log('  - userRoleID 2 → role 2 (Admin)')
    console.log('  - userRoleID 3 → role 3 (Agency)')
    
    console.log('❓ Current Issue:')
    console.log(`  - API userRoleID: ${cookieUser.userRoleID}`)
    console.log(`  - RBAC role: ${cookieUser.role}`)
    console.log(`  - Expected: userRoleID ${cookieUser.userRoleID} should map to role ${cookieUser.userRoleID}`)
    
    if (cookieUser.userRoleID !== cookieUser.role) {
      console.log('❌ MISMATCH DETECTED!')
      console.log('🔧 Possible causes:')
      console.log('  1. Login function mapping logic is incorrect')
      console.log('  2. API route mapping is being overridden')
      console.log('  3. Cached user data with old role')
      console.log('  4. Multiple role mapping happening')
    } else {
      console.log('✅ Role mapping is correct')
    }
  }
  
  // Check auth token
  const token = cookieUtils.getAuthToken()
  console.log('🔑 Auth token exists:', !!token)
  
  return {
    cookieUser,
    hasToken: !!token,
    roleMismatch: cookieUser ? cookieUser.userRoleID !== cookieUser.role : false
  }
}

// Make available globally for console debugging
if (typeof window !== 'undefined') {
  (window as any).debugRoles = debugRoles
  console.log('🐛 Debug function loaded: debugRoles()')
}
