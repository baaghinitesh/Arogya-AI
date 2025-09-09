import Head from 'next/head';
import { siteConfig } from '@/lib/config';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  language?: string;
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = siteConfig.description,
  keywords = siteConfig.keywords,
  image = siteConfig.ogImage,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  language = 'en',
  noindex = false,
  nofollow = false,
  canonical
}) => {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const fullUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const fullImage = image?.startsWith('http') ? image : `${siteConfig.url}${image}`;
  const canonicalUrl = canonical ? `${siteConfig.url}${canonical}` : fullUrl;

  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow'
  ].join(', ');

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author || siteConfig.name} />
      <meta name="robots" content={robotsContent} />
      <meta name="language" content={language} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content={language === 'hi' ? 'hi_IN' : language === 'od' ? 'or_IN' : 'en_IN'} />
      
      {/* Article specific Open Graph tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@arogyaai" />
      <meta name="twitter:creator" content="@arogyaai" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* WhatsApp Meta Tags */}
      <meta property="whatsapp:title" content={fullTitle} />
      <meta property="whatsapp:description" content={description} />
      <meta property="whatsapp:image" content={fullImage} />

      {/* Additional Meta Tags for Healthcare */}
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      <meta name="application-name" content={siteConfig.name} />
      <meta name="apple-mobile-web-app-title" content={siteConfig.name} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />

      {/* Geo Tags for Odisha */}
      <meta name="geo.region" content="IN-OR" />
      <meta name="geo.placename" content="Odisha, India" />
      <meta name="geo.position" content="20.9517;85.0985" />
      <meta name="ICBM" content="20.9517, 85.0985" />

      {/* Healthcare Specific Meta Tags */}
      <meta name="medical-disclaimer" content="This AI assistant provides general health information and is not a substitute for professional medical advice." />
      <meta name="content-category" content="Healthcare, Telemedicine, AI Assistant" />
      <meta name="target-audience" content="General Public, Healthcare Seekers" />
      <meta name="content-language" content={`${language}, hi, or`} />

      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://wa.me" />
      <link rel="preconnect" href="https://api.whatsapp.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//wa.me" />
      <link rel="dns-prefetch" href="//api.whatsapp.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />

      {/* Alternate language pages */}
      <link rel="alternate" hrefLang="en" href={`${siteConfig.url}${url || ''}`} />
      <link rel="alternate" hrefLang="hi" href={`${siteConfig.url}/hi${url || ''}`} />
      <link rel="alternate" hrefLang="or" href={`${siteConfig.url}/od${url || ''}`} />
      <link rel="alternate" hrefLang="x-default" href={`${siteConfig.url}${url || ''}`} />
    </Head>
  );
};