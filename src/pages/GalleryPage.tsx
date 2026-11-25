import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Maximize2, X } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { SafeImage } from '../components/SafeImage';
import { PageBanner } from '../components/PageBanner';
import { DynamicHeading } from '../components/DynamicHeading';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { GALLERY_CATEGORIES, IMG_FIELD } from '../data/defaults';
import { localizeCategory, localizeGalleryItem } from '../i18n/translations';

export const GalleryPage: React.FC = () => {
  const { gallery: rawGallery } = useSite();
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredRawItems = useMemo(() => {
    if (selectedCategory === 'Todas') return rawGallery;
    return rawGallery.filter((g) => g.category === selectedCategory);
  }, [rawGallery, selectedCategory]);

  const filteredItems = useMemo(
    () => filteredRawItems.map((item) => localizeGalleryItem(item, lang)),
    [filteredRawItems, lang]
  );

  const handleNext = useCallback(() => {
    if (lightboxIndex === null || filteredItems.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null || filteredItems.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, handleNext, handlePrev]);

  const activeItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <>
      <SeoHead
        title={t('Galeria Fotográfica', 'Photo Gallery')}
        description={t(
          'Registo fotográfico de trabalhos de campo, monitorização ambiental, avaliações técnicas e actividades operacionais da BIOSFERA em Angola.',
          'Photographic records of fieldwork, environmental monitoring campaigns, technical inspections, and BIOSFERA operations in Angola.'
        )}
        path="/galeria"
      />

      <PageBanner
        kicker={t('Registo Visual Técnico', 'Technical Visual Archive')}
        title={t(
          'Galeria de Actividades e Trabalhos de Campo',
          'Fieldwork & Technical Operations Gallery'
        )}
        alternates={[
          t(
            'Evidência de Campo, Amostragem e Monitorização',
            'Field Evidence, Sampling & Environmental Monitoring'
          ),
        ]}
        subtitle={t(
          'Acompanhe o trabalho técnico de campo, recolha de amostras, inspecções industriais e campanhas de monitorização ambiental.',
          'Explore field engineering activities, water and soil sampling, industrial inspections, and environmental monitoring campaigns.'
        )}
        imageUrl={IMG_FIELD}
        imageAlt={t(
          'Equipa técnica da BIOSFERA em campanha de amostragem ambiental em Angola',
          'BIOSFERA technical team conducting an environmental sampling campaign in Angola'
        )}
      />

      {/* Category Filter */}
      <section className="bg-[#F4F7F5] dark:bg-[#0D1E18] border-b border-neutral-200 dark:border-[#224738]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Todas');
                setLightboxIndex(null);
              }}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'Todas'
                  ? 'bg-[#1B6B4A] text-white dark:bg-[#8BC53F] dark:text-[#182C61]'
                  : 'bg-white dark:bg-[#11261E] text-[#29332F] dark:text-[#DCECE3] border border-neutral-200 dark:border-[#224738] hover:border-[#1E7E54] dark:hover:border-[#7FD1A8]'
              }`}
            >
              {t(`Todas (${rawGallery.length})`, `All (${rawGallery.length})`)}
            </button>
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setLightboxIndex(null);
                }}
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

      {/* Gallery Grid */}
      <section className="py-16 bg-white dark:bg-[#081410]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <DynamicHeading
            as="h2"
            kicker={t('Evidência Operacional', 'Operational Evidence')}
            title={t('Registos Fotográficos de Campo', 'Field Photographic Records')}
            alternates={[
              t(
                'Monitorização, Auditoria e Avaliação Ambiental',
                'Monitoring, Auditing & Environmental Assessment'
              ),
            ]}
            subtitle={t(
              'Clique em qualquer fotografia para abrir a visualização ampliada com descrição técnica.',
              'Click any photograph to open the full-screen technical viewer.'
            )}
            className="max-w-3xl"
            titleClassName="!text-2xl sm:!text-3xl"
          />

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, idx) => (
                <article
                  key={item.id}
                  className="group rounded-xl border border-neutral-200 dark:border-[#224738] overflow-hidden bg-white dark:bg-[#11261E] flex flex-col hover:border-[#7FD1A8] dark:hover:border-[#8BC53F]/60 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className="relative h-64 w-full overflow-hidden bg-[#1B6B4A]/10 dark:bg-[#163127] text-left focus-visible:outline-2 focus-visible:outline-[#1E7E54]"
                  >
                    <SafeImage
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover object-[50%_18%]"
                      zoomOnHover
                    />
                    <span className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/60 text-white opacity-90 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </button>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-xs font-medium text-[#1E7E54] dark:text-[#BCE87D]">
                      {item.category}
                      {item.capturedAt ? ` · ${item.capturedAt}` : ''}
                    </p>
                    <h3 className="font-display text-base font-bold text-[#1B6B4A] dark:text-[#ECF5F0] mt-1">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-[#29332F]/80 dark:text-[#C5DFD1] leading-relaxed flex-1">
                      {item.caption}
                    </p>
                    {item.location && (
                      <p className="mt-3 text-xs text-[#29332F]/60 dark:text-[#A8CBB9] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{item.location}</span>
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#F4F7F5] dark:bg-[#11261E] rounded-xl border border-neutral-200 dark:border-[#224738]">
              <p className="text-sm text-[#29332F]/80 dark:text-[#C5DFD1]">
                {t(
                  'Ainda não existem fotografias publicadas nesta categoria.',
                  'No photographs have been published in this category yet.'
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeItem && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label={t('Fechar visualização ampliada', 'Close enlarged view')}
            className="absolute top-4 right-4 p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {filteredItems.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label={t('Fotografia anterior', 'Previous photograph')}
              className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div className="max-w-4xl w-full flex flex-col items-center">
            <div className="w-full max-h-[75vh] rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <SafeImage
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
            <div className="mt-4 text-center text-white max-w-2xl">
              <p className="text-xs text-[#7FD1A8] font-medium">
                {activeItem.category} · {lightboxIndex + 1} / {filteredItems.length}
              </p>
              <h2 className="font-display text-lg font-semibold mt-1">{activeItem.title}</h2>
              <p className="text-sm text-white/80 mt-1">{activeItem.caption}</p>
            </div>
          </div>

          {filteredItems.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label={t('Fotografia seguinte', 'Next photograph')}
              className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </>
  );
};
