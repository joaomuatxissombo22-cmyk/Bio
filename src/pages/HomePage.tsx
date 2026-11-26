import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  FileCheck2,
  MapPin,
  Shield,
  ShieldCheck,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { SeoHead } from '../components/SeoHead';
import { SafeImage } from '../components/SafeImage';
import { ServiceIcon } from '../components/ServiceIcon';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { TestimonialsFeedback } from '../components/TestimonialsFeedback';
import { LiveEnvironmentalNews } from '../components/LiveEnvironmentalNews';
import { DynamicHeading } from '../components/DynamicHeading';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { IMG_HERO, IMG_MANGROVE, SECTORS_LIST } from '../data/defaults';
import {
  HERO_DYNAMIC_SLIDES,
  localizeCategory,
  localizeSector,
  localizeService,
  localizeSettings,
} from '../i18n/translations';

const AnimatedMetricValue: React.FC<{
  value: string;
  confirmed: boolean;
  isAlwaysConfirmed?: boolean;
  inView: boolean;
  delayMs?: number;
  unconfirmedLabel: string;
}> = ({
  value,
  confirmed,
  isAlwaysConfirmed = false,
  inView,
  delayMs = 0,
  unconfirmedLabel,
}) => {
  const cleanVal = value.trim();
  const hasConfirmedValue = (confirmed || isAlwaysConfirmed) && cleanVal.length > 0;
  const numericMatch = cleanVal.match(/^(\+?)(\d+)(.*)$/);
  const [displayNum, setDisplayNum] = useState(0);

  useEffect(() => {
    if (!hasConfirmedValue || !numericMatch || !inView) return;
    const target = parseInt(numericMatch[2], 10);
    if (isNaN(target) || target <= 0) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayNum(target);
      return;
    }

    let rafId = 0;
    let startTime = 0;
    const duration = 1800;

    const timeoutId = window.setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayNum(Math.round(target * eased));
        if (progress < 1) {
          rafId = window.requestAnimationFrame(step);
        } else {
          setDisplayNum(target);
        }
      };
      rafId = window.requestAnimationFrame(step);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [hasConfirmedValue, cleanVal, inView, delayMs]);

  if (!hasConfirmedValue) {
    return (
      <span className="text-sm font-medium text-[#29332F]/65 dark:text-[#A8CBB9]">
        {unconfirmedLabel}
      </span>
    );
  }

  if (numericMatch) {
    return (
      <span className="font-display text-4xl sm:text-[2.65rem] font-extrabold text-[#182C61] dark:text-[#ECF5F0] tabular-nums tracking-tight leading-none inline-flex items-baseline">
        {numericMatch[1] && (
          <span className="text-[#1E7E54] dark:text-[#BCE87D] mr-0.5">{numericMatch[1]}</span>
        )}
        <span>{displayNum}</span>
        {numericMatch[3] && <span className="ml-0.5">{numericMatch[3]}</span>}
      </span>
    );
  }

  return (
    <span className="font-display text-4xl sm:text-[2.65rem] font-extrabold text-[#182C61] dark:text-[#ECF5F0] tabular-nums leading-none">
      {cleanVal}
    </span>
  );
};

