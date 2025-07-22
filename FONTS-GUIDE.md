# 🎨 Custom Fonts Guide

This guide shows you how to add and use custom fonts in your AssetWise Agency Portal.

## 📁 Where to Put Font Files

### Recommended Location
```
public/
  fonts/
    YourFont-Regular.woff2
    YourFont-Bold.woff2
    YourFont-Light.woff2
    YourFont-Medium.woff2
```

### Recommended Font Formats
1. **WOFF2** (most efficient, modern browsers)
2. **WOFF** (fallback for older browsers)
3. **TTF/OTF** (backup, larger file size)

## 🚀 Method 1: Next.js Font Optimization (Recommended)

### Step 1: Add fonts to `public/fonts/`
Place your `.woff2`, `.woff`, and other font files in the `public/fonts/` directory.

### Step 2: Configure in `lib/fonts.ts`
```typescript
import localFont from 'next/font/local'

export const yourBrandFont = localFont({
  src: [
    {
      path: '../public/fonts/YourFont-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/YourFont-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/YourFont-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/YourFont-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-brand',
  display: 'swap',
})
```

### Step 3: Update Tailwind Config
In `tailwind.config.ts`, uncomment and modify:
```typescript
fontFamily: {
  'brand': ['var(--font-brand)', 'sans-serif'],
  sans: ['var(--font-brand)', 'Arial', 'Helvetica', 'sans-serif'],
}
```

### Step 4: Apply in Layout
In `app/layout.tsx`:
```typescript
import { yourBrandFont } from '@/lib/fonts'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${yourBrandFont.variable} font-brand`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
```

### Step 5: Use in Components
```typescript
// Use with Tailwind classes
<h1 className="font-brand text-2xl font-bold">AssetWise Portal</h1>

// Or use specific weights
<p className="font-brand font-light">Light text</p>
<p className="font-brand font-medium">Medium text</p>
<p className="font-brand font-bold">Bold text</p>
```

## 📝 Method 2: CSS @font-face (Simple)

### Step 1: Add fonts to `public/fonts/`

### Step 2: Define in `app/globals.css`
Uncomment and modify the example in `globals.css`:
```css
@font-face {
  font-family: 'YourBrandFont';
  src: url('/fonts/YourFont-Regular.woff2') format('woff2'),
       url('/fonts/YourFont-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'YourBrandFont';
  src: url('/fonts/YourFont-Bold.woff2') format('woff2'),
       url('/fonts/YourFont-Bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### Step 3: Update Tailwind Config
```typescript
fontFamily: {
  'brand': ['YourBrandFont', 'sans-serif'],
  sans: ['YourBrandFont', 'Arial', 'Helvetica', 'sans-serif'],
}
```

### Step 4: Use in Components
```typescript
<h1 className="font-brand">Your heading</h1>
```

## 💡 Usage Examples

### Different Font Weights
```typescript
<h1 className="font-brand font-light">Light Heading</h1>
<h2 className="font-brand font-normal">Regular Heading</h2>
<h3 className="font-brand font-medium">Medium Heading</h3>
<h4 className="font-brand font-bold">Bold Heading</h4>
```

### Mixed Fonts in Components
```typescript
<div>
  <h1 className="font-brand font-bold text-3xl">Brand Font Title</h1>
  <p className="font-sans text-base">Fallback sans-serif content</p>
</div>
```

### Component-Specific Fonts
```typescript
// In a specific component
export function BrandHeader() {
  return (
    <header className="font-brand">
      <h1 className="text-4xl font-bold">AssetWise</h1>
      <p className="text-lg font-medium">Agency Portal</p>
    </header>
  )
}
```

## ⚡ Performance Tips

1. **Use WOFF2 format** - Best compression and modern browser support
2. **Include `font-display: swap`** - Prevents invisible text during font load
3. **Preload critical fonts** - Add to `<head>` for important fonts:
   ```html
   <link rel="preload" href="/fonts/YourFont-Regular.woff2" as="font" type="font/woff2" crossorigin>
   ```
4. **Subset fonts** - Remove unused characters to reduce file size
5. **Use Next.js font optimization** - Better performance and automatic optimization

## 🎯 Quick Start Checklist

- [ ] Create `public/fonts/` directory
- [ ] Add your `.woff2` and `.woff` font files
- [ ] Choose Method 1 (Next.js) or Method 2 (CSS)
- [ ] Update `tailwind.config.ts` font families
- [ ] Apply fonts in layout or components
- [ ] Test in browser

## 🔧 Troubleshooting

**Font not loading?**
- Check file paths are correct
- Ensure font files are in `public/fonts/`
- Verify MIME types are correct
- Check browser developer tools for 404 errors

**Font not applying?**
- Make sure Tailwind config includes your font family
- Check CSS class names match Tailwind config
- Verify CSS variables are defined correctly

**Performance issues?**
- Use WOFF2 format
- Implement font preloading
- Consider font subsetting
- Use `font-display: swap` 