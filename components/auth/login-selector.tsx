"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Mail, Building } from "lucide-react"
import { useAuth, type AuthMethod } from "@/lib/auth-context"
import { alert } from "@/hooks/use-alert"
import Image from 'next/image'

// Mock Microsoft auth for development - will be replaced with actual MSAL when credentials are provided
const useMockMicrosoft = !process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || process.env.NEXT_PUBLIC_AZURE_CLIENT_ID === 'your-client-id-here'

export function LoginSelector() {
  const { setAuthMethod, login } = useAuth()
  const [isLoadingMicrosoft, setIsLoadingMicrosoft] = useState(false)

  const handleMicrosoftLogin = async () => {
    setIsLoadingMicrosoft(true)

    try {
      if (useMockMicrosoft) {
        // Mock authentication for development
        await new Promise(resolve => setTimeout(resolve, 1500))
        const mockToken = 'mock-access-token-' + Date.now()
        
        // First, login with basic info and token
        login('microsoft', {
          id: 'mock-user-id',
          email: 'user@company.com',
          displayName: 'John Doe'
        }, mockToken)
        
        // Then fetch complete user data from API
        const response = await fetch('/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const userData = await response.json()
          console.log('✅ Complete user data fetched after Microsoft login:', userData)
          
          // Update user with complete data
          login('microsoft', userData.data, mockToken)
        } else {
          console.warn('Could not fetch complete user data, using basic info')
        }
      } else {
        // Actual MSAL authentication
        const { PublicClientApplication } = await import('@azure/msal-browser')
        const { msalConfig, loginRequest } = await import('@/lib/msal-config')
        
        const msalInstance = new PublicClientApplication(msalConfig)
        await msalInstance.initialize()
        
        const response = await msalInstance.loginPopup(loginRequest)
        
        if (response.account) {
          // Extract access token from the response
          const accessToken = response.accessToken
          
          // First, login with basic info and token
          login('microsoft', {
            id: response.account.homeAccountId,
            email: response.account.username,
            displayName: response.account.name || response.account.username
          }, accessToken)
          
          // Then fetch complete user data from API
          const userResponse = await fetch('/api/user', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          })

          if (userResponse.ok) {
            const userData = await userResponse.json()
            console.log('✅ Complete user data fetched after Microsoft login:', userData)
            
            // Update user with complete data
            login('microsoft', userData.data, accessToken)
          } else {
            console.warn('Could not fetch complete user data, using basic info')
          }
        } else {
          throw new Error('Authentication successful but no account information received')
        }
      }
    } catch (error) {
      console.error('Microsoft authentication error:', error)
      let errorMessage = 'Authentication failed'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null && 'errorMessage' in error) {
        errorMessage = String(error.errorMessage)
      }
      
      // Use the new alert dialog system instead of browser alert
      await alert({
        title: "Authentication Error",
        description: errorMessage,
        confirmText: "OK",
        variant: "destructive"
      })
    } finally {
      setIsLoadingMicrosoft(false)
    }
  }

  const handleAuthMethodSelect = (method: AuthMethod) => {
    setAuthMethod(method)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Image src="/ASW_Logo_Rac_light-bg.svg" alt="AssetWise" width={180} height={100} className="mx-auto" />
        <CardTitle className="text-2xl font-medium">Agency Portal</CardTitle>
        <CardDescription>
          Choose your preferred login method
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleMicrosoftLogin}
          variant="outline"
          className="w-full flex items-center justify-center gap-3 h-15 hover:bg-blue-50 hover:border-blue-300"
          disabled={isLoadingMicrosoft}
        >
          <Image src="/microsoft-svg-com.svg" alt="Microsoft" width={40} height={40} />
          <div className="text-gray-600 text-lg">
            {isLoadingMicrosoft ? "Signing in..." : "Sign in with Microsoft"}
          </div>
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button
          onClick={() => handleAuthMethodSelect('email')}
          variant="outline"
          className="w-full flex items-center justify-center gap-3 h-12 hover:bg-green-50 hover:border-green-300"
          disabled={isLoadingMicrosoft}
        >
          <Mail className="text-green-600" />
          <div className="text-gray-600">รับรหัส OTP ผ่านอีเมล</div>
        </Button>
      </CardContent>
    </Card>
  )
} 