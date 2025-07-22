import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
// Uncomment when you add your font files:
// import { customFont, interFont } from '@/lib/fonts'

export const metadata: Metadata = {
  title: 'AssetWise Agency Portal',
  description: 'AssetWise Agency Portal',
  generator: 'AssetWise Dev Team',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* Option 1: Apply to entire body */}
      <body 
        // className={customFont.className} // Single font
        // className={`${customFont.variable} ${interFont.variable} font-custom`} // Multiple fonts with CSS variables
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

// Alternative approach: Apply fonts selectively in components
// <div className="font-custom">Content with custom font</div>
// <div className="font-inter">Content with Inter font</div> 