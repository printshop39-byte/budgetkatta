import type { MetadataRoute } from 'next';

// PWA manifest — served at /manifest.webmanifest. Enables "Add to Home Screen"
// and is the basis for a future Play Store TWA wrapper.
// NOTE: icon files (icon-192.png, icon-512.png, maskable-512.png) must be added
// to /public for installability; placeholders are referenced here.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BudgetKatta — आर्थिक मार्गदर्शन',
    short_name: 'BudgetKatta',
    description:
      'मराठीत सोपे आर्थिक मार्गदर्शन — FD, SIP, कर्ज, विमा कॅल्क्युलेटर व बँक डिरेक्टरी.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050814',
    theme_color: '#fbbf24',
    orientation: 'portrait',
    lang: 'mr-IN',
    categories: ['finance', 'education', 'productivity'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
