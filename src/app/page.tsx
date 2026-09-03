"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import WhatsAppWidget from './WhatsAppWidget';
import { translations, Language } from './translations';

export default function Home() {
  
  const [lang, setLang] = useState<Language>("pt");
  const t = translations[lang];

  const [timeLeft, setTimeLeft] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userCompany, setUserCompany] = useState("");
  const [siteType, setSiteType] = useState("Site para apresentar minha empresa");

  useEffect(() => {
    const today = new Date();
    setTodayDate(today.toLocaleDateString('pt-BR'));

    let totalSeconds = 4 * 3600 + 14 * 60 + 59;
    
    const interval = setInterval(() => {
      totalSeconds--;
      if (totalSeconds <= 0) totalSeconds = 4 * 3600;
      const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
      const s = (totalSeconds % 60).toString().padStart(2, '0');
      setTimeLeft(`${h}:${m}:${s}`);
    }, 1000);

    // Initial set to avoid flash of empty timer
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    setTimeLeft(`${h}:${m}:${s}`);

    return () => clearInterval(interval);
  }, []);

  const handleWhatsAppClick = (origin: string) => {
    console.log(`Tracking event: click_whatsapp from ${origin}`);
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userCompany) return;

    const currentSiteType = siteType || t.formSelect1;

    // Dispara silenciosamente em background para salvar o lead
    fetch('/api/save-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, userCompany, siteType: currentSiteType })
    }).catch(() => {}); // fire and forget

    const text = encodeURIComponent(t.whatsappMessage(userName, userCompany, currentSiteType));
    window.open(`https://wa.me/553172247907?text=${text}`, '_blank');
    setIsModalOpen(false);
  };

  return (
    <main className={styles.main}>


      {/* STICKY BANNER */}
      {todayDate && (
        <div className={styles.stickyBanner}>
          <div className="container">
            <p className={styles.stickyBannerText}>
              {t.banner(todayDate)}
            </p>
          </div>
        </div>
      )}
      {/* HEADER */}
      <header className={styles.header}>
        <div className={`container ${styles.headerContainer}`}>
          <div className={styles.logo}>
            <img src="/logo_siteexpress.png?v=2" alt="SiteExpress Logo" width="180" height="42" className={styles.logoImage} />
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginLeft: 'auto' }}>
            <img src="https://flagcdn.com/w40/br.png" onClick={() => setLang('pt')} style={{ cursor: 'pointer', width: '28px', height: 'auto', opacity: lang === 'pt' ? 1 : 0.4, transition: '0.3s', borderRadius: '4px' }} alt="Português" />
            <img src="https://flagcdn.com/w40/us.png" onClick={() => setLang('en')} style={{ cursor: 'pointer', width: '28px', height: 'auto', opacity: lang === 'en' ? 1 : 0.4, transition: '0.3s', borderRadius: '4px' }} alt="English" />
          </div>
        </div>
      </header>

      {/* SEÇÃO 1 - HERO */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              {t.heroBadge}
            </div>
            
            <h1 className={styles.headline}>
              {t.heroHeadlinePart1}<span className={styles.highlightPink}>{t.heroHeadlinePart2}</span>
            </h1>
            
            <p className={styles.subheadline}>
              <span>{t.heroSubheadline3a}</span><strong className={styles.highlightPink}>{t.heroSubheadline3b}</strong>
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 45, 122, 0.08)', color: '#FF2D7A', padding: '6px 16px', borderRadius: '100px', fontSize: '0.88rem', fontWeight: 700, marginBottom: '20px' }}>
              {t.heroPaymentBadge}
            </div>
            
            <div className={styles.heroCtaWrapper}>
              <button 
                className={`${styles.ctaButton} ${styles.ctaLarge}`}
                onClick={() => handleWhatsAppClick('hero')}
              >
                {t.ctaHero}
              </button>
            </div>
          </div>
          
          <div className={styles.heroVisual}>
             <img src="/hero_2.png?v=4" alt="Mulher trabalhando MacBook SiteExpress" width="600" height="500" className={styles.heroImage} />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 - PORTFÓLIO + PROVA */}
      <section className={styles.portfolioSection}>
        <div className="container">
          <div className={styles.benefitsHeader}>
            <h2 className={styles.sectionTitle}>
              {t.portfolioTitle1}<br/>
              {t.portfolioTitle2}
              <span className={styles.highlightPink} style={{ fontWeight: 800 }}>{t.portfolioTitle3}</span>
              {t.portfolioTitle4}
            </h2>
            <p className={styles.sectionSubtitle}>{t.portfolioSubtitle}</p>
          </div>
          
          <div className={styles.portfolioGrid}>
            <div className={styles.portfolioItem}>
              <div className={styles.browserMockup}>
                <div className={styles.browserBar}>
                  <div className={styles.browserDots}><span></span><span></span><span></span></div>
                  <span className={styles.browserBarText}>{t.portfolioBrowserText}</span>
                </div>
                <div className={styles.browserIframeWrapper}>
                  <iframe src="https://lp-lex-aero.vercel.app/" title="Portfolio Preview"></iframe>
                </div>
              </div>
            </div>

            <div className={styles.portfolioItem}>
              <div className={styles.browserMockup}>
                <div className={styles.browserBar}>
                  <div className={styles.browserDots}><span></span><span></span><span></span></div>
                  <span className={styles.browserBarText}>{t.portfolioBrowserText}</span>
                </div>
                <div className={styles.browserIframeWrapper}>
                  <iframe src="https://lp-bcredf-cil.vercel.app/" title="Portfolio Preview"></iframe>
                </div>
              </div>
            </div>

            <div className={styles.portfolioItem}>
              <div className={styles.browserMockup}>
                <div className={styles.browserBar}>
                  <div className={styles.browserDots}><span></span><span></span><span></span></div>
                  <span className={styles.browserBarText}>{t.portfolioBrowserText}</span>
                </div>
                <div className={styles.browserIframeWrapper}>
                  <iframe src="https://lp-gs-terapias.vercel.app/" title="Portfolio Preview"></iframe>
                </div>
              </div>
            </div>

            <div className={styles.portfolioItem}>
              <div className={styles.browserMockup}>
                <div className={styles.browserBar}>
                  <div className={styles.browserDots}><span></span><span></span><span></span></div>
                  <span className={styles.browserBarText}>{t.portfolioBrowserText}</span>
                </div>
                <div className={styles.browserIframeWrapper}>
                  <iframe src="https://lp-obras-servi-os.vercel.app/" title="Portfolio Preview"></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* DEPOIMENTOS / PROVA SOCIAL LOGO APÓS O PORTFÓLIO */}
          <div style={{ marginTop: '36px', background: '#F8FAFC', padding: '24px 32px', borderRadius: '16px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
              ⭐ ⭐ ⭐ ⭐ ⭐ {t.proofTitle}
            </div>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              {t.proofText}
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 - POR QUE VALE A PENA */}
      <section className={styles.benefitsSection}>
        <div className="container">
          <div className={styles.benefitsHeader}>
            <h2 className={styles.sectionTitle}>{t.benefitsTitle}</h2>
            <p className={styles.sectionSubtitle}>{t.benefitsSubtitle}</p>
          </div>
          <div className={styles.benefitsGrid}>
            <div className={`${styles.benefitCard} ${styles.googleCard}`}>
              <div className={styles.benefitIcon}>
                <Image src="/google.png" alt="Google" width={64} height={64} style={{ objectFit: 'contain' }} />
              </div>
              <h3>
                Buscas do <span style={{color: '#4285F4'}}>G</span><span style={{color: '#EA4335'}}>o</span><span style={{color: '#FBBC05'}}>o</span><span style={{color: '#4285F4'}}>g</span><span style={{color: '#34A853'}}>l</span><span style={{color: '#EA4335'}}>e</span>{t.benefit1Title}
              </h3>
              <p>{t.benefit1Desc}</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon} style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center' }}>
                <Image src="/claude.png" alt="Claude" width={44} height={44} style={{ objectFit: 'contain' }} />
                <Image src="/gemini.png" alt="Gemini" width={90} height={40} style={{ objectFit: 'contain' }} />
                <Image src="/chatgpt.png" alt="ChatGPT" width={44} height={44} style={{ objectFit: 'contain' }} />
              </div>
              <h3>{t.benefit2Title}</h3>
              <p>{t.benefit2Desc}</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <img src="/vendas.png?v=3" alt="Vendas" width="64" height="64" style={{ objectFit: 'contain' }} />
              </div>
              <h3>{t.benefit3Title}</h3>
              <p>{t.benefit3Desc}</p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <button 
              className={`${styles.ctaButton} ${styles.ctaSolidPink} ${styles.ctaGiant}`}
              onClick={() => handleWhatsAppClick('beneficios')}
            >
              {t.ctaBenefits}
            </button>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 - A OFERTA */}
      <section className={styles.offerSection}>
        <div className={`container`}>
          <div className={styles.offerHeader}>
            <h2 className={styles.sectionTitle}>{t.offerTitle.split("\n")[0]}<br/>{t.offerTitle.split("\n")[1]}</h2>
            <p className={styles.sectionSubtitle}>{t.offerSubtitle}</p>
          </div>

          <div className={styles.pricingListCard}>
            <ul className={styles.pricingList}>
              <li className={`${styles.pricingListItem} ${styles.highlightedItem}`}>
                <span>{t.offerItem1}</span>
                <span className={styles.pricingItemValue}>R$ 150,00</span>
              </li>
              <li className={styles.pricingListItem}>
                <span>{t.offerItem2}</span>
                <span className={styles.pricingItemValue}>R$ 250,00</span>
              </li>
              <li className={styles.pricingListItem}>
                <span>{t.offerItem3}</span>
                <span className={styles.pricingItemValue}>R$ 100,00</span>
              </li>
              <li className={styles.pricingListItem}>
                <span>{t.offerItem4}</span>
                <span className={styles.pricingItemValue}>R$ 100,00</span>
              </li>
              <li className={styles.pricingListItem}>
                <span>{t.offerItem5}</span>
                <span className={styles.pricingItemValue}>R$ 100,00</span>
              </li>
              <li className={styles.pricingListItem}>
                <span>{t.offerItem6}</span>
                <span className={styles.pricingItemValue}>R$ 50,00</span>
              </li>
              <li className={styles.pricingListItem}>
                <span>{t.offerItem7}</span>
                <span className={styles.pricingItemValue}>R$ 50,00</span>
              </li>
            </ul>
            
            <div className={styles.pricingTotal}>
              <span>{t.offerTotalEstimate}</span>
              <span className={styles.redStrikethrough}>R$ 800,00</span>
            </div>

            <div className={styles.pricingFinal}>
              <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-gray)' }}>{t.offerFrom}</span>
              <h2 className={styles.offerPrice}>{t.offerPrice}</h2>
              <p className={styles.offerCondition}>{t.offerCondition}</p>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginTop: '6px' }}>
                {t.offerNoSubscription}
              </p>
            </div>
            
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button onClick={() => handleWhatsAppClick('pricing')} className={`${styles.ctaButton} ${styles.ctaSolidPink} ${styles.ctaFullWidth}`}>
                {t.ctaForm}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 - COMO FUNCIONA */}
      <section className={styles.processSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>{t.processTitle}</h2>
          
          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div style={{ marginBottom: '20px' }}>
                <Image src="/etapa1.jpg" alt="Etapa 1" width={400} height={300} style={{ objectFit: 'cover', width: '100%', height: '300px', borderRadius: '12px' }} />
              </div>
              <h3 className={styles.stepTitle}>{t.processStep1Title}</h3>
              <p className={styles.stepDesc}>{t.processStep1Desc}</p>
            </div>
            <div className={styles.processStep}>
              <div style={{ marginBottom: '20px' }}>
                <Image src="/etapa2.jpg" alt="Etapa 2" width={400} height={300} style={{ objectFit: 'cover', width: '100%', height: '300px', borderRadius: '12px' }} />
              </div>
              <h3 className={styles.stepTitle}>{t.processStep2Title}</h3>
              <p className={styles.stepDesc}>{t.processStep2Desc}</p>
            </div>
            <div className={styles.processStep}>
              <div style={{ marginBottom: '20px' }}>
                <Image src="/etapa3.jpg" alt="Etapa 3" width={400} height={300} style={{ objectFit: 'cover', width: '100%', height: '300px', borderRadius: '12px' }} />
              </div>
              <h3 className={styles.stepTitle}>{t.processStep3Title}</h3>
              <p className={styles.stepDesc}>{t.processStep3Desc}</p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <button 
              className={`${styles.ctaButton} ${styles.ctaSolidPink}`}
              onClick={() => handleWhatsAppClick('como_funciona')}
            >
              {t.ctaProcess}
            </button>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6 - GARANTIA + OBJEÇÕES (FAQ) */}
      <section className={styles.guaranteeSection}>
        <div className={`container ${styles.guaranteeContainer}`}>
          <div className={styles.guaranteeVisual}>
            <Image src="/garantia.png" alt="Selo de 7 Dias de Garantia" width={280} height={280} style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }} />
          </div>
          <div className={styles.guaranteeContent}>
            <span className={styles.guaranteeLabel}>{t.guaranteeLabel}</span>
            <h2 className={styles.guaranteeTitle}>
              {t.guaranteeTitle1}<span className={styles.highlightPink} style={{ fontWeight: 800 }}>{t.guaranteeTitle2}</span>{t.guaranteeTitle3}
            </h2>
            <p className={styles.guaranteeText}>
              {t.guaranteeText}<strong>{t.guaranteeTextBold}</strong>.
            </p>
            <div className={styles.guaranteeFeature}>
              <div className={styles.guaranteeCheck}>✓</div>
              <span>{t.guaranteeCheck}</span>
            </div>
          </div>
        </div>

        {/* OBJEÇÕES & PERGUNTAS FREQUENTES INTEGRADAS */}
        <div className="container" style={{ marginTop: '60px' }}>
          <h2 className={styles.sectionTitle} style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>{t.faqTitle}</h2>
          <div className={styles.faqList}>
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{t.faqQ1}</summary>
              <div className={styles.faqAnswer}>{t.faqA1}</div>
            </details>
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{t.faqQ2}</summary>
              <div className={styles.faqAnswer}>{t.faqA2}</div>
            </details>
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{t.faqQ3}</summary>
              <div className={styles.faqAnswer}>{t.faqA3}</div>
            </details>
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{t.faqQ4}</summary>
              <div className={styles.faqAnswer}>{t.faqA4}</div>
            </details>
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{t.faqQ5}</summary>
              <div className={styles.faqAnswer}>{t.faqA5}</div>
            </details>
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{t.faqQ6}</summary>
              <div className={styles.faqAnswer}>{t.faqA6}</div>
            </details>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <button 
              className={`${styles.ctaButton} ${styles.ctaSolidPink}`}
              onClick={() => handleWhatsAppClick('faq')}
            >
              {t.ctaFaq}
            </button>
          </div>
        </div>
      </section>

      {/* SEÇÃO 7 - FECHAMENTO & RODAPÉ */}
      <section className={styles.finalCtaSection}>
        <div className="container">
          <h2 className={styles.finalTitle}>
            {t.finalTitle.split("\n")[0]}<br/>{t.finalTitle.split("\n")[1]}
          </h2>
          <h3 className={styles.finalSubtitle}>{t.finalSubtitle}</h3>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '20px', fontWeight: 400 }}>
            {t.finalPersuasion}
          </p>
          <div style={{ marginTop: '30px', maxWidth: '400px', margin: '30px auto 0 auto' }}>
            <form className={styles.modalForm} onSubmit={handleSubmitForm}>
              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>{t.formLabelName}</label>
                <input 
                  type="text" 
                  placeholder={t.formNamePlaceholder} 
                  className={styles.modalInput}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>{t.formLabelCompany}</label>
                <input 
                  type="text" 
                  placeholder={t.formCompanyPlaceholder} 
                  className={styles.modalInput}
                  value={userCompany}
                  onChange={(e) => setUserCompany(e.target.value)}
                  required
                />
              </div>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>{t.formLabelSelect}</label>
                <select 
                  className={styles.modalSelect}
                  value={siteType}
                  onChange={(e) => setSiteType(e.target.value)}
                  required
                >
                  <option value={t.formSelect1}>{t.formSelect1}</option>
                  <option value={t.formSelect2}>{t.formSelect2}</option>
                  <option value={t.formSelect3}>{t.formSelect3}</option>
                  <option value={t.formSelect4}>{t.formSelect4}</option>
                  <option value={t.formSelect5}>{t.formSelect5}</option>
                  <option value={t.formSelect6}>{t.formSelect6}</option>
                </select>
              </div>

              <button type="submit" className={`${styles.ctaButton} ${styles.ctaGiant} ${styles.ctaSolidPink} ${styles.ctaFullWidth}`}>
                {t.ctaForm}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={`container ${styles.footerContainer}`}>
          <div className={styles.footerBrand}>
            <img src="/logo_siteexpress.png?v=2" alt="SiteExpress Logo" width="160" height="37" className={styles.logoImage} style={{ filter: 'brightness(0) invert(1)' }} />
            <p className={styles.footerBio}>
              {t.footerBio1}
              <span className={styles.highlightPink} style={{ fontWeight: 800 }}>{t.footerBio2}</span>
            </p>
          </div>
          
          <div className={styles.footerGrid}>
            <div className={styles.footerCol}>
              <h4>{t.footerContactTitle}</h4>
              <a href="#">{t.footerWhatsapp}</a>
              <a href="#">{t.footerEmail}</a>
            </div>
            <div className={styles.footerCol}>
              <h4>{t.footerLegalTitle}</h4>
              <a href="#">{t.footerCnpj}</a>
              <a href="#">{t.footerPrivacy}</a>
              <a href="#">{t.footerTerms}</a>
            </div>
            <div className={styles.footerCol}>
              <h4>{t.footerSocialTitle}</h4>
              <a href="https://instagram.com/siteexpressbrasil" target="_blank" rel="noopener noreferrer">{t.footerInstagram}</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div className="container">
            <p>{t.footerCopyright}</p>
          </div>
        </div>
      </footer>



      <WhatsAppWidget lang={lang} />

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setIsModalOpen(false)}>×</button>
            <h3 className={styles.modalTitle}>{t.modalTitle}</h3>
            <p className={styles.modalDesc}>{t.modalDesc}</p>
            
            <form className={styles.modalForm} onSubmit={handleSubmitForm}>
              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>{t.formLabelName}</label>
                <input 
                  type="text" 
                  placeholder={t.formNamePlaceholder} 
                  className={styles.modalInput}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>{t.formLabelCompany}</label>
                <input 
                  type="text" 
                  placeholder={t.formCompanyPlaceholder} 
                  className={styles.modalInput}
                  value={userCompany}
                  onChange={(e) => setUserCompany(e.target.value)}
                  required
                />
              </div>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>{t.formLabelSelect}</label>
                <select 
                  className={styles.modalSelect}
                  value={siteType}
                  onChange={(e) => setSiteType(e.target.value)}
                  required
                >
                  <option value={t.formSelect1}>{t.formSelect1}</option>
                  <option value={t.formSelect2}>{t.formSelect2}</option>
                  <option value={t.formSelect3}>{t.formSelect3}</option>
                  <option value={t.formSelect4}>{t.formSelect4}</option>
                  <option value={t.formSelect5}>{t.formSelect5}</option>
                  <option value={t.formSelect6}>{t.formSelect6}</option>
                </select>
              </div>

              <button type="submit" className={`${styles.ctaButton} ${styles.ctaFullWidth} ${styles.ctaSolidPink}`}>
                {t.ctaModal}
              </button>
              <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '12px', textAlign: 'center', fontWeight: 500 }}>
                {t.modalMicrocopy}
              </p>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
