import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SupabaseProvider } from './providers';
import SiteFooter from './components/SiteFooter';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Aharam – Weekly Indian Meal Planner',
  description:
    'A weekly Indian meal planner. 145 recipes with protein tracking across diet modes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <SupabaseProvider>
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </SupabaseProvider>
      </body>
    </html>
  );
}
