import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
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

    const agentData = await request.json()
    
    // Validate required fields
    const requiredFields = ['email', 'firstName', 'lastName', 'agencyID']
    const missingFields = requiredFields.filter(field => !agentData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Create FormData for the API call
    const formData = new FormData()
    formData.append('Email', agentData.email)
    formData.append('FirstName', agentData.firstName)
    formData.append('LastName', agentData.lastName)
    formData.append('AgencyID', agentData.agencyID.toString())

    const response = await fetch(process.env.NEXT_PUBLIC_API_PATH + 'Agent/CreateAgent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    const data = await response.json()
    
    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: data.data || data,
        message: data.message || 'Agent created successfully'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: data.error || data.message || 'Failed to create agent',
        message: data.message
      }, { status: response.status })
    }
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json(
      { error: 'Failed to create agent: ' + error },
      { status: 500 }
    )
  }
}
