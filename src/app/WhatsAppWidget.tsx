"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './WhatsAppWidget.module.css';
import { translations, Language } from './translations';

export default function WhatsAppWidget({ lang = "pt" }: { lang?: Language }) {
  const t = translations[lang];
  const [isOpen, setIsOpen] = useState(false);
  const [showFirstBubble, setShowFirstBubble] = useState(false);
  const [firstBubbleTyping, setFirstBubbleTyping] = useState(true);
  const [showSecondBubble, setShowSecondBubble] = useState(false);
  const [secondBubbleTyping, setSecondBubbleTyping] = useState(true);

  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500 && !hasTriggered) {
        setHasTriggered(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasTriggered]);

  useEffect(() => {
    if (!hasTriggered) return;

    // 1. Mostrar primeiro balão "digitando..."
    const t1 = setTimeout(() => {
      setShowFirstBubble(true);
      setFirstBubbleTyping(true);
    }, 2000);

    // 2. Mostrar texto do primeiro balão
    const t2 = setTimeout(() => {
      setFirstBubbleTyping(false);
    }, 4500);

    // 3. Mostrar segundo balão "digitando..."
    const t3 = setTimeout(() => {
      setShowSecondBubble(true);
      setSecondBubbleTyping(true);
    }, 7000);

    // 4. Mostrar texto do segundo balão
    const t4 = setTimeout(() => {
      setSecondBubbleTyping(false);
    }, 9500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [hasTriggered]);

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/553172247907?text=Ol%C3%A1!%20Vi%20a%20oferta%20da%20SiteExpress%20e%20quero%20criar%20meu%20site%20a%20partir%20de%20R$297.%20Meu%20neg%C3%B3cio%20%C3%A9...`, '_blank');
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    setShowFirstBubble(false);
    setShowSecondBubble(false);
  };

  return (
    <div className={styles.widgetContainer}>
      {/* Balões flutuantes (lado esquerdo) quando fechado */}
      {!isOpen && (
        <div className={styles.floatingBubbles}>
          {showFirstBubble && (
            <div className={`${styles.bubble} ${styles.animateBubble}`}>
              {firstBubbleTyping ? (
                <div className={styles.typingIndicator}><span></span><span></span><span></span></div>
              ) : (
                <>
                  <strong className={styles.bubbleName}>Maria Julia</strong>
                  {t.widgetGreeting}
                </>
              )}
            </div>
          )}
          {showSecondBubble && (
            <div className={`${styles.bubble} ${styles.animateBubble}`}>
              {secondBubbleTyping ? (
                <div className={styles.typingIndicator}><span></span><span></span><span></span></div>
              ) : (
                <>
                  <strong className={styles.bubbleName}>Maria Julia</strong>
                  {t.widgetOffer}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Botão Flutuante (Lado direito) ou Modal */}
      {isOpen ? (
        <div className={styles.chatModal}>
          <div className={styles.chatHeader}>
            <div className={styles.chatProfile}>
              <div className={styles.profilePicPlaceholder}>
                <img src="/widget_mariajulia.jpeg?v=3" alt="SiteExpress" width="45" height="45" style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <strong>SiteExpress</strong>
                <span>Online</span>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={toggleWidget}>&times;</button>
          </div>
          <div className={styles.chatBody}>
            <div className={styles.chatMessage}>
              {t.widgetGreeting}
            </div>
            <div className={styles.chatMessage}>
              {t.widgetOffer}
            </div>
          </div>
          <div className={styles.chatFooter}>
            <button className={styles.chatCta} onClick={handleWhatsAppClick}>
              <span className={styles.whatsappIcon}>💬</span> Falar no WhatsApp
            </button>
          </div>
        </div>
      ) : (
        <button className={styles.floatingBtn} onClick={toggleWidget}>
          <div className={styles.profilePicWrapper}>
            <img src="/widget_mariajulia.jpeg?v=3" alt="SiteExpress" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
          </div>
          <span className={styles.onlineDot}></span>
        </button>
      )}
    </div>
  );
}
