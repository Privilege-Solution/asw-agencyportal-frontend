export const requestOtp = async (email: string) => {
    let isLoading = true
    let error = ""
    let success = false

    try {
      const response = await fetch('/api/AgencyAuth/RequestOTP', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      console.log('OTP request response:', response)
      if (response.ok) {
        success = true
      } else {
        const errorData = await response.json()
        console.log('Error sending OTP request:', errorData.message)
        error = errorData.message
      }
    } catch (error) {
      console.error('Error sending OTP request:', error)
    } finally {
      isLoading = false
    }
  
  return { isLoading, error, success }
}