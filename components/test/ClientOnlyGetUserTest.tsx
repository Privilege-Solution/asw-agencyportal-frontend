"use client"

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the GetUserTest component to avoid SSR issues
const GetUserTest = dynamic(() => import('./GetUserTest').then(mod => ({ default: mod.GetUserTest })), {
  ssr: false,
  loading: () => (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-8 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  )
})

export function ClientOnlyGetUserTest() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-8 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    )
  }

  return <GetUserTest />
}
