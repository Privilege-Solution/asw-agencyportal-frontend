/**
 * Test functions for cookie-based authentication
 * Use these in browser console to verify cookie functionality
 */

import { cookieUtils } from './cookie-utils'
import { authUtils } from './auth-utils'

export const testCookieAuth = {
  /**
   * Test basic cookie operations
   */
  testBasicCookies: () => {
    console.log('🍪 Testing basic cookie operations...')
    
    // Test setting and getting a simple cookie
    cookieUtils.set('test_cookie', 'test_value')
    const value = cookieUtils.get('test_cookie')
    console.log('Set/Get test:', value === 'test_value' ? '✅ PASS' : '❌ FAIL')
    
    // Test cookie existence
    const exists = cookieUtils.exists('test_cookie')
    console.log('Exists test:', exists ? '✅ PASS' : '❌ FAIL')
    
    // Test cookie removal
    cookieUtils.remove('test_cookie')
    const removed = !cookieUtils.exists('test_cookie')
    console.log('Remove test:', removed ? '✅ PASS' : '❌ FAIL')
  },

  /**
   * Test auth user cookie operations
   */
  testAuthUserCookies: () => {
    console.log('👤 Testing auth user cookies...')
    
    const testUser = {
      id: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User',
      authMethod: 'email' as const
    }
    
    // Test setting user data
    cookieUtils.setAuthUser(testUser)
    const retrievedUser = cookieUtils.getAuthUser()
    
    const userMatch = retrievedUser && 
      retrievedUser.id === testUser.id &&
      retrievedUser.email === testUser.email &&
      retrievedUser.name === testUser.name &&
      retrievedUser.authMethod === testUser.authMethod
    
    console.log('Auth user set/get:', userMatch ? '✅ PASS' : '❌ FAIL')
    
    // Test clearing auth user
    cookieUtils.removeAuthUser()
    const cleared = !cookieUtils.getAuthUser()
    console.log('Auth user clear:', cleared ? '✅ PASS' : '❌ FAIL')
  },

  /**
   * Test auth token operations
   */
  testAuthTokens: () => {
    console.log('🔑 Testing auth token cookies...')
    
    const testToken = 'test-access-token-123'
    const testRefreshToken = 'test-refresh-token-456'
    
    // Test access token
    cookieUtils.setAuthToken(testToken)
    const retrievedToken = cookieUtils.getAuthToken()
    console.log('Access token set/get:', retrievedToken === testToken ? '✅ PASS' : '❌ FAIL')
    
    // Test refresh token
    cookieUtils.setRefreshToken(testRefreshToken)
    const retrievedRefreshToken = cookieUtils.getRefreshToken()
    console.log('Refresh token set/get:', retrievedRefreshToken === testRefreshToken ? '✅ PASS' : '❌ FAIL')
    
    // Test auth headers
    const headers = authUtils.getAuthHeaders()
    const expectedAuth = `Bearer ${testToken}`
    console.log('Auth headers:', headers.Authorization === expectedAuth ? '✅ PASS' : '❌ FAIL')
    
    // Test clear all
    cookieUtils.clearAllAuthCookies()
    const allCleared = !cookieUtils.getAuthToken() && !cookieUtils.getRefreshToken()
    console.log('Clear all tokens:', allCleared ? '✅ PASS' : '❌ FAIL')
  },

  /**
   * Test authentication status
   */
  testAuthStatus: () => {
    console.log('🔒 Testing authentication status...')
    
    // Should not be authenticated initially
    const notAuthInitially = !authUtils.isAuthenticated()
    console.log('Not authenticated initially:', notAuthInitially ? '✅ PASS' : '❌ FAIL')
    
    // Set up auth data
    const testUser = {
      id: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User',
      authMethod: 'email' as const
    }
    
    cookieUtils.setAuthUser(testUser)
    cookieUtils.setAuthToken('test-token')
    
    // Should be authenticated now
    const isAuthNow = authUtils.isAuthenticated()
    console.log('Authenticated with user and token:', isAuthNow ? '✅ PASS' : '❌ FAIL')
    
    // Clear auth data
    authUtils.logout()
    const notAuthAfterLogout = !authUtils.isAuthenticated()
    console.log('Not authenticated after logout:', notAuthAfterLogout ? '✅ PASS' : '❌ FAIL')
  },

  /**
   * Run all tests
   */
  runAllTests: () => {
    console.log('🚀 Running all cookie authentication tests...\n')
    
    testCookieAuth.testBasicCookies()
    console.log('')
    
    testCookieAuth.testAuthUserCookies()
    console.log('')
    
    testCookieAuth.testAuthTokens()
    console.log('')
    
    testCookieAuth.testAuthStatus()
    console.log('')
    
    console.log('✨ All tests completed!')
  }
}

// Export for browser console usage
if (typeof window !== 'undefined') {
  (window as any).testCookieAuth = testCookieAuth
}
