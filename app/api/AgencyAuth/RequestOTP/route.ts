import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    const formData = new FormData()
    formData.append('email', email)
    
    const response = await fetch(process.env.NEXT_PUBLIC_API_PATH + 'AgencyAuth/RequestOTP', {
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
