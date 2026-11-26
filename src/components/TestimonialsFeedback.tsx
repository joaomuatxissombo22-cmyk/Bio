import React, { useMemo, useRef, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageSquarePlus,
  Quote,
  Send,
  Star,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useSite } from '../context/SiteContext';
import { useLanguage, type SiteLanguage } from '../context/LanguageContext';
import { localizeTestimonial } from '../i18n/translations';
import { DynamicHeading } from './DynamicHeading';
import { db, handleFirestoreError, OperationType } from '../firebase';

function formatFirestoreDate(ts: unknown, lang: SiteLanguage): string {
  const locale = lang === 'en' ? 'en-GB' : lang === 'zh' ? 'zh-TW' : 'pt-AO';
  if (!ts) return lang === 'en' ? 'Just now' : lang === 'zh' ? '剛剛' : 'Agora mesmo';
  if (typeof ts === 'object') {
    const maybeToDate = ts as { toDate?: () => Date; seconds?: number };
    const date =
      typeof maybeToDate.toDate === 'function'
        ? maybeToDate.toDate()
        : typeof maybeToDate.seconds === 'number'
        ? new Date(maybeToDate.seconds * 1000)
        : null;
    if (date && !Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date);
    }
  }
  if (typeof ts === 'string') {
    const parsed = new Date(ts);
    if (!Number.isNaN(parsed.getTime())) {
      return new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(parsed);
    }
  }
  return lang === 'en' ? 'Recent' : lang === 'zh' ? '近期' : 'Recente';
}

