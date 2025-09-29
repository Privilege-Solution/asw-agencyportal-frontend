/**
 * Force refresh user role from GetUser API
 * Use this if you see role mismatch issues
 */

import { cookieUtils } from './cookie-utils'
import { apiCall } from './api-utils'

export const forceRoleRefresh = async () => {
  console.log('🔄 FORCING ROLE REFRESH FROM API...')
  
  try {
    const authToken = cookieUtils.getAuthToken()
    
    if (!authToken) {
      console.error('❌ No auth token found')
      return null
    }

    console.log('📡 Calling GetUser API...')
    
    const response = await apiCall('/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ API Error:', errorData)
      return null
    }

    const freshUserData = await response.json()
    console.log('✅ Fresh user data from API:', freshUserData)
    
    // Get current saved user
    const savedUser = cookieUtils.getAuthUser()
    console.log('👤 Current saved user:', savedUser)
    
    // Update user data with API response
    const updatedUser = {
      ...savedUser,
      id: freshUserData.id || freshUserData.employeeId || savedUser?.id,
      email: freshUserData.email || savedUser?.email,
      name: freshUserData.displayName || freshUserData.givenName || savedUser?.name,
      role: freshUserData.role, // This should be correctly mapped by API
      userRoleID: freshUserData.userRoleID,
      userRoleName: freshUserData.userRoleName,
      departmentID: freshUserData.departmentID,
      departmentName: freshUserData.departmentName,
      jobTitle: freshUserData.jobTitle,
      projectIDs: freshUserData.projectIDs,
      agencyId: freshUserData.agencyId,
      subRole: freshUserData.subRole
    }
    
    console.log('🔧 Updated user data:', {
      before: {
        userRoleID: savedUser?.userRoleID,
        role: savedUser?.role,
        userRoleName: savedUser?.userRoleName
      },
      after: {
        userRoleID: updatedUser.userRoleID,
        role: updatedUser.role,
        userRoleName: updatedUser.userRoleName
      }
    })
    
    // Save updated user
    cookieUtils.setAuthUser(updatedUser)
    
    console.log('✅ User data refreshed! Reload the page to see changes.')
    console.log('💡 Or call window.location.reload() to refresh immediately')
    
    return updatedUser
    
  } catch (error) {
    console.error('❌ Error refreshing role:', error)
    return null
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  (window as any).forceRoleRefresh = forceRoleRefresh
  console.log('🔧 Force refresh function loaded: forceRoleRefresh()')
}
