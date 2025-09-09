import { siteConfig } from '@/lib/config';

interface StructuredDataProps {
  type: 'organization' | 'website' | 'webpage' | 'article' | 'faq' | 'product';
  data?: Record<string, any>;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data = {} }) => {
  const getStructuredData = () => {
    const baseUrl = siteConfig.url;
    
    switch (type) {
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: siteConfig.name,
          description: siteConfig.description,
          url: baseUrl,
          logo: `${baseUrl}/logo.png`,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: siteConfig.contact.phone,
            contactType: 'customer service',
            email: siteConfig.contact.email,
            availableLanguage: siteConfig.languages.map(lang => lang.name)
          },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Bhubaneswar',
            addressRegion: 'Odisha',
            addressCountry: 'IN'
          },
          sameAs: [
            siteConfig.social.facebook,
            siteConfig.social.twitter,
            siteConfig.social.linkedin
          ],
          ...data
        };

      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteConfig.name,
          description: siteConfig.description,
          url: baseUrl,
          inLanguage: siteConfig.languages.map(lang => lang.code),
          potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          },
          ...data
        };

      case 'webpage':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: data.title || siteConfig.title,
          description: data.description || siteConfig.description,
          url: data.url || baseUrl,
          inLanguage: data.language || 'en',
          isPartOf: {
            '@type': 'WebSite',
            name: siteConfig.name,
            url: baseUrl
          },
          datePublished: data.datePublished || new Date().toISOString(),
          dateModified: data.dateModified || new Date().toISOString(),
          ...data
        };

      case 'article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.title,
          description: data.description,
          url: data.url,
          datePublished: data.datePublished,
          dateModified: data.dateModified || data.datePublished,
          author: {
            '@type': 'Organization',
            name: siteConfig.name,
            url: baseUrl
          },
          publisher: {
            '@type': 'Organization',
            name: siteConfig.name,
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/logo.png`
            }
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data.url
          },
          ...data
        };

      case 'faq':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data.questions?.map((faq: { question: string; answer: string }) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          })) || [],
          ...data
        };

      case 'product':
        return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: siteConfig.name,
          description: siteConfig.description,
          brand: {
            '@type': 'Brand',
            name: siteConfig.name
          },
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            seller: {
              '@type': 'Organization',
              name: siteConfig.name
            }
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '150',
            bestRating: '5',
            worstRating: '1'
          },
          ...data
        };

      default:
        return {};
    }
  };

  const structuredData = getStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

// Specific structured data components for common use cases
export const OrganizationStructuredData = () => (
  <StructuredData type="organization" />
);

export const WebsiteStructuredData = () => (
  <StructuredData type="website" />
);

export const WebPageStructuredData = (props: {
  title?: string;
  description?: string;
  url?: string;
  language?: string;
  datePublished?: string;
  dateModified?: string;
}) => (
  <StructuredData type="webpage" data={props} />
);

export const HealthServiceStructuredData = () => (
  <StructuredData 
    type="organization" 
    data={{
      '@type': ['Organization', 'MedicalOrganization'],
      medicalSpecialty: 'General Medicine',
      serviceType: 'Telemedicine',
      areaServed: {
        '@type': 'State',
        name: 'Odisha',
        containedInPlace: {
          '@type': 'Country',
          name: 'India'
        }
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Health Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AI Health Consultation',
              description: 'AI-powered health guidance and symptom assessment'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'WhatsApp Health Support',
              description: '24/7 health assistance through WhatsApp'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Multilingual Support',
              description: 'Health guidance in English, Hindi, and Odia languages'
            }
          }
        ]
      }
    }} 
  />
);