import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe2,
  Loader2,
  RefreshCw,
  Rss,
  X,
} from 'lucide-react';
import {
  fetchLiveArticle,
  useLiveNews,
  type LiveArticleDetail,
  type LiveNewsItem,
} from '../hooks/useLiveNews';
import { useLanguage } from '../context/LanguageContext';
import { DynamicHeading } from './DynamicHeading';
import { SafeImage } from './SafeImage';
import { sanitizeHref } from '../utils/safeUrl';

type SourceFilter = 'ALL' | 'MINAMB' | 'ANR';

export const LiveEnvironmentalNews: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { items, sources, fetchedAt, loading, refreshing, error, refreshNow } = useLiveNews();
  const { lang, t } = useLanguage();
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('ALL');
  const [tickerIdx, setTickerIdx] = useState(0);
  const [tickerPaused, setTickerPaused] = useState(false);

  const [selectedItem, setSelectedItem] = useState<LiveNewsItem | null>(null);
  const [articleDetail, setArticleDetail] = useState<LiveArticleDetail | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleError, setArticleError] = useState(false);

  const filteredItems = useMemo(() => {
    const base =
      sourceFilter === 'ALL' ? items : items.filter((item) => item.source === sourceFilter);
    return compact ? base.slice(0, 6) : base;
  }, [items, sourceFilter, compact]);

  useEffect(() => {
    if (items.length <= 1 || tickerPaused) return;
    const timer = window.setInterval(() => {
      setTickerIdx((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [items.length, tickerPaused]);

  useEffect(() => {
    if (!selectedItem) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedItem]);

  const openArticleReader = async (item: LiveNewsItem) => {
    setSelectedItem(item);
    setArticleDetail(null);
    setArticleError(false);
    setArticleLoading(true);
    try {
      const detail = await fetchLiveArticle(item.url);
      setArticleDetail(detail);
    } catch {
      setArticleError(true);
    } finally {
      setArticleLoading(false);
    }
  };

  const formattedTime = useMemo(() => {
    if (!fetchedAt) return '';
    try {
      const locale = lang === 'en' ? 'en-GB' : lang === 'zh' ? 'zh-TW' : 'pt-AO';
      return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(fetchedAt));
    } catch {
      return '';
    }
  }, [fetchedAt, lang]);

  const currentTickerItem = items.length > 0 ? items[tickerIdx % items.length] : null;

  return (
    <section
      id="noticias-tempo-real"
      aria-label={t(
        'Notícias Ambientais Nacionais em Tempo Real',
        'Real-Time National Environmental News',
        '安哥拉國家級即時環境新聞'
      )}
      className="py-16 bg-[#F4F7F5] dark:bg-[#0D1E18] border-y border-neutral-200 dark:border-[#224738]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        {/* Header & Live Sync Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <DynamicHeading
              as="h2"
              kicker={t(
                'Feed Oficial & RSS · MINAMB & ANR',
                'Official Live Feed & RSS · MINAMB & ANR',
                '官方即時連線與 RSS · 環境部 MINAMB 暨 ANR'
              )}
              title={t(
                'Notícias Ambientais de Angola em Tempo Real',
                'Real-Time Angolan Environmental News',
                '安哥拉環境部與國家廢棄物局即時新聞'
              )}
              alternates={[
                t(
                  'Manchetes Directas do Ministério do Ambiente e da ANR',
                  'Live Headlines from the Ministry of Environment & ANR',
                  '安哥拉環境部與國家廢棄物管理局官方即時頭條'
                ),
              ]}
              subtitle={t(
                'Sincronização automática com o Ministério do Ambiente de Angola (MINAMB) e a Agência Nacional de Resíduos (ANR), com leitura integral e feed RSS 2.0.',
                'Automatically synced with Angola’s Ministry of Environment (MINAMB) and National Waste Agency (ANR), featuring in-page article reading and an RSS 2.0 feed.',
                '自動同步安哥拉環境部（MINAMB）與國家廢棄物管理局（ANR）最新官方新聞，支援站內全文閱讀與 RSS 2.0 訂閱。'
              )}
              titleClassName="text-2xl sm:text-3xl"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#1B6B4A] dark:text-[#BCE87D]">
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1E7E54] dark:bg-[#8BC53F] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1E7E54] dark:bg-[#8BC53F]" />
              </span>
              <span>
                {t('Actualização Automática', 'Auto-Synced Live', '自動即時同步')}
                {formattedTime ? ` · ${formattedTime}` : ''}
              </span>
            </div>

            <a
              href="/api/live-news/rss"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#182C61] dark:text-[#7FD1A8] bg-white dark:bg-[#11261E] border border-neutral-200 dark:border-[#2B5946] hover:border-[#1E7E54] dark:hover:border-[#8BC53F] rounded-lg transition-colors min-h-[40px] whitespace-nowrap"
            >
              <Rss className="w-3.5 h-3.5 text-[#1E7E54] dark:text-[#BCE87D]" aria-hidden="true" />
              <span>{t('Feed RSS', 'RSS Feed', 'RSS 訂閱')}</span>
            </a>

            <button
              type="button"
              onClick={refreshNow}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] rounded-lg transition-colors min-h-[40px] whitespace-nowrap disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>
                {refreshing
                  ? t('A Sincronizar...', 'Syncing...', '同步更新中...')
                  : t('Actualizar Agora', 'Refresh Now', '立即更新')}
              </span>
            </button>
          </div>
        </div>

        {/* Automatic Live Headlines Ticker Strip */}
        {currentTickerItem && (
          <div
            onMouseEnter={() => setTickerPaused(true)}
            onMouseLeave={() => setTickerPaused(false)}
            className="rounded-xl bg-white dark:bg-[#11261E] border border-neutral-200 dark:border-[#224738] px-4 py-3 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#182C61] dark:text-[#BCE87D] whitespace-nowrap shrink-0">
                {t('Manchetes MINAMB/ANR', 'MINAMB/ANR Headlines', '環境部/ANR 即時頭條')}
              </span>
              <span className="text-neutral-300 dark:text-[#2B5946]" aria-hidden="true">
                |
              </span>
              <div className="flex-1 min-w-0 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.button
                    key={currentTickerItem.id}
                    type="button"
                    onClick={() => openArticleReader(currentTickerItem)}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="w-full text-left flex items-center gap-2 min-w-0 group"
                  >
                    <span className="font-mono text-[11px] font-semibold text-[#1E7E54] dark:text-[#8BC53F] shrink-0">
                      {currentTickerItem.source}
                      {currentTickerItem.publishedDate ? ` · ${currentTickerItem.publishedDate}` : ''}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[#29332F] dark:text-[#ECF5F0] group-hover:text-[#1B6B4A] dark:group-hover:text-[#BCE87D] truncate transition-colors">
                      {currentTickerItem.title}
                    </span>
                  </motion.button>
                </AnimatePresence>
              </div>
            </div>

            {items.length > 1 && (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setTickerIdx((prev) => (prev - 1 + items.length) % items.length)
                  }
                  aria-label={t('Manchete anterior', 'Previous headline', '上一則頭條')}
                  className="p-1.5 rounded-lg hover:bg-[#F4F7F5] dark:hover:bg-[#163127] text-[#29332F]/70 dark:text-[#A8CBB9] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="hidden sm:inline font-mono text-[11px] text-[#29332F]/60 dark:text-[#A8CBB9] tabular-nums px-1">
                  {(tickerIdx % items.length) + 1}/{items.length}
                </span>
                <button
                  type="button"
                  onClick={() => setTickerIdx((prev) => (prev + 1) % items.length)}
                  aria-label={t('Próxima manchete', 'Next headline', '下一則頭條')}
                  className="p-1.5 rounded-lg hover:bg-[#F4F7F5] dark:hover:bg-[#163127] text-[#29332F]/70 dark:text-[#A8CBB9] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Source Filter & Official Portals */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                {
                  id: 'ALL' as const,
                  label: t(
                    `Todas as Fontes (${items.length})`,
                    `All Sources (${items.length})`,
                    `全部官方來源 (${items.length})`
                  ),
                },
                {
                  id: 'MINAMB' as const,
                  label: t(
                    'MINAMB · Ministério do Ambiente',
                    'MINAMB · Ministry of Environment',
                    'MINAMB · 安哥拉環境部'
                  ),
                },
                {
                  id: 'ANR' as const,
                  label: t(
                    'ANR · Agência Nacional de Resíduos',
                    'ANR · National Waste Agency',
                    'ANR · 國家廢棄物管理局'
                  ),
                },
              ] as const
            ).map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setSourceFilter(btn.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  sourceFilter === btn.id
                    ? 'bg-[#1B6B4A] text-white dark:bg-[#8BC53F] dark:text-[#182C61]'
                    : 'bg-white dark:bg-[#11261E] text-[#29332F] dark:text-[#DCECE3] border border-neutral-200 dark:border-[#224738] hover:border-[#1E7E54] dark:hover:border-[#7FD1A8]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            {(sources.length > 0
              ? sources
              : [
                  {
                    id: 'MINAMB',
                    label: 'MINAMB',
                    url: 'https://minamb.gov.ao/web/noticias',
                    ok: true,
                    count: 0,
                  },
                  {
                    id: 'ANR',
                    label: 'ANR',
                    url: 'https://anr.gov.ao/web/noticias',
                    ok: true,
                    count: 0,
                  },
                ]
            ).map((src) => {
              const safeSourceUrl = sanitizeHref(src.url);
              if (!safeSourceUrl) return null;
              return (
                <a
                  key={src.id}
                  href={safeSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-[#182C61] dark:text-[#7FD1A8] hover:text-[#1E7E54] dark:hover:text-[#BCE87D] transition-colors whitespace-nowrap"
                >
                  <Globe2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{src.id}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((skeleton) => (
              <div
                key={skeleton}
                className="bg-white dark:bg-[#11261E] rounded-xl border border-neutral-200 dark:border-[#224738] overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-neutral-200 dark:bg-[#163127]" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-32 bg-neutral-200 dark:bg-[#163127] rounded" />
                  <div className="h-5 w-4/5 bg-neutral-200 dark:bg-[#163127] rounded" />
                  <div className="h-4 w-full bg-neutral-200 dark:bg-[#163127] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error && filteredItems.length === 0 ? (
          <div className="rounded-xl bg-white dark:bg-[#11261E] border border-neutral-200 dark:border-[#224738] p-8 text-center space-y-4">
            <p className="text-sm text-[#29332F]/80 dark:text-[#C5DFD1]">
              {t(
                'Não foi possível obter as notícias em tempo real neste momento. Verifique a ligação aos portais oficiais ou tente actualizar.',
                'Unable to reach the live official portals right now. Try refreshing or visit the official sources directly.',
                '目前無法連線擷取官方即時新聞，請稍後點擊重新整理或直接造訪官方網站。'
              )}
            </p>
            <button
              type="button"
              onClick={refreshNow}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] rounded-lg transition-colors"
            >
              {t('Tentar Novamente', 'Retry Now', '重新載入')}
            </button>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="group bg-white dark:bg-[#11261E] rounded-xl border border-neutral-200 dark:border-[#224738] overflow-hidden flex flex-col hover:border-[#7FD1A8] dark:hover:border-[#8BC53F]/60 transition-colors duration-300"
              >
                <div className="h-44 overflow-hidden bg-[#182C61]/10 dark:bg-[#163127]">
                  <SafeImage
                    src={item.imageUrl}
                    alt={item.title}
                    fallbackTitle={item.source}
                    className="w-full h-full object-cover"
                    zoomOnHover
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`font-semibold ${
                        item.source === 'ANR'
                          ? 'text-[#182C61] dark:text-[#7FD1A8]'
                          : 'text-[#1E7E54] dark:text-[#BCE87D]'
                      }`}
                    >
                      {item.source === 'ANR'
                        ? t('ANR · Resíduos', 'ANR · Waste Agency', 'ANR 國家廢棄物局')
                        : t('MINAMB · Ambiente', 'MINAMB · Environment', 'MINAMB 環境部')}
                    </span>
                    {item.publishedDate && (
                      <>
                        <span className="text-neutral-300 dark:text-[#2B5946]" aria-hidden="true">
                          ·
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[#29332F]/65 dark:text-[#A8CBB9] tabular-nums">
                          <Calendar className="w-3 h-3" aria-hidden="true" />
                          {item.publishedDate}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="font-display text-base font-bold text-[#1B6B4A] dark:text-[#ECF5F0] mt-2 leading-snug line-clamp-3">
                    {item.title}
                  </h3>

                  {item.summary && (
                    <p className="mt-2 text-xs sm:text-sm text-[#29332F]/75 dark:text-[#C5DFD1] leading-relaxed flex-1 line-clamp-3">
                      {item.summary}
                    </p>
                  )}

                  <div className="mt-4 pt-3.5 border-t border-neutral-100 dark:border-[#1B3A2E] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => openArticleReader(item)}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1B6B4A] dark:text-[#BCE87D] hover:text-[#1E7E54] dark:hover:text-[#7FD1A8] transition-colors whitespace-nowrap"
                    >
                      <span>{t('Ler Notícia', 'Read Article', '閱讀全文')}</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>

                    {sanitizeHref(item.url) && (
                      <a
                        href={sanitizeHref(item.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#29332F]/65 dark:text-[#A8CBB9] hover:text-[#182C61] dark:hover:text-[#ECF5F0] transition-colors whitespace-nowrap"
                      >
                        <span>{t('Fonte Oficial', 'Official Link', '官方來源')}</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white dark:bg-[#11261E] border border-neutral-200 dark:border-[#224738] p-8 text-center">
            <p className="text-sm text-[#29332F]/80 dark:text-[#C5DFD1]">
              {t(
                'Sem notícias disponíveis para o filtro seleccionado neste momento.',
                'No live news items available for this filter right now.',
                '此分類目前無即時新聞項目。'
              )}
            </p>
          </div>
        )}

        {compact && items.length > 0 && (
          <div className="pt-2 flex justify-end">
            <Link
              to="/noticias#noticias-tempo-real"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B6B4A] dark:text-[#BCE87D] hover:text-[#1E7E54] dark:hover:text-[#7FD1A8] transition-colors"
            >
              <span>
                {t(
                  'Ver Todas as Notícias Nacionais e Publicações',
                  'View All National News & Publications',
                  '查看所有國家環境新聞與技術專欄'
                )}
              </span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>

      {/* Live Official Article Reader Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedItem(null);
          }}
        >
          <div className="w-full max-w-3xl bg-white dark:bg-[#11261E] rounded-2xl border border-neutral-200 dark:border-[#224738] overflow-hidden my-8 shadow-2xl">
            <div className="relative h-60 sm:h-72 bg-[#182C61] dark:bg-[#0D1E18]">
              <SafeImage
                src={articleDetail?.imageUrl || selectedItem.imageUrl}
                alt={articleDetail?.title || selectedItem.title}
                fallbackTitle={selectedItem.source}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label={t('Fechar notícia', 'Close article', '關閉新聞閱讀視窗')}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/95 dark:bg-[#0D1E18]/90 text-[#1B6B4A] dark:text-[#ECF5F0] hover:bg-white dark:hover:bg-[#163127] shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-5 max-h-[68vh] overflow-y-auto">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium">
                <span className="text-[#1E7E54] dark:text-[#BCE87D] font-semibold">
                  {selectedItem.sourceLabel}
                </span>
                {(articleDetail?.publishedDate || selectedItem.publishedDate) && (
                  <>
                    <span className="text-neutral-300 dark:text-[#2B5946]" aria-hidden="true">
                      ·
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[#29332F]/70 dark:text-[#A8CBB9] tabular-nums">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      {articleDetail?.publishedDate || selectedItem.publishedDate}
                    </span>
                  </>
                )}
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1B6B4A] dark:text-[#ECF5F0] leading-snug">
                {articleDetail?.title || selectedItem.title}
              </h3>

              <div className="border-t border-neutral-100 dark:border-[#224738] pt-5 space-y-4">
                {articleLoading ? (
                  <div className="flex items-center gap-2.5 py-6 text-sm text-[#29332F]/75 dark:text-[#C5DFD1]">
                    <Loader2 className="w-4 h-4 animate-spin text-[#1E7E54] dark:text-[#8BC53F]" />
                    <span>
                      {t(
                        'A obter conteúdo completo do portal oficial...',
                        'Loading full article from the official portal...',
                        '正在從官方網站載入完整新聞內文...'
                      )}
                    </span>
                  </div>
                ) : articleDetail && articleDetail.paragraphs.length > 0 ? (
                  articleDetail.paragraphs.map((para, idx) => (
                    <p
                      key={idx}
                      className="text-sm sm:text-base text-[#29332F]/90 dark:text-[#DCECE3] leading-relaxed"
                    >
                      {para}
                    </p>
                  ))
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm sm:text-base text-[#29332F]/90 dark:text-[#DCECE3] leading-relaxed">
                      {selectedItem.summary || selectedItem.title}
                    </p>
                    {articleError && (
                      <p className="text-xs text-[#29332F]/65 dark:text-[#A8CBB9]">
                        {t(
                          'Consulte o artigo integral directamente no portal oficial abaixo.',
                          'View the full publication directly on the official portal below.',
                          '請點擊下方連結前往官方網站瀏覽完整內文。'
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-[#224738] flex flex-wrap items-center justify-between gap-3">
                {sanitizeHref(selectedItem.url) && (
                  <a
                    href={sanitizeHref(selectedItem.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] rounded-lg transition-colors"
                  >
                    <span>
                      {t('Abrir Publicação Original', 'Open Original Publication', '開啟官方原文頁面')}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] bg-[#F4F7F5] dark:bg-[#163127] border border-neutral-200 dark:border-[#2B5946] rounded-lg transition-colors"
                >
                  {t('Fechar', 'Close', '關閉')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
