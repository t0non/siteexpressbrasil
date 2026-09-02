import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
content = content.replace("import WhatsAppWidget from './WhatsAppWidget';", "import WhatsAppWidget from './WhatsAppWidget';\nimport { translations, Language } from './translations';")

# 2. Add state
content = content.replace('const [timeLeft, setTimeLeft] = useState("");', 'const [lang, setLang] = useState<Language>("pt");\n  const t = translations[lang];\n\n  const [timeLeft, setTimeLeft] = useState("");')

# 3. Banner
content = content.replace('MÊS DE ANIVERSÁRIO SITEEXPRESS: SEU SITE A PARTIR DE R$ 297 SÓ HOJE ({todayDate})', '{t.banner(todayDate)}')

# 4. Header flags
header_original = '''          <div className={styles.logo}>
            <img src="/logo_siteexpress.png?v=2" alt="SiteExpress Logo" width="180" height="42" className={styles.logoImage} />
          </div>'''
header_new = '''          <div className={styles.logo}>
            <img src="/logo_siteexpress.png?v=2" alt="SiteExpress Logo" width="180" height="42" className={styles.logoImage} />
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginLeft: 'auto' }}>
            <span onClick={() => setLang('pt')} style={{ cursor: 'pointer', fontSize: '1.8rem', filter: lang === 'pt' ? 'none' : 'grayscale(100%)', opacity: lang === 'pt' ? 1 : 0.5, transition: '0.3s' }}>🇧🇷</span>
            <span onClick={() => setLang('en')} style={{ cursor: 'pointer', fontSize: '1.8rem', filter: lang === 'en' ? 'none' : 'grayscale(100%)', opacity: lang === 'en' ? 1 : 0.5, transition: '0.3s' }}>🇺🇸</span>
          </div>'''
content = content.replace(header_original, header_new)

# 5. WhatsApp Form
content = content.replace('const text = encodeURIComponent(`Olá, meu nome é ${userName}, empresa: ${userCompany}. Gostaria de fazer um site tipo: ${siteType} com vocês 💖`);', 'const text = encodeURIComponent(t.whatsappMessage(userName, userCompany, siteType));')
content = content.replace('const userConfirmed = window.confirm("Você está ciente que o investimento para o site é a partir de R$ 297?\\n\\nClique em OK para continuarmos no WhatsApp!");', 'const userConfirmed = window.confirm(t.whatsappConfirm);')

# 6. Hero
content = content.replace('ENTREGAMOS EM 24 HORAS', '{t.heroBadge}')
content = content.replace('Seu site profissional no ar <span className={styles.highlightPink}>a partir de R$ 297.</span>', '{t.heroHeadlinePart1}<span className={styles.highlightPink}>{t.heroHeadlinePart2}</span>')
content = content.replace('e pare de deixar dinheiro na mesa.<br/>', '{t.heroSubheadline1}<br/>')
content = content.replace('Entregamos seu site profissional no ar em tempo recorde.<br/>', '{t.heroSubheadline2}<br/>')
content = content.replace('<strong>Zero dor de cabeça, zero código.</strong>', '<strong>{t.heroSubheadline3}</strong>')
content = content.replace('QUERO MEU SITE A PARTIR DE R$ 297', '{t.ctaHero}')
content = content.replace('<span>Empresa verificada</span>', '<span>{t.verifiedCompany}</span>')

# 7. Benefits
content = content.replace('Por que ter um site ajuda a sua empresa?', '{t.benefitsTitle}')
content = content.replace('Estar presente na internet de forma profissional não é mais opção, é necessidade.', '{t.benefitsSubtitle}')
content = content.replace(' Orgânico', '{t.benefit1Title}')
content = content.replace('Ajuda a colocar a sua empresa nas buscas do Google de forma orgânica, sendo encontrada por clientes que procuram seu serviço.', '{t.benefit1Desc}')
content = content.replace('Buscas das IAs', '{t.benefit2Title}')
content = content.replace('Ajuda nas buscas das inteligências artificiais. Ferramentas como ChatGPT recomendam empresas que possuem presença online estruturada.', '{t.benefit2Desc}')
content = content.replace('Trazer Mais Vendas', '{t.benefit3Title}')
content = content.replace('Com tudo isso, um site profissional transmite confiança, atrai mais visitantes qualificados e consequentemente traz mais vendas para o seu negócio.', '{t.benefit3Desc}')
content = content.replace('QUERO MEU SITE A PARTIR DE R$ 397', '{t.ctaBenefits}')

# 8. Offer
content = content.replace('Não é só "um site".<br/>Você recebe tudo pronto para funcionar.', '{t.offerTitle.split("\\n")[0]}<br/>{t.offerTitle.split("\\n")[1]}')
content = content.replace('Do visual à publicação, a parte técnica fica com a gente.', '{t.offerSubtitle}')

# 9. Offer List
content = content.replace('<span>Sua empresa nas Inteligências Artificiais</span>', '<span>{t.offerItem1}</span>')
content = content.replace('<span>Design Profissional Customizado</span>', '<span>{t.offerItem2}</span>')
content = content.replace('<span>Otimização para Celular (Responsivo)</span>', '<span>{t.offerItem3}</span>')
content = content.replace('<span>Configuração de SEO & GEO Local</span>', '<span>{t.offerItem4}</span>')
content = content.replace('<span>Google Analytics & Search Console</span>', '<span>{t.offerItem5}</span>')
content = content.replace('<span>Integração com WhatsApp</span>', '<span>{t.offerItem6}</span>')
content = content.replace('<span>Publicação e Hospedagem Inicial</span>', '<span>{t.offerItem7}</span>')

# 10. Offer Values
content = content.replace('<span>Valor Total Estimado:</span>', '<span>{t.offerTotalEstimate}</span>')
content = content.replace('>A partir de<', '>{t.offerFrom}<')
content = content.replace('>R$ 297<', '>{t.offerPrice}<')
content = content.replace('>Pagamento único.<', '>{t.offerCondition}<')

# 11. Form
content = content.replace('Preencha para falar no WhatsApp:', '{t.formTitle}')
content = content.replace('placeholder="Seu nome"', 'placeholder={t.formNamePlaceholder}')
content = content.replace('placeholder="Nome da sua empresa"', 'placeholder={t.formCompanyPlaceholder}')
content = content.replace('placeholder="Nome da sua empresa (ou ideia)"', 'placeholder={t.formCompanyPlaceholder}')
content = content.replace('<option value="Institucional">Site Institucional</option>', '<option value="Institucional">{t.formSelect1}</option>')
content = content.replace('<option value="Landing Page">Landing Page / Vendas</option>', '<option value="Landing Page">{t.formSelect2}</option>')
content = content.replace('<option value="E-commerce">E-commerce / Loja Virtual</option>', '<option value="E-commerce">{t.formSelect3}</option>')
content = content.replace('<option value="Blog/Portal">Blog / Portal</option>', '<option value="Blog/Portal">{t.formSelect4}</option>')
content = content.replace('<option value="Outro">Outro (Sistema, App, etc)</option>', '<option value="Outro">{t.formSelect5}</option>')
content = content.replace('QUERO APROVEITAR A PARTIR DE R$ 297 ➔', '{t.ctaForm}')
content = content.replace('O domínio .com.br é contratado separadamente e custa aproximadamente R$39,99/ano.', '{t.microcopy}')

# 12. Process
content = content.replace('Como funciona?', '{t.processTitle}')
content = content.replace('Passo 1: Você manda as informações', '{t.processStep1Title}')
content = content.replace('Logo, serviços, WhatsApp, fotos e referências.', '{t.processStep1Desc}')
content = content.replace('Passo 2: Criamos seu site', '{t.processStep2Title}')
content = content.replace('Montamos o visual, conteúdo e estrutura e enviamos uma primeira prévia.', '{t.processStep2Desc}')
content = content.replace('Passo 3: Você aprova. A gente publica.', '{t.processStep3Title}')
content = content.replace('Fazemos os ajustes combinados e colocamos tudo no ar.', '{t.processStep3Desc}')
content = content.replace('COMEÇAR MEU PROJETO AGORA', '{t.ctaProcess}')

