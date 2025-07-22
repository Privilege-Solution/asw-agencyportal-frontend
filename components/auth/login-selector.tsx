"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Mail, Building } from "lucide-react"
import { useAuth, type AuthMethod } from "@/lib/auth-context"
import Image from 'next/image'

export function LoginSelector() {
  const { setAuthMethod } = useAuth()

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
          onClick={() => handleAuthMethodSelect('microsoft')}
          variant="outline"
          className="w-full flex items-center justify-center gap-3 h-15 hover:bg-blue-50 hover:border-blue-300"
        >
          <Image src="/microsoft-svg-com.svg" alt="Microsoft" width={40} height={40} />
          <div className="text-gray-600 text-lg">Sign in with Microsoft</div>
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
        >
          <Mail className="text-green-600" />
          <div className="text-gray-600">รับรหัส OTP ผ่านอีเมล</div>
        </Button>
      </CardContent>
    </Card>
  )
} 