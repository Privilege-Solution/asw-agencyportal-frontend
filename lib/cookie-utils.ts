import Cookies from 'js-cookie'

export interface CookieOptions {
  expires?: number | Date
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  httpOnly?: boolean
}

// Default cookie options for auth tokens
const DEFAULT_AUTH_COOKIE_OPTIONS: CookieOptions = {
  expires: 7, // 7 days
  path: '/',
  secure: process.env.NODE_ENV === 'production', // Only secure in production
  sameSite: 'lax'
}

export const cookieUtils = {
  // Set a cookie
  set: (name: string, value: string, options?: CookieOptions): void => {
    const cookieOptions = { ...DEFAULT_AUTH_COOKIE_OPTIONS, ...options }
    Cookies.set(name, value, cookieOptions)
  },

  // Get a cookie
  get: (name: string): string | undefined => {
    return Cookies.get(name)
  },

  // Remove a cookie
  remove: (name: string, options?: CookieOptions): void => {
    const cookieOptions = { ...DEFAULT_AUTH_COOKIE_OPTIONS, ...options }
    Cookies.remove(name, cookieOptions)
  },

  // Check if a cookie exists
  exists: (name: string): boolean => {
    return Cookies.get(name) !== undefined
  },

  // Set auth user data as a cookie
  setAuthUser: (user: any): void => {
    cookieUtils.set('auth_user', JSON.stringify(user), {
      expires: 7, // 7 days for user session
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
  },

  // Get auth user data from cookie
  getAuthUser: (): any | null => {
    try {
      const userData = cookieUtils.get('auth_user')
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error parsing auth user cookie:', error)
      cookieUtils.remove('auth_user')
      return null
    }
  },

  // Remove auth user cookie
  removeAuthUser: (): void => {
    cookieUtils.remove('auth_user')
  },

  // Set auth token (for API calls)
  setAuthToken: (token: string): void => {
    cookieUtils.set('auth_token', token, {
      expires: 1/24, // 1 hour for access token
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
  },

  // Get auth token
  getAuthToken: (): string | undefined => {
    return cookieUtils.get('auth_token')
  },

  // Remove auth token
  removeAuthToken: (): void => {
    cookieUtils.remove('auth_token')
  },

  // Set refresh token
  setRefreshToken: (token: string): void => {
    cookieUtils.set('refresh_token', token, {
      expires: 30, // 30 days for refresh token
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
  },

  // Get refresh token
  getRefreshToken: (): string | undefined => {
    return cookieUtils.get('refresh_token')
  },

  // Remove refresh token
  removeRefreshToken: (): void => {
    cookieUtils.remove('refresh_token')
  },

  // Clear all auth cookies
  clearAllAuthCookies: (): void => {
    cookieUtils.removeAuthUser()
    cookieUtils.removeAuthToken()
    cookieUtils.removeRefreshToken()
  }
}
