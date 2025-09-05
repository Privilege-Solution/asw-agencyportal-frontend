import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()
    const formData = new FormData()
    formData.append('Email', email)
    formData.append('OTP', otp)
    
    const response = await fetch(process.env.NEXT_PUBLIC_API_PATH + 'AgencyAuth/OTPSubmit', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    
    if (response.ok) {
      // Handle response structure: { data: "token", message: "", status: 200, success: true }
      return NextResponse.json({
        success: data.success || true,
        token: data.data, // Token is directly in data field
        message: data.message || 'OTP verified successfully',
        status: data.status || 200,
        //originalResponse: data
      })
    } else {
      return NextResponse.json(data, { status: response.status })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send OTP request.' + error },
      { status: 500 }
    )
  }
}
