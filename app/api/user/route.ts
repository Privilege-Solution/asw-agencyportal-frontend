import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookies on the server side
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')?.value

    if (!authToken) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      )
    }

    console.log('🔑 Server: Auth token found, making API call...')

    // Make the API call from the server (no CORS issues)
    const response = await fetch('https://aswservice.com/agencyportalapiuat/User/GetUser', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'ASW-Agency-Portal/1.0'
      }
    })

    console.log('📡 Server: GetUser API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Server: GetUser API Error:', errorText)
      
      return NextResponse.json(
        { 
          error: `API request failed: ${response.status} ${response.statusText}`,
          details: errorText 
        },
        { status: response.status }
      )
    }

    const userData = await response.json()
    console.log('✅ Server: GetUser API Success:', userData)
    console.log('🔍 Server: userData.userRoleID:', userData.userRoleID)
    console.log('🔍 Server: userData structure:', JSON.stringify(userData, null, 2))

    // Map the API response to include role information for RBAC
    const mappedUserData = {
      ...userData,
      // Ensure userRoleID exists - if not provided by API, default to Agency (3)
      userRoleID: userData.userRoleID || 3,
      // Map userRoleID to our RBAC role system
      role: userData.userRoleID === 1 ? 1 : // Super Admin
            userData.userRoleID === 2 ? 2 : // Admin  
            userData.userRoleID === 3 ? 3 : // Agency
            3, // Default to Agency if unknown
      // Preserve original API structure
      originalUserData: userData
    }

    console.log('🔍 Server: mappedUserData.userRoleID:', mappedUserData.userRoleID)
    console.log('🔍 Server: Final response structure:', { data: mappedUserData })

    // Return the enhanced user data wrapped in data property to match expected structure
    return NextResponse.json({ data: mappedUserData })

  } catch (error) {
    console.error('❌ Server: Error in GetUser API route:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Optional: Add other HTTP methods if needed
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
