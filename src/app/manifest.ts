import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sora 2 Playground - AI Video Generation',
    short_name: 'Sora 2 Playground',
    description: 'Generate stunning AI videos with OpenAI\'s Sora 2 and Sora 2 Pro models',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#a855f7',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}

