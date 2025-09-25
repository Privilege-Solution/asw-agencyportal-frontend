/**
 * Simple test function that doesn't rely on complex imports
 * This should work without any import issues
 */

import { getApiPath } from './asset-utils'

export const simpleGetUserTest = async (): Promise<void> => {
  console.log('🚀 Starting simple GetUser API test...')
  
  try {
    // Simple cookie extraction
    const getCookie = (name: string): string | undefined => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift()
      }
      return undefined
    }

    // Get auth token from cookies
    const authToken = getCookie('auth_token')
    
    if (!authToken) {
      console.error('❌ No auth token found in cookies')
      console.log('🍪 Available cookies:', document.cookie)
      return
    }

    console.log('🔑 Auth token found:', `${authToken.substring(0, 30)}...`)
    
    // Make the API call
    console.log('📡 Making API call to /api/user...')
    
    const response = await fetch(getApiPath('api/user'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('📊 Response Details:')
    console.log('  Status:', response.status, response.statusText)
    console.log('  Headers:', Object.fromEntries(response.headers.entries()))

    if (response.ok) {
      const data = await response.json()
      console.log('✅ SUCCESS - User data received:')
      console.log(JSON.stringify(data, null, 2))
    } else {
      const errorData = await response.json()
      console.error('❌ ERROR - API response:')
      console.error(JSON.stringify(errorData, null, 2))
    }

  } catch (error) {
    console.error('❌ ERROR:', error)
  }
  
  console.log('🏁 Simple test completed')
}

// Make available globally
if (typeof window !== 'undefined') {
  (window as any).simpleGetUserTest = simpleGetUserTest
  console.log('🎯 Simple test function loaded: simpleGetUserTest()')
}
