import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Sparkles, Trees, X } from 'lucide-react';
import { BIOSFERA_LOGO_GIF_URL, BIOSFERA_LOGO_URL } from '../data/defaults';
import { useLanguage } from '../context/LanguageContext';
import { isChristmasSeasonActive } from '../config/festive';
import { SantaHatOverlay } from './SantaHatOverlay';

const SNOWFLAKES = [
  { left: '6%', top: '12%', size: 6, delay: '0s', duration: '9s', opacity: 0.45 },
  { left: '16%', top: '28%', size: 4, delay: '1.2s', duration: '11s', opacity: 0.35 },
  { left: '24%', top: '8%', size: 7, delay: '0.6s', duration: '10s', opacity: 0.4 },
  { left: '36%', top: '18%', size: 5, delay: '2.1s', duration: '12s', opacity: 0.3 },
  { left: '48%', top: '10%', size: 4, delay: '0.4s', duration: '9.5s', opacity: 0.45 },
  { left: '62%', top: '16%', size: 6, delay: '1.8s', duration: '11.5s', opacity: 0.35 },
  { left: '74%', top: '9%', size: 5, delay: '0.9s', duration: '10.5s', opacity: 0.45 },
  { left: '84%', top: '24%', size: 7, delay: '2.4s', duration: '9.8s', opacity: 0.35 },
  { left: '92%', top: '14%', size: 5, delay: '1.1s', duration: '11s', opacity: 0.4 },
  { left: '12%', top: '76%', size: 5, delay: '1.5s', duration: '12s', opacity: 0.3 },
  { left: '86%', top: '74%', size: 6, delay: '0.8s', duration: '10.2s', opacity: 0.32 },
  { left: '70%', top: '82%', size: 4, delay: '2.0s', duration: '11.8s', opacity: 0.28 },
];

