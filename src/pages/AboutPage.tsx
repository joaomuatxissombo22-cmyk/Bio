import React from 'react';
import { Award, CheckCircle2, Compass, ShieldCheck, Users } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { SafeImage } from '../components/SafeImage';
import { PageBanner } from '../components/PageBanner';
import { DynamicHeading } from '../components/DynamicHeading';
import { CompanyTimeline } from '../components/CompanyTimeline';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { IMG_BANNER_ABOUT, IMG_MANGROVE, IMG_OFFICE } from '../data/defaults';
import {
  ABOUT_COMPETENCIES_BY_LANG,
  ABOUT_VALUES_BY_LANG,
  localizeSettings,
} from '../i18n/translations';

export const AboutPage: React.FC = () => {
  const { settings: rawSettings, openProposalModal } = useSite();
  const { lang, t } = useLanguage();
  const settings = localizeSettings(rawSettings, lang);
  const values = ABOUT_VALUES_BY_LANG[lang];
  const competencies = ABOUT_COMPETENCIES_BY_LANG[lang];

  return (
    <>
      <SeoHead
        title={t('Quem Somos', 'About Us')}
        description={t(
          'Conheça a BIOSFERA – Consultoria Ambiental, Lda., empresa angolana com mais de 10 anos de experiência em consultoria, licenciamento e gestão ambiental.',
          'Learn about BIOSFERA – Consultoria Ambiental, Lda., an Angolan consultancy with over 10 years of experience in environmental consulting, permitting, and management.'
        )}
        path="/quem-somos"
      />

      <PageBanner
        kicker={t('Identidade Institucional', 'Institutional Identity')}
        title="BIOSFERA – CONSULTORIA AMBIENTAL, LDA."
        alternates={[
          t(
            'MAIS DE 10 ANOS DE RIGOR TÉCNICO EM ANGOLA',
            'OVER 10 YEARS OF TECHNICAL RIGOR IN ANGOLA'
          ),
        ]}
        subtitle={t(
          'Mais de uma década de rigor técnico, independência e dedicação ao desenvolvimento sustentável e à conformidade ambiental em Angola.',
          'Over a decade of technical rigor, independence, and commitment to sustainable development and environmental compliance in Angola.'
        )}
        imageUrl={IMG_BANNER_ABOUT}
        imageAlt={t(
          'Sede e equipa técnica de consultoria ambiental da BIOSFERA',
          'BIOSFERA environmental consultancy headquarters and technical team'
        )}
      />

      {/* Institutional Presentation & History */}
      <section className="py-16 lg:py-20 bg-white dark:bg-[#081410]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-6 space-y-5">
              <DynamicHeading
                as="h2"
                kicker={t('Trajectória Corporativa', 'Corporate Track Record')}
                title={t(
                  'História, Experiência e Posicionamento no Mercado Angolano',
                  'History, Experience & Positioning in the Angolan Market'
                )}
                alternates={[
                  t(
                    'Parceiro Técnico de Confiança em Gestão Ambiental',
                    'Trusted Technical Partner in Environmental Management'
                  ),
                ]}
                titleClassName="!text-2xl sm:!text-3xl"
              />
              <p className="text-base text-[#29332F]/85 dark:text-[#DCECE3] leading-relaxed">
                {settings.institutionalDescription}
              </p>
              <p className="text-base text-[#29332F]/85 dark:text-[#DCECE3] leading-relaxed">
                {t(
                  'Com sede na Centralidade do Kilamba, em Luanda, a BIOSFERA tem vindo a consolidar o seu posicionamento como parceiro técnico de confiança para empresas industriais, operadores logísticos, projectos de infra-estruturas, unidades de saúde e instituições públicas que necessitam de conciliar crescimento económico com exigência ecológica.',
                  'Headquartered in Centralidade do Kilamba, Luanda, BIOSFERA has built its reputation as a trusted technical partner for industrial operators, logistics hubs, infrastructure developers, healthcare units, and public institutions seeking to align economic growth with ecological stewardship.'
                )}
              </p>
              <p className="text-base text-[#29332F]/85 dark:text-[#DCECE3] leading-relaxed">
                {t(
                  'A nossa abordagem assenta no conhecimento profundo do quadro regulamentar nacional e na capacidade de traduzir obrigações ambientais em planos práticos, mensuráveis e operacionalmente viáveis.',
                  'Our methodology combines deep command of Angola’s regulatory framework with the capability to turn environmental obligations into practical, measurable, and operationally workable plans.'
                )}
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="group h-full min-h-[340px] rounded-2xl overflow-hidden border border-neutral-200 dark:border-[#224738]">
                <SafeImage
                  src={IMG_OFFICE}
                  alt={t(
                    'Equipa técnica da BIOSFERA no escritório em Luanda',
                    'BIOSFERA consultancy team at our Luanda office'
                  )}
                  className="w-full h-full object-cover object-[50%_15%]"
                  zoomOnHover
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Company Milestones & Historical Achievements Timeline */}
      <CompanyTimeline />

      {/* Mission & Vision */}
      <section className="py-16 bg-[#F4F7F5] dark:bg-[#0D1E18] border-y border-neutral-200 dark:border-[#224738]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#11261E] rounded-xl border border-neutral-200 dark:border-[#224738] p-8">
              <div className="w-10 h-10 rounded-lg bg-[#1B6B4A]/10 dark:bg-[#163127] text-[#1B6B4A] dark:text-[#7FD1A8] flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" aria-hidden="true" />
              </div>
              <DynamicHeading
                as="h2"
                title={t('Missão', 'Mission')}
                titleClassName="!text-2xl"
              />
              <p className="mt-3 text-base text-[#29332F]/85 dark:text-[#DCECE3] leading-relaxed">
                {settings.missionText}
              </p>
            </div>

            <div className="bg-white dark:bg-[#11261E] rounded-xl border border-neutral-200 dark:border-[#224738] p-8">
              <div className="w-10 h-10 rounded-lg bg-[#1E7E54]/10 dark:bg-[#163127] text-[#1E7E54] dark:text-[#BCE87D] flex items-center justify-center mb-4">
                <Award className="w-5 h-5" aria-hidden="true" />
              </div>
              <DynamicHeading
                as="h2"
                title={t('Visão', 'Vision')}
                titleClassName="!text-2xl"
              />
              <p className="mt-3 text-base text-[#29332F]/85 dark:text-[#DCECE3] leading-relaxed">
                {settings.visionText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-20 bg-white dark:bg-[#081410]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <DynamicHeading
            as="h2"
            kicker={t('Princípios Orientadores', 'Guiding Principles')}
            title={t('Valores Corporativos', 'Corporate Values')}
            alternates={[
              t('Ética, Rigor Técnico e Sustentabilidade', 'Ethics, Technical Rigor & Sustainability'),
            ]}
            className="max-w-2xl mb-10"
            titleClassName="!text-3xl"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((val, index) => (
              <div
                key={val.title}
                className="p-6 rounded-xl bg-[#F4F7F5] dark:bg-[#11261E] border border-neutral-200/80 dark:border-[#224738]"
              >
                <p className="text-xs font-mono text-[#1E7E54] dark:text-[#BCE87D] tabular-nums mb-2">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display text-lg font-bold text-[#1B6B4A] dark:text-[#ECF5F0]">
                  {val.title}
                </h3>
                <p className="mt-2 text-sm text-[#29332F]/80 dark:text-[#C5DFD1] leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Competencies, Team & Quality Policy */}
      <section className="py-16 bg-[#F4F7F5] dark:bg-[#0D1E18] border-t border-neutral-200 dark:border-[#224738]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-6 bg-white dark:bg-[#11261E] rounded-xl border border-neutral-200 dark:border-[#224738] p-8">
              <DynamicHeading
                as="h2"
                title={t('Competências Técnicas', 'Technical Competencies')}
                titleClassName="!text-2xl"
                className="mb-5"
              />
              <ul className="space-y-3">
                {competencies.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-[#29332F]/85 dark:text-[#DCECE3]"
                  >
                    <CheckCircle2
                      className="w-4 h-4 text-[#1E7E54] dark:text-[#8BC53F] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white dark:bg-[#11261E] rounded-xl border border-neutral-200 dark:border-[#224738] p-8">
                <div className="flex items-center gap-3 mb-3">
                  <Users
                    className="w-5 h-5 text-[#1B6B4A] dark:text-[#7FD1A8] shrink-0"
                    aria-hidden="true"
                  />
                  <DynamicHeading
                    as="h2"
                    title={t('Equipa Multidisciplinar', 'Multidisciplinary Team')}
                    titleClassName="!text-xl"
                  />
                </div>
                <p className="text-sm text-[#29332F]/80 dark:text-[#C5DFD1] leading-relaxed">
                  {t(
                    'Contamos com engenheiros do ambiente, biólogos, especialistas em segurança e saúde ocupacional, auditores e consultores jurídicos ambientais capacitados para responder a projectos complexos de grande dimensão em todo o país.',
                    'Our team comprises environmental engineers, biologists, occupational health & safety specialists, auditors, and environmental legal advisors equipped to execute complex nationwide projects.'
                  )}
                </p>
              </div>

              <div className="bg-white dark:bg-[#11261E] rounded-xl border border-neutral-200 dark:border-[#224738] p-8">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck
                    className="w-5 h-5 text-[#1E7E54] dark:text-[#8BC53F] shrink-0"
                    aria-hidden="true"
                  />
                  <DynamicHeading
                    as="h2"
                    title={t(
                      'Política de Qualidade e Responsabilidade Ambiental',
                      'Quality & Environmental Responsibility Policy'
                    )}
                    titleClassName="!text-xl"
                  />
                </div>
                <p className="text-sm text-[#29332F]/80 dark:text-[#C5DFD1] leading-relaxed">
                  {t(
                    'Todos os estudos e planos desenvolvidos pela BIOSFERA passam por revisão técnica independente interna, garantindo rastreabilidade de dados, conformidade legal, prevenção da poluição e compromisso genuíno com a sustentabilidade.',
                    'Every study and management plan produced by BIOSFERA undergoes independent internal peer review, ensuring full data traceability, legal compliance, pollution prevention, and genuine sustainability.'
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl overflow-hidden border border-neutral-200 dark:border-[#224738] bg-white dark:bg-[#11261E] grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 min-h-[240px] overflow-hidden">
              <SafeImage
                src={IMG_MANGROVE}
                alt={t(
                  'Compromisso com a sustentabilidade e recursos hídricos em Angola',
                  'Commitment to sustainability and water resources in Angola'
                )}
                className="w-full h-full object-cover object-[50%_22%]"
                zoomOnHover
              />
            </div>
            <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-center">
              <DynamicHeading
                as="h2"
                kicker={t('Visão de Futuro', 'Future Outlook')}
                title={t(
                  'Compromisso com a Sustentabilidade',
                  'Commitment to Sustainability'
                )}
                titleClassName="!text-2xl"
              />
              <p className="mt-3 text-sm sm:text-base text-[#29332F]/85 dark:text-[#DCECE3] leading-relaxed">
                {t(
                  'Apoiamos organizações públicas e privadas na transição para operações mais limpas, eficientes e resilientes, promovendo a conservação dos recursos hídricos, do solo, da qualidade do ar e da biodiversidade em Angola.',
                  'We support public and private organizations in transitioning toward cleaner, more efficient, and resilient operations—protecting water resources, soil, air quality, and biodiversity across Angola.'
                )}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => openProposalModal()}
                  className="px-6 py-3 text-sm font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] rounded-lg transition-colors"
                >
                  {t('Falar com a Nossa Equipa', 'Speak with Our Team')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
