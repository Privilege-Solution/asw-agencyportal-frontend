"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGetUser } from '@/hooks/use-get-user'
import { testGetUser, testGetUserWithUtils } from '@/lib/api-test'
import { cookieUtils } from '@/lib/cookie-utils'
import { Loader2, User, Key, RefreshCw } from 'lucide-react'

export function GetUserTest() {
  const { user, loading, error, fetchUser } = useGetUser()

  const handleDirectTest = async () => {
    try {
      console.log('🧪 Testing direct API call...')
      await testGetUser()
    } catch (error) {
      console.error('Error in direct test:', error)
    }
  }

  const handleUtilsTest = async () => {
    try {
      console.log('🧪 Testing API call with auth utils...')
      await testGetUserWithUtils()
    } catch (error) {
      console.error('Error in utils test:', error)
    }
  }

  const handleHookTest = async () => {
    try {
      console.log('🧪 Testing API call with React hook...')
      await fetchUser()
    } catch (error) {
      console.error('Error in hook test:', error)
    }
  }

  const checkAuthToken = () => {
    const token = cookieUtils.getAuthToken()
    console.log('🔍 Current auth token:', token ? `${token.substring(0, 20)}...` : 'No token found')
    console.log('🍪 All cookies:', document.cookie)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          GetUser API Test
        </CardTitle>
        <CardDescription>
          Test the GetUser API endpoint using cookie-based authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Auth Token Check */}
        <div className="flex items-center gap-2">
          <Button
            onClick={checkAuthToken}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Key className="h-4 w-4" />
            Check Auth Token
          </Button>
          <Badge variant={cookieUtils.getAuthToken() ? "default" : "destructive"}>
            {cookieUtils.getAuthToken() ? "Token Available" : "No Token"}
          </Badge>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Button
            onClick={handleDirectTest}
            variant="outline"
            className="flex items-center gap-2"
          >
            Direct API Call
          </Button>
          
          <Button
            onClick={handleUtilsTest}
            variant="outline"
            className="flex items-center gap-2"
          >
            With Auth Utils
          </Button>
          
          <Button
            onClick={handleHookTest}
            variant="outline"
            className="flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            React Hook
          </Button>
        </div>

        {/* Hook Results */}
        {loading && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading user data...
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">Error: {error}</p>
          </div>
        )}

        {user && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <h4 className="font-medium text-green-800 mb-2">User Data Retrieved:</h4>
            <pre className="text-sm text-green-700 overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2">Instructions:</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Make sure you're logged in (auth token should be available)</li>
            <li>2. Click any test button to make the API call</li>
            <li>3. Check the browser console for detailed logs</li>
            <li>4. All responses will be logged to the console</li>
          </ol>
        </div>

        {/* API Endpoint Info */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
          <h4 className="font-medium text-gray-800 mb-2">API Flow:</h4>
          <div className="space-y-2 text-sm">
            <div>
              <code className="bg-white px-2 py-1 rounded">Client → /api/user</code>
              <span className="text-gray-600 ml-2">(Next.js API Route)</span>
            </div>
            <div>
              <code className="bg-white px-2 py-1 rounded">Server → https://aswservice.com/agencyportalapiuat/User/GetUser</code>
              <span className="text-gray-600 ml-2">(External API)</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            ✅ No CORS issues - API calls made from Next.js server
          </p>
        </div>

      </CardContent>
    </Card>
  )
}
