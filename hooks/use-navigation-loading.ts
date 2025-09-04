"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function useNavigationLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    let startTimeoutId: NodeJS.Timeout
    let endTimeoutId: NodeJS.Timeout

    const handleStart = () => {
      // Clear any existing timeouts
      clearTimeout(startTimeoutId)
      clearTimeout(endTimeoutId)
      
      // Add a small delay to prevent flash for very fast navigations
      startTimeoutId = setTimeout(() => {
        setIsLoading(true)
      }, 100)
    }

    const handleComplete = () => {
      clearTimeout(startTimeoutId)
      // Show loading for at least 300ms to make it visible
      endTimeoutId = setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }

    // Intercept Next.js router navigation
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const link = target.closest('a[href]') as HTMLAnchorElement
      
      if (link && link.href) {
        const url = new URL(link.href)
        const currentUrl = new URL(window.location.href)
        
        // Check if it's an internal navigation
        if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
          // Don't trigger for external links, same page, or hash links
          if (!link.target && !link.download && !url.href.startsWith('mailto:') && !url.href.startsWith('tel:')) {
            handleStart()
          }
        }
      }
    }

    // Handle browser back/forward buttons
    const handlePopState = () => {
      handleStart()
    }

    // Listen for clicks on links
    document.addEventListener('click', handleClick, true)
    window.addEventListener('popstate', handlePopState)

    // Clean up on pathname change (navigation completed)
    handleComplete()

    return () => {
      clearTimeout(startTimeoutId)
      clearTimeout(endTimeoutId)
      document.removeEventListener('click', handleClick, true)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [pathname])

  return isLoading
}
