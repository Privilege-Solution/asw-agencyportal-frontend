"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, User } from 'lucide-react'
import { getApiPath } from '@/lib/asset-utils'
import { apiCall } from '@/lib/api-utils'

export function SimpleApiTest() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const getCookie = (name: string): string | undefined => {
    if (typeof document === 'undefined') return undefined
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift()
    }
    return undefined
  }

  const testApi = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const authToken = getCookie('auth_token')
      
      if (!authToken) {
        throw new Error('No auth token found in cookies')
      }

      console.log('🔑 Making API call to /api/user...')

      const response = await apiCall('/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('📡 Response:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'API request failed')
      }

      const data = await response.json()
      console.log('✅ Success:', data)
      setResult(data)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('❌ Error:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const checkCookies = () => {
    const authToken = getCookie('auth_token')
    console.log('🍪 Auth token:', authToken ? `${authToken.substring(0, 20)}...` : 'Not found')
    console.log('🍪 All cookies:', document.cookie)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Simple API Test
        </CardTitle>
        <CardDescription>
          Basic GetUser API test without complex dependencies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="flex gap-2">
          <Button
            onClick={checkCookies}
            variant="outline"
            size="sm"
          >
            Check Cookies
          </Button>
          
          <Button
            onClick={testApi}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Test API"
            )}
          </Button>
        </div>

        {loading && (
          <div className="text-blue-600 text-sm">
            Making API call...
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">Error: {error}</p>
          </div>
        )}

        {result && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <h4 className="font-medium text-green-800 mb-2">Success:</h4>
            <pre className="text-sm text-green-700 overflow-auto max-h-40">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Check browser console for detailed logs
        </div>

      </CardContent>
    </Card>
  )
}
