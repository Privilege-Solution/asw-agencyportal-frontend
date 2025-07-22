import localFont from 'next/font/local'

// Example: Configure your custom font
// Replace with your actual font files
export const dbHeaventFont = localFont({
  src: [
    {
      path: '../public/fonts/DBHeavent-Thin.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/DBHeavent-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/DBHeavent.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/DBHeavent-Med.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/DBHeavent-Bold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/DBHeavent-Black.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-db-heavent',
  display: 'swap',
})