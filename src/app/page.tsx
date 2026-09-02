"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import WhatsAppWidget from './WhatsAppWidget';

export default function Home() {
  
  const [timeLeft, setTimeLeft] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userCompany, setUserCompany] = useState("");

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
    const text = encodeURIComponent(`ola meu nome é ${userName} empresa: ${userCompany} gostario de fazer um site com vocês 💖`);
    window.open(`https://wa.me/5511999999999?text=${text}`, '_blank');
    setIsModalOpen(false);
  };

  return (
    <main className={styles.main}>


      {/* STICKY BANNER */}
      {todayDate && (
        <div className={styles.stickyBanner}>
          <div className="container">
            <p className={styles.stickyBannerText}>
              OFERTA VÁLIDA SOMENTE HOJE DIA {todayDate}: SITE PROFISSIONAL POR APENAS R$ 297!
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
        </div>
      </header>

      {/* SEÇÃO 1 - HERO */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              ENTREGAMOS EM 24 HORAS
            </div>
            
            <h1 className={styles.headline}>
              Seu site profissional no ar por <span className={styles.highlightPink}>R$ 297.</span>
            </h1>
            
            <p className={styles.subheadline}>
              Domine as buscas do <strong>Google</strong> e das <strong>IAs</strong> antes do seu concorrente.<br/>
              A SiteExpress cria, configura e publica seu site profissional em tempo recorde para você parar de deixar dinheiro na mesa. Zero dor de cabeça e zero programação.
            </p>
            
            <div className={styles.heroCtaWrapper}>
              <button 
                className={`${styles.ctaButton} ${styles.ctaLarge}`}
                onClick={() => handleWhatsAppClick('hero')}
              >
                QUERO MEU SITE POR R$ 297
              </button>
              <div className={styles.verifiedBadge}>
                <Image src="/verificado.jpg" alt="Empresa Verificada" width={24} height={24} className={styles.verifiedImage} />
                <span>Empresa verificada</span>
              </div>
            </div>
          </div>
          
          <div className={styles.heroVisual}>
             <Image src="/hero_2.png" alt="Mulher trabalhando MacBook SiteExpress" width={600} height={500} className={styles.heroImage} priority />
          </div>
        </div>
      </section>

      {/* SEÇÃO BENEFÍCIOS */}
      <section className={styles.benefitsSection}>
        <div className="container">
          <div className={styles.benefitsHeader}>
            <h2 className={styles.sectionTitle}>Por que ter um site ajuda a sua empresa?</h2>
            <p className={styles.sectionSubtitle}>Estar presente na internet de forma profissional não é mais opção, é necessidade.</p>
          </div>
          <div className={styles.benefitsGrid}>
            <div className={`${styles.benefitCard} ${styles.googleCard}`}>
              <div className={styles.benefitIcon}>
                <Image src="/google.png" alt="Google" width={64} height={64} style={{ objectFit: 'contain' }} />
              </div>
              <h3>
                Buscas do <span style={{color: '#4285F4'}}>G</span><span style={{color: '#EA4335'}}>o</span><span style={{color: '#FBBC05'}}>o</span><span style={{color: '#4285F4'}}>g</span><span style={{color: '#34A853'}}>l</span><span style={{color: '#EA4335'}}>e</span> Orgânico
              </h3>
              <p>Ajuda a colocar a sua empresa nas buscas do Google de forma orgânica, sendo encontrada por clientes que procuram seu serviço.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Image src="/claude.png" alt="Claude" width={44} height={44} style={{ objectFit: 'contain' }} />
                <Image src="/gemini.png" alt="Gemini" width={90} height={40} style={{ objectFit: 'contain' }} />
                <Image src="/chatgpt.png" alt="ChatGPT" width={44} height={44} style={{ objectFit: 'contain' }} />
              </div>
              <h3>Buscas das IAs</h3>
              <p>Ajuda nas buscas das inteligências artificiais. Ferramentas como ChatGPT recomendam empresas que possuem presença online estruturada.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <img src="/vendas.png?v=3" alt="Vendas" width="64" height="64" style={{ objectFit: 'contain' }} />
              </div>
              <h3>Trazer Mais Vendas</h3>
              <p>Com tudo isso, um site profissional transmite confiança, atrai mais visitantes qualificados e consequentemente traz mais vendas para o seu negócio.</p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <button 
              className={`${styles.ctaButton} ${styles.ctaSolidPink}`}
              onClick={() => handleWhatsAppClick('beneficios')}
            >
              QUERO MEU SITE PROFISSIONAL
            </button>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 - OFERTA */}
      <section className={styles.offerSection}>
        <div className={`container`}>
          <div className={styles.offerHeader}>
            <h2 className={styles.sectionTitle}>Não é só "um site".<br/>Você recebe tudo pronto para funcionar.</h2>
            <p className={styles.sectionSubtitle}>Do visual à publicação, a parte técnica fica com a gente.</p>
          </div>



          <div className={styles.pricingListCard}>
            <ul className={styles.pricingList}>
              <li className={`${styles.pricingListItem} ${styles.highlightedItem}`}>
                <span>Sua empresa nas Inteligências Artificiais</span>
                <span className={styles.pricingItemValue}>R$ 200,00</span>
              </li>
              <li className={styles.pricingListItem}>
                <span>Design Profissional Customizado</span>
                <span className={styles.pricingItemValue}>R$ 350,00</span>
              </li>
              <li className={styles.pricingListItem}>
                <span>Otimização para Celular (Responsivo)</span>
                <span className={styles.pricingItemValue}>R$ 150,00</span>
              </li>
              <li className={styles.pricingListItem}>
                <span>Configuração de SEO & GEO Local</span>
                <span className={styles.pricingItemValue}>R$ 150,00</span>
              </li>
              <li className={styles.pricingListItem}>
                <span>Google Analytics & Search Console</span>
                <span className={styles.pricingItemValue}>R$ 200,00</span>
              </li>
              <li className={styles.pricingListItem}>
                <span>Integração com WhatsApp</span>
                <span className={styles.pricingItemValue}>R$ 50,00</span>
              </li>
              <li className={styles.pricingListItem}>
                <span>Publicação e Hospedagem Inicial</span>
                <span className={styles.pricingItemValue}>R$ 100,00</span>
              </li>
            </ul>
            
            <div className={styles.pricingTotal}>
              <span>Valor Total Estimado:</span>
              <span className={styles.redStrikethrough}>R$ 500,00</span>
            </div>

            <div className={styles.pricingFinal}>
              <div className={styles.offerBadge}>HOJE NA SITEEXPRESS</div>
              <h2 className={styles.offerPrice}>R$ 297</h2>
              <p className={styles.offerCondition}>Pagamento único.</p>
            </div>
            
            <div style={{ marginTop: '20px', textAlign: 'left' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gray)', marginBottom: '10px', textAlign: 'center' }}>
                Preencha para falar no WhatsApp:
              </p>
              <form className={styles.modalForm} onSubmit={handleSubmitForm}>
                <input 
                  type="text" 
                  placeholder="Seu nome" 
                  className={styles.modalInput}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Nome da sua empresa" 
                  className={styles.modalInput}
                  value={userCompany}
                  onChange={(e) => setUserCompany(e.target.value)}
                  required
                />
                <button type="submit" className={`${styles.ctaButton} ${styles.ctaSolidPink} ${styles.ctaFullWidth}`}>
                  QUERO APROVEITAR POR R$ 297 ➔
                </button>
              </form>
            </div>
            <p className={styles.microcopy}>
              O domínio .com.br é contratado separadamente e custa aproximadamente R$39,99/ano.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 - COMO FUNCIONA */}
      <section className={styles.processSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Você manda o básico.<br/>A gente cuida do resto.</h2>
          
          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div style={{ marginBottom: '20px' }}>
                <Image src="/etapa1.jpg" alt="Etapa 1" width={400} height={300} style={{ objectFit: 'cover', width: '100%', height: '300px', borderRadius: '12px' }} />
              </div>
              <h3 className={styles.stepTitle}>Você manda as informações</h3>
              <p className={styles.stepDesc}>Logo, serviços, WhatsApp, fotos e referências.</p>
            </div>
            <div className={styles.processStep}>
              <div style={{ marginBottom: '20px' }}>
                <Image src="/etapa2.jpg" alt="Etapa 2" width={400} height={300} style={{ objectFit: 'cover', width: '100%', height: '300px', borderRadius: '12px' }} />
              </div>
              <h3 className={styles.stepTitle}>Criamos seu site</h3>
              <p className={styles.stepDesc}>Montamos o visual, conteúdo e estrutura e enviamos uma primeira prévia.</p>
            </div>
            <div className={styles.processStep}>
              <div style={{ marginBottom: '20px' }}>
                <Image src="/etapa3.jpg" alt="Etapa 3" width={400} height={300} style={{ objectFit: 'cover', width: '100%', height: '300px', borderRadius: '12px' }} />
              </div>
              <h3 className={styles.stepTitle}>Você aprova. A gente publica.</h3>
              <p className={styles.stepDesc}>Fazemos os ajustes combinados e colocamos tudo no ar.</p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <button 
              className={`${styles.ctaButton} ${styles.ctaSolidPink}`}
              onClick={() => handleWhatsAppClick('como_funciona')}
            >
              COMEÇAR MEU PROJETO AGORA
            </button>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 - GARANTIA */}
      <section className={styles.guaranteeSection}>
        <div className={`container ${styles.guaranteeContainer}`}>
          <div className={styles.guaranteeVisual}>
            <Image src="/garantia.png" alt="Selo de 7 Dias de Garantia" width={280} height={280} style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }} />
          </div>
          <div className={styles.guaranteeContent}>
            <span className={styles.guaranteeLabel}>RISCO ZERO PARA VOCÊ</span>
            <h2 className={styles.guaranteeTitle}>
              SE NÃO GOSTAR, <span className={styles.highlightPink}>DEVOLVEMOS</span> SEU DINHEIRO!
            </h2>
            <p className={styles.guaranteeText}>
              Confiamos tanto no padrão de excelência dos nossos projetos que o risco é 100% nosso. Se após receber a primeira versão do seu site você entender que ele não atende aos seus objetivos, <strong>devolvemos todo o seu dinheiro investido</strong>. Sem burocracia e sem letras miúdas. Consulte nossos <a href="#" style={{color: 'var(--color-magenta)', textDecoration: 'underline'}}>Termos de Garantia</a>.
            </p>
            <div className={styles.guaranteeFeature}>
              <div className={styles.guaranteeCheck}>✓</div>
              <span>Atendimento direto e rápido</span>
            </div>
            <button 
              className={`${styles.ctaButton} ${styles.ctaSolidPink}`}
              onClick={() => handleWhatsAppClick('garantia')}
              style={{ marginTop: '20px' }}
            >
              QUERO MEU SITE COM GARANTIA ➔
            </button>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6 - CTA FINAL */}
      <section className={styles.finalCtaSection}>
        <div className="container">
          <h2 className={styles.finalTitle}>
            Seu próximo cliente provavelmente<br/>vai pesquisar sua empresa.
          </h2>
          <h3 className={styles.finalSubtitle}>O que ele vai encontrar?</h3>
          <div style={{ marginTop: '30px', maxWidth: '400px', margin: '30px auto 0 auto' }}>
            <p style={{ fontSize: '1rem', color: 'var(--color-gray)', marginBottom: '16px' }}>
              Preencha para falar direto com a gente no WhatsApp:
            </p>
            <form className={styles.modalForm} onSubmit={handleSubmitForm}>
              <input 
                type="text" 
                placeholder="Seu nome" 
                className={styles.modalInput}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <input 
                type="text" 
                placeholder="Nome da sua empresa" 
                className={styles.modalInput}
                value={userCompany}
                onChange={(e) => setUserCompany(e.target.value)}
                required
              />
              <button type="submit" className={`${styles.ctaButton} ${styles.ctaGiant} ${styles.ctaSolidPink} ${styles.ctaFullWidth}`}>
                QUERO MEU SITE POR R$ 297 ➔
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* SEÇÃO 7 - FAQ */}
      <section className={styles.faqSection}>
        <div className="container">
          <div className={styles.faqList}>
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>Tem mensalidade?</summary>
              <div className={styles.faqAnswer}>Não. O investimento para criação do site é de R$297. O único custo externo obrigatório é o domínio, que custa aproximadamente R$39,99 por ano.</div>
            </details>
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>Quanto tempo leva?</summary>
              <div className={styles.faqAnswer}>Depois de recebermos as informações necessárias, seu projeto entra em produção e é entregue em poucos dias.</div>
            </details>
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>Preciso entender de tecnologia?</summary>
              <div className={styles.faqAnswer}>Não. Nós cuidamos da criação, configuração e publicação para você.</div>
            </details>
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>Posso pedir alterações?</summary>
              <div className={styles.faqAnswer}>Sim. Após receber a primeira prévia, fazemos os ajustes combinados dentro do escopo antes da publicação.</div>
            </details>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <button 
              className={`${styles.ctaButton} ${styles.ctaSolidPink}`}
              onClick={() => handleWhatsAppClick('faq')}
            >
              TIRAR DÚVIDAS NO WHATSAPP
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={`container ${styles.footerContainer}`}>
          <div className={styles.logo}>
            <img src="/logo_siteexpress.png?v=2" alt="SiteExpress Logo" width="120" height="28" className={styles.logoImage} />
          </div>
          <div className={styles.footerLinks}>
            <a href="#">Instagram</a>
            <a href="#">WhatsApp</a>
            <a href="#">CNPJ</a>
            <a href="#">Política de Privacidade</a>
            <a href="#">Termos</a>
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE CTA */}
      <div className={styles.stickyMobileCta}>
        <button 
          className={`${styles.ctaButton} ${styles.ctaFullWidth}`}
          onClick={() => handleWhatsAppClick('sticky')}
        >
          QUERO MEU SITE POR R$297
        </button>
      </div>

      <WhatsAppWidget />

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setIsModalOpen(false)}>×</button>
            <h3 className={styles.modalTitle}>Quase lá!</h3>
            <p className={styles.modalDesc}>Preencha rápido para falarmos no WhatsApp:</p>
            
            <form className={styles.modalForm} onSubmit={handleSubmitForm}>
              <input 
                type="text" 
                placeholder="Seu nome" 
                className={styles.modalInput}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <input 
                type="text" 
                placeholder="Nome da sua empresa (ou ideia)" 
                className={styles.modalInput}
                value={userCompany}
                onChange={(e) => setUserCompany(e.target.value)}
                required
              />
              <button type="submit" className={`${styles.ctaButton} ${styles.ctaFullWidth} ${styles.ctaSolidPink}`}>
                CHAMAR NO WHATSAPP ➔
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
