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
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-56HGMGLS');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1420794743273475');
fbq('track', 'PageView');`,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1420794743273475&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className={`${sora.variable} ${inter.variable} ${manrope.variable} ${jakarta.variable} ${inter.className}`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-56HGMGLS"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
