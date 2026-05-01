import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import PWARegistration from "@/components/PWARegistration";

export const metadata: Metadata = {
  title: "Chancellor — AI-Native Work Execution Platform",
  description: "A modular AI-native work operating system. Manage work, CRM, dev, support, and marketing — all unified through real-time collaboration and intelligent automation.",
  keywords: ["work management", "AI", "project management", "CRM", "automation", "collaboration"],
  manifest: '/manifest.json',
  themeColor: '#6161FF',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: "Chancellor — AI-Native Work Execution Platform",
    description: "The operating system for modern work. Powered by AI.",
    type: "website",
    images: [
      {
        url: '/icon.svg',
        width: 1200,
        height: 630,
        alt: 'Chancellor Logo',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chancellor — AI-Native Work Execution Platform",
    description: "The operating system for modern work. Powered by AI.",
    images: ['/icon.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <PWARegistration />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
