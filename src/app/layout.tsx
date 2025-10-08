import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sora 2 Playground - AI Video Generation with OpenAI Sora",
  description: "Generate stunning AI videos with OpenAI's Sora 2 and Sora 2 Pro models. Full control over duration, resolution, and generation parameters. Try it free in your browser.",
  keywords: ["Sora 2", "OpenAI", "AI video generation", "Sora playground", "video AI", "text to video", "Sora 2 Pro", "AI video creator"],
  authors: [{ name: "Sora 2 Playground" }],
  creator: "Sora 2 Playground",
  publisher: "Sora 2 Playground",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sora2playground.com",
    siteName: "Sora 2 Playground",
    title: "Sora 2 Playground - AI Video Generation with OpenAI Sora",
    description: "Generate stunning AI videos with OpenAI's Sora 2 and Sora 2 Pro models. Full control over duration, resolution, and generation parameters.",
    images: [
      {
        url: "/sora-playground.png",
        width: 1200,
        height: 630,
        alt: "Sora 2 Playground - AI Video Generation Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sora 2 Playground - AI Video Generation with OpenAI Sora",
    description: "Generate stunning AI videos with OpenAI's Sora 2 and Sora 2 Pro models. Full control over duration, resolution, and generation parameters.",
    images: ["/sora-playground.png"],
    creator: "@yourusername",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Sora 2 Playground',
    description: 'Generate stunning AI videos with OpenAI\'s Sora 2 and Sora 2 Pro models',
    url: 'https://sora2playground.com',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '0.1.0',
    creator: {
      '@type': 'Organization',
      name: 'Sora 2 Playground',
    },
    featureList: [
      'AI Video Generation',
      'Sora 2 and Sora 2 Pro Models',
      'Customizable Duration and Resolution',
      'Video Library Management',
      'Real-time Progress Tracking',
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
