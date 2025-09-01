"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, ArrowLeft, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { cookieUtils } from '@/lib/cookie-utils'

// Mock Microsoft auth for development - will be replaced with actual MSAL when credentials are provided
const useMockMicrosoft = !process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || process.env.NEXT_PUBLIC_AZURE_CLIENT_ID === 'your-client-id-here'

export function MicrosoftAuth() {
  const { login, setAuthMethod } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleMicrosoftLogin = async () => {
    setIsLoading(true)
    setError(null)

    console.log('🔄 Microsoft authentication started')

    try {
      // Implement actual MSAL authentication
      const { PublicClientApplication } = await import('@azure/msal-browser')
      const { msalConfig, loginRequest } = await import('@/lib/msal-config')
      
      const msalInstance = new PublicClientApplication(msalConfig)
      await msalInstance.initialize()
      
      const response = await msalInstance.loginPopup(loginRequest)

      console.log('🔄 Microsoft authentication response:', response)

      console.log('🔄 Microsoft authentication access token:', response.accessToken)
      
      if (response.account) {
        const accessToken = response.accessToken
        login('microsoft', {
          id: response.account.homeAccountId,
          email: response.account.username,
          displayName: response.account.name || response.account.username
        }, accessToken)
      } else {
        throw new Error('Authentication failed: No account information received')
      }
      
    } catch (error) {
      console.error('Microsoft authentication error:', error)
      setError(error instanceof Error ? error.message : 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setAuthMethod(null)
    setError(null)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Building className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Microsoft SSO</CardTitle>
        <CardDescription>
          Sign in with your Microsoft account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {useMockMicrosoft && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Development mode: Using mock authentication. Configure Azure AD credentials for production.
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleMicrosoftLogin}
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in with Microsoft"}
        </Button>

        <Button 
          type="button" 
          variant="ghost" 
          className="w-full" 
          onClick={handleBack}
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to login options
        </Button>
      </CardContent>
    </Card>
  )
} 