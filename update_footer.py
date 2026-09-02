import re

# 1. translations.ts
with open('src/app/translations.ts', 'r', encoding='utf-8') as f:
    t_content = f.read()

t_content = t_content.replace('    footerInstagram: "@siteexpressbrasil",\n', '''    footerBio: "Transformamos ideias em sites profissionais de alta performance. Zero dor de cabeça, zero código.",
    footerContactTitle: "Contato",
    footerEmail: "contato@siteexpress.com.br",
    footerLegalTitle: "Legal",
    footerSocialTitle: "Redes Sociais",
    footerCopyright: "© 2026 SiteExpress. Todos os direitos reservados.",
    footerInstagram: "Instagram",\n''', 1)

t_content = t_content.replace('    footerInstagram: "@siteexpressbrasil",\n', '''    footerBio: "We turn ideas into high-performance professional websites. Zero headaches, zero coding.",
    footerContactTitle: "Contact",
    footerEmail: "contact@siteexpress.com.br",
    footerLegalTitle: "Legal",
    footerSocialTitle: "Social Media",
    footerCopyright: "© 2026 SiteExpress. All rights reserved.",
    footerInstagram: "Instagram",\n''', 1)

with open('src/app/translations.ts', 'w', encoding='utf-8') as f:
    f.write(t_content)


# 2. page.tsx
with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    p_content = f.read()

old_footer = '''      <footer className={styles.footer}>
        <div className={`container ${styles.footerContainer}`}>
          <div className={styles.logo}>
            <img src="/logo_siteexpress.png?v=2" alt="SiteExpress Logo" width="120" height="28" className={styles.logoImage} />
          </div>
          <div className={styles.footerLinks}>
            <a href="https://instagram.com/siteexpressbrasil" target="_blank" rel="noopener noreferrer">{t.footerInstagram}</a>
            <a href="#">{t.footerWhatsapp}</a>
            <a href="#">{t.footerCnpj}</a>
            <a href="#">{t.footerPrivacy}</a>
            <a href="#">{t.footerTerms}</a>
          </div>
        </div>
      </footer>'''

new_footer = '''      <footer className={styles.footer}>
        <div className={`container ${styles.footerContainer}`}>
          <div className={styles.footerBrand}>
            <img src="/logo_siteexpress.png?v=2" alt="SiteExpress Logo" width="160" height="37" className={styles.logoImage} style={{ filter: 'brightness(0) invert(1)' }} />
            <p className={styles.footerBio}>{t.footerBio}</p>
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
      </footer>'''

p_content = p_content.replace(old_footer, new_footer)
with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(p_content)


# 3. page.module.css
with open('src/app/page.module.css', 'r', encoding='utf-8') as f:
    c_content = f.read()

old_css = '''.footer {
  background-color: var(--color-white);
  padding: var(--space-lg) 0;
  border-top: 1px solid rgba(0,0,0,0.05);
}

.footerContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footerLinks {
  display: flex;
  gap: var(--space-sm);
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-gray);
}
.footerLinks a:hover {
  color: var(--color-magenta);
}'''

new_css = '''.footer {
  background-color: #111111;
  color: #fff;
  padding: 80px 0 0 0;
}

.footerContainer {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 40px;
  padding-bottom: 60px;
}

.footerBrand {
  max-width: 300px;
}

.footerBio {
  margin-top: 16px;
  font-size: 0.9rem;
  color: #a0a0a0;
  line-height: 1.5;
}

.footerGrid {
  display: flex;
  gap: 60px;
  flex-wrap: wrap;
}

.footerCol h4 {
  font-size: 1rem;
  margin-bottom: 20px;
  font-weight: 700;
  color: #fff;
}

.footerCol a {
  display: block;
  color: #a0a0a0;
  font-size: 0.9rem;
  margin-bottom: 12px;
  text-decoration: none;
  transition: color 0.2s;
}

.footerCol a:hover {
  color: var(--color-magenta);
}

.footerBottom {
  background-color: #0a0a0a;
  padding: 24px 0;
  text-align: center;
  font-size: 0.85rem;
  color: #666;
  border-top: 1px solid #222;
}'''

c_content = c_content.replace(old_css, new_css)

# Check if there is media query for footer to add
c_content += '''
@media (max-width: 768px) {
  .footerContainer {
    flex-direction: column;
    gap: 40px;
  }
  .footerGrid {
    flex-direction: column;
    gap: 40px;
    width: 100%;
  }
}
'''
with open('src/app/page.module.css', 'w', encoding='utf-8') as f:
    f.write(c_content)
