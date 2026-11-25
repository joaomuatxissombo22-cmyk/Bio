import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, Trees, X } from 'lucide-react';
import { BIOSFERA_LOGO_GIF_URL, BIOSFERA_LOGO_URL } from '../data/defaults';
import { useLanguage } from '../context/LanguageContext';

export const ChristmasNotice: React.FC<{ openSignal?: number }> = ({ openSignal = 0 }) => {
  // Always appear automatically on every site access (no session suppression)
  const [expanded, setExpanded] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setExpanded(true);
    }, 450);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (openSignal > 0) {
      setExpanded(true);
    }
  }, [openSignal]);

  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpanded(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expanded]);

  return (
    <AnimatePresence mode="wait">
      {expanded ? (
        <motion.aside
          key="christmas-expanded"
          role="dialog"
          aria-live="polite"
          aria-label={t(
            'Mensagem de Natal e Boas Festas da BIOSFERA',
            'BIOSFERA Christmas & Holiday Greeting',
            'BIOSFERA 聖誕佳節與新年祝福'
          )}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.97 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 sm:max-w-[420px] rounded-2xl overflow-hidden shadow-2xl border border-[#7FD1A8]/45 bg-gradient-to-br from-[#182C61] via-[#1B6B4A] to-[#1E7E54] text-white"
        >
          {/* Top festive lime-to-mint bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#8BC53F] via-[#BCE87D] to-[#7FD1A8]" />

          <div className="p-5 sm:p-6 relative">
            <button
              type="button"
              onClick={() => setExpanded(false)}
              aria-label={t(
                'Minimizar lembrete de Boas Festas',
                'Minimize Holiday Greeting',
                '縮小聖誕節慶提醒'
              )}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-white/75 hover:text-white hover:bg-white/15 transition-colors"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-3.5 pr-8">
              <div className="w-11 h-11 rounded-xl bg-white/15 border border-[#7FD1A8]/35 flex items-center justify-center shrink-0">
                <Trees className="w-5 h-5 text-[#BCE87D]" aria-hidden="true" />
              </div>
              <div>
                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#BCE87D]">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t('Natal & Boas Festas', 'Christmas & Season’s Greetings', '聖誕佳節祝福')}</span>
                </p>
                <h2 className="font-display text-lg font-bold text-white leading-snug mt-0.5">
                  {t(
                    'Feliz Natal e Próspero Ano Novo',
                    'Merry Christmas & Happy New Year',
                    '敬祝聖誕快樂・新年進步'
                  )}
                </h2>
              </div>
            </div>

            <p className="mt-3.5 text-xs sm:text-[13px] text-white/95 leading-relaxed">
              {t(
                'A equipa da BIOSFERA – Consultoria Ambiental, Lda. agradece a sua visita e confiança, desejando-lhe um Natal sereno e umas Boas Festas com saúde, paz e sustentabilidade.',
                'The team at BIOSFERA – Consultoria Ambiental, Lda. thanks you for visiting and trusting our work, wishing you a peaceful Christmas and a sustainable, prosperous New Year.',
                'BIOSFERA 環境顧問有限公司感謝您的造訪與信賴，謹祝您與親友度過溫馨平安的聖誕佳節，並迎接健康、和諧且永續繁榮的新年。'
              )}
            </p>

            <div className="mt-4 pt-3.5 border-t border-white/15 flex items-center justify-between gap-3">
              <div className="bg-white rounded-xl px-2.5 py-1 border border-white/80 dark:border-[#8BC53F]/65 inline-flex items-center shadow-xs">
                <img
                  src={BIOSFERA_LOGO_GIF_URL}
                  onError={(e) => {
                    e.currentTarget.src = BIOSFERA_LOGO_URL;
                  }}
                  alt="BIOSFERA"
                  className="h-11 w-auto object-contain"
                />
              </div>

              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="px-4 py-2 text-xs font-semibold bg-[#8BC53F] text-[#182C61] hover:bg-[#9FD354] rounded-lg transition-colors whitespace-nowrap"
              >
                {t('Obrigado, Boas Festas', 'Thank You, Happy Holidays', '感謝祝福')}
              </button>
            </div>
          </div>
        </motion.aside>
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
            'Abrir lembrete de Natal e Boas Festas da BIOSFERA',
            'Open BIOSFERA Christmas & Holiday Greeting',
            '展開 BIOSFERA 聖誕節慶祝福卡片'
          )}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-full shadow-lg border border-[#7FD1A8]/50 bg-gradient-to-r from-[#182C61] via-[#1B6B4A] to-[#1E7E54] text-white hover:brightness-110 transition-all"
        >
          <Trees className="w-4 h-4 text-[#BCE87D] shrink-0" aria-hidden="true" />
          <span className="text-xs font-semibold whitespace-nowrap">
            {t('Boas Festas · Natal', 'Merry Christmas', '聖誕快樂')}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#BCE87D] shrink-0" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
