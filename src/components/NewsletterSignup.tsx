import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, FileText, Mail, Newspaper, Scale, Send } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useLanguage } from '../context/LanguageContext';
import { DynamicHeading } from './DynamicHeading';
import type { NewsletterTopic } from '../types';

const TOPIC_OPTIONS: {
  id: NewsletterTopic;
  ptLabel: string;
  enLabel: string;
  zhLabel: string;
  ptDesc: string;
  enDesc: string;
  zhDesc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'Legislação Ambiental',
    ptLabel: 'Legislação Ambiental',
    enLabel: 'Environmental Law',
    zhLabel: '環境法規動態',
    ptDesc: 'Decretos, normas regulatórias e requisitos de licenciamento em Angola.',
    enDesc: 'Decrees, regulatory rules, and environmental licensing updates in Angola.',
    zhDesc: '安哥拉環境法令、監管規範與許可審查最新動態。',
    icon: Scale,
  },
  {
    id: 'Notícias da Empresa',
    ptLabel: 'Notícias da Empresa',
    enLabel: 'Company News',
    zhLabel: '企業最新消息',
    ptDesc: 'Novos projectos, iniciativas institucionais e formações da BIOSFERA.',
    enDesc: 'New projects, institutional initiatives, and BIOSFERA training events.',
    zhDesc: 'BIOSFERA 最新專案進度、機構倡議與專業訓練活動。',
    icon: Newspaper,
  },
  {
    id: 'Artigos Técnicos',
    ptLabel: 'Artigos Técnicos',
    enLabel: 'Technical Articles',
    zhLabel: '專業技術文章',
    ptDesc: 'Guias práticos sobre EIA, auditorias, monitorização e gestão de resíduos.',
    enDesc: 'Practical insights on EIA, audits, monitoring, and waste management.',
    zhDesc: '環評（EIA）、稽核、環境監測與廢棄物管理實務指引。',
    icon: FileText,
  },
];

