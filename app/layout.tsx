import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

import './globals.css';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://sreyka.ifc-cambodge.com'),
  title: 'Sreyka – IFC AI Concierge',
  description:
    "Sreyka est l'assistante virtuelle officielle de l'Institut français du Cambodge. Posez vos questions sur les cours de français, la médiathèque, le cinéma ou les événements culturels !",
  applicationName: 'Sreyka AI',
  authors: { name: 'Institut français du Cambodge' },
  openGraph: {
    title: 'Sreyka – IFC AI Concierge',
    description:
      "Sreyka est l'assistante virtuelle officielle de l'Institut français du Cambodge.",
    url: 'https://sreyka.ifc-cambodge.com',
    siteName: 'Sreyka AI',
    images: [
      {
        url: '/images/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Logo Institut français du Cambodge',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sreyka – IFC AI Concierge',
    description:
      "Sreyka est l'assistante virtuelle officielle de l'Institut français du Cambodge.",
    images: ['/images/opengraph-image.png'],
  },
  icons: {
    icon: '/images/logo-ifc.png',
    shortcut: '/images/logo-ifc.png',
    apple: '/images/logo-ifc.png',
  },
  manifest: '/manifest.json',
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)';
const DARK_THEME_COLOR = 'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
