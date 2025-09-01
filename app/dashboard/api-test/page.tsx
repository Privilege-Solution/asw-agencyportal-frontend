import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ServerGetUserTest } from '@/components/server/ServerGetUserTest'
import { ClientOnlyGetUserTest } from '@/components/test/ClientOnlyGetUserTest'
import { Skeleton } from '@/components/ui/skeleton'

export default function ApiTestPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">API Testing Page</h1>
        <p className="text-gray-600 mt-2">
          Compare Server Component vs Client Component approaches for API calls
        </p>
      </div>

      {/* Server Component Section */}
      <Card>
        <CardHeader>
          <CardTitle>🖥️ Server Component Approach</CardTitle>
          <CardDescription>
            Data fetched on the server during page load (no CORS issues)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          }>
            <ServerGetUserTest />
          </Suspense>
        </CardContent>
      </Card>

      {/* Client Component Section */}
      <Card>
        <CardHeader>
          <CardTitle>💻 Client Component Approach</CardTitle>
          <CardDescription>
            Interactive testing with API calls via Next.js API routes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientOnlyGetUserTest />
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>📚 Understanding the Approaches</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-green-700">✅ Server Component Benefits:</h4>
            <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
              <li>No CORS issues - API calls made from server</li>
              <li>Data available at page load (faster initial render)</li>
              <li>Better SEO - content is server-rendered</li>
              <li>Secure - API keys/tokens not exposed to client</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-700">💡 Client Component Benefits:</h4>
            <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
              <li>Interactive - can refetch data on demand</li>
              <li>Real-time updates - loading states, error handling</li>
              <li>User-triggered actions - buttons, forms, etc.</li>
              <li>Dynamic - can respond to user input</li>
            </ul>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-800">🚀 Recommended Approach:</h4>
            <p className="text-sm text-blue-700 mt-1">
              Use <strong>Next.js API routes</strong> as a proxy between your client and external APIs. 
              This solves CORS issues while maintaining the flexibility of client-side interactions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
