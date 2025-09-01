import { cookieUtils } from './cookie-utils'

/**
 * Utility functions for authentication and token management
 */
export const authUtils = {
  /**
   * Get the current authentication token from cookies
   */
  getAuthToken: (): string | null => {
    return cookieUtils.getAuthToken() || null
  },

  /**
   * Get the current refresh token from cookies
   */
  getRefreshToken: (): string | null => {
    return cookieUtils.getRefreshToken() || null
  },

  /**
   * Check if user is authenticated by verifying token existence
   */
  isAuthenticated: (): boolean => {
    const user = cookieUtils.getAuthUser()
    const token = cookieUtils.getAuthToken()
    return !!(user && token)
  },

  /**
   * Get authentication headers for API calls
   */
  getAuthHeaders: (): Record<string, string> => {
    const token = cookieUtils.getAuthToken()
    if (!token) {
      return {}
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  },

  /**
   * Logout and clear all authentication data
   */
  logout: (): void => {
    cookieUtils.clearAllAuthCookies()
    
    // Clear any additional MSAL cache if needed
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('msal.account.keys')
        localStorage.removeItem('msal.token.keys.') 
        sessionStorage.clear()
      } catch (error) {
        console.warn('Error clearing MSAL cache:', error)
      }
    }
  },

  /**
   * Refresh authentication token
   * This would typically make an API call to refresh the token
   */
  refreshToken: async (): Promise<string | null> => {
    const refreshToken = cookieUtils.getRefreshToken()
    if (!refreshToken) {
      return null
    }

    try {
      // TODO: Implement actual token refresh API call
      // For now, return null to indicate refresh is needed
      console.log('Token refresh would be implemented here')
      return null
    } catch (error) {
      console.error('Token refresh failed:', error)
      authUtils.logout()
      return null
    }
  },

  /**
   * Make an authenticated API request
   */
  makeAuthenticatedRequest: async (url: string, options: RequestInit = {}): Promise<Response> => {
    const authHeaders = authUtils.getAuthHeaders()
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...authHeaders,
        ...options.headers
      }
    })

    // If token is expired (401), try to refresh
    if (response.status === 401) {
      const newToken = await authUtils.refreshToken()
      if (newToken) {
        // Retry with new token
        cookieUtils.setAuthToken(newToken)
        const retryHeaders = authUtils.getAuthHeaders()
        
        return fetch(url, {
          ...options,
          headers: {
            ...retryHeaders,
            ...options.headers
          }
        })
      } else {
        // Refresh failed, logout user
        authUtils.logout()
        throw new Error('Authentication session expired. Please login again.')
      }
    }

    return response
  }
}