export const HomePage: React.FC = () => {
  const { settings: rawSettings, services: rawServices, projects, partners, openProposalModal } =
    useSite();
  const { lang, t } = useLanguage();
  const settings = localizeSettings(rawSettings, lang);

  const [slideIndex, setSlideIndex] = useState(0);
  const [indicatorsInView, setIndicatorsInView] = useState(false);
  const indicatorsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % HERO_DYNAMIC_SLIDES.length);
    }, 5200);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const el = indicatorsRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIndicatorsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIndicatorsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const currentSlide = HERO_DYNAMIC_SLIDES[slideIndex];
  const slideHeadline =
    lang === 'en'
      ? currentSlide.enTitle
      : lang === 'zh'
      ? currentSlide.zhTitle
      : currentSlide.ptTitle;
  const activeHeadline = slideHeadline || settings.heroTitle;
  const activeFocus =
    lang === 'en'
      ? currentSlide.enFocus
      : lang === 'zh'
      ? currentSlide.zhFocus
      : currentSlide.ptFocus;
  const unconfirmedLabel = t('Sob confirmação institucional', 'Pending institutional confirmation');

  return (
    <>
      <SeoHead
        title={t(
          'BIOSFERA – Consultoria Ambiental em Angola | EIA e Licenciamento',
          'BIOSFERA – Environmental Consultancy in Angola | EIA & Permitting'
        )}
        description={t(
          'Consultoria ambiental em Angola com mais de 10 anos de experiência em EIA, Licenciamento Ambiental, Auditorias, Planos de Gestão de Resíduos e Monitorização.',
          'Environmental consultancy in Angola with over 10 years of experience in EIA, Environmental Permitting, Audits, Waste Management Plans, and Monitoring.'
        )}
        path="/"
      />

      {/* 1. Hero Section with Authentic Field Photography & Dynamic Typography */}
      <section className="relative min-h-[600px] lg:min-h-[680px] flex items-center overflow-hidden bg-[#182C61]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-full h-full animate-hero-drift">
            <SafeImage
              src={IMG_HERO}
              alt={t(
                'Equipa técnica da BIOSFERA em expedição de campo junto ao rio e embarcação de monitorização ambiental em Angola',
                'BIOSFERA technical field team on an environmental monitoring expedition along an Angolan river'
              )}
              className="w-full h-full object-cover object-[68%_28%]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#182C61]/90 via-[#1B6B4A]/70 to-[#1B6B4A]/20" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#BCE87D] uppercase mb-4">
              {t(
                'BIOSFERA – Consultoria Ambiental, Lda. · Luanda, Angola',
                'BIOSFERA – Environmental Consultancy, Ltd. · Luanda, Angola'
              )}
            </p>

            {/* Dynamic Main Headline */}
            <div className="min-h-[118px] sm:min-h-[136px] lg:min-h-[152px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`${lang}-${slideIndex}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-[clamp(2.05rem,4.1vw,3.6rem)] font-extrabold dynamic-title-sheen-light leading-[1.09] tracking-tight"
                >
                  {activeHeadline}
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Dynamic cycling focus sub-line */}
            <div className="mt-4 min-h-[28px] flex items-center gap-2.5 overflow-hidden">
              <span className="h-[2px] w-7 bg-[#8BC53F] shrink-0" aria-hidden="true" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${lang}-focus-${slideIndex}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-sm sm:text-base font-semibold text-[#BCE87D] tracking-wide"
                >
                  {activeFocus}
                </motion.span>
              </AnimatePresence>
            </div>

            <p className="mt-5 text-base sm:text-lg text-white/95 leading-relaxed max-w-2xl">
              {settings.heroSubtitle}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/servicos"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#1B6B4A] bg-white hover:bg-[#F4F7F5] rounded-lg transition-colors duration-150 min-h-[44px]"
              >
                <span>{t('Conheça os Nossos Serviços', 'Explore Our Services')}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => openProposalModal()}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#2EA36F] hover:bg-[#248A5C] border border-white/25 rounded-lg transition-colors duration-150 min-h-[44px]"
              >
                <span>{t('Solicitar Consultoria', 'Request Consultancy')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Institutional Indicators Strip (Directly Below Hero) */}
      <section
        ref={indicatorsRef}
        aria-label={t('Indicadores Institucionais Confirmados', 'Verified Institutional Indicators')}
        className="bg-[#F4F7F5] dark:bg-[#0D1E18] border-b border-neutral-200 dark:border-[#224738]"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
            <DynamicHeading
              as="h2"
              kicker={t('Desempenho Institucional', 'Institutional Track Record')}
              title={t('Indicadores Institucionais Confirmados', 'Verified Institutional Indicators')}
              titleClassName="text-xl sm:text-2xl"
            />
            <span className="text-xs text-[#29332F]/70 dark:text-[#A8CBB9]">
              {t(
                'Experiência comprovada em consultoria ambiental em Angola',
                'Proven experience in environmental consultancy across Angola'
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <div className="relative overflow-hidden bg-white dark:bg-[#11261E] border border-neutral-200/80 dark:border-[#224738] rounded-xl p-6 transition-shadow duration-300 hover:shadow-md">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#182C61] via-[#1B6B4A] to-[#8BC53F]" />
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1B6B4A] dark:text-[#7FD1A8]">
                  {t('Anos de experiência', 'Years of Experience')}
                </p>
                <span className="w-8 h-8 rounded-lg bg-[#1B6B4A]/10 dark:bg-[#1E7E54]/25 text-[#1B6B4A] dark:text-[#BCE87D] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" aria-hidden="true" />
                </span>
              </div>
              <AnimatedMetricValue
                value={settings.yearsExperience}
                confirmed={true}
                isAlwaysConfirmed={true}
                inView={indicatorsInView}
                delayMs={0}
                unconfirmedLabel={unconfirmedLabel}
              />
              <p className="text-xs text-[#29332F]/75 dark:text-[#C5DFD1] mt-2.5 font-medium">
                {t('Actuação contínua no mercado angolano', 'Continuous operation in Angola')}
              </p>
            </div>

            <div className="relative overflow-hidden bg-white dark:bg-[#11261E] border border-neutral-200/80 dark:border-[#224738] rounded-xl p-6 transition-shadow duration-300 hover:shadow-md">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#182C61] via-[#1B6B4A] to-[#8BC53F]" />
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1B6B4A] dark:text-[#7FD1A8]">
                  {t('Projectos realizados', 'Completed Projects')}
                </p>
                <span className="w-8 h-8 rounded-lg bg-[#1B6B4A]/10 dark:bg-[#1E7E54]/25 text-[#1B6B4A] dark:text-[#BCE87D] flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4" aria-hidden="true" />
                </span>
              </div>
              <AnimatedMetricValue
                value={settings.projectsCompleted}
                confirmed={settings.indicatorsConfirmed}
                inView={indicatorsInView}
                delayMs={100}
                unconfirmedLabel={unconfirmedLabel}
              />
              <p className="text-xs text-[#29332F]/75 dark:text-[#C5DFD1] mt-2.5 font-medium">
                {t('Portfólio multissetorial em Angola', 'Multi-sector portfolio in Angola')}
              </p>
            </div>

            <div className="relative overflow-hidden bg-white dark:bg-[#11261E] border border-neutral-200/80 dark:border-[#224738] rounded-xl p-6 transition-shadow duration-300 hover:shadow-md">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#182C61] via-[#1B6B4A] to-[#8BC53F]" />
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1B6B4A] dark:text-[#7FD1A8]">
                  {t('Estudos e relatórios', 'Studies & Reports')}
                </p>
                <span className="w-8 h-8 rounded-lg bg-[#1B6B4A]/10 dark:bg-[#1E7E54]/25 text-[#1B6B4A] dark:text-[#BCE87D] flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-4 h-4" aria-hidden="true" />
                </span>
              </div>
              <AnimatedMetricValue
                value={settings.studiesDeveloped}
                confirmed={settings.indicatorsConfirmed}
                inView={indicatorsInView}
                delayMs={200}
                unconfirmedLabel={unconfirmedLabel}
              />
              <p className="text-xs text-[#29332F]/75 dark:text-[#C5DFD1] mt-2.5 font-medium">
                {t('EIA, RMA, PGA, PGR e Auditorias', 'EIA, EMR, EMP, WMP & Audits')}
              </p>
            </div>

            <div className="relative overflow-hidden bg-white dark:bg-[#11261E] border border-neutral-200/80 dark:border-[#224738] rounded-xl p-6 transition-shadow duration-300 hover:shadow-md">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#182C61] via-[#1B6B4A] to-[#8BC53F]" />
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1B6B4A] dark:text-[#7FD1A8]">
                  {t('Licenças acompanhadas', 'Permits Supported')}
                </p>
                <span className="w-8 h-8 rounded-lg bg-[#1B6B4A]/10 dark:bg-[#1E7E54]/25 text-[#1B6B4A] dark:text-[#BCE87D] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                </span>
              </div>
              <AnimatedMetricValue
                value={settings.licensesSupported}
                confirmed={settings.indicatorsConfirmed}
                inView={indicatorsInView}
                delayMs={300}
                unconfirmedLabel={unconfirmedLabel}
              />
              <p className="text-xs text-[#29332F]/75 dark:text-[#C5DFD1] mt-2.5 font-medium">
                {t('Tramitação junto das entidades competentes', 'Liaison with regulatory authorities')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Institutional Presentation Section */}
      <section className="py-20 bg-white dark:bg-[#081410]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <DynamicHeading
                as="h2"
                kicker={t('Identidade Institucional', 'Institutional Identity')}
                title={settings.institutionalTitle}
                alternates={
                  lang === 'zh'
                    ? ['服務安哥拉全國各省的卓越環境顧問團隊']
                    : lang === 'en'
                    ? ['Environmental Excellence Across Every Angolan Province']
                    : ['Excelência Técnica em Consultoria Ambiental em Angola']
                }
                titleClassName="text-3xl sm:text-4xl"
              />
              <p className="mt-5 text-base text-[#29332F]/85 dark:text-[#DCECE3] leading-relaxed">
                {settings.institutionalDescription}
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#F4F7F5] dark:bg-[#11261E] border border-neutral-200/70 dark:border-[#224738]">
                  <Shield className="w-5 h-5 text-[#1B6B4A] dark:text-[#BCE87D] mb-2" aria-hidden="true" />
                  <h3 className="text-sm font-semibold text-[#1B6B4A] dark:text-[#7FD1A8]">
                    {t('Rigor Técnico e Legal', 'Technical & Legal Rigor')}
                  </h3>
                  <p className="text-xs text-[#29332F]/75 dark:text-[#C5DFD1] mt-1 leading-relaxed">
                    {t(
                      'Alinhamento estrito com a legislação ambiental angolana e normas internacionais.',
                      'Strict alignment with Angolan environmental legislation and international standards.'
                    )}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#F4F7F5] dark:bg-[#11261E] border border-neutral-200/70 dark:border-[#224738]">
                  <CheckCircle2 className="w-5 h-5 text-[#1E7E54] dark:text-[#BCE87D] mb-2" aria-hidden="true" />
                  <h3 className="text-sm font-semibold text-[#1B6B4A] dark:text-[#7FD1A8]">
                    {t('Equipa Multidisciplinar', 'Multidisciplinary Team')}
                  </h3>
                  <p className="text-xs text-[#29332F]/75 dark:text-[#C5DFD1] mt-1 leading-relaxed">
                    {t(
                      'Especialistas em ambiente, engenharia, segurança ocupacional e gestão de resíduos.',
                      'Specialists in environment, engineering, occupational safety, and waste management.'
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/quem-somos"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B6B4A] dark:text-[#BCE87D] hover:text-[#1E7E54] dark:hover:text-[#7FD1A8] transition-colors"
                >
                  <span>
                    {t(
                      'Conhecer a história e missão da BIOSFERA',
                      'Discover BIOSFERA’s history & mission'
                    )}
                  </span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="group h-full min-h-[360px] rounded-2xl overflow-hidden border border-neutral-200 dark:border-[#224738]">
                <SafeImage
                  src={IMG_MANGROVE}
                  alt={t(
                    'Equipa da BIOSFERA em monitorização ambiental junto a zona húmida e curso de água em Angola',
                    'BIOSFERA field team conducting environmental monitoring along a riverbank in Angola'
                  )}
                  className="w-full h-full object-cover object-[50%_20%]"
                  zoomOnHover
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Services Showcase */}
      <section className="py-20 bg-[#F4F7F5] dark:bg-[#0D1E18] border-y border-neutral-200 dark:border-[#224738]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <DynamicHeading
              as="h2"
              kicker={t('Portfólio Técnico', 'Technical Portfolio')}
              title={t(
                'Serviços Especializados de Consultoria Ambiental',
                'Specialized Environmental Consultancy Services'
              )}
              alternates={
                lang === 'zh'
                  ? ['環境影響評估、許可審查、稽核、廢棄物與環境監測']
                  : lang === 'en'
                  ? ['EIA, Permitting, Audits, Waste Management & Monitoring']
                  : ['EIA, Licenciamento, Auditorias, Resíduos e Monitorização']
              }
              className="max-w-2xl"
            />
            <Link
              to="/servicos"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B6B4A] dark:text-[#BCE87D] hover:text-[#1E7E54] dark:hover:text-[#7FD1A8] whitespace-nowrap shrink-0"
            >
              <span>
                {t(`Ver todos os ${rawServices.length} serviços`, `View all ${rawServices.length} services`)}
              </span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rawServices.slice(0, 6).map((rawService) => {
              const service = localizeService(rawService, lang);
              return (
                <article
                  key={service.id}
                  className="group bg-white dark:bg-[#11261E] rounded-xl border border-neutral-200 dark:border-[#224738] overflow-hidden flex flex-col hover:border-[#7FD1A8] dark:hover:border-[#8BC53F]/60 transition-colors duration-300"
                >
                  <div className="h-48 overflow-hidden bg-[#1B6B4A]/10">
                    <SafeImage
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover object-[50%_22%]"
                      zoomOnHover
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-xs font-mono font-medium text-[#1E7E54] dark:text-[#BCE87D]">
                        {t(`Serviço ${service.code}`, `Service ${service.code}`)}
                      </span>
                      <ServiceIcon
                        name={service.iconName}
                        className="w-5 h-5 text-[#1B6B4A] dark:text-[#7FD1A8]"
                      />
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#1B6B4A] dark:text-[#ECF5F0] leading-snug">
                      {service.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-[#29332F]/80 dark:text-[#C5DFD1] leading-relaxed flex-1">
                      {service.shortDescription}
                    </p>
                    <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-[#224738] flex items-center justify-between">
                      <Link
                        to={`/servicos#${service.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B6B4A] dark:text-[#7FD1A8] hover:text-[#1E7E54] dark:hover:text-[#BCE87D] transition-colors"
                      >
                        <span>{t('Saber Mais', 'Learn More')}</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => openProposalModal(rawService.title)}
                        className="text-xs font-medium text-[#29332F]/70 dark:text-[#A8CBB9] hover:text-[#1B6B4A] dark:hover:text-[#BCE87D] transition-colors"
                      >
                        {t('Orçamento', 'Quote')}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Sectors of Activity */}
      <section className="py-20 bg-white dark:bg-[#081410]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <DynamicHeading
              as="h2"
              kicker={t('Abrangência Económica', 'Economic Coverage')}
              title={t('Sectores de Actividade', 'Industry Sectors')}
              alternates={
                lang === 'zh'
                  ? ['涵蓋九大核心產業的專屬法規合規方案']
                  : lang === 'en'
                  ? ['Tailored Compliance Across 9 Productive Industries']
                  : ['Soluções Ambientais para 9 Sectores Estratégicos']
              }
              subtitle={t(
                'Soluções técnicas adaptadas às exigências regulatórias e operacionais de cada sector produtivo em Angola.',
                'Technical solutions tailored to the regulatory and operational demands of every productive sector in Angola.'
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SECTORS_LIST.map((rawSec, idx) => {
              const sec = localizeSector(rawSec, lang);
              return (
                <div
                  key={rawSec.name}
                  className="p-6 rounded-xl bg-[#F4F7F5] dark:bg-[#11261E] border border-neutral-200/80 dark:border-[#224738] flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#163127] border border-neutral-200 dark:border-[#2B5946] text-[#1B6B4A] dark:text-[#BCE87D] flex items-center justify-center shrink-0">
                    <ServiceIcon name={sec.iconName} className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-[#1E7E54] dark:text-[#BCE87D] tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </p>
                    <h3 className="font-display text-base font-bold text-[#1B6B4A] dark:text-[#ECF5F0] mt-0.5">
                      {sec.name}
                    </h3>
                    <p className="text-xs text-[#29332F]/75 dark:text-[#C5DFD1] mt-1.5 leading-relaxed">
                      {sec.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Featured Projects (Confirmed Only) */}
      <section className="py-20 bg-[#F4F7F5] dark:bg-[#0D1E18] border-y border-neutral-200 dark:border-[#224738]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <DynamicHeading
              as="h2"
              kicker={t('Portfólio Institucional', 'Institutional Portfolio')}
              title={t('Projectos em Destaque', 'Featured Projects')}
              alternates={
                lang === 'zh'
                  ? ['獲正式授權公開的安哥拉環境工程標竿實績']
                  : lang === 'en'
                  ? ['Authorized Environmental Engineering References']
                  : ['Referências Técnicas Confirmadas em Angola']
              }
              className="max-w-2xl"
            />
            <Link
              to="/projectos"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B6B4A] dark:text-[#BCE87D] hover:text-[#1E7E54] dark:hover:text-[#7FD1A8] whitespace-nowrap shrink-0"
            >
              <span>{t('Explorar portfólio completo', 'Explore full portfolio')}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((project) => (
                <article
                  key={project.id}
                  className="group bg-white dark:bg-[#11261E] rounded-xl border border-neutral-200 dark:border-[#224738] overflow-hidden flex flex-col hover:border-[#7FD1A8] transition-colors duration-300"
                >
                  <div className="h-48 overflow-hidden bg-[#1B6B4A]/10">
                    <SafeImage
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      zoomOnHover
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-xs text-[#1E7E54] dark:text-[#BCE87D] font-medium">
                      {localizeCategory(project.category, lang)} · {project.sector}
                    </p>
                    <h3 className="font-display text-lg font-bold text-[#1B6B4A] dark:text-[#ECF5F0] mt-1.5">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#29332F]/65 dark:text-[#A8CBB9] mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{project.location}</span>
                    </p>
                    <p className="mt-3 text-sm text-[#29332F]/80 dark:text-[#C5DFD1] leading-relaxed flex-1 line-clamp-3">
                      {project.description}
                    </p>
                    <Link
                      to="/projectos"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B6B4A] dark:text-[#7FD1A8] hover:text-[#1E7E54] dark:hover:text-[#BCE87D]"
                    >
                      <span>{t('Ver detalhes', 'View details')}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#11261E] rounded-xl border border-neutral-200 dark:border-[#224738] p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <h3 className="font-display text-xl font-bold text-[#1B6B4A] dark:text-[#7FD1A8]">
                  {t(
                    'Dossiers Técnicos Publicados Mediante Autorização',
                    'Technical Dossiers Published Upon Client Authorization'
                  )}
                </h3>
                <p className="mt-2 text-sm text-[#29332F]/80 dark:text-[#C5DFD1] leading-relaxed">
                  {t(
                    'Por compromisso de confidencialidade e rigor institucional, a BIOSFERA publica apenas referências de projectos e resultados expressamente confirmados e autorizados pelos respectivos clientes. Consulte as nossas áreas de intervenção técnica ou solicite o nosso portfólio institucional em reunião.',
                    'Out of contractual confidentiality and institutional rigor, BIOSFERA publishes only project references explicitly authorized by clients. Explore our technical practice areas or request our institutional portfolio during a consultation.'
                  )}
                </p>
              </div>
              <Link
                to="/projectos"
                className="px-5 py-3 text-sm font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                {t('Ver Categorias de Projectos', 'View Project Categories')}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 7. Authorized Partners & Clients */}
      <section className="py-16 bg-white dark:bg-[#081410]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <DynamicHeading
              as="h2"
              kicker={t('Relações Institucionais', 'Institutional Relationships')}
              title={t('Parceiros e Clientes', 'Partners & Clients')}
              titleClassName="text-2xl sm:text-3xl"
            />
          </div>

          {partners.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-[#F4F7F5] dark:bg-[#11261E] border border-neutral-200/80 dark:border-[#224738] rounded-xl p-5 flex flex-col items-center justify-center text-center min-h-[120px]"
                >
                  <SafeImage
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="h-12 w-auto object-contain mb-2"
                    fallbackTitle={partner.name}
                  />
                  <span className="text-xs font-medium text-[#29332F]/80 dark:text-[#C5DFD1]">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-[#F4F7F5] dark:bg-[#11261E] border border-neutral-200 dark:border-[#224738] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-[#29332F]/80 dark:text-[#C5DFD1]">
                {t(
                  'Os logótipos de parceiros e clientes institucionais são apresentados neste espaço exclusivamente após autorização formal e validação administrativa.',
                  'Partner and institutional client logos are displayed here strictly following formal authorization and administrative validation.'
                )}
              </p>
              <Link
                to="/contactos"
                className="text-sm font-semibold text-[#1B6B4A] dark:text-[#BCE87D] hover:text-[#1E7E54] dark:hover:text-[#7FD1A8] whitespace-nowrap shrink-0"
              >
                {t('Estabelecer Parceria →', 'Partner With Us →')}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 8. Real-Time National Environmental & ANR News */}
      <LiveEnvironmentalNews compact />

      {/* 9. Newsletter Signup */}
      <NewsletterSignup sourcePage="inicio" />

      {/* 10. Witness & Client Testimonials + Comment Form */}
      <TestimonialsFeedback />

      {/* 11. Final Call to Action */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="rounded-2xl bg-[#1B6B4A] dark:bg-gradient-to-br dark:from-[#102A20] dark:to-[#182C61] dark:border dark:border-[#224738] text-white p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <DynamicHeading
              as="h2"
              variant="inverted"
              kicker={t('Acompanhamento Especializado', 'Specialized Advisory')}
              title={t(
                'Tem um projecto que necessita de acompanhamento ambiental?',
                'Does your project require dedicated environmental support?'
              )}
              subtitle={t(
                'A nossa equipa multidisciplinar está disponível para analisar os requisitos legais e técnicos do seu empreendimento em qualquer província de Angola.',
                'Our multidisciplinary team is ready to assess the legal and technical requirements of your project in any Angolan province.'
              )}
              titleClassName="text-2xl sm:text-3xl lg:text-4xl"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => openProposalModal()}
              className="px-6 py-3.5 text-sm font-semibold bg-[#8BC53F] text-[#182C61] hover:bg-[#9FD354] rounded-lg transition-colors min-h-[44px] whitespace-nowrap"
            >
              {t('Fale com a Nossa Equipa Técnica', 'Speak with Our Technical Team')}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
