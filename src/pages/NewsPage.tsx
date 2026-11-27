import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Calendar, X } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { SafeImage } from '../components/SafeImage';
import { LiveEnvironmentalNews } from '../components/LiveEnvironmentalNews';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { PageBanner } from '../components/PageBanner';
import { DynamicHeading } from '../components/DynamicHeading';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { IMG_BANNER_NEWS, NEWS_CATEGORIES } from '../data/defaults';
import { localizeCategory, localizeNewsArticle } from '../i18n/translations';
import type { NewsArticle } from '../types';

type DisplayNewsArticle = Omit<NewsArticle, 'category'> & { category: string };

export const NewsPage: React.FC = () => {
  const { news: rawNews } = useSite();
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [activeArticle, setActiveArticle] = useState<DisplayNewsArticle | null>(null);

  useEffect(() => {
    const articleId = searchParams.get('artigo');
    if (!articleId) return;
    const found = rawNews.find((item) => item.id === articleId);
    if (found) {
      setSelectedCategory('Todas');
      setActiveArticle(localizeNewsArticle(found, lang));
      const next = new URLSearchParams(searchParams);
      next.delete('artigo');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, rawNews, lang, setSearchParams]);

  const filteredNews = useMemo(() => {
    const base =
      selectedCategory === 'Todas'
        ? rawNews
        : rawNews.filter((n) => n.category === selectedCategory);
    return base.map((article) => localizeNewsArticle(article, lang));
  }, [rawNews, selectedCategory, lang]);

  return (
    <>
      <SeoHead
        title={t('Notícias e Publicações', 'News & Publications')}
        description={t(
          'Notícias institucionais, artigos técnicos, legislação ambiental em Angola e eventos da BIOSFERA – Consultoria Ambiental, Lda.',
          'Institutional news, technical briefings, Angolan environmental legislation updates, and events from BIOSFERA – Consultoria Ambiental, Lda.'
        )}
        path="/noticias"
      />

      <PageBanner
        kicker={t('Conhecimento e Actualidade', 'Knowledge & Regulatory Updates')}
        title={t('Notícias e Publicações Técnicas', 'News & Technical Publications')}
        alternates={[
          t(
            'Legislação Ambiental e Notas Institucionais',
            'Environmental Law & Institutional Briefings'
          ),
        ]}
        subtitle={t(
          'Artigos técnicos, actualizações sobre legislação ambiental angolana, iniciativas institucionais e formações especializadas.',
          'Technical articles, Angolan environmental regulation updates, institutional initiatives, and specialized training sessions.'
        )}
        imageUrl={IMG_BANNER_NEWS}
        imageAlt={t(
          'Documentação regulamentar ambiental e análise de relatórios técnicos',
          'Environmental regulatory documentation and technical report analysis'
        )}
      />

      {/* Real-Time National News (ANR & MINAMB Angola) */}
      <LiveEnvironmentalNews />

      {/* Filter Bar */}
      <section className="bg-[#F4F7F5] dark:bg-[#0D1E18] border-b border-neutral-200 dark:border-[#224738]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <button
              type="button"
              onClick={() => setSelectedCategory('Todas')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'Todas'
                  ? 'bg-[#1B6B4A] text-white dark:bg-[#8BC53F] dark:text-[#182C61]'
                  : 'bg-white dark:bg-[#11261E] text-[#29332F] dark:text-[#DCECE3] border border-neutral-200 dark:border-[#224738] hover:border-[#1E7E54] dark:hover:border-[#7FD1A8]'
              }`}
            >
              {t(`Todas (${rawNews.length})`, `All (${rawNews.length})`)}
            </button>
            {NEWS_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#1B6B4A] text-white dark:bg-[#8BC53F] dark:text-[#182C61]'
                    : 'bg-white dark:bg-[#11261E] text-[#29332F] dark:text-[#DCECE3] border border-neutral-200 dark:border-[#224738] hover:border-[#1E7E54] dark:hover:border-[#7FD1A8]'
                }`}
              >
                {localizeCategory(cat, lang)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-white dark:bg-[#081410]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <DynamicHeading
            as="h2"
            kicker={t('Acervo Editorial', 'Editorial Archive')}
            title={t(
              'Artigos Técnicos e Enquadramento Legal',
              'Technical Briefings & Regulatory Framework'
            )}
            alternates={[
              t(
                'Informação Actualizada para Empresas em Angola',
                'Up-to-Date Guidance for Businesses in Angola'
              ),
            ]}
            className="max-w-3xl"
            titleClassName="!text-2xl sm:!text-3xl"
          />

          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredNews.map((article) => (
                <article
                  key={article.id}
                  className="group bg-white dark:bg-[#11261E] rounded-xl border border-neutral-200 dark:border-[#224738] overflow-hidden flex flex-col hover:border-[#7FD1A8] dark:hover:border-[#8BC53F]/60 transition-colors duration-300"
                >
                  <div className="h-52 overflow-hidden bg-[#1B6B4A]/10 dark:bg-[#163127]">
                    <SafeImage
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover object-[50%_20%]"
                      zoomOnHover
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-[#1E7E54] dark:text-[#BCE87D] font-medium">
                      <span>{article.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[#29332F]/65 dark:text-[#A8CBB9] tabular-nums">
                        {article.publishedDate}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#1B6B4A] dark:text-[#ECF5F0] mt-2 leading-snug">
                      {article.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-[#29332F]/80 dark:text-[#C5DFD1] leading-relaxed flex-1">
                      {article.summary}
                    </p>
                    <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-[#1B3A2E]">
                      <button
                        type="button"
                        onClick={() => setActiveArticle(article)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B6B4A] dark:text-[#7FD1A8] hover:text-[#1E7E54] dark:hover:text-[#BCE87D]"
                      >
                        <span>{t('Ler Publicação', 'Read Publication')}</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#F4F7F5] dark:bg-[#11261E] rounded-xl border border-neutral-200 dark:border-[#224738]">
              <p className="text-sm text-[#29332F]/80 dark:text-[#C5DFD1]">
                {t(
                  'Nenhuma publicação encontrada nesta categoria.',
                  'No publications found in this category.'
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup for Environmental Legislation & Company News */}
      <NewsletterSignup sourcePage="noticias" />

      {/* Article Reader Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-3xl bg-white dark:bg-[#11261E] rounded-2xl border border-neutral-200 dark:border-[#224738] overflow-hidden my-8">
            <div className="relative h-64 bg-[#1B6B4A] dark:bg-[#0D1E18]">
              <SafeImage
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                aria-label={t('Fechar artigo', 'Close article')}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/95 dark:bg-[#0D1E18]/90 text-[#1B6B4A] dark:text-[#ECF5F0] hover:bg-white dark:hover:bg-[#163127] shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-10 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#1E7E54] dark:text-[#BCE87D] font-medium">
                <span>{activeArticle.category}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-mono text-[#29332F]/70 dark:text-[#A8CBB9] tabular-nums">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  {activeArticle.publishedDate}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1B6B4A] dark:text-[#ECF5F0] leading-tight">
                {activeArticle.title}
              </h2>
              <div className="text-base text-[#29332F]/90 dark:text-[#DCECE3] leading-relaxed whitespace-pre-line border-t border-neutral-100 dark:border-[#224738] pt-5">
                {activeArticle.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
