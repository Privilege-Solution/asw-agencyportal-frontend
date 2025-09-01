"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Shield, ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface EmailOtpFormProps {
  // No props needed as we use context
}

export function EmailOtpForm({}: EmailOtpFormProps) {
  const { login, setAuthMethod } = useAuth()
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setStep("otp")
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp !== "000000") {
      alert("Invalid OTP. Please enter 000000")
      return
    }

    setIsLoading(true)
    
    try {
      // Generate a mock OTP token for this session
      const otpToken = 'otp-token-' + email + '-' + Date.now()
      
      // First, login with basic info and token
      login('email', {
        email: email,
        displayName: email.split('@')[0]
      }, otpToken)
      
      // Then fetch complete user data from API
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const userData = await response.json()
        console.log('✅ Complete user data fetched after OTP login:', userData)
        console.log('🔍 userData.data structure:', userData.data)
        console.log('🔍 userData.data.userRoleID:', userData.data?.userRoleID)
        
        // Update user with complete data
        login('email', userData.data, otpToken)
      } else {
        console.warn('Could not fetch complete user data, using basic info')
        const errorText = await response.text()
        console.error('❌ API Error Response:', errorText)
      }
    } catch (error) {
      console.error('Error fetching user data after OTP login:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Email OTP Login</CardTitle>
        <CardDescription>
          {step === "email" ? "Enter your email to receive OTP" : "Enter the OTP sent to your email"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
                required
              />
              <p className="text-sm text-gray-500">OTP sent to {email}</p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => setStep("email")}>
                Back to Email
              </Button>
              <Button type="button" variant="ghost" className="flex-1" onClick={() => setAuthMethod(null)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Login Options
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
