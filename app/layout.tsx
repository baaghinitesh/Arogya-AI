import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import Script from 'next/script';
import { SWRConfig } from 'swr';
import Navbar from '@/components/navbar';
import { ThemeProvider } from '@/contexts/theme-context';
import { LanguageProvider } from '@/contexts/language-context';
import { OrganizationStructuredData, WebsiteStructuredData, HealthServiceStructuredData } from '@/components/seo/structured-data';
import { SkipToContent } from '@/components/accessibility/skip-to-content';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'hi': '/hi',
      'or': '/od',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@arogyaai',
    site: '@arogyaai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'healthcare',
  classification: 'Healthcare, AI, Telemedicine',
};

export const viewport: Viewport = {
  maximumScale: 1
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-background text-foreground">
        {/* Structured Data */}
        <OrganizationStructuredData />
        <WebsiteStructuredData />
        <HealthServiceStructuredData />
        
        <ThemeProvider>
          <LanguageProvider>
            <SWRConfig
              value={{
                fallback: {}
              }}
            >
              <div className="flex flex-col min-h-screen">
                <SkipToContent />
                <Navbar />
                <main id="main-content" className="flex-1">
                  {children}
                </main>
              </div>
            </SWRConfig>
          </LanguageProvider>
        </ThemeProvider>

        {/* Dynamic Global Website Auto-Translation Widget */}
        <div id="google_translate_element" style={{ display: 'none' }} className="hidden" />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            window.googleTranslateElementInit = function() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            };
          `}
        </Script>
        <Script 
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