function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'BF';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export const TestimonialsFeedback: React.FC = () => {
  const { testimonials } = useSite();
  const { lang, t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const authorInputRef = useRef<HTMLInputElement | null>(null);

  const visibleTestimonials = useMemo(
    () => testimonials.slice(0, 9).map((raw) => localizeTestimonial(raw, lang)),
    [testimonials, lang]
  );

  const safeActiveIndex =
    visibleTestimonials.length > 0 ? activeIndex % visibleTestimonials.length : 0;
  const featuredItem = visibleTestimonials[safeActiveIndex] ?? null;

  const averageRating = useMemo(() => {
    if (visibleTestimonials.length === 0) return 5.0;
    const sum = visibleTestimonials.reduce((acc, item) => acc + (Number(item.rating) || 5), 0);
    return sum / visibleTestimonials.length;
  }, [visibleTestimonials]);

  const handlePrev = () => {
    if (visibleTestimonials.length <= 1) return;
    setActiveIndex(
      (prev) => (prev - 1 + visibleTestimonials.length) % visibleTestimonials.length
    );
  };

  const handleNext = () => {
    if (visibleTestimonials.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % visibleTestimonials.length);
  };

  const scrollToComposer = () => {
    setSubmitted(false);
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => {
      authorInputRef.current?.focus();
    }, 350);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (honeypot.trim() !== '') return;

    const cleanAuthor = authorName.trim();
    const cleanOrg = organization.trim();
    const cleanRole = role.trim();
    const cleanComment = comment.trim();

    if (cleanAuthor.length < 2 || cleanAuthor.length > 120) {
      setErrorMsg(
        t(
          'Por favor, indique o seu nome completo (mínimo 2 caracteres).',
          'Please enter your full name (minimum 2 characters).',
          '請輸入您的完整姓名（至少 2 個字元）。'
        )
      );
      return;
    }

    if (cleanComment.length < 8 || cleanComment.length > 1500) {
      setErrorMsg(
        t(
          'Escreva um comentário com pelo menos 8 caracteres.',
          'Please write a comment with at least 8 characters.',
          '請撰寫至少 8 個字元的評論內容。'
        )
      );
      return;
    }

    const safeRating = Math.min(5, Math.max(1, Math.round(rating)));

    setSubmitting(true);
    try {
      const payload = {
        authorName: cleanAuthor.slice(0, 120),
        organization: cleanOrg.slice(0, 140),
        role: cleanRole.slice(0, 120),
        rating: safeRating,
        comment: cleanComment.slice(0, 1500),
        published: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'testimonials'), payload).catch((err) =>
        handleFirestoreError(err, OperationType.CREATE, 'testimonials')
      );

      setSubmitted(true);
      setActiveIndex(0);
      setAuthorName('');
      setOrganization('');
      setRole('');
      setRating(5);
      setComment('');
    } catch {
      setErrorMsg(
        t(
          'Não foi possível registar o seu testemunho neste momento. Tente novamente dentro de instantes.',
          'Unable to submit your testimonial right now. Please try again shortly.',
          '目前無法提交您的見證，請稍後再試。'
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      aria-label={t(
        'Testemunhos e Comentários de Clientes e Visitantes',
        'Client and Visitor Testimonials & Comments',
        '客戶與訪客見證及評論'
      )}
      className="py-20 sm:py-24 bg-[#F4F7F5] dark:bg-[#0D1E18] border-y border-neutral-200/80 dark:border-[#224738]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Header & Aggregate Proof */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <DynamicHeading
              as="h2"
              kicker={t('Feedback & Testemunhos', 'Feedback & Testimonials', '客戶評價與見證')}
              title={t('Vozes de Clientes e Parceiros', 'Client & Partner Voices', '客戶與合作夥伴真實見證')}
              alternates={
                lang === 'zh'
                  ? ['環境顧問合作客戶與訪客的真實體驗回饋']
                  : lang === 'en'
                  ? ['Verified Client Experiences in Environmental Consultancy']
                  : ['Testemunhos e Comentários sobre a BIOSFERA']
              }
              subtitle={t(
                'Experiências reais de empresas, gestores ambientais e parceiros institucionais que confiam no rigor técnico da BIOSFERA em Angola.',
                'Real feedback from companies, environmental managers, and institutional partners who trust BIOSFERA’s technical rigor across Angola.',
                '來自安哥拉各地企業、環境主管與機構合作夥伴對 BIOSFERA 專業服務的真實回饋。'
              )}
            />
          </div>

          <div className="flex flex-wrap items-center gap-5 shrink-0">
            {visibleTestimonials.length > 0 && (
              <div className="flex items-center gap-3 text-sm text-[#29332F]/80 dark:text-[#C5DFD1]">
                <div className="flex items-center gap-0.5" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <Star
                      key={starVal}
                      className={`w-4 h-4 ${
                        starVal <= Math.round(averageRating)
                          ? 'fill-[#1E7E54] text-[#1E7E54] dark:fill-[#8BC53F] dark:text-[#8BC53F]'
                          : 'text-neutral-300 dark:text-[#2B5946]'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono font-bold text-[#182C61] dark:text-[#ECF5F0] tabular-nums">
                  {averageRating.toFixed(1)} / 5.0
                </span>
                <span className="text-[#29332F]/40 dark:text-[#7DA894]" aria-hidden="true">
                  ·
                </span>
                <span className="text-xs sm:text-sm tabular-nums">
                  {visibleTestimonials.length}{' '}
                  {visibleTestimonials.length === 1
                    ? t('testemunho', 'testimonial', '則見證')
                    : t('testemunhos', 'testimonials', '則見證')}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={scrollToComposer}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] rounded-lg transition-colors min-h-[44px] whitespace-nowrap shrink-0"
            >
              <MessageSquarePlus className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t('Deixar Testemunho', 'Write a Testimonial', '撰寫見證')}</span>
            </button>
          </div>
        </div>

        {/* Featured Editorial Spotlight Stage */}
        {featuredItem ? (
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#182C61] via-[#17404E] to-[#1B6B4A] dark:from-[#0F241D] dark:via-[#123026] dark:to-[#18334A] text-white border border-[#1E7E54]/20 dark:border-[#2B5946]">
              {/* Subtle top hairline light accent */}
              <div
                aria-hidden="true"
                className="h-[3px] w-full bg-gradient-to-r from-[#8BC53F] via-[#7FD1A8] to-transparent"
              />

              <div className="p-7 sm:p-10 lg:p-12">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#BCE87D] shrink-0">
                      <Quote className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <div className="flex items-center gap-2 text-xs text-white/80">
                      <span className="font-semibold text-[#BCE87D]">
                        {t('Testemunho em Destaque', 'Featured Testimonial', '精選見證')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {String(safeActiveIndex + 1).padStart(2, '0')} /{' '}
                        {String(visibleTestimonials.length).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {visibleTestimonials.length > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrev}
                        aria-label={t('Testemunho anterior', 'Previous testimonial', '上一則見證')}
                        className="w-11 h-11 rounded-xl border border-white/20 bg-white/8 hover:bg-white/18 text-white flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#BCE87D]"
                      >
                        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        aria-label={t('Próximo testemunho', 'Next testimonial', '下一則見證')}
                        className="w-11 h-11 rounded-xl border border-white/20 bg-white/8 hover:bg-white/18 text-white flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#BCE87D]"
                      >
                        <ChevronRight className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${featuredItem.id}-${lang}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <blockquote className="font-display text-lg sm:text-2xl lg:text-[1.6rem] font-medium text-white leading-[1.5] max-w-4xl whitespace-pre-line">
                      “{featuredItem.comment}”
                    </blockquote>

                    <div className="mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#8BC53F] text-[#182C61] font-display text-sm font-extrabold flex items-center justify-center shrink-0">
                          {getInitials(featuredItem.authorName)}
                        </div>
                        <div>
                          <p className="font-display text-base font-bold text-white">
                            {featuredItem.authorName}
                          </p>
                          {(featuredItem.role || featuredItem.organization) && (
                            <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                              {[featuredItem.role, featuredItem.organization]
                                .filter(Boolean)
                                .join(' · ')}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-white/80">
                        <div
                          className="flex items-center gap-0.5"
                          aria-label={t(
                            `Avaliação: ${featuredItem.rating} de 5`,
                            `Rating: ${featuredItem.rating} out of 5`,
                            `評分：${featuredItem.rating} / 5`
                          )}
                        >
                          {[1, 2, 3, 4, 5].map((starVal) => (
                            <Star
                              key={starVal}
                              className={`w-4 h-4 ${
                                starVal <= featuredItem.rating
                                  ? 'fill-[#BCE87D] text-[#BCE87D]'
                                  : 'text-white/25'
                              }`}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {formatFirestoreDate(featuredItem.createdAt, lang)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Editorial Voices Grid */}
            {visibleTestimonials.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleTestimonials.map((item, idx) => {
                  const isSelected = idx === safeActiveIndex;
                  return (
                    <article
                      key={item.id}
                      onClick={() => setActiveIndex(idx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveIndex(idx);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      className={`group text-left rounded-2xl bg-white dark:bg-[#11261E] border p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E7E54] ${
                        isSelected
                          ? 'border-[#1E7E54] dark:border-[#8BC53F] ring-1 ring-[#1E7E54]/25 dark:ring-[#8BC53F]/30'
                          : 'border-neutral-200/90 dark:border-[#224738] hover:border-[#7FD1A8] dark:hover:border-[#7FD1A8]/60'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-10 h-10 rounded-full font-display text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-[#1B6B4A] text-white dark:bg-[#8BC53F] dark:text-[#182C61]'
                                  : 'bg-[#F4F7F5] dark:bg-[#163127] text-[#182C61] dark:text-[#BCE87D]'
                              }`}
                            >
                              {getInitials(item.authorName)}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-display text-sm font-bold text-[#182C61] dark:text-[#ECF5F0] truncate">
                                {item.authorName}
                              </h3>
                              {(item.role || item.organization) && (
                                <p className="text-xs text-[#29332F]/70 dark:text-[#A8CBB9] truncate mt-0.5">
                                  {[item.role, item.organization].filter(Boolean).join(' · ')}
                                </p>
                              )}
                            </div>
                          </div>

                          <div
                            className="inline-flex items-center gap-1 shrink-0 font-mono text-xs font-semibold text-[#1E7E54] dark:text-[#BCE87D] tabular-nums"
                            aria-label={t(
                              `Avaliação: ${item.rating} de 5`,
                              `Rating: ${item.rating} out of 5`,
                              `評分：${item.rating} / 5`
                            )}
                          >
                            <span>{Number(item.rating || 5).toFixed(1)}</span>
                            <Star
                              className="w-3.5 h-3.5 fill-[#1E7E54] text-[#1E7E54] dark:fill-[#8BC53F] dark:text-[#8BC53F]"
                              aria-hidden="true"
                            />
                          </div>
                        </div>

                        <p className="text-sm text-[#29332F]/85 dark:text-[#DCECE3] leading-relaxed line-clamp-4 whitespace-pre-line">
                          “{item.comment}”
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-neutral-200/75 dark:border-[#224738] flex items-center justify-between gap-2 text-xs">
                        <span className="font-mono text-[#29332F]/60 dark:text-[#A8CBB9] tabular-nums">
                          {formatFirestoreDate(item.createdAt, lang)}
                        </span>
                        <span
                          className={`font-semibold transition-colors ${
                            isSelected
                              ? 'text-[#1E7E54] dark:text-[#BCE87D]'
                              : 'text-[#29332F]/55 dark:text-[#A8CBB9] group-hover:text-[#1B6B4A] dark:group-hover:text-[#BCE87D]'
                          }`}
                        >
                          {isSelected
                            ? t('Em destaque', 'Highlighted', '精選顯示中')
                            : t('Ler completo', 'Highlight', '展開閱讀')}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl bg-white dark:bg-[#11261E] border border-neutral-200 dark:border-[#224738] p-8 sm:p-10 space-y-3">
            <h3 className="font-display text-xl font-bold text-[#182C61] dark:text-[#ECF5F0]">
              {t(
                'Espaço Aberto a Testemunhos e Comentários',
                'Open Space for Testimonials & Comments',
                '開放客戶見證與評論專區'
              )}
            </h3>
            <p className="text-sm text-[#29332F]/80 dark:text-[#C5DFD1] leading-relaxed max-w-2xl">
              {t(
                'Valorizamos a opinião transparente de clientes, parceiros técnicos e participantes das nossas formações e projectos. Registe o primeiro testemunho abaixo.',
                'We value transparent feedback from clients, technical partners, and project stakeholders. Share the first testimonial below.',
                '我們重視客戶、技術合作夥伴與專案參與者的真實意見，歡迎在下方留下您的見證。'
              )}
            </p>
          </div>
        )}

        {/* Dedicated Institutional Feedback Submission Panel */}
        <div
          id="escrever-testemunho"
          ref={formSectionRef}
          className="mt-12 rounded-2xl bg-white dark:bg-[#11261E] border border-neutral-200/90 dark:border-[#224738] p-7 sm:p-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1E7E54] dark:text-[#BCE87D]">
                {t('Partilhe a Sua Experiência', 'Share Your Experience', '分享您的合作體驗')}
              </p>
              <h3 className="font-display text-2xl font-bold text-[#182C61] dark:text-[#ECF5F0] leading-snug">
                {t('Deixar Testemunho e Comentário', 'Leave a Testimonial & Comment', '留下見證與評論')}
              </h3>
              <p className="text-sm text-[#29332F]/80 dark:text-[#C5DFD1] leading-relaxed">
                {t(
                  'A sua avaliação ajuda-nos a manter o mais elevado padrão técnico em estudos ambientais, licenciamento, auditorias e acompanhamento de projectos em Angola.',
                  'Your feedback helps us maintain the highest technical standard in environmental studies, permitting, audits, and project advisory across Angola.',
                  '您的回饋有助於我們在環境研究、許可審查、稽核與專案輔導中持續維持最高技術水準。'
                )}
              </p>

              <div className="pt-4 border-t border-neutral-200/80 dark:border-[#224738] space-y-2 text-xs text-[#29332F]/70 dark:text-[#A8CBB9]">
                <p>
                  {t(
                    'Publicação imediata · Dados protegidos · Visível na secção institucional',
                    'Immediate publication · Protected data · Displayed in our institutional feed',
                    '即時發布 · 資料保護 · 顯示於機構見證專區'
                  )}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              {submitted ? (
                <div className="rounded-xl bg-[#F4F7F5] dark:bg-[#163127] border border-[#1E7E54]/30 dark:border-[#7FD1A8]/35 p-8 text-center space-y-3">
                  <CheckCircle2
                    className="w-9 h-9 text-[#1E7E54] dark:text-[#8BC53F] mx-auto"
                    aria-hidden="true"
                  />
                  <h4 className="font-display text-lg font-bold text-[#182C61] dark:text-[#ECF5F0]">
                    {t(
                      'Obrigado pelo seu Testemunho!',
                      'Thank You for Your Testimonial!',
                      '感謝您的寶貴見證！'
                    )}
                  </h4>
                  <p className="text-sm text-[#29332F]/80 dark:text-[#C5DFD1] max-w-md mx-auto">
                    {t(
                      'O seu comentário foi registado e já está disponível em destaque na lista acima.',
                      'Your comment has been recorded and is now featured in the testimonials showcase above.',
                      '您的評論已成功儲存，並已顯示於上方的見證展示區。'
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] rounded-lg transition-colors min-h-[44px]"
                  >
                    {t('Escrever Outro Comentário', 'Write Another Comment', '撰寫另一則評論')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <input
                    type="text"
                    name="testimonial_website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />

                  {errorMsg && (
                    <div
                      role="alert"
                      className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/70 text-xs text-red-800 dark:text-red-200"
                    >
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="testimonial-author"
                        className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5"
                      >
                        {t('Nome Completo *', 'Full Name *', '完整姓名 *')}
                      </label>
                      <input
                        ref={authorInputRef}
                        id="testimonial-author"
                        type="text"
                        required
                        maxLength={120}
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder={t('O seu nome', 'Your name', '您的姓名')}
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-[#F9FBFA] dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#7DA894]/70 focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="testimonial-org"
                        className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5"
                      >
                        {t('Empresa / Instituição', 'Company / Institution', '企業 / 機構')}
                      </label>
                      <input
                        id="testimonial-org"
                        type="text"
                        maxLength={140}
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder={t('Opcional', 'Optional', '選填')}
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-[#F9FBFA] dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#7DA894]/70 focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <div>
                      <label
                        htmlFor="testimonial-role"
                        className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5"
                      >
                        {t('Cargo / Função', 'Role / Position', '職稱 / 職務')}
                      </label>
                      <input
                        id="testimonial-role"
                        type="text"
                        maxLength={120}
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder={t('Ex.: Director Técnico', 'e.g., Technical Director', '例如：技術總監')}
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-[#F9FBFA] dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#7DA894]/70 focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                      />
                    </div>

                    <div>
                      <span className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5">
                        {t('Avaliação da Experiência', 'Experience Rating', '合作體驗評分')}
                      </span>
                      <div
                        className="flex items-center gap-1.5"
                        role="group"
                        aria-label={t(
                          'Seleccionar classificação de 1 a 5',
                          'Select rating from 1 to 5',
                          '選擇 1 至 5 分評價'
                        )}
                      >
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <button
                            key={starVal}
                            type="button"
                            onClick={() => setRating(starVal)}
                            aria-label={t(`${starVal} de 5`, `${starVal} out of 5`, `${starVal} / 5`)}
                            aria-pressed={rating === starVal}
                            className="p-2 rounded-lg border border-neutral-200 dark:border-[#224738] bg-[#F4F7F5] dark:bg-[#0D1E18] hover:border-[#1E7E54] dark:hover:border-[#8BC53F] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                starVal <= rating
                                  ? 'fill-[#1E7E54] text-[#1E7E54] dark:fill-[#8BC53F] dark:text-[#8BC53F]'
                                  : 'text-neutral-300 dark:text-[#2B5946]'
                              }`}
                              aria-hidden="true"
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-xs font-mono text-[#1E7E54] dark:text-[#BCE87D] font-semibold tabular-nums">
                          {rating}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <label
                        htmlFor="testimonial-comment"
                        className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3]"
                      >
                        {t('Comentário / Testemunho *', 'Comment / Testimonial *', '評論 / 見證內容 *')}
                      </label>
                      <span className="text-[11px] font-mono text-[#29332F]/60 dark:text-[#A8CBB9] tabular-nums">
                        {comment.length}/1500
                      </span>
                    </div>
                    <textarea
                      id="testimonial-comment"
                      required
                      rows={4}
                      maxLength={1500}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t(
                        'Escreva aqui o seu comentário sobre o atendimento, estudos ambientais ou parceria com a BIOSFERA...',
                        'Write your comment about our consulting support, environmental studies, or partnership with BIOSFERA...',
                        '請在此分享您對 BIOSFERA 顧問服務、環境研究或專案合作的評價...'
                      )}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-[#F9FBFA] dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#7DA894]/70 focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] disabled:opacity-60 rounded-lg transition-colors min-h-[44px]"
                    >
                      <Send className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {submitting
                          ? t('A Publicar Comentário...', 'Publishing Comment...', '正在發布評論...')
                          : t('Publicar Testemunho', 'Publish Testimonial', '發布見證')}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
