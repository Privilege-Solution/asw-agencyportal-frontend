/**
 * Quick test function for immediate console use
 * Run this in browser console after logging in
 */

import { cookieUtils } from './cookie-utils'
import { getApiPath } from './asset-utils'

export const quickGetUserTest = async () => {
  console.log('🚀 Starting GetUser API test...')
  
  try {
    // Step 1: Check for auth token
    const authToken = cookieUtils.getAuthToken()
    
    if (!authToken) {
      console.error('❌ No auth token found in cookies')
      console.log('🍪 Available cookies:', document.cookie)
      return
    }

    console.log('🔑 Auth token found:', `${authToken.substring(0, 30)}...`)
    
    // Step 2: Make the API call
    console.log('📡 Making API call to GetUser endpoint...')
    
    const startTime = Date.now()
    
    const response = await fetch(getApiPath('api/user'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })

    const endTime = Date.now()
    const duration = endTime - startTime

    // Step 3: Log response details
    console.log('📊 Response Details:')
    console.log('  Status:', response.status, response.statusText)
    console.log('  Duration:', `${duration}ms`)
    console.log('  URL:', response.url)
    console.log('  Headers:', Object.fromEntries(response.headers.entries()))

    // Step 4: Handle response body
    const contentType = response.headers.get('content-type')
    
    if (response.ok) {
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        console.log('✅ SUCCESS - User data received:')
        console.log(JSON.stringify(data, null, 2))
      } else {
        const text = await response.text()
        console.log('✅ SUCCESS - Response text:')
        console.log(text)
      }
    } else {
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json()
          console.error('❌ ERROR - JSON response:')
          console.error(JSON.stringify(errorData, null, 2))
        } catch {
          const errorText = await response.text()
          console.error('❌ ERROR - Text response:')
          console.error(errorText)
        }
      } else {
        const errorText = await response.text()
        console.error('❌ ERROR - Response:')
        console.error(errorText)
      }
    }

  } catch (error) {
    console.error('❌ NETWORK ERROR:', error)
    
    if (error instanceof TypeError) {
      console.log('💡 This might be a CORS issue or network connectivity problem')
    }
  }
  
  console.log('🏁 GetUser API test completed')
}

// Make available globally for console use
if (typeof window !== 'undefined') {
  (window as any).quickGetUserTest = quickGetUserTest
  
  // Also provide a simpler name
  (window as any).testAPI = quickGetUserTest
  
  console.log('🎯 Quick test functions loaded!')
  console.log('Run: quickGetUserTest() or testAPI() in console')
}