export const NewsletterSignup: React.FC<{ sourcePage?: string }> = ({ sourcePage = 'inicio' }) => {
  const { lang, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [topics, setTopics] = useState<NewsletterTopic[]>([
    'Legislação Ambiental',
    'Notícias da Empresa',
  ]);
  const [consent, setConsent] = useState(true);
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');

  const toggleTopic = (topic: NewsletterTopic) => {
    setTopics((prev) => {
      if (prev.includes(topic)) {
        if (prev.length === 1) return prev;
        return prev.filter((tItem) => tItem !== topic);
      }
      return [...prev, topic];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (honeypot.trim() !== '') return;

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (
      cleanEmail.length < 5 ||
      cleanEmail.length > 140 ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)
    ) {
      setErrorMsg(
        t(
          'Por favor, indique um endereço de e-mail válido.',
          'Please enter a valid email address.'
        )
      );
      return;
    }

    if (topics.length === 0) {
      setErrorMsg(
        t(
          'Seleccione pelo menos uma área de interesse para a subscrição.',
          'Select at least one topic of interest to subscribe.'
        )
      );
      return;
    }

    if (!consent) {
      setErrorMsg(
        t(
          'Confirme a autorização para receber comunicações informativas da BIOSFERA.',
          'Please confirm consent to receive updates from BIOSFERA.'
        )
      );
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        email: cleanEmail.slice(0, 140),
        name: cleanName.slice(0, 120),
        topics: topics.slice(0, 3),
        status: 'ativo' as const,
        sourcePage: sourcePage.trim().slice(0, 60) || 'website',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'newsletterSubscribers'), payload).catch((err) =>
        handleFirestoreError(err, OperationType.CREATE, 'newsletterSubscribers')
      );

      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'newsletter',
          honeypot,
          summary: {
            id: docRef.id,
            email: payload.email,
            topics: payload.topics,
            sourcePage: payload.sourcePage,
          },
        }),
      }).catch(() => undefined);

      setSubmittedEmail(payload.email);
      setEmail('');
      setName('');
    } catch {
      setErrorMsg(
        t(
          'Não foi possível registar a sua subscrição neste momento. Tente novamente dentro de instantes.',
          'Unable to complete your subscription right now. Please try again shortly.'
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      aria-label={t(
        'Subscrição da Newsletter de Legislação Ambiental e Notícias',
        'Environmental Legislation & Company News Newsletter'
      )}
      className="py-16 bg-[#F4F7F5] dark:bg-[#0D1E18] border-y border-neutral-200 dark:border-[#224738]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white dark:bg-[#11261E] border border-neutral-200 dark:border-[#224738] overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Institutional Editorial Panel */}
            <div className="lg:col-span-5 bg-[#1B6B4A] dark:bg-gradient-to-br dark:from-[#0E241C] dark:to-[#182C61] text-white p-8 sm:p-10 flex flex-col justify-between">
              <div className="space-y-4">
                <DynamicHeading
                  as="h2"
                  variant="inverted"
                  kicker={t('Boletim Informativo BIOSFERA', 'BIOSFERA Technical Briefing')}
                  title={t(
                    'Actualizações sobre Legislação Ambiental e Notícias',
                    'Environmental Legislation & Company News Updates'
                  )}
                  alternates={
                    lang === 'zh'
                      ? ['掌握安哥拉環境法規與 BIOSFERA 最新資訊']
                      : lang === 'en'
                      ? ['Stay Informed on Angolan Environmental Regulations']
                      : ['Acompanhe Diplomas Ambientais e Novidades da BIOSFERA']
                  }
                  subtitle={t(
                    'Receba directamente no seu correio electrónico sínteses técnicas sobre novos diplomas ambientais em Angola, boas práticas de licenciamento e novidades dos nossos projectos.',
                    'Receive concise technical briefs on new Angolan environmental decrees, permitting best practices, and updates on our projects straight to your inbox.'
                  )}
                  titleClassName="text-2xl sm:text-3xl"
                />
              </div>

              <div className="mt-8 pt-6 border-t border-white/15 space-y-2.5 text-xs text-white/85">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8BC53F] shrink-0" aria-hidden="true" />
                  <span>
                    {t(
                      'Enquadramento técnico da legislação ambiental angolana',
                      'Technical briefings on Angolan environmental regulations'
                    )}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8BC53F] shrink-0" aria-hidden="true" />
                  <span>
                    {t(
                      'Notas práticas sobre EIA, Auditorias, PGR e Monitorização',
                      'Practical insights on EIA, Audits, Waste Plans & Monitoring'
                    )}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8BC53F] shrink-0" aria-hidden="true" />
                  <span>
                    {t(
                      'Comunicações periódicas sem spam e com total confidencialidade',
                      'Periodic communications with zero spam and strict privacy'
                    )}
                  </span>
                </p>
              </div>
            </div>

            {/* Right Subscription Form */}
            <div className="lg:col-span-7 p-8 sm:p-10">
              {submittedEmail ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1E7E54]/10 dark:bg-[#163127] text-[#1E7E54] dark:text-[#8BC53F] flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div className="space-y-1.5 max-w-md">
                    <h3 className="font-display text-xl font-bold text-[#1B6B4A] dark:text-[#ECF5F0]">
                      {t('Subscrição Registada com Sucesso', 'Subscription Confirmed')}
                    </h3>
                    <p className="text-sm text-[#29332F]/80 dark:text-[#C5DFD1] leading-relaxed">
                      {t('O e-mail', 'Email address')}{' '}
                      <span className="font-semibold text-[#1B6B4A] dark:text-[#7FD1A8]">
                        {submittedEmail}
                      </span>{' '}
                      {t('foi guardado para receber actualizações sobre', 'has been saved for updates on')}{' '}
                      <span className="font-medium">
                        {topics
                          .map((top) => {
                            const found = TOPIC_OPTIONS.find((o) => o.id === top);
                            return found
                              ? lang === 'en'
                                ? found.enLabel
                                : lang === 'zh'
                                ? found.zhLabel
                                : found.ptLabel
                              : top;
                          })
                          .join(', ')}
                      </span>
                      .
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubmittedEmail('')}
                    className="px-5 py-2.5 text-xs font-semibold text-[#1B6B4A] dark:text-[#7FD1A8] bg-[#F4F7F5] dark:bg-[#163127] border border-neutral-200 dark:border-[#2B5946] hover:border-[#1B6B4A] dark:hover:border-[#8BC53F] rounded-lg transition-colors"
                  >
                    {t('Subscrever Outro Endereço de E-mail', 'Subscribe Another Email Address')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <input
                    type="text"
                    name="newsletter_website"
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
                      className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/70 text-xs sm:text-sm text-red-800 dark:text-red-200"
                    >
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor={`newsletter-email-${sourcePage}`}
                        className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5"
                      >
                        {t('E-mail Profissional ou Pessoal *', 'Work or Personal Email *')}
                      </label>
                      <div className="relative">
                        <Mail
                          className="w-4 h-4 text-[#1B6B4A]/70 dark:text-[#7FD1A8]/80 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                          aria-hidden="true"
                        />
                        <input
                          id={`newsletter-email-${sourcePage}`}
                          type="email"
                          required
                          maxLength={140}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t('nome@empresa.ao', 'name@company.ao')}
                          className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#7DA894]/70 focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor={`newsletter-name-${sourcePage}`}
                        className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5"
                      >
                        {t('Nome ou Organização (opcional)', 'Name or Organization (optional)')}
                      </label>
                      <input
                        id={`newsletter-name-${sourcePage}`}
                        type="text"
                        maxLength={120}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('Ex.: Eng.ª Ana Silva · Indústria', 'e.g., Ana Silva · Industry')}
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#7DA894]/70 focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-2">
                      {t('Temas de Interesse *', 'Topics of Interest *')}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {TOPIC_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const active = topics.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleTopic(opt.id)}
                            aria-pressed={active}
                            className={`text-left p-3 rounded-xl border transition-colors ${
                              active
                                ? 'bg-[#F4F7F5] dark:bg-[#163127] border-[#1E7E54] dark:border-[#8BC53F]'
                                : 'bg-white dark:bg-[#0D1E18] border-neutral-200 dark:border-[#224738] hover:border-[#7FD1A8] dark:hover:border-[#2B5946]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <Icon
                                className={`w-4 h-4 shrink-0 ${
                                  active
                                    ? 'text-[#1B6B4A] dark:text-[#BCE87D]'
                                    : 'text-[#29332F]/60 dark:text-[#A8CBB9]'
                                }`}
                                aria-hidden="true"
                              />
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                  active
                                    ? 'bg-[#1E7E54] dark:bg-[#8BC53F]'
                                    : 'bg-neutral-300 dark:bg-[#224738]'
                                }`}
                                aria-hidden="true"
                              />
                            </div>
                            <p className="text-xs font-bold text-[#1B6B4A] dark:text-[#ECF5F0]">
                              {lang === 'en'
                                ? opt.enLabel
                                : lang === 'zh'
                                ? opt.zhLabel
                                : opt.ptLabel}
                            </p>
                            <p className="text-[11px] text-[#29332F]/70 dark:text-[#A8CBB9] mt-0.5 leading-snug">
                              {lang === 'en'
                                ? opt.enDesc
                                : lang === 'zh'
                                ? opt.zhDesc
                                : opt.ptDesc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                    <label className="inline-flex items-start gap-2.5 text-xs text-[#29332F]/80 dark:text-[#C5DFD1] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 rounded border-neutral-300 dark:border-[#2B5946] text-[#1B6B4A] focus:ring-[#1E7E54]"
                      />
                      <span>
                        {t(
                          'Concordo em receber actualizações sobre legislação ambiental e notícias da BIOSFERA.',
                          'I agree to receive environmental legislation updates and company news from BIOSFERA.'
                        )}
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] disabled:opacity-60 rounded-lg transition-colors min-h-[44px] whitespace-nowrap shrink-0"
                    >
                      <Send className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {submitting
                          ? t('A Subscrever...', 'Subscribing...')
                          : t('Subscrever Newsletter', 'Subscribe Newsletter')}
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
