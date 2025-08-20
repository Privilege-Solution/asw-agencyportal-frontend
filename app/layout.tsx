import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { dbHeaventFont } from '@/lib/fonts'
import { AlertProvider } from '@/components/ui/alert-provider'

export const metadata: Metadata = {
  title: 'Agency Portal',
  description: 'Agency Portal',
  generator: 'AssetWise Dev Team',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${dbHeaventFont.variable} font-dbHeavent`}>
        <AuthProvider>
          {children}
          <AlertProvider />
        </AuthProvider>
      </body>
    </html>
  )
}
