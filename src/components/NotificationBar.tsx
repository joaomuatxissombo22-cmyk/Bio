import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, ExternalLink, Sparkles, Trees } from 'lucide-react';
import { useLiveNews } from '../hooks/useLiveNews';
import { useLanguage } from '../context/LanguageContext';
import { sanitizeHref } from '../utils/safeUrl';

interface TickerEntry {
  kind: 'christmas' | 'news';
  id: string;
  tag: string;
  text: string;
  url?: string;
}

export const NotificationBar: React.FC<{ onOpenChristmas: () => void }> = ({
  onOpenChristmas,
}) => {
  const { items } = useLiveNews();
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const entries: TickerEntry[] = useMemo(() => {
    const list: TickerEntry[] = [
      {
        kind: 'christmas',
        id: 'christmas-greeting',
        tag: t('Natal & Boas Festas', 'Holiday Greeting', '聖誕佳節祝福'),
        text: t(
          'A BIOSFERA deseja-lhe um Feliz Natal e um Próspero Ano Novo com paz e sustentabilidade.',
          'BIOSFERA wishes you a Merry Christmas and a sustainable, prosperous New Year.',
          'BIOSFERA 全體團隊敬祝您聖誕快樂、新年平安順心與永續繁榮。'
        ),
      },
    ];

    for (const item of items.slice(0, 6)) {
      list.push({
        kind: 'news',
        id: item.id,
        tag: item.publishedDate ? `${item.source} · ${item.publishedDate}` : item.source,
        text: item.title,
        url: item.url,
      });
    }

    return list;
  }, [items, t]);

  useEffect(() => {
    if (entries.length <= 1 || paused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % entries.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [entries.length, paused]);

  const safeIndex = activeIndex % entries.length;
  const current = entries[safeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + entries.length) % entries.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % entries.length);
  };

  return (
    <div
      role="region"
      aria-label={t(
        'Faixa de Notificações e Notícias em Tempo Real',
        'Notification Bar & Live Environmental News',
        '聖誕提醒與即時環境新聞通知列'
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="w-full bg-gradient-to-r from-[#182C61] via-[#1B6B4A] to-[#1E7E54] text-white border-b border-[#7FD1A8]/30 text-xs"
    >
      <div className="max-w-[1380px] mx-auto px-3 sm:px-6 lg:px-8 min-h-[40px] py-1.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left badge indicator */}
        <div className="flex items-center gap-2 shrink-0">
          {current.kind === 'christmas' ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#BCE87D] whitespace-nowrap">
              <Trees className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{current.tag}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-[#BCE87D] whitespace-nowrap">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8BC53F] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8BC53F]" />
              </span>
              <span>{current.tag}</span>
            </span>
          )}
        </div>

        {/* Center rotating announcement / live news */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2 sm:gap-3 min-w-0"
            >
              <p className="truncate text-white/95 font-medium">{current.text}</p>

              {current.kind === 'christmas' ? (
                <button
                  type="button"
                  onClick={onOpenChristmas}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#8BC53F] text-[#182C61] hover:bg-[#9FD354] font-semibold text-[11px] whitespace-nowrap shrink-0 transition-colors"
                >
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  <span>{t('Ver Lembrete', 'View Note', '查看祝福')}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to="/noticias#noticias-tempo-real"
                    className="hidden sm:inline-flex items-center px-2 py-0.5 rounded border border-white/25 hover:bg-white/10 text-[11px] font-semibold text-white whitespace-nowrap transition-colors"
                  >
                    {t('Tempo Real', 'Live Feed', '即時新聞')}
                  </Link>
                  {sanitizeHref(current.url) && (
                    <a
                      href={sanitizeHref(current.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t('Abrir notícia oficial', 'Open official article', '開啟官方原文')}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#BCE87D] hover:text-white whitespace-nowrap"
                    >
                      <span>{t('Ler', 'Read', '閱讀')}</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Controls */}
        {entries.length > 1 && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              aria-label={t('Notificação anterior', 'Previous notice', '上一則通知')}
              className="p-1 rounded hover:bg-white/15 text-white/80 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <span className="hidden md:inline font-mono text-[11px] text-white/75 tabular-nums px-1">
              {safeIndex + 1}/{entries.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              aria-label={t('Próxima notificação', 'Next notice', '下一則通知')}
              className="p-1 rounded hover:bg-white/15 text-white/80 hover:text-white transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
