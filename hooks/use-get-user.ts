import { useState, useCallback } from 'react'
import { cookieUtils } from '@/lib/cookie-utils'
import { apiCall } from '@/lib/api-utils'

interface User {
  // Define the expected user structure from your API
  // Update this interface based on the actual API response
  id?: string
  email?: string
  name?: string
  // Add other fields as needed
}

interface UseGetUserReturn {
  user: User | null
  loading: boolean
  error: string | null
  fetchUser: () => Promise<void>
}

/**
 * Hook to fetch user data from the GetUser API using cookie auth token
 */
export const useGetUser = (): UseGetUserReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Get auth token from cookies
      const authToken = cookieUtils.getAuthToken()
      
      if (!authToken) {
        throw new Error('No authentication token found')
      }

      console.log('🔑 Making GetUser API call via Next.js API route...')

      // Make API call to our Next.js API route (no CORS issues)
      const response = await apiCall('/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })

      console.log('📡 GetUser API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ GetUser API Error:', errorText)
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const userData = await response.json()
      console.log('✅ GetUser API Success:', userData)
      
      setUser(userData)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('❌ Error fetching user:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    user,
    loading,
    error,
    fetchUser
  }
}
