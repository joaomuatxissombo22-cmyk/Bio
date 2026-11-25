import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Building2, CheckCircle2, MessageSquarePlus, Quote, Send, Star } from 'lucide-react';
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

export const TestimonialsFeedback: React.FC = () => {
  const { testimonials } = useSite();
  const { lang, t } = useLanguage();
  const [authorName, setAuthorName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
          'Please enter your full name (minimum 2 characters).'
        )
      );
      return;
    }

    if (cleanComment.length < 8 || cleanComment.length > 1500) {
      setErrorMsg(
        t(
          'Escreva um comentário com pelo menos 8 caracteres.',
          'Please write a comment with at least 8 characters.'
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
      setAuthorName('');
      setOrganization('');
      setRole('');
      setRating(5);
      setComment('');
    } catch {
      setErrorMsg(
        t(
          'Não foi possível registar o seu testemunho neste momento. Tente novamente dentro de instantes.',
          'Unable to submit your testimonial right now. Please try again shortly.'
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
        'Client and Visitor Testimonials & Comments'
      )}
      className="py-20 bg-white dark:bg-[#081410]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <DynamicHeading
            as="h2"
            kicker={t('Feedback & Testemunhos', 'Feedback & Testimonials')}
            title={t('Testemunhos e Comentários', 'Testimonials & Comments')}
            alternates={
              lang === 'zh'
                ? ['環境顧問合作客戶與訪客的真實體驗回饋']
                : lang === 'en'
                ? ['Verified Client Experiences in Environmental Consultancy']
                : ['Opiniões de Clientes e Parceiros sobre a BIOSFERA']
            }
            subtitle={t(
              'Partilhe a sua experiência com os serviços de consultoria ambiental da BIOSFERA ou deixe o seu comentário no espaço abaixo.',
              'Share your experience with BIOSFERA’s environmental consultancy services or leave your comment below.'
            )}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Published Testimonials & Visitor Comments */}
          <div className="lg:col-span-7 space-y-5">
            {testimonials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.slice(0, 8).map((rawItem) => {
                  const item = localizeTestimonial(rawItem, lang);
                  return (
                    <article
                      key={item.id}
                      className="rounded-xl bg-[#F4F7F5] dark:bg-[#11261E] border border-neutral-200 dark:border-[#224738] p-5 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div
                            className="flex items-center gap-1"
                            aria-label={t(
                              `Avaliação: ${item.rating} de 5`,
                              `Rating: ${item.rating} out of 5`
                            )}
                          >
                            {[1, 2, 3, 4, 5].map((starVal) => (
                              <Star
                                key={starVal}
                                className={`w-4 h-4 ${
                                  starVal <= item.rating
                                    ? 'fill-[#1E7E54] text-[#1E7E54] dark:fill-[#8BC53F] dark:text-[#8BC53F]'
                                    : 'text-neutral-300 dark:text-[#224738]'
                                }`}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                          <span className="text-xs font-mono text-[#29332F]/60 dark:text-[#A8CBB9] tabular-nums">
                            {formatFirestoreDate(item.createdAt, lang)}
                          </span>
                        </div>

                        <div className="relative pl-6">
                          <Quote
                            className="w-4 h-4 text-[#1E7E54] dark:text-[#BCE87D] absolute left-0 top-1"
                            aria-hidden="true"
                          />
                          <p className="text-sm text-[#29332F]/90 dark:text-[#DCECE3] leading-relaxed whitespace-pre-line">
                            {item.comment}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-neutral-200/80 dark:border-[#224738] flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-display text-sm font-bold text-[#1B6B4A] dark:text-[#ECF5F0]">
                            {item.authorName}
                          </p>
                          {(item.role || item.organization) && (
                            <p className="text-xs text-[#29332F]/70 dark:text-[#A8CBB9] flex items-center gap-1.5 mt-0.5">
                              <Building2
                                className="w-3.5 h-3.5 text-[#1E7E54] dark:text-[#7FD1A8] shrink-0"
                                aria-hidden="true"
                              />
                              <span>
                                {[item.role, item.organization].filter(Boolean).join(' · ')}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl bg-[#F4F7F5] dark:bg-[#11261E] border border-neutral-200 dark:border-[#224738] p-8 sm:p-10 space-y-3">
                <div className="w-11 h-11 rounded-xl bg-white dark:bg-[#163127] border border-neutral-200 dark:border-[#2B5946] text-[#1B6B4A] dark:text-[#7FD1A8] flex items-center justify-center">
                  <MessageSquarePlus className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#1B6B4A] dark:text-[#7FD1A8]">
                  {t(
                    'Espaço Aberto a Testemunhos e Comentários',
                    'Open Space for Testimonials & Comments'
                  )}
                </h3>
                <p className="text-sm text-[#29332F]/80 dark:text-[#C5DFD1] leading-relaxed">
                  {t(
                    'Valorizamos a opinião transparente de clientes, parceiros técnicos e participantes das nossas formações e projectos. Seja o primeiro a registar o seu testemunho e comentário no formulário ao lado.',
                    'We value transparent feedback from clients, technical partners, and project stakeholders. Share your testimonial and comment using the form.'
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Right: Interactive Testimonial & Comment Form */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-2xl bg-white dark:bg-[#11261E] border border-neutral-200 dark:border-[#224738] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2.5 mb-2">
                <MessageSquarePlus
                  className="w-5 h-5 text-[#1B6B4A] dark:text-[#BCE87D]"
                  aria-hidden="true"
                />
                <h3 className="font-display text-xl font-bold text-[#1B6B4A] dark:text-[#ECF5F0]">
                  {t('Deixar Testemunho e Comentário', 'Leave a Testimonial & Comment')}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#29332F]/75 dark:text-[#A8CBB9] mb-6">
                {t(
                  'O seu comentário é guardado e apresentado na secção de feedback institucional.',
                  'Your comment is saved and displayed in our institutional feedback section.'
                )}
              </p>

              {submitted ? (
                <div className="rounded-xl bg-[#F4F7F5] dark:bg-[#163127] border border-[#1E7E54]/30 dark:border-[#7FD1A8]/35 p-6 text-center space-y-3">
                  <CheckCircle2
                    className="w-8 h-8 text-[#1E7E54] dark:text-[#8BC53F] mx-auto"
                    aria-hidden="true"
                  />
                  <h4 className="font-display text-base font-bold text-[#1B6B4A] dark:text-[#ECF5F0]">
                    {t('Obrigado pelo seu Testemunho!', 'Thank You for Your Testimonial!')}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#29332F]/80 dark:text-[#C5DFD1]">
                    {t(
                      'O seu comentário foi registado e já está visível para os visitantes.',
                      'Your comment has been recorded and is now visible to visitors.'
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] rounded-lg transition-colors"
                  >
                    {t('Escrever Outro Comentário', 'Write Another Comment')}
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

                  <div>
                    <label
                      htmlFor="testimonial-author"
                      className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5"
                    >
                      {t('Nome Completo *', 'Full Name *')}
                    </label>
                    <input
                      id="testimonial-author"
                      type="text"
                      required
                      maxLength={120}
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder={t('O seu nome', 'Your name')}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#7DA894]/70 focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="testimonial-org"
                        className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5"
                      >
                        {t('Empresa / Instituição', 'Company / Institution')}
                      </label>
                      <input
                        id="testimonial-org"
                        type="text"
                        maxLength={140}
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder={t('Opcional', 'Optional')}
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#7DA894]/70 focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="testimonial-role"
                        className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5"
                      >
                        {t('Cargo / Função', 'Role / Position')}
                      </label>
                      <input
                        id="testimonial-role"
                        type="text"
                        maxLength={120}
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder={t('Ex.: Director Técnico', 'e.g., Technical Director')}
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#7DA894]/70 focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5">
                      {t('Avaliação da Experiência', 'Experience Rating')}
                    </span>
                    <div
                      className="flex items-center gap-1.5"
                      role="group"
                      aria-label={t('Seleccionar classificação de 1 a 5', 'Select rating from 1 to 5')}
                    >
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setRating(starVal)}
                          aria-label={t(`${starVal} de 5`, `${starVal} out of 5`)}
                          aria-pressed={rating === starVal}
                          className="p-1.5 rounded-lg border border-neutral-200 dark:border-[#224738] bg-[#F4F7F5] dark:bg-[#0D1E18] hover:border-[#1E7E54] dark:hover:border-[#8BC53F] transition-colors"
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
                      <span className="ml-2 text-xs font-mono text-[#1E7E54] dark:text-[#BCE87D] font-semibold">
                        {rating}/5
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <label
                        htmlFor="testimonial-comment"
                        className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3]"
                      >
                        {t('Comentário / Testemunho *', 'Comment / Testimonial *')}
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
                        'Write your comment about our consulting support, environmental studies, or partnership with BIOSFERA...'
                      )}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#7DA894]/70 focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] disabled:opacity-60 rounded-lg transition-colors min-h-[44px]"
                  >
                    <Send className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {submitting
                        ? t('A Publicar Comentário...', 'Publishing Comment...')
                        : t('Publicar Testemunho', 'Publish Testimonial')}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
