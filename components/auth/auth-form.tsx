"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Shield, ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { requestOtp } from "@/hooks/use-otp"

interface EmailOtpFormProps {
  // No props needed as we use context
}

export function EmailOtpForm({}: EmailOtpFormProps) {
  const { login, setAuthMethod } = useAuth()
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [requestOtpError, setRequestOtpError] = useState("")

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsLoading(true)
    
    try {
      const { success, error } = await requestOtp(email)

      if (success) {
        // Success - move to OTP step
        setStep("otp")
      } else {
        // Error response
        setRequestOtpError(error)
        console.error('Failed to send OTP:', error)
      }
    } catch (error) {
      // Network or other error
      console.error('Error sending OTP request:', error)
    } finally {
      setIsLoading(false)
    }
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
      
      // Login with basic info and token - login() will automatically fetch complete user data
      await login('email', {
        email: email,
        displayName: email.split('@')[0]
      }, otpToken)
    } catch (error) {
      console.error('Error during OTP login:', error)
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
        <CardTitle className="text-2xl font-medium">รับรหัส OTP ผ่านอีเมล</CardTitle>
        <CardDescription>
          {step === "email" ? "กรุณากรอกอีเมลที่ลงทะเบียนไว้" : "กรุณากรอกรหัส OTP ที่ถูกส่งไปยังอีเมล"}
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
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            {requestOtpError && (
              <div className="text-red-600 text-sm mt-2">
                {requestOtpError}
              </div>
            )}
            <Button type="submit" className="w-full bg-blue-800 hover:bg-blue-900" disabled={isLoading}>
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
