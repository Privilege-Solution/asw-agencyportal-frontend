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
      return NextResponse.json(data)
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
