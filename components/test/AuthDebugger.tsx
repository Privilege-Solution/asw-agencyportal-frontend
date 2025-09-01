"use client"

import { useAuth } from "@/lib/auth-context"
import { cookieUtils } from "@/lib/cookie-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export function AuthDebugger() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [cookieData, setCookieData] = useState<any>(null)

  const checkCookies = () => {
    const authUser = cookieUtils.getAuthUser()
    const authToken = cookieUtils.getAuthToken()
    const refreshToken = cookieUtils.getRefreshToken()
    
    setCookieData({
      authUser,
      authToken: authToken ? 'exists' : 'null',
      refreshToken: refreshToken ? 'exists' : 'null'
    })
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Auth Debugger
          <Badge variant={isAuthenticated ? "default" : "destructive"}>
            {isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
          </div>
          <div>
            <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
          </div>
        </div>

        {user && (
          <div className="space-y-2">
            <h4 className="font-medium">User Data:</h4>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium">Cookie Data:</h4>
          <Button onClick={checkCookies} size="sm">
            Check Cookies
          </Button>
          {cookieData && (
            <div className="bg-gray-50 p-3 rounded text-sm">
              <pre>{JSON.stringify(cookieData, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Actions:</h4>
          <div className="flex gap-2">
            <Button 
              onClick={() => window.location.reload()} 
              size="sm" 
              variant="outline"
            >
              Reload Page
            </Button>
            <Button 
              onClick={() => cookieUtils.clearAllAuthCookies()} 
              size="sm" 
              variant="destructive"
            >
              Clear All Cookies
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
