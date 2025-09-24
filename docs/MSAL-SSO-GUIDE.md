### MSAL SSO Implementation Guide (Next.js)

This guide explains how to implement Microsoft SSO (MSAL) in a Next.js app, based on the pattern used in this project. Share this with juniors to reuse across projects.

---

## Overview
- **Goal**: Sign in with Microsoft (MSAL), store token + user, fetch real user profile/role from backend, and protect pages with RBAC.
- **Key files in this repo**:
  - `lib/msal-config.ts`: MSAL configuration + scopes
  - `components/auth/microsoft-auth.tsx`: Login button + MSAL popup flow
  - `lib/auth-context.tsx`: App-wide auth state, sync `/api/user`
  - `app/auth/login/page.tsx`, `components/auth/auth-manager.tsx`: Login screens and method switcher
  - `lib/auth-utils.ts`, `lib/cookie-utils.ts`: Token/cookie helpers

---

## Prerequisites (Azure AD)
1) Create an App Registration in Azure AD.
2) Note these values:
   - Application (client) ID
   - Directory (tenant) ID
3) Add Redirect URIs (e.g., `http://localhost:3000` and production URL).
4) Configure API permissions and the scopes you need (example used here: `api://<client-id>/agency-scope`).

---

## Environment Variables
Create `.env.local` and set:

```bash
NEXT_PUBLIC_AZURE_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000
```

The code reads them in `lib/msal-config.ts` and defines a scope:

```ts
// lib/msal-config.ts
import { Configuration, LogLevel } from '@azure/msal-browser'

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '',
    authority: process.env.NEXT_PUBLIC_AZURE_AUTHORITY || '',
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
    postLogoutRedirectUri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
        if (containsPii) return
        // log level handling...
      }
    }
  }
}

export const loginRequest = {
  scopes: [`api://${process.env.NEXT_PUBLIC_AZURE_CLIENT_ID}/agency-scope`]
}
```

---

## Install Dependencies

```bash
pnpm add @azure/msal-browser
# or: npm i @azure/msal-browser
```

---

## Login Button (MSAL Popup)
Use MSAL to authenticate and pass the result to your auth context:

```tsx
// components/auth/microsoft-auth.tsx (core flow snippet)
const { PublicClientApplication } = await import('@azure/msal-browser')
const { msalConfig, loginRequest } = await import('@/lib/msal-config')

const msalInstance = new PublicClientApplication(msalConfig)
await msalInstance.initialize()

const response = await msalInstance.loginPopup(loginRequest)

if (response.account) {
  const accessToken = response.accessToken
  login('microsoft', {
    id: response.account.homeAccountId,
    email: response.account.username,
    displayName: response.account.name || response.account.username
  }, accessToken)
}
```

Tip: This project shows a dev warning if env values are missing (mock mode). Provide real envs for production.

---

## Global Auth Provider
Wrap your app with `AuthProvider` in `app/layout.tsx` to share auth state everywhere:

```tsx
// app/layout.tsx (excerpt)
<AuthProvider>
  {children}
  <AlertProvider />
</AuthProvider>
```

`AuthProvider` does:
- On mount, reads user/token from cookies.
- If Microsoft user, calls `/api/user` with `Authorization: Bearer <token>` to get the real profile/role from backend.
- Validates `userRoleID` must be one of [1=SUPER_ADMIN, 2=ADMIN, 3=AGENCY] before accepting login.

---

## Fetch Real User From Backend
When a Microsoft user is detected, fetch and update:

```ts
// lib/auth-context.tsx (concept)
const response = await fetch('/api/user', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  }
})

// Merge server data into user and enforce valid userRoleID
```

Backend should return a shape containing `userRoleID` and related fields used for RBAC.

---

## RBAC (Protect Pages/Components)
- After syncing `/api/user`, you have `userRoleID`.
- Use helpers exposed by `AuthProvider` (e.g., `hasPermission`, `canAccessView`, `isAdmin`, etc.).
- Optionally wrap pages/components with a guard/HOC for role checks.

---

## Calling APIs With Token
Use a helper to attach headers:

```ts
// lib/auth-utils.ts (usage idea)
const response = await fetch('/api/your-endpoint', {
  headers: {
    Authorization: `Bearer ${cookieUtils.getAuthToken()}`,
    'Content-Type': 'application/json'
  }
})
```

There is also `makeAuthenticatedRequest()` and a stubbed `refreshToken()` to extend later.

---

## Logout
Clear cookies and MSAL cache:

```ts
// lib/auth-utils.ts (excerpt)
cookieUtils.clearAllAuthCookies()
localStorage.removeItem('msal.account.keys')
localStorage.removeItem('msal.token.keys.')
sessionStorage.clear()
```

For full AAD sign-out, add `msalInstance.logoutRedirect()` in your logout action.

---

## Common Pitfalls
- Redirect URI in Azure must exactly match `NEXT_PUBLIC_REDIRECT_URI`.
- Scopes must exist and match your backend configuration.
- Ensure backend `/api/user` validates/returns `userRoleID` (1/2/3) and relevant fields.
- In dev without envs, you’ll be in mock mode—fine for UI, not for real auth.

---

## Quick Checklist
- [ ] Create Azure App Registration + scopes
- [ ] Add envs: `CLIENT_ID`, `AUTHORITY`, `REDIRECT_URI`
- [ ] Implement `lib/msal-config.ts`
- [ ] Implement MSAL login popup and call `login('microsoft', user, token)`
- [ ] `AuthProvider` loads token, fetches `/api/user`, validates `userRoleID`
- [ ] Protect routes/components with RBAC helpers/guards
- [ ] Use `Authorization: Bearer <token>` for API calls
- [ ] Implement logout (cookies + MSAL cache, optional `logoutRedirect`)

---

## Minimal Template (Copy to New Project)

```bash
pnpm add @azure/msal-browser
```

```ts
// lib/msal-config.ts
import { Configuration } from '@azure/msal-browser'

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '',
    authority: process.env.NEXT_PUBLIC_AZURE_AUTHORITY || '',
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000',
  },
  cache: { cacheLocation: 'localStorage', storeAuthStateInCookie: true },
}

export const loginRequest = {
  scopes: [`api://${process.env.NEXT_PUBLIC_AZURE_CLIENT_ID}/agency-scope`]
}
```

```tsx
// components/MicrosoftLoginButton.tsx
'use client'
import { useState } from 'react'
import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig, loginRequest } from '@/lib/msal-config'
import { useAuth } from '@/lib/auth-context'

export default function MicrosoftLoginButton() {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  const onClick = async () => {
    setLoading(true)
    try {
      const msal = new PublicClientApplication(msalConfig)
      await msal.initialize()
      const res = await msal.loginPopup(loginRequest)
      if (res.account) {
        login('microsoft', {
          id: res.account.homeAccountId,
          email: res.account.username,
          displayName: res.account.name || res.account.username,
        }, res.accessToken)
      }
    } finally {
      setLoading(false)
    }
  }

  return <button onClick={onClick} disabled={loading}>Sign in with Microsoft</button>
}
```

```tsx
// app/layout.tsx (wrap provider)
import { AuthProvider } from '@/lib/auth-context'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
```

Adapt `/api/user` and RBAC to your backend contract.