# 13. Guarantee
content = content.replace('RISCO ZERO PARA VOCÊ', '{t.guaranteeLabel}')
content = content.replace('SE NÃO GOSTAR, <span className={styles.highlightPink} style={{ fontWeight: 800 }}>DEVOLVEMOS</span> SEU DINHEIRO!', '{t.guaranteeTitle1}<span className={styles.highlightPink} style={{ fontWeight: 800 }}>{t.guaranteeTitle2}</span>{t.guaranteeTitle3}')
content = content.replace('Confiamos tanto no padrão de excelência dos nossos projetos que o risco é 100% nosso. Se após receber a primeira versão do seu site você entender que ele não atende aos seus objetivos, <strong>devolvemos todo o seu dinheiro investido</strong>. Consulte nossos <a href="#" style={{color: \'var(--color-magenta)\', textDecoration: \'underline\'}}>Termos de Garantia</a>.', '{t.guaranteeText}<strong>{t.guaranteeTextBold}</strong>{t.guaranteeTerms}<a href="#" style={{color: \'var(--color-magenta)\', textDecoration: \'underline\'}}>{t.guaranteeLink}</a>.')
content = content.replace('>Atendimento imediato<', '>{t.guaranteeCheck}<')
content = content.replace('QUERO MEU SITE COM GARANTIA ➔', '{t.ctaGuarantee}')

# 14. Final
content = content.replace('Seu próximo cliente provavelmente<br/>vai pesquisar sua empresa.', '{t.finalTitle.split("\\n")[0]}<br/>{t.finalTitle.split("\\n")[1]}')
content = content.replace('O que ele vai encontrar?', '{t.finalSubtitle}')
content = content.replace('Se você pensou &quot;nada&quot;, você está perdendo dinheiro.', '{t.finalPersuasion}')
content = content.replace('Preencha para falar direto com a gente no WhatsApp:', '{t.finalFormTitle}')
content = content.replace('QUERO MEU SITE A PARTIR DE R$ 297 ➔', '{t.ctaFinal}')

# 15. FAQ
content = content.replace('Tem mensalidade?', '{t.faqQ1}')
content = content.replace('Não. O investimento para criação do site é a partir de R$ 297. O único custo externo obrigatório é o domínio, que custa aproximadamente R$39,99 por ano.', '{t.faqA1}')
content = content.replace('Quanto tempo leva?', '{t.faqQ2}')
content = content.replace('Depois de recebermos as informações necessárias, seu projeto entra em produção e é entregue em poucos dias.', '{t.faqA2}')
content = content.replace('Preciso entender de tecnologia?', '{t.faqQ3}')
content = content.replace('Não. Nós cuidamos da criação, configuração e publicação para você.', '{t.faqA3}')
content = content.replace('Posso pedir alterações?', '{t.faqQ4}')
content = content.replace('Sim. Após receber a primeira prévia, fazemos os ajustes combinados dentro do escopo antes da publicação.', '{t.faqA4}')
content = content.replace('TIRAR DÚVIDAS NO WHATSAPP', '{t.ctaFaq}')

# 16. Footer
content = content.replace('@siteexpressbrasil', '{t.footerInstagram}')
content = content.replace('>WhatsApp<', '>{t.footerWhatsapp}<')
content = content.replace('>CNPJ<', '>{t.footerCnpj}<')
content = content.replace('>Política de Privacidade<', '>{t.footerPrivacy}<')
content = content.replace('>Termos<', '>{t.footerTerms}<')

# 17. Modal (bottom)
content = content.replace('Quase lá!', '{t.modalTitle}')
content = content.replace('Preencha rápido para falarmos no WhatsApp:', '{t.modalDesc}')
content = content.replace('CHAMAR NO WHATSAPP ➔', '{t.ctaModal}')

# 18. Widget prop
content = content.replace('<WhatsAppWidget />', '<WhatsAppWidget lang={lang} />')

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)


with open('src/app/WhatsAppWidget.tsx', 'r', encoding='utf-8') as f:
    widget_content = f.read()

widget_content = widget_content.replace("import styles from './WhatsAppWidget.module.css';", "import styles from './WhatsAppWidget.module.css';\nimport { translations, Language } from './translations';")
widget_content = widget_content.replace('export default function WhatsAppWidget() {', 'export default function WhatsAppWidget({ lang = "pt" }: { lang?: Language }) {\n  const t = translations[lang];')
widget_content = widget_content.replace("Olá, vamos fazer o seu site hoje?", "{t.widgetGreeting}")
widget_content = widget_content.replace("Não perca essa chance, site a partir de R$ 297! 🚀", "{t.widgetOffer}")
widget_content = widget_content.replace(">Falar no WhatsApp<", ">{t.widgetButton}<")

with open('src/app/WhatsAppWidget.tsx', 'w', encoding='utf-8') as f:
    f.write(widget_content)
