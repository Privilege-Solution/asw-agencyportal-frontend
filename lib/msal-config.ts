import { Configuration, LogLevel } from '@azure/msal-browser'

// TODO: Replace with actual Microsoft SSO credentials
// These are placeholder values that should be configured before deployment
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || 'your-client-id-here',
    authority: process.env.NEXT_PUBLIC_AZURE_AUTHORITY || 'https://login.microsoftonline.com/your-tenant-id',
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
    postLogoutRedirectUri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
        if (containsPii) {
          return
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message)
            return
          case LogLevel.Info:
            console.info(message)
            return
          case LogLevel.Verbose:
            console.debug(message)
            return
          case LogLevel.Warning:
            console.warn(message)
            return
        }
      }
    }
  }
}

// Add scopes for additional permissions as needed
export const loginRequest = {
  scopes: ['User.Read', 'profile', 'email', 'openid']
} 