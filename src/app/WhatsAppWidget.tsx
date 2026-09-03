"use client";

import React, { useState, useEffect } from 'react';
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
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`);
  }, []);

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

    const t1 = setTimeout(() => {
      setShowFirstBubble(true);
      setFirstBubbleTyping(true);
    }, 2000);

    const t2 = setTimeout(() => {
      setFirstBubbleTyping(false);
    }, 4500);

    const t3 = setTimeout(() => {
      setShowSecondBubble(true);
      setSecondBubbleTyping(true);
    }, 7000);

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

      {isOpen ? (
        <div className={styles.chatModal}>
          {/* Header estilo WhatsApp Web */}
          <div className={styles.chatHeader}>
            <div className={styles.chatProfile}>
              <div className={styles.profilePicWrapperHeader}>
                <img src="/widget_mariajulia.jpeg?v=3" alt="Maria Julia" className={styles.profilePic} />
                <span className={styles.profileOnlineDot}></span>
              </div>
              <div className={styles.profileMeta}>
                <strong>Maria Julia | Site Express</strong>
                <span className={styles.statusOnline}>online</span>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={toggleWidget} aria-label="Fechar">&times;</button>
          </div>

          {/* Corpo estilo Conversa do WhatsApp com Papel de Parede */}
          <div className={styles.chatBody}>
            <div className={styles.dateBadge}>HOJE</div>
            
            <div className={styles.chatMessage}>
              <div className={styles.messageContent}>{t.widgetGreeting}</div>
              <div className={styles.messageMeta}>
                <span className={styles.messageTime}>{currentTime}</span>
                <span className={styles.doubleCheck}>✓✓</span>
              </div>
            </div>

            <div className={styles.chatMessage}>
              <div className={styles.messageContent}>{t.widgetOffer}</div>
              <div className={styles.messageMeta}>
                <span className={styles.messageTime}>{currentTime}</span>
                <span className={styles.doubleCheck}>✓✓</span>
              </div>
            </div>
          </div>

          {/* Footer / Botão de Ação do WhatsApp */}
          <div className={styles.chatFooter}>
            <button className={styles.chatCta} onClick={handleWhatsAppClick}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.989 9.984 0 1.758.459 3.474 1.33 4.982l-1.413 5.16 5.281-1.385c1.455.794 3.1 1.227 4.791 1.227 5.506 0 9.989-4.478 9.989-9.984s-4.483-9.984-9.989-9.984zm5.787 14.159c-.244.686-1.42 1.309-1.96 1.365-.54.057-1.242.08-3.568-.887-2.981-1.238-4.9-4.269-5.048-4.468-.148-.199-1.213-1.614-1.213-3.078 0-1.464.767-2.183 1.04-2.477.273-.294.595-.368.793-.368.198 0 .396.002.568.01.182.008.428-.069.67.511.244.58.831 2.029.904 2.177.073.148.122.321.024.516-.098.195-.148.317-.294.492-.148.175-.31.391-.443.525-.148.148-.302.31-.13.605.172.295.767 1.267 1.646 2.049 1.13.006 2.083.663 2.378.808.295.145.467.122.639-.074.172-.196.737-.859.934-1.154.197-.295.394-.246.663-.148.269.098 1.71.806 2.005.953.295.147.492.221.565.344.073.123.073.71-.171 1.396z"/>
              </svg>
              <span>{t.widgetButton}</span>
            </button>
          </div>
        </div>
      ) : (
        <button className={styles.floatingBtn} onClick={toggleWidget} aria-label="Abrir WhatsApp">
          <div className={styles.profilePicWrapper}>
            <img src="/widget_mariajulia.jpeg?v=3" alt="Maria Julia" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
          </div>
          <span className={styles.onlineDot}></span>
        </button>
      )}
    </div>
  );
}
