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

    // Get pagination and search parameters from request body
    const body = await request.json()
    const {
      perPage = 10,
      page = 1,
      offset = 0,
      searchStr = '',
      agencyTypeID = 0,
      projectID = 0
    } = body

    const requestBody = {
      perPage,
      page,
      offset,
      searchStr,
      agencyTypeID,
      projectID
    }

    const response = await fetch(process.env.NEXT_PUBLIC_API_PATH + 'Agency/GetAgenciesByPagination', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    const data = await response.json()
    
    console.log('External API Response:', data) // Debug log
    console.log('Response status:', response.status, response.statusText) // Debug log
    
    if (response.ok) {
      // Handle different possible data structures
      let agenciesData = data.data || data.agencies || data
      
      // If agenciesData is not an array, try to extract from common structures
      if (!Array.isArray(agenciesData)) {
        if (data.result && Array.isArray(data.result)) {
          agenciesData = data.result
        } else if (data.items && Array.isArray(data.items)) {
          agenciesData = data.items
        } else {
          console.warn('Unexpected data structure from external API:', data)
          agenciesData = []
        }
      }
      
      return NextResponse.json({
        success: true,
        data: agenciesData,
        pagination: {
          page,
          perPage,
          total: data.total || data.totalCount || agenciesData.length || 0,
          totalPages: Math.ceil((data.total || data.totalCount || agenciesData.length || 0) / perPage)
        },
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
