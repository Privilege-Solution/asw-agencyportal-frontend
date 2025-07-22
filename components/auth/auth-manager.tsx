"use client"

import React from 'react'
import { useAuth } from "@/lib/auth-context"
import { LoginSelector } from './login-selector'
import { MicrosoftAuth } from './microsoft-auth'
import { EmailOtpForm } from './auth-form'

export function AuthManager() {
  const { currentAuthMethod, isAuthenticated } = useAuth()

  // If user is already authenticated, don't show auth forms
  if (isAuthenticated) {
    return null
  }

  // Show appropriate authentication form based on selected method
  switch (currentAuthMethod) {
    case 'microsoft':
      return <MicrosoftAuth />
    case 'email':
      return <EmailOtpForm />
    default:
      return <LoginSelector />
  }
} 