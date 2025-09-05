import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token is required' },
        { status: 401 }
      )
    }

    const response = await fetch(process.env.NEXT_PUBLIC_API_PATH + 'Agency/GetAllAgencies', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    
    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: data.data || data,
        message: data.message || 'Agencies retrieved successfully'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: data.error || data.message || 'Failed to get agencies',
        message: data.message
      }, { status: response.status })
    }
  } catch (error) {
    console.error('Error getting agencies:', error)
    return NextResponse.json(
      { error: 'Failed to get agencies: ' + error },
      { status: 500 }
    )
  }
}
