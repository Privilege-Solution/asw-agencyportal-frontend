import { cookieUtils } from './cookie-utils'
import { apiCall } from './api-utils'

/**
 * Test function to get auth token from cookie and call GetUser API
 */
export const testGetUser = async (): Promise<void> => {
  try {
    // Get auth token from cookies
    const authToken = cookieUtils.getAuthToken()
    
    if (!authToken) {
      console.error('❌ No auth token found in cookies')
      console.log('Available cookies:', document.cookie)
      return
    }

    console.log('🔑 Auth token found:', authToken.substring(0, 20) + '...')

    // Make API call to our Next.js API route (bypasses CORS)
    const response = await apiCall('/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('📡 API Response Status:', response.status, response.statusText)
    console.log('📡 API Response Headers:', Object.fromEntries(response.headers.entries()))

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API Response Data:', data)
    } else {
      const errorText = await response.text()
      console.error('❌ API Error Response:', errorText)
    }

  } catch (error) {
    console.error('❌ Error calling GetUser API:', error)
  }
}

/**
 * Alternative version that uses the auth utils
 */
export const testGetUserWithUtils = async (): Promise<void> => {
  try {
    const authUtilsModule = await import('./auth-utils')
    const { authUtils } = authUtilsModule
    
    // Check if user is authenticated
    if (!authUtils.isAuthenticated()) {
      console.error('❌ User is not authenticated')
      return
    }

    console.log('🔑 User is authenticated, making API call...')

    // Make authenticated request to our API route using auth utils
    const response = await authUtils.makeAuthenticatedRequest('/agency/api/user', {
      method: 'GET'
    })

    console.log('📡 API Response Status:', response.status, response.statusText)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API Response Data:', data)
    } else {
      const errorText = await response.text()
      console.error('❌ API Error Response:', errorText)
    }

  } catch (error) {
    console.error('❌ Error calling GetUser API:', error)
  }
}

// Make functions available in browser console
if (typeof window !== 'undefined') {
  (window as any).testGetUser = testGetUser
  //(window as any).testGetUserWithUtils = testGetUserWithUtils
}
