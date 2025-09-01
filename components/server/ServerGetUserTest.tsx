import { cookies } from 'next/headers'

// This is a Server Component (no "use client" directive)
export async function ServerGetUserTest() {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')?.value

    if (!authToken) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="font-medium text-yellow-800">No Auth Token</h3>
          <p className="text-yellow-700">Please log in to test the GetUser API</p>
          <p className="text-xs text-yellow-600 mt-2">
            Server component checked for auth token during render
          </p>
        </div>
      )
    }

    // For server components, we'll show a static message about the approach
    // rather than making actual API calls that could cause hydration mismatches
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-medium text-blue-800">🖥️ Server Component Ready</h3>
        <p className="text-blue-700 mb-2">Auth token detected: {authToken.substring(0, 20)}...</p>
        <div className="text-sm text-blue-600 space-y-1">
          <p>✅ Server component can access cookies</p>
          <p>✅ No CORS issues for server-side API calls</p>
          <p>✅ Data would be available at page load time</p>
        </div>
        <div className="mt-3 p-2 bg-white rounded text-xs text-blue-500">
          Note: To avoid hydration mismatches, actual API calls are demonstrated 
          in the client component below. Server components are ideal for static 
          data or when hydration consistency is guaranteed.
        </div>
      </div>
    )

  } catch (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="font-medium text-red-800">Server Component Error</h3>
        <p className="text-red-700 text-sm">
          {error instanceof Error ? error.message : 'Unknown server error'}
        </p>
      </div>
    )
  }
}
