# Cookie-Based Authentication Implementation

This document explains the implementation of cookie-based authentication for both Microsoft SSO and OTP authentication methods in the ASW Agency Portal.

## Overview

The authentication system has been updated to use HTTP cookies instead of sessionStorage/localStorage for improved security and cross-tab synchronization. This implementation includes:

- Secure cookie storage for auth tokens
- Support for both Microsoft SSO and Email OTP authentication
- Automatic token refresh capabilities
- Cross-tab authentication synchronization

## Key Components

### 1. Cookie Utilities (`lib/cookie-utils.ts`)

Provides comprehensive cookie management functions:

```typescript
import { cookieUtils } from '@/lib/cookie-utils'

// Set/Get user data
cookieUtils.setAuthUser(userData)
const user = cookieUtils.getAuthUser()

// Set/Get auth tokens
cookieUtils.setAuthToken(accessToken)
const token = cookieUtils.getAuthToken()

// Set/Get refresh tokens
cookieUtils.setRefreshToken(refreshToken)
const refreshToken = cookieUtils.getRefreshToken()

// Clear all auth cookies
cookieUtils.clearAllAuthCookies()
```

### 2. Auth Context (`lib/auth-context.tsx`)

Updated to use cookies for persistence:

```typescript
// Login now accepts an optional token parameter
const login = (method: AuthMethod, userData?: Partial<User>, token?: string) => {
  // Stores user data and token in cookies
}

// Logout clears all auth cookies
const logout = () => {
  cookieUtils.clearAllAuthCookies()
}
```

### 3. Auth Utils (`lib/auth-utils.ts`)

Provides utilities for token management and API calls:

```typescript
import { authUtils } from '@/lib/auth-utils'

// Check authentication status
const isAuth = authUtils.isAuthenticated()

// Get auth headers for API calls
const headers = authUtils.getAuthHeaders()

// Make authenticated requests
const response = await authUtils.makeAuthenticatedRequest('/api/data')
```

## Cookie Configuration

### Security Settings

Cookies are configured with security best practices:

- **Secure**: `true` in production (HTTPS only)
- **SameSite**: `lax` for CSRF protection
- **Path**: `/` for application-wide access
- **Expiration**: 
  - User data: 7 days
  - Access token: 1 day
  - Refresh token: 30 days

### Cookie Names

- `auth_user`: User profile data (JSON)
- `auth_token`: Access token for API calls
- `refresh_token`: Token for refreshing access tokens

## Microsoft SSO Configuration

Updated MSAL configuration (`lib/msal-config.ts`):

```typescript
export const msalConfig: Configuration = {
  cache: {
    cacheLocation: 'localStorage', // Changed from sessionStorage
    storeAuthStateInCookie: true,  // Enable cookie storage
  }
}
```

## Authentication Flow

### Microsoft SSO Flow

1. User clicks "Sign in with Microsoft"
2. MSAL popup/redirect authentication
3. Extract access token from MSAL response
4. Store user data and token in cookies
5. User is authenticated across all tabs

### Email OTP Flow

1. User enters email address
2. OTP is sent (simulated)
3. User enters OTP code
4. Generate session token
5. Store user data and token in cookies

## API Integration

### Making Authenticated Requests

```typescript
import { authUtils } from '@/lib/auth-utils'

// Option 1: Use auth utils (recommended)
try {
  const response = await authUtils.makeAuthenticatedRequest('/api/leads', {
    method: 'POST',
    body: JSON.stringify(leadData)
  })
  const data = await response.json()
} catch (error) {
  // Handle auth errors (automatic logout on 401)
}

// Option 2: Manual header management
const headers = authUtils.getAuthHeaders()
const response = await fetch('/api/leads', {
  method: 'GET',
  headers
})
```

### Token Refresh

The system includes automatic token refresh:

```typescript
// Automatic refresh on 401 responses
const response = await authUtils.makeAuthenticatedRequest('/api/data')
// If token is expired, it will automatically:
// 1. Attempt to refresh using refresh token
// 2. Retry the request with new token
// 3. Logout user if refresh fails
```

## Migration from localStorage/sessionStorage

### What Changed

1. **User Data Storage**: `localStorage.getItem('auth_user')` → `cookieUtils.getAuthUser()`
2. **Token Storage**: Manual management → Automatic cookie storage
3. **Cross-tab Sync**: Manual events → Native cookie synchronization
4. **Security**: Basic storage → Secure cookie configuration

### Benefits

1. **Enhanced Security**: HttpOnly options, secure flags, SameSite protection
2. **Cross-tab Synchronization**: Automatic sync across browser tabs
3. **Better Persistence**: Configurable expiration, survives browser restarts
4. **Server-side Access**: Cookies available to server-side code
5. **CSRF Protection**: SameSite cookie attribute

## Troubleshooting

### Common Issues

1. **Cookies not persisting**: Check secure flag in development (use HTTP)
2. **Cross-tab not syncing**: Verify cookie path and domain settings
3. **Token refresh failing**: Check refresh token expiration
4. **MSAL cache issues**: Clear localStorage and sessionStorage

### Development vs Production

```typescript
// Development (HTTP)
secure: false

// Production (HTTPS)
secure: true
```

## Testing

### Test Authentication Flow

1. Login with Microsoft SSO or Email OTP
2. Verify cookies are set in browser DevTools
3. Open new tab - user should remain authenticated
4. Clear cookies - user should be logged out
5. Test token refresh on expired tokens

### Browser DevTools

Check cookies in:
- Chrome: DevTools → Application → Storage → Cookies
- Firefox: DevTools → Storage → Cookies
- Safari: Develop → Web Inspector → Storage → Cookies

## Security Considerations

1. **HTTPS Required**: Enable secure cookies in production
2. **Cookie Expiration**: Set appropriate expiration times
3. **Token Rotation**: Implement refresh token rotation
4. **XSS Protection**: Validate and sanitize all user inputs
5. **CSRF Protection**: Use SameSite cookies and CSRF tokens

## Future Enhancements

1. **HttpOnly Cookies**: Move sensitive tokens to HttpOnly cookies
2. **Token Rotation**: Implement refresh token rotation
3. **Remember Me**: Extended session duration option
4. **Multi-device Logout**: Invalidate sessions across devices
5. **Session Monitoring**: Track active sessions and suspicious activity
