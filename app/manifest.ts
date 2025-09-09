import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: 'Arogya AI',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3B82F6',
    orientation: 'portrait',
    categories: ['health', 'medical', 'lifestyle', 'utilities'],
    lang: 'en',
    dir: 'ltr',
    
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-256.png',
        sizes: '256x256',
        type: 'image/png'
      },
      {
        src: '/icon-384.png',
        sizes: '384x384',
        type: 'image/png'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],

    shortcuts: [
      {
        name: 'Chat with AI',
        short_name: 'Chat',
        description: 'Start a health conversation with Arogya AI',
        url: '/chat',
        icons: [
          {
            src: '/shortcut-chat.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'WhatsApp Support',
        short_name: 'WhatsApp',
        description: 'Get help through WhatsApp',
        url: siteConfig.links.whatsapp,
        icons: [
          {
            src: '/shortcut-whatsapp.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'Contact Us',
        short_name: 'Contact',
        description: 'Contact Arogya AI team',
        url: '/contact',
        icons: [
          {
            src: '/shortcut-contact.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      }
    ],

    screenshots: [
      {
        src: '/screenshot-home.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Arogya AI Home Page'
      },
      {
        src: '/screenshot-chat.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'AI Health Chat Interface'
      }
    ],

    related_applications: [
      {
        platform: 'webapp',
        url: siteConfig.url
      }
    ],

    prefer_related_applications: false,
    
    // Additional PWA features
    scope: '/',
    id: 'com.arogyaai.webapp',
    
    // Protocol handlers for health-related links
    protocol_handlers: [
      {
        protocol: 'web+health',
        url: '/chat?topic=%s'
      }
    ],

    // File handlers for health documents
    file_handlers: [
      {
        action: '/upload',
        accept: {
          'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
          'application/pdf': ['.pdf']
        }
      }
    ]
  };
}