"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SimpleApiTest } from '@/components/test/SimpleApiTest'
import { useEffect, useState } from 'react'

export default function ApiTestClientPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-8">
          <div className="text-center space-y-4">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
          </div>
          <div className="h-64 bg-gray-300 rounded"></div>
          <div className="h-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Client-Side API Testing</h1>
        <p className="text-gray-600 mt-2">
          Pure client-side approach - no hydration issues
        </p>
      </div>

      {/* Client Component Section */}
      <Card>
        <CardHeader>
          <CardTitle>💻 Client-Side API Testing</CardTitle>
          <CardDescription>
            Interactive testing with API calls via Next.js API routes (no hydration issues)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleApiTest />
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 Hydration-Safe Approach</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-green-700">✅ Benefits of This Approach:</h4>
            <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
              <li>No hydration mismatches - everything renders client-side</li>
              <li>Consistent behavior between server and client</li>
              <li>Full interactivity from the start</li>
              <li>No SSR complications with dynamic content</li>
            </ul>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-800">🚀 How It Works:</h4>
            <div className="text-sm text-blue-700 mt-1 space-y-1">
              <p>1. <strong>Client-side only</strong> - marked with "use client"</p>
              <p>2. <strong>Mount check</strong> - ensures consistent rendering</p>
              <p>3. <strong>API calls</strong> - go through Next.js API routes</p>
              <p>4. <strong>No CORS issues</strong> - server-side proxy handles external APIs</p>
            </div>
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <h4 className="font-medium text-yellow-800">⚡ Performance Note:</h4>
            <p className="text-sm text-yellow-700 mt-1">
              This approach sacrifices some SEO benefits and initial page load speed 
              for guaranteed hydration safety. Choose based on your specific needs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
