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

    const agencyData = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'tel', 'firstName', 'lastName', 'agencyTypeID']
    const missingFields = requiredFields.filter(field => !agencyData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Create FormData for the API call
    const formData = new FormData()
    formData.append('Name', agencyData.name)
    formData.append('Email', agencyData.email)
    formData.append('Tel', agencyData.tel)
    formData.append('FirstName', agencyData.firstName)
    formData.append('LastName', agencyData.lastName)
    formData.append('AgencyTypeID', agencyData.agencyTypeID.toString())

    const response = await fetch(process.env.NEXT_PUBLIC_API_PATH + 'Agency/CreateAgency', {
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
        message: data.message || 'Agency created successfully'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: data.error || data.message || 'Failed to create agency',
        message: data.message
      }, { status: response.status })
    }
  } catch (error) {
    console.error('Error creating agency:', error)
    return NextResponse.json(
      { error: 'Failed to create agency: ' + error },
      { status: 500 }
    )
  }
}
