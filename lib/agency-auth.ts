/**
 * Agency authentication utilities for OTP flow
 */

export interface AgencyAccessTokenResponse {
  success: boolean
  data?: {
    agencyID: string | number
    accessToken?: string
  }
  message?: string
  error?: string
}

export interface AgencyDataResponse {
  success: boolean
  data?: {
    id: string | number
    refCode: string
    name: string
    description: string
    email: string
    tel: string
    agencyTypeID: number
    firstName: string
    lastName: string
    agencyType: {
      id: number
      name: string
      description: string
      isActive: boolean
    }
    projectIDs: number[]
    isActive: boolean
    createBy: string
    createDate: string
    updateBy: string
    updateDate: string
  }
  message?: string
  error?: string
}

/**
 * Step 2: Get Agency API Access Token using Bearer token
 */
export const getAgencyAccessToken = async (token: string): Promise<AgencyAccessTokenResponse> => {
  try {
    const response = await fetch('/api/AgencyAuth/GetAccessToken', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('Agency access token response:', response)
    

    const data = await response.json()
    
    if (response.ok && data.success) {
      return {
        success: true,
        data: data.data,
        message: data.message || 'Access token retrieved successfully'
      }
    } else {
      return {
        success: false,
        error: data.error || data.message || 'Failed to get access token',
        message: data.message
      }
    }
  } catch (error) {
    console.error('Error getting agency access token:', error)
    return {
      success: false,
      error: 'Network error while getting access token'
    }
  }
}

/**
 * Step 3: Get Agency data by ID using token
 */
export const getAgencyById = async (agencyID: string | number, token: string): Promise<AgencyDataResponse> => {
  try {
    const response = await fetch(`/api/AgencyAuth/GetAgencyByID?agencyID=${agencyID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    
    if (response.ok && data.success) {
      return {
        success: true,
        data: data.data,
        message: data.message || 'Agency data retrieved successfully'
      }
    } else {
      return {
        success: false,
        error: data.error || data.message || 'Failed to get agency data',
        message: data.message
      }
    }
  } catch (error) {
    console.error('Error getting agency data:', error)
    return {
      success: false,
      error: 'Network error while getting agency data'
    }
  }
}

/**
 * Complete agency authentication flow
 * Steps 2-4: Get access token, get agency data, and map roles
 */
export const completeAgencyAuth = async (token: string) => {
  try {
    // Step 2: Get Agency API Access Token
    const accessTokenResult = await getAgencyAccessToken(token)
    
    if (!accessTokenResult.success || !accessTokenResult.data?.agencyID) {
      return {
        success: false,
        error: accessTokenResult.error || 'Failed to get agency access token'
      }
    }

    const agencyID = accessTokenResult.data.agencyID

    // Step 3: Get Agency data by ID
    const agencyDataResult = await getAgencyById(agencyID, token)
    
    if (!agencyDataResult.success || !agencyDataResult.data) {
      return {
        success: false,
        error: agencyDataResult.error || 'Failed to get agency data'
      }
    }

    const agencyData = agencyDataResult.data

    // Step 4: Map agency type to user role
    let userRoleID: number
    let agencyType: string

    if (agencyData.agencyTypeID === 1) {
      userRoleID = 3
      agencyType = 'agency'
    } else if (agencyData.agencyTypeID === 2) {
      userRoleID = 3
      agencyType = 'agent'
    } else {
      return {
        success: false,
        error: `Unknown agency type ID: ${agencyData.agencyTypeID}`
      }
    }

    // Return complete user data for authentication
    return {
      success: true,
      userData: {
        id: agencyData.id.toString(),
        email: agencyData.email,
        displayName: `${agencyData.firstName} ${agencyData.lastName}`.trim() || agencyData.name,
        givenName: agencyData.firstName,
        surename: agencyData.lastName,
        userRoleID,
        userRoleName: agencyType,
        departmentID: 0,
        departmentName: agencyData.agencyType?.name || agencyType,
        jobTitle: agencyData.agencyType?.description || agencyType,
        projectIDs: agencyData.projectIDs || [],
        createBy: agencyData.createBy,
        createDate: agencyData.createDate,
        updateBy: agencyData.updateBy,
        updateDate: agencyData.updateDate,
        isActive: agencyData.isActive,
        // Agency-specific fields
        agencyID: agencyData.id,
        agencyName: agencyData.name,
        agencyType,
        agencyTypeID: agencyData.agencyTypeID,
        refCode: agencyData.refCode
      },
      token
    }
  } catch (error) {
    console.error('Error in complete agency auth flow:', error)
    return {
      success: false,
      error: 'Unexpected error during agency authentication'
    }
  }
}