export const ChristmasNotice: React.FC<{ openSignal?: number }> = ({ openSignal = 0 }) => {
  const isFestiveActive = isChristmasSeasonActive();
  const [expanded, setExpanded] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!isFestiveActive) return;
    const timer = window.setTimeout(() => {
      setExpanded(true);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [isFestiveActive]);

  useEffect(() => {
    if (openSignal > 0 && isFestiveActive) {
      setExpanded(true);
    }
  }, [openSignal, isFestiveActive]);

  useEffect(() => {
    if (!expanded) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpanded(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [expanded]);

  if (!isFestiveActive) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {expanded ? (
        <motion.div
          key="christmas-fullscreen"
          role="dialog"
          aria-modal="true"
          aria-live="polite"
          aria-label={t(
            'Mensagem de Natal e Boas Festas da BIOSFERA',
            'BIOSFERA Christmas & Holiday Greeting',
            'BIOSFERA 聖誕佳節與新年祝福'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[70] w-screen min-h-[100dvh] overflow-y-auto text-white bg-[radial-gradient(ellipse_at_top,_#B71C2E_0%,_#7D0E1D_44%,_#0B3B24_100%)]"
        >
          {/* Top festive gold-crimson-evergreen accent band */}
          <div
            className="fixed top-0 inset-x-0 h-1.5 z-20 bg-gradient-to-r from-[#0F5132] via-[#F2D16B] to-[#C4243B]"
            aria-hidden="true"
          />

          {/* Subtle ambient radial glow & decorative golden frame */}
          <div
            className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(242,209,107,0.18),transparent_58%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none fixed inset-3 sm:inset-6 rounded-2xl border border-[#F2D16B]/25"
            aria-hidden="true"
          />

          {/* Subtle festive snow accents */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
            {SNOWFLAKES.map((flake, idx) => (
              <span
                key={idx}
                style={{
                  left: flake.left,
                  top: flake.top,
                  width: `${flake.size}px`,
                  height: `${flake.size}px`,
                  opacity: flake.opacity,
                }}
                className="absolute rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.65)]"
              />
            ))}
          </div>

          {/* Full-screen content container */}
          <div className="relative z-10 min-h-[100dvh] flex flex-col justify-between px-6 py-7 sm:px-12 sm:py-10 max-w-5xl mx-auto">
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F2D16B]">
                <Trees className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  {t(
                    'Época Festiva · Luanda, Angola',
                    'Festive Season · Luanda, Angola',
                    '聖誕佳節 · 安哥拉羅安達'
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label={t(
                  'Fechar mensagem de Natal da BIOSFERA',
                  'Close BIOSFERA Christmas greeting',
                  '關閉 BIOSFERA 聖誕祝福畫面'
                )}
                className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-lg border border-[#F2D16B]/35 bg-black/20 hover:bg-black/35 text-white/95 text-xs font-semibold transition-colors"
              >
                <span className="hidden sm:inline">{t('Fechar', 'Close', '關閉')}</span>
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Centerpiece: BIOSFERA Logo + Christmas Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="my-auto py-8 sm:py-10 flex flex-col items-center text-center"
            >
              {/* Prominent BIOSFERA Logo Medallion with Christmas Hat */}
              <div className="relative inline-flex items-center justify-center bg-white rounded-2xl px-7 py-4 sm:px-10 sm:py-5 shadow-[0_24px_60px_rgba(0,0,0,0.4)] border-2 border-[#F2D16B]/80 overflow-visible">
                <SantaHatOverlay className="absolute left-[48.2%] -translate-x-1/2 -top-[20px] sm:-top-[24px] w-[42px] sm:w-[50px]" />
                <img
                  src={BIOSFERA_LOGO_GIF_URL}
                  onError={(e) => {
                    e.currentTarget.src = BIOSFERA_LOGO_URL;
                  }}
                  alt="Logótipo BIOSFERA – Consultoria Ambiental, Lda."
                  className="h-20 sm:h-24 w-auto object-contain"
                />
              </div>

              {/* Festive Eyebrow */}
              <p className="mt-8 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-[#F2D16B]">
                <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t('Natal & Boas Festas', 'Christmas & Season’s Greetings', '聖誕佳節祝福')}</span>
                <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
              </p>

              {/* Main Holiday Headline */}
              <h2 className="mt-4 font-display text-3xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.08] tracking-tight max-w-3xl">
                {t(
                  'Feliz Natal e Próspero Ano Novo',
                  'Merry Christmas & Happy New Year',
                  '敬祝聖誕快樂・新年進步'
                )}
              </h2>

              {/* Golden decorative divider */}
              <div className="mt-6 flex items-center justify-center gap-3 w-full max-w-xs" aria-hidden="true">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#F2D16B]/80" />
                <span className="w-2 h-2 rotate-45 bg-[#F2D16B]" />
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#F2D16B]/80" />
              </div>

              {/* Institutional Greeting Message */}
              <p className="mt-6 text-base sm:text-lg text-white/95 leading-relaxed max-w-2xl">
                {t(
                  'A equipa da BIOSFERA – Consultoria Ambiental, Lda. agradece a sua visita e confiança, desejando-lhe um Natal sereno e umas Boas Festas com saúde, paz e sustentabilidade.',
                  'The team at BIOSFERA – Consultoria Ambiental, Lda. thanks you for visiting and trusting our work, wishing you a peaceful Christmas and a sustainable, prosperous New Year.',
                  'BIOSFERA 環境顧問有限公司感謝您的造訪與信賴，謹祝您與親友度過溫馨平安的聖誕佳節，並迎接健康、和諧且永續繁榮的新年。'
                )}
              </p>

              {/* Primary Dismiss / Enter Site CTA */}
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 min-h-[48px] text-sm sm:text-base font-bold bg-[#F2D16B] text-[#5E0B18] hover:bg-[#FCE28B] rounded-xl shadow-xl transition-colors"
                >
                  <span>
                    {t('Entrar no Portal · Boas Festas', 'Enter Portal · Happy Holidays', '進入網站 · 佳節愉快')}
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>
              </div>
            </motion.div>

            {/* Bottom Institutional Signature */}
            <div className="pt-4 border-t border-[#F2D16B]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/80">
              <p className="font-semibold tracking-wide text-[#F2D16B]">
                BIOSFERA – Consultoria Ambiental, Lda.
              </p>
              <p>
                {t(
                  'Compromisso com o Ambiente. Responsabilidade com o Futuro.',
                  'Commitment to the Environment. Responsibility for the Future.',
                  '致力環境保護・承擔永續未來'
                )}
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.button
          key="christmas-minimized"
          type="button"
          onClick={() => setExpanded(true)}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          aria-label={t(
            'Abrir mensagem de Natal e Boas Festas da BIOSFERA',
            'Open BIOSFERA Christmas & Holiday Greeting',
            '展開 BIOSFERA 聖誕節慶祝福畫面'
          )}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 inline-flex items-center gap-2.5 px-4 py-2.5 min-h-[44px] rounded-xl shadow-xl border border-[#F2D16B]/60 bg-gradient-to-r from-[#8E1324] via-[#A81B2E] to-[#0E4A2E] text-white hover:brightness-110 transition-all"
        >
          <Trees className="w-4 h-4 text-[#F2D16B] shrink-0" aria-hidden="true" />
          <span className="text-xs font-semibold whitespace-nowrap">
            {t('Boas Festas · Natal', 'Merry Christmas', '聖誕快樂')}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#F2D16B] shrink-0" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
