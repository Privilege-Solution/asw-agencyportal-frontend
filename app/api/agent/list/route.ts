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

    // Get agencyID from query parameters
    const { searchParams } = new URL(request.url)
    const agencyID = searchParams.get('agencyID')
    
    if (!agencyID) {
      return NextResponse.json(
        { error: 'agencyID parameter is required' },
        { status: 400 }
      )
    }

    const response = await fetch(process.env.NEXT_PUBLIC_API_PATH + `Agent/GetAgentsByAgencyID?agencyID=${agencyID}`, {
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
        message: data.message || 'Agents retrieved successfully'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: data.error || data.message || 'Failed to get agents',
        message: data.message
      }, { status: response.status })
    }
  } catch (error) {
    console.error('Error getting agents:', error)
    return NextResponse.json(
      { error: 'Failed to get agents: ' + error },
      { status: 500 }
    )
  }
}
