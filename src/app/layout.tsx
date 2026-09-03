import type { Metadata } from 'next';
import { Sora, Inter, Manrope, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });

export const metadata: Metadata = {
  title: 'SiteExpress | Site Profissional Sem Complicação',
  description: 'Enviamos a primeira versão do seu site profissional em até 24 horas. Você manda as informações, a SiteExpress resolve o resto.',
  openGraph: {
    title: 'SiteExpress | Site Profissional Sem Complicação',
    description: 'Sua empresa é profissional. Seu site também deveria ser.',
    url: 'https://siteexpress.com.br',
    siteName: 'SiteExpress',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://siteexpress.com.br',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'SiteExpress',
    url: 'https://siteexpress.com.br',
    logo: 'https://siteexpress.com.br/logo_siteexpress.png',
    description: 'Enviamos a primeira versão do seu site profissional em até 24 horas.',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR'
    }
  };

  return (
    <html lang="pt-BR">
      <body className={`${sora.variable} ${inter.variable} ${manrope.variable} ${jakarta.variable} ${inter.className}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
