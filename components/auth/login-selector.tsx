"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Mail, Building } from "lucide-react"
import { useAuth, type AuthMethod } from "@/lib/auth-context"
import { alert } from "@/hooks/use-alert"
import Image from 'next/image'
import { cookieUtils } from '@/lib/cookie-utils'
import { getImagePath, getApiPath } from '@/lib/asset-utils'


export function LoginSelector() {
  const { setAuthMethod, login } = useAuth()
  const [isLoadingMicrosoft, setIsLoadingMicrosoft] = useState(false)

  const handleMicrosoftLogin = async () => {
    setIsLoadingMicrosoft(true)

    try {
        // Actual MSAL authentication
        const { PublicClientApplication } = await import('@azure/msal-browser')
        const { msalConfig, loginRequest } = await import('@/lib/msal-config')
        
        const msalInstance = new PublicClientApplication(msalConfig)
        await msalInstance.initialize()
        
        const response = await msalInstance.loginPopup(loginRequest)
        
        if (response.account) {
          // Extract access token from the response
          const accessToken = response.accessToken
          
          cookieUtils.setAuthToken(accessToken)
          
          // Fetch complete user data from API first
          const userResponse = await fetch(getApiPath('/agency/api/user'), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          })

          if (userResponse.ok) {
            const userData = await userResponse.json()
            console.log('✅ Complete user data fetched after Microsoft login:', userData)
            console.log('🔍 userData.data structure:', userData.data)
            console.log('🔍 userData.data.userRoleID:', userData.data?.userRoleID)
            
            // Login with complete data
            console.log('🔄 Login with complete data:', userData.data)
            login('microsoft', userData.data, accessToken)
          } else {
            console.warn('Could not fetch complete user data, using basic info')
            const errorText = await userResponse.text()
            console.error('❌ API Error Response:', errorText)
          }
        } else {
          throw new Error('Authentication successful but no account information received')
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
        <Image src="/agency/ASW_Logo_Rac_light-bg.svg" alt="AssetWise" width={180} height={100} className="mx-auto" />
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
          <Image src="/agency/microsoft-svg-com.svg" alt="Microsoft" width={40} height={40} />
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