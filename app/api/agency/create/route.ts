import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, response: NextResponse) {
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
    const requestBody = {
      name: agencyData.name,
      description: agencyData.description || '',
      email: agencyData.email,
      tel: agencyData.tel,
      isActive: agencyData.isActive || true,
      firstName: agencyData.firstName,
      lastName: agencyData.lastName,
      agencyTypeID: agencyData.agencyTypeID,
      projectIDs: agencyData.projectIDs
    }

    console.log(requestBody)

    const response = await fetch(process.env.NEXT_PUBLIC_API_PATH + 'Agency/SaveAgency', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log(response)

    // Check if response has content and is JSON
    let data: any = {}
    const contentType = response.headers.get('content-type')
    const responseText = await response.text()
    
    if (responseText && contentType?.includes('application/json')) {
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Failed to parse JSON response:', responseText)
        return NextResponse.json(
          { error: 'Invalid JSON response from API', details: responseText },
          { status: 500 }
        )
      }
    } else if (responseText) {
      // If we have text but it's not JSON, treat it as an error message
      data = { error: responseText }
    } else {
      // Empty response
      data = { error: 'Empty response from API' }
    }
    
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
