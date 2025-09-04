import './globals.css'

export const metadata = {
  title: 'Holiday Explorer - Discover India\'s Hidden Gems',
  description: 'Experience the magic of incredible India with our curated holiday packages. From majestic mountains to pristine beaches, create memories that last forever.',
  keywords: 'India travel, holiday packages, tourism, adventure, heritage, nature',
  author: 'Holiday Explorer',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-inter antialiased">
        {children}
      </body>
    </html>
  )
}