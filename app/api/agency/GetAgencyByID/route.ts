import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get the Authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
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

    const response = await fetch(process.env.NEXT_PUBLIC_API_PATH + `Agency/GetAgencyByID?agencyID=${agencyID}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    
    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: data.data || data,
        message: data.message || 'Agency data retrieved successfully'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: data.error || data.message || 'Failed to get agency data',
        message: data.message
      }, { status: response.status })
    }
  } catch (error) {
    console.error('Error getting agency data:', error)
    return NextResponse.json(
      { error: 'Failed to get agency data: ' + error },
      { status: 500 }
    )
  }
}
