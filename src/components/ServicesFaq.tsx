import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { FAQ_ITEMS_BY_LANG } from '../i18n/translations';
import { DynamicHeading } from './DynamicHeading';

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const ServicesFaq: React.FC = () => {
  const { lang, t } = useLanguage();
  const faqItems = FAQ_ITEMS_BY_LANG[lang];
  const [openId, setOpenId] = useState<string>(faqItems[0].id);
  const { openProposalModal } = useSite();

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? '' : id));
  };

  return (
    <section
      id="faq-servicos"
      aria-labelledby="faq-servicos-heading"
      className="py-20 bg-[#F4F7F5] dark:bg-[#0D1E18] border-t border-neutral-200 dark:border-[#224738]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Sticky Summary Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-5">
            <DynamicHeading
              as="h2"
              kicker={t('Esclarecimentos Técnicos', 'Technical Guidance')}
              title={t(
                'Perguntas Frequentes sobre Licenciamento e Consultoria Ambiental',
                'Frequently Asked Questions on Environmental Permitting'
              )}
              subtitle={t(
                'Respostas objectivas sobre o enquadramento legal em Angola, prazos de tramitação, estudos ambientais obrigatórios e monitorização operacional.',
                'Clear answers on Angola’s environmental legal framework, review timelines, mandatory impact studies, and operational monitoring.'
              )}
              titleClassName="text-2xl sm:text-3xl"
            />

            <div className="p-6 rounded-xl bg-white dark:bg-[#11261E] border border-neutral-200 dark:border-[#224738] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F4F7F5] dark:bg-[#163127] text-[#1B6B4A] dark:text-[#BCE87D] flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-[#1B6B4A] dark:text-[#ECF5F0]">
                    {t(
                      'Precisa de enquadramento para o seu projecto?',
                      'Need legal scoping for your project?'
                    )}
                  </h3>
                  <p className="text-xs text-[#29332F]/70 dark:text-[#A8CBB9] mt-0.5">
                    {t(
                      'Avaliamos os requisitos legais aplicáveis sem compromisso.',
                      'We evaluate applicable regulatory requirements with no obligation.'
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  openProposalModal(
                    t(
                      'Licenciamento Ambiental / Enquadramento Legal',
                      'Environmental Permitting & Legal Scoping'
                    )
                  )
                }
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] rounded-lg transition-colors duration-200 min-h-[44px]"
              >
                <span>{t('Falar com a Equipa Técnica', 'Speak with Our Technical Team')}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Right Accordion Column */}
          <div className="lg:col-span-8 space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openId === item.id;
              const panelId = `${item.id}-panel`;
              const buttonId = `${item.id}-button`;

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border transition-colors duration-200 bg-white dark:bg-[#11261E] ${
                    isOpen
                      ? 'border-[#2EA36F]/60 dark:border-[#8BC53F]/60 shadow-xs'
                      : 'border-neutral-200 dark:border-[#224738] hover:border-[#7FD1A8]'
                  }`}
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleItem(item.id)}
                      className="w-full px-6 py-5 text-left flex items-start justify-between gap-4 min-h-[56px] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1E7E54] rounded-xl"
                    >
                      <div className="space-y-1">
                        <span className="block text-[11px] font-mono font-medium text-[#1E7E54] dark:text-[#BCE87D] uppercase tracking-wider">
                          {String(index + 1).padStart(2, '0')} · {item.category}
                        </span>
                        <span className="block font-display text-base sm:text-lg font-bold text-[#1B6B4A] dark:text-[#ECF5F0] leading-snug">
                          {item.question}
                        </span>
                      </div>
                      <span
                        className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                          isOpen
                            ? 'bg-[#1B6B4A] dark:bg-[#8BC53F] text-white dark:text-[#182C61]'
                            : 'bg-[#F4F7F5] dark:bg-[#163127] text-[#1B6B4A] dark:text-[#7FD1A8]'
                        }`}
                        aria-hidden="true"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-1 border-t border-neutral-100 dark:border-[#224738]">
                          <p className="text-sm text-[#29332F]/85 dark:text-[#DCECE3] leading-relaxed pt-3">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
