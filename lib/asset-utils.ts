/**
 * Utility functions for handling asset paths with basePath
 */

export const getAssetPath = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // With assetPrefix configured in next.config.mjs, Next.js will automatically
  // prepend the prefix to static assets, so we just need the clean path
  return `/${cleanPath}`
}

export const getImagePath = (imageName: string): string => {
  return getAssetPath(imageName)
}

export const getApiPath = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // For API routes, we need to use the full path with basePath
  // since API routes are handled by Next.js and need the full path
  return `/${cleanPath}`
}
