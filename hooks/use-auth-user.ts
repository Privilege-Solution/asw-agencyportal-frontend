import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { cookieUtils } from '@/lib/cookie-utils'

interface UseAuthUserReturn {
  loading: boolean
  error: string | null
  fetchUserData: () => Promise<void>
  hasValidToken: boolean
}

/**
 * Hook to fetch and sync user data from GetUser API endpoint
 * This will get the real user role and details from the server
 */
export const useAuthUser = (): UseAuthUserReturn => {
  const { login, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasValidToken = !!cookieUtils.getAuthToken()

  const fetchUserData = async () => {
    setLoading(true)
    setError(null)

    try {
      const authToken = cookieUtils.getAuthToken()
      
      if (!authToken) {
        throw new Error('No authentication token found')
      }

      console.log('🔍 Fetching user data from GetUser API...')

      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch user data')
      }

      const userData = await response.json()
      console.log('✅ User data fetched successfully:', userData)

      // Update auth context with real user data from API
      login('email', {
        id: userData.id || userData.employeeId || 'api-user',
        email: userData.email,
        name: userData.displayName || userData.givenName || userData.email,
        role: userData.role, // This comes from the API mapping
        userRoleID: userData.userRoleID,
        userRoleName: userData.userRoleName,
        departmentID: userData.departmentID,
        departmentName: userData.departmentName,
        jobTitle: userData.jobTitle,
        projectIDs: userData.projectIDs,
        // Additional fields that might be in the API response
        agencyId: userData.agencyId,
        subRole: userData.subRole
      }, authToken)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('❌ Error fetching user data:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch user data when component mounts if we have a token but no user
  useEffect(() => {
    if (hasValidToken && !user && !loading) {
      fetchUserData()
    }
  }, [hasValidToken, user, loading])

  return {
    loading,
    error,
    fetchUserData,
    hasValidToken
  }
}
