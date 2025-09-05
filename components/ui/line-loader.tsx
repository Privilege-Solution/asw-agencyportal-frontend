"use client"

import { cn } from "@/lib/utils"

interface LineLoaderProps {
  isLoading?: boolean
  className?: string
}

export function LineLoader({ isLoading = false, className }: LineLoaderProps) {
  return (
    <div 
      className={cn(
        "absolute left-0 right-0 h-1 bg-gray-200 overflow-hidden transition-opacity duration-200",
        isLoading ? "opacity-100" : "opacity-0",
        className
      )}
    >
      <div
        className={cn(
          "h-full bg-gradient-to-r from-orange-300 to-orange-500 transition-transform duration-1000 ease-in-out",
          isLoading ? "animate-loading-bar" : "translate-x-full"
        )}
      />
    </div>
  )
}
