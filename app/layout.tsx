import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { dbHeaventFont } from '@/lib/fonts'

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
      <body className={`${dbHeaventFont.variable} font-dbHeavent`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
