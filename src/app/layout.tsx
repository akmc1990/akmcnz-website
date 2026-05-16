import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AKMC 오클랜드 감리교회 | Auckland Korean Methodist Church',
  description: '뉴질랜드 오클랜드 감리교회 – 믿음이 보이는 교회 | Auckland Korean Methodist Church, New Zealand',
  keywords: ['오클랜드 감리교회', 'AKMC', 'Auckland Korean Methodist Church', '뉴질랜드 한인교회'],
  openGraph: {
    title: 'AKMC 오클랜드 감리교회',
    description: '믿음이 보이는 교회 | A Church Where Faith Is Visible',
    url: 'https://akmcnz.org',
    siteName: 'AKMC 오클랜드 감리교회',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={notoSansKR.className}>
        <SessionProviderWrapper>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
