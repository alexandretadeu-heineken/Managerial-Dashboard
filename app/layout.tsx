import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Managerial Dashboard | D&T AMS BR',
  description: 'D&T AMS BR - Support Functions monitoring.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <body suppressHydrationWarning className="bg-[#F4F4F4] text-[#333333] antialiased min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
