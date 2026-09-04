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
  const [userWhatsapp, setUserWhatsapp] = useState("");
  const [userCompany, setUserCompany] = useState("");
  const [siteType, setSiteType] = useState("Site para apresentar minha empresa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buttonText, setButtonText] = useState(t.ctaModal);

  const getOrCreateLeadId = () => {
    if (typeof window === "undefined") return "SX-FALLBACK";
    let leadId = sessionStorage.getItem('active_lead_id');
    if (!leadId) {
      const randomId = Math.random().toString(16).slice(2, 10).toUpperCase();
      leadId = `SX-${randomId}`;
      sessionStorage.setItem('active_lead_id', leadId);
    }
    return leadId;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      getOrCreateLeadId(); // Garante o ID ativo no inicio da sessao
      
      if (!sessionStorage.getItem('session_timestamp')) {
        sessionStorage.setItem('session_timestamp', Date.now().toString());
      }
      
      // NOVA LÓGICA DE TRACKING (Persistência no localStorage por 30 dias)
      const params = new URLSearchParams(window.location.search);
      const trackParams = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
        'fbclid', 'campaign', 'campaign_id', 'adset', 'adset_id', 'ad', 'ad_id'
      ];
      
      let currentParams: Record<string, string> = {};
      let hasAnyTrackParam = false;
      trackParams.forEach(param => {
        if (params.has(param)) {
          const val = params.get(param) || '';
          currentParams[param] = val;
          if (val) hasAnyTrackParam = true;
        }
      });

      // Identificar se é Meta Ads nesta visita específica
      let isCurrentMetaAds = false;
      const utmSource = (currentParams.utm_source || '').toLowerCase();
      const utmMedium = (currentParams.utm_medium || '').toLowerCase();
      
      if (
        currentParams.fbclid || 
        ['meta', 'facebook', 'instagram', 'fb'].includes(utmSource) ||
        utmMedium === 'paid_social'
      ) {
        isCurrentMetaAds = true;
      } else if (currentParams.campaign || currentParams.adset || currentParams.ad) {
        isCurrentMetaAds = true;
      }

      // Se for Meta Ads, salvar no localStorage
      if (isCurrentMetaAds) {
        const trackingData = {
          ...currentParams,
          origin: 'META ADS',
          captured_at: Date.now()
        };
        localStorage.setItem('sx_tracking_data', JSON.stringify(trackingData));
      }
      
      // Manter também a lógica legada do sessionStorage para não quebrar outras partes
      if (hasAnyTrackParam) {
        Object.entries(currentParams).forEach(([k, v]) => {
          sessionStorage.setItem(k, v);
        });
      }
      
      // Processa a fila no load
      processPendingLeads();
    }

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
    if (typeof window !== "undefined") {
      getOrCreateLeadId(); // Garante q tem ID ao abrir o modal
      
      // GTM: Track form modal open
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: 'siteexpress_form_start'
      });
    }

    setIsModalOpen(true);
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);
    if (v.length > 2) v = `(${v.substring(0, 2)}) ${v.substring(2)}`;
    if (v.length > 10) v = `${v.substring(0, 10)}-${v.substring(10)}`;
    setUserWhatsapp(v);
  };

  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return '';
  };

  const processPendingLeads = async () => {
    if (typeof window === "undefined") return;
    if ((window as any).isProcessingLeads) return; // Lock

    (window as any).isProcessingLeads = true;

    try {
      const queueStr = localStorage.getItem('siteexpress_pending_leads');
      if (!queueStr) return;
      
      let queue = [];
      try { queue = JSON.parse(queueStr); } catch (e) { queue = []; }
      if (!Array.isArray(queue) || queue.length === 0) return;

      const now = Date.now();
      const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
      let newQueue = [];

      for (const item of queue) {
        if (now - item.created_at > SEVEN_DAYS || item.retry_count >= 5) {
          continue; // descarta muito velhos ou q falharam 5 vezes
        }

        try {
          const res = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.payload),
            keepalive: true
          });
          
          if (!res.ok) {
            item.retry_count += 1;
            newQueue.push(item);
            continue;
          }
          
          const json = await res.json();
          if (json.ok) {
            // Sucesso (ou duplicate), remove (não da push pro newQueue)
          } else {
            item.retry_count += 1;
            newQueue.push(item);
          }
        } catch (err) {
          item.retry_count += 1;
          newQueue.push(item);
        }
      }

      localStorage.setItem('siteexpress_pending_leads', JSON.stringify(newQueue));
    } finally {
      (window as any).isProcessingLeads = false;
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanPhone = userWhatsapp.replace(/\D/g, '');
    if (!userName || !userCompany || cleanPhone.length < 10) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    setButtonText("Abrindo WhatsApp...");

    const currentSiteType = siteType || t.formSelect1;
    const finalPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const lead_id = getOrCreateLeadId(); // ID amarrado a este payload
    const session_timestamp = sessionStorage.getItem('session_timestamp') || Date.now().toString();

    // 1. Tentar recuperar tracking salvo no localStorage (com expiração de 30 dias)
    let storedTracking: any = null;
    try {
      const stored = localStorage.getItem('sx_tracking_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
        if (Date.now() - parsed.captured_at < THIRTY_DAYS) {
          storedTracking = parsed;
        } else {
          localStorage.removeItem('sx_tracking_data'); // expirou
        }
      }
    } catch (e) {
      console.error("Erro ao ler localStorage de tracking", e);
    }

    // 2. Definir função auxiliar de prioridade: URL atual > LocalStorage > Sessão
    const params = new URLSearchParams(window.location.search);
    const getParam = (key: string) => {
      // Prioridade 1: URL atual (desde que não esteja vazia)
      if (params.has(key) && params.get(key) !== "") return params.get(key) || "";
      // Prioridade 2: LocalStorage salvo (último clique pago)
      if (storedTracking && storedTracking[key]) return storedTracking[key];
      // Prioridade 3: SessionStorage (fallback legado)
      return sessionStorage.getItem(key) || '';
    };

    const fbclid = getParam('fbclid');
    const utm_source = getParam('utm_source');
    
    // 3. Determinar a origem sem falsos positivos de ORGÂNICO
    let origin = "ORGÂNICO";
    const checkSource = utm_source.toLowerCase();
    const checkMedium = getParam('utm_medium').toLowerCase();
    
    if (
      fbclid || 
      ['meta', 'facebook', 'instagram', 'fb'].includes(checkSource) ||
      checkMedium === 'paid_social' ||
      (storedTracking && storedTracking.origin === 'META ADS') ||
      getParam('campaign') || getParam('adset') || getParam('ad')
    ) {
      origin = "META ADS";
    }

    let fbc = getCookie('_fbc');
    if (!fbc && fbclid) {
      fbc = `fb.1.${session_timestamp}.${fbclid}`;
    }
    const fbp = getCookie('_fbp');

    // 4. Corrigir fuso horário para America/Sao_Paulo explicitamente no formato dd/MM/yyyy HH:mm
    const nowSaoPaulo = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).replace(',', ''); // Output: 04/09/2026 12:52

    const payload = {
      lead_id,
      name: userName,
      whatsapp: finalPhone,
      business: userCompany,
      project_type: currentSiteType,
      origin,
      campaign: getParam('campaign') || getParam('utm_campaign'),
      adset: getParam('adset'),
      ad: getParam('ad') || getParam('utm_content'),
      utm_source,
      utm_medium: getParam('utm_medium'),
      utm_campaign: getParam('utm_campaign'),
      utm_content: getParam('utm_content'),
      utm_term: getParam('utm_term'),
      campaign_id: getParam('campaign_id'),
      adset_id: getParam('adset_id'),
      ad_id: getParam('ad_id'),
      fbclid,
      fbc,
      fbp,
      created_at_br: nowSaoPaulo, // Enviando horário de SP para a API
      timestamp: nowSaoPaulo
    };

    // 1. Salvar na fila local (com retry_count = 0)
    if (typeof window !== "undefined") {
      let queue = [];
      try {
        const q = localStorage.getItem('siteexpress_pending_leads');
        if (q) queue = JSON.parse(q);
      } catch(e) {}
      
      queue.push({
        lead_id,
        created_at: Date.now(),
        retry_count: 0,
        payload
      });
      localStorage.setItem('siteexpress_pending_leads', JSON.stringify(queue));
      
      // 2. Disparar GTM imediatamente (sem PII)
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: 'siteexpress_lead',
        project_type: currentSiteType
      });
      
      // 3. Remover o lead_id atual para q o proximo modal gere um novo
      sessionStorage.removeItem('active_lead_id');
    }

    // 4. Abrir WhatsApp síncrono para evitar popup blocker
    const text = encodeURIComponent(t.whatsappMessage(userName, userCompany, currentSiteType) + `\n\nRef: ${lead_id}`);
    const wppUrl = `https://wa.me/553172247907?text=${text}`;
    window.open(wppUrl, '_blank');
    
    setIsModalOpen(false);
    
    // 5. Iniciar processamento da fila solto em background
    processPendingLeads().catch(() => {});

    // Limpar state do formulário
    setTimeout(() => {
      setUserName("");
      setUserWhatsapp("");
      setUserCompany("");
      setIsSubmitting(false);
      setButtonText(t.ctaModal);
    }, 1000);
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
              <span style={{ whiteSpace: 'nowrap' }}>
                {t.portfolioTitle4}
                <img src="/felicidad.png?v=1" alt="Felicidade" width="46" height="46" style={{ objectFit: 'contain', display: 'inline-block', verticalAlign: '-8px', marginLeft: '8px' }} />
              </span>
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
        </div>
      </section>

      {/* SEÇÃO 3 - POR QUE VALE A PENA */}
      <section className={styles.benefitsSection}>
        <div className="container">
          <div className={styles.benefitsHeader}>
            <h2 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span>{t.benefitsTitle}</span>
              <img src="/olho_iphone.png?v=1" alt="Olho iPhone" width="44" height="44" style={{ objectFit: 'contain', display: 'inline-block' }} />
            </h2>
            <p className={styles.sectionSubtitle} style={{ color: '#0F172A', fontWeight: 500 }}>
              {t.benefitsSubtitle1}<strong>{t.benefitsSubtitle2}</strong>
            </p>
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
                {buttonText === t.ctaModal ? t.ctaForm : buttonText}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 - COMO FUNCIONA */}
      <section className={styles.processSection}>
        <div className="container">
          <h2 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span>{t.processTitle}</span>
            <img src="/duvid.png?v=1" alt="Como funciona" width="44" height="44" style={{ objectFit: 'contain', display: 'inline-block' }} />
          </h2>
          
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
          <h2 className={styles.sectionTitle} style={{ color: '#0F172A', textAlign: 'center', marginBottom: '30px' }}>{t.faqTitle}</h2>
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
            {t.finalTitle}
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
                <label className={styles.modalLabel}>{t.formLabelWhatsapp}</label>
                <input 
                  type="tel" 
                  placeholder={t.formWhatsappPlaceholder} 
                  className={styles.modalInput}
                  value={userWhatsapp}
                  onChange={handleWhatsAppChange}
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

              <button type="submit" className={`${styles.ctaButton} ${styles.ctaSolidPink} ${styles.ctaFullWidth}`}>
                {buttonText === t.ctaModal ? t.ctaForm : buttonText}
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
            <h3 className={styles.modalTitle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span>{t.modalTitle}</span>
              <img src="/tchau.png?v=1" alt="Tchau" width="34" height="34" style={{ objectFit: 'contain', display: 'inline-block' }} />
            </h3>
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
                <label className={styles.modalLabel}>{t.formLabelWhatsapp}</label>
                <input 
                  type="tel" 
                  placeholder={t.formWhatsappPlaceholder} 
                  className={styles.modalInput}
                  value={userWhatsapp}
                  onChange={handleWhatsAppChange}
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
                {buttonText}
              </button>
              <p style={{ fontSize: '0.82rem', color: '#0F172A', marginTop: '12px', textAlign: 'center', fontWeight: 600 }}>
                {t.modalMicrocopy}
              </p>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
