import { getApiPath } from '@/lib/asset-utils'

export const requestOtp = async (email: string) => {
    let isLoading = true
    let error = ""
    let success = false
    let data = null

    try {
      const response = await fetch(getApiPath('api/AgencyAuth/RequestOTP'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      
      const responseData = await response.json()
      console.log('OTP request response data:', responseData)
      
      if (response.ok) {
        success = true
        data = responseData
      } else {
        console.log('Error sending OTP request:', responseData)
        error = responseData.error || responseData.message || 'Unknown error'
      }
    } catch (error) {
      console.error('Error sending OTP request:', error)
      error = 'Network error'
    } finally {
      isLoading = false
    }
  
  return { isLoading, error, success, data }
}

export const submitOtp = async (email: string, otp: string) => {
    let isLoading = true
    let error = ""
    let success = false
    let data = null

    try {
      const response = await fetch(getApiPath('api/AgencyAuth/SubmitOTP'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })
      
      const responseData = await response.json()
      
      if (response.ok) {
        success = true
        data = responseData
      } else {
        console.log('Error submitting OTP:', responseData)
        error = responseData.error || responseData.message || 'Unknown error'
      }
    } catch (error) {
      console.error('Error submitting OTP:', error)
      error = 'Network error'
    } finally {
      isLoading = false
    }
  
  return { isLoading, error, success, data }
}