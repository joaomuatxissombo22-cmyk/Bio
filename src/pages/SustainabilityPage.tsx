import React from 'react';
import { Droplets, Leaf, Recycle, ShieldCheck, Sun, Wind } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { SafeImage } from '../components/SafeImage';
import { PageBanner } from '../components/PageBanner';
import { DynamicHeading } from '../components/DynamicHeading';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { IMG_BIODIVERSITY, IMG_MANGROVE, IMG_WASTE } from '../data/defaults';
import {
  SUSTAINABILITY_PILLARS_BY_LANG,
  SUSTAINABILITY_PRACTICES_BY_LANG,
} from '../i18n/translations';

const PILLAR_ICONS = [Leaf, ShieldCheck, Droplets, Recycle, Wind, Sun];

export const SustainabilityPage: React.FC = () => {
  const { openProposalModal } = useSite();
  const { lang, t } = useLanguage();
  const pillars = SUSTAINABILITY_PILLARS_BY_LANG[lang];
  const goodPractices = SUSTAINABILITY_PRACTICES_BY_LANG[lang];

  return (
    <>
      <SeoHead
        title={t('Sustentabilidade', 'Sustainability')}
        description={t(
          'Princípios de desenvolvimento sustentável, preservação de ecossistemas, prevenção da poluição e boas práticas ambientais da BIOSFERA em Angola.',
          'Sustainable development principles, ecosystem preservation, pollution prevention, and environmental best practices by BIOSFERA in Angola.'
        )}
        path="/sustentabilidade"
      />

      <PageBanner
        kicker={t('Visão Ambiental de Longo Prazo', 'Long-Term Environmental Vision')}
        title={t(
          'Sustentabilidade e Responsabilidade Ecológica',
          'Sustainability & Ecological Responsibility'
        )}
        alternates={[
          t(
            'Protecção dos Ecossistemas e Economia Circular em Angola',
            'Ecosystem Protection & Circular Economy in Angola'
          ),
        ]}
        subtitle={t(
          'Promovemos a conciliação entre o desenvolvimento económico de Angola e a conservação efectiva dos seus ecossistemas naturais e recursos para as gerações futuras.',
          'We champion the balance between Angola’s economic growth and the lasting conservation of its natural ecosystems and resources for future generations.'
        )}
        imageUrl={IMG_BIODIVERSITY}
        imageAlt={t(
          'Fauna silvestre angolana em levantamento de biodiversidade da BIOSFERA',
          'Native Angolan wildlife documented during a BIOSFERA biodiversity survey'
        )}
      />

      {/* Editorial Feature */}
      <section className="py-16 bg-white dark:bg-[#081410]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-6">
              <div className="group h-full min-h-[320px] rounded-2xl overflow-hidden border border-neutral-200 dark:border-[#224738]">
                <SafeImage
                  src={IMG_MANGROVE}
                  alt={t(
                    'Monitorização ambiental e conservação de recursos hídricos em Angola',
                    'Environmental monitoring and water resource conservation in Angola'
                  )}
                  className="w-full h-full object-cover object-[50%_20%]"
                  zoomOnHover
                />
              </div>
            </div>
            <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
              <DynamicHeading
                as="h2"
                kicker={t(
                  'Desenvolvimento Sustentável em Angola',
                  'Sustainable Development in Angola'
                )}
                title={t(
                  'Preservar Hoje para Garantir Competitividade Amanhã',
                  'Preserve Today to Secure Competitiveness Tomorrow'
                )}
                alternates={[
                  t(
                    'Sustentabilidade como Factor Estratégico de Viabilidade',
                    'Sustainability as a Strategic Viability Driver'
                  ),
                ]}
                titleClassName="!text-2xl sm:!text-3xl"
              />
              <p className="text-base text-[#29332F]/85 dark:text-[#DCECE3] leading-relaxed">
                {t(
                  'A sustentabilidade deixou de ser apenas um requisito regulatório para se tornar um factor estratégico de viabilidade empresarial, acesso a financiamento internacional e aceitação social dos projectos.',
                  'Sustainability has evolved beyond mere regulatory compliance into a strategic driver of corporate resilience, international financing access, and community trust.'
                )}
              </p>
              <p className="text-base text-[#29332F]/85 dark:text-[#DCECE3] leading-relaxed">
                {t(
                  'A BIOSFERA apoia empresas e instituições na adopção de práticas concretas de prevenção da poluição, uso eficiente de água e energia e protecção da biodiversidade.',
                  'BIOSFERA helps businesses and institutions implement measurable pollution prevention, water and energy efficiency, and biodiversity conservation initiatives.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Pillars */}
      <section className="py-16 bg-[#F4F7F5] dark:bg-[#0D1E18] border-y border-neutral-200 dark:border-[#224738]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <DynamicHeading
            as="h2"
            kicker={t('Eixos de Acção', 'Core Action Axes')}
            title={t('Pilares da Actuação Sustentável', 'Pillars of Sustainable Action')}
            alternates={[
              t(
                'Conservação, Prevenção e Economia Circular',
                'Conservation, Prevention & Circular Economy'
              ),
            ]}
            className="max-w-2xl mb-10"
            titleClassName="!text-2xl sm:!text-3xl"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = PILLAR_ICONS[idx % PILLAR_ICONS.length];
              return (
                <div
                  key={pillar.title}
                  className="bg-white dark:bg-[#11261E] rounded-xl border border-neutral-200 dark:border-[#224738] p-6 space-y-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#F4F7F5] dark:bg-[#163127] text-[#1B6B4A] dark:text-[#7FD1A8] flex items-center justify-center">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#1B6B4A] dark:text-[#ECF5F0]">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#29332F]/80 dark:text-[#C5DFD1] leading-relaxed">
                    {pillar.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Educational Good Practices */}
      <section className="py-16 bg-white dark:bg-[#081410]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-7 space-y-6">
              <DynamicHeading
                as="h2"
                kicker={t('Conteúdo Técnico e Educativo', 'Technical & Educational Guidance')}
                title={t(
                  'Boas Práticas Ambientais para Organizações',
                  'Environmental Best Practices for Organizations'
                )}
                titleClassName="!text-2xl sm:!text-3xl"
              />

              <div className="space-y-4">
                {goodPractices.map((gp) => (
                  <div
                    key={gp.title}
                    className="p-5 rounded-xl bg-[#F4F7F5] dark:bg-[#11261E] border border-neutral-200/80 dark:border-[#224738]"
                  >
                    <h3 className="font-display text-base font-bold text-[#1B6B4A] dark:text-[#ECF5F0]">
                      {gp.title}
                    </h3>
                    <p className="text-sm text-[#29332F]/80 dark:text-[#C5DFD1] mt-1.5 leading-relaxed">
                      {gp.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="group flex-1 min-h-[240px] rounded-2xl overflow-hidden border border-neutral-200 dark:border-[#224738]">
                <SafeImage
                  src={IMG_WASTE}
                  alt={t(
                    'Equipa técnica em auditoria de boas práticas ambientais em campo',
                    'Technical team performing environmental best-practice field audits'
                  )}
                  className="w-full h-full object-cover object-[50%_20%]"
                  zoomOnHover
                />
              </div>
              <div className="p-6 rounded-2xl bg-[#1B6B4A] dark:bg-gradient-to-br dark:from-[#102A20] dark:to-[#182C61] dark:border dark:border-[#224738] text-white space-y-3">
                <DynamicHeading
                  as="h3"
                  variant="inverted"
                  title={t(
                    'Quer implementar um Programa de Sustentabilidade?',
                    'Ready to Launch a Sustainability Program?'
                  )}
                  titleClassName="!text-xl"
                />
                <p className="text-sm text-white/85">
                  {t(
                    'Solicite um diagnóstico técnico à equipa da BIOSFERA para identificar oportunidades de conformidade e eficiência ambiental.',
                    'Request a technical assessment from BIOSFERA to uncover compliance and environmental efficiency opportunities.'
                  )}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    openProposalModal(
                      t(
                        'Planos de Gestão Ambiental (PGA)',
                        'Environmental Management Plans (EMP)'
                      )
                    )
                  }
                  className="px-5 py-2.5 text-sm font-semibold bg-[#8BC53F] text-[#182C61] hover:bg-[#9FD354] rounded-lg transition-colors"
                >
                  {t('Solicitar Diagnóstico Ambiental', 'Request Environmental Assessment')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
