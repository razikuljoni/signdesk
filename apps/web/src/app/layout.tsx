import type { Metadata } from 'next';
import { Newsreader, Hanken_Grotesk, JetBrains_Mono, Caveat } from 'next/font/google';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-newsreader',
  display: 'swap',
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hanken',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-caveat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SignDesk — E-Signature & Approval SaaS for Bangladeshi Commerce',
  description: 'Upload a PDF, place signature fields, send for signature under ICT Act 2006 with a tamper-evident audit trail.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} ${caveat.variable}`}
    >
      <body className="bg-paper text-ink font-body min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
