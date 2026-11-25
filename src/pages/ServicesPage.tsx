import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Layers } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { SafeImage } from '../components/SafeImage';
import { ServiceIcon } from '../components/ServiceIcon';
import { ServicesFaq } from '../components/ServicesFaq';
import { PageBanner } from '../components/PageBanner';
import { DynamicHeading } from '../components/DynamicHeading';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { IMG_INDUSTRIAL } from '../data/defaults';
import { localizeService } from '../i18n/translations';

export const ServicesPage: React.FC = () => {
  const { services: rawServices, openProposalModal } = useSite();
  const { lang, t } = useLanguage();
  const location = useLocation();
  const [selectedSlug, setSelectedSlug] = useState<string>('all');

  const services = rawServices.map((s) => localizeService(s, lang));

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

  const visibleServices =
    selectedSlug === 'all' ? services : services.filter((s) => s.slug === selectedSlug);

  return (
    <>
      <SeoHead
        title={t('Serviços de Consultoria Ambiental', 'Environmental Consultancy Services')}
        description={t(
          'Conheça os serviços técnicos da BIOSFERA: EIA, Licenciamento Ambiental, Auditorias, RMA, PGA, PGR, PHST, Resíduos Hospitalares e Monitorização Ambiental.',
          'Explore BIOSFERA technical services: EIA, Environmental Permitting, Audits, EMR, EMP, WMP, OHSP, Biomedical Waste, and Environmental Monitoring.'
        )}
        path="/servicos"
      />

      <PageBanner
        kicker={t('Soluções Técnicas Integradas', 'Integrated Technical Solutions')}
        title={t(
          'Serviços de Consultoria e Gestão Ambiental',
          'Environmental Consultancy & Management Services'
        )}
        alternates={[
          t(
            'Do Licenciamento Inicial à Monitorização Contínua',
            'From Initial Permitting to Ongoing Monitoring'
          ),
        ]}
        subtitle={t(
          'Apoio técnico especializado em todo o ciclo de vida do projecto — do licenciamento inicial à monitorização operacional e auditoria de conformidade.',
          'Specialized technical advisory across your entire project lifecycle — from initial environmental permitting to operational monitoring and compliance audits.'
        )}
        imageUrl={IMG_INDUSTRIAL}
        imageAlt={t(
          'Inspecção industrial e auditoria de conformidade ambiental em Angola',
          'Industrial inspection and environmental compliance audit in Angola'
        )}
      />

      {/* Quick Anchor Index Bar */}
      <section className="bg-[#F4F7F5] dark:bg-[#0D1E18] border-b border-neutral-200 dark:border-[#224738] sticky top-[90px] z-30">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <button
              type="button"
              onClick={() => setSelectedSlug('all')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedSlug === 'all'
                  ? 'bg-[#1B6B4A] text-white dark:bg-[#8BC53F] dark:text-[#182C61]'
                  : 'bg-white dark:bg-[#11261E] text-[#29332F] dark:text-[#DCECE3] border border-neutral-200 dark:border-[#224738] hover:border-[#1E7E54] dark:hover:border-[#7FD1A8]'
              }`}
            >
              {t(`Todos os Serviços (${services.length})`, `All Services (${services.length})`)}
            </button>
            {services.map((srv) => (
              <button
                key={srv.id}
                type="button"
                onClick={() => setSelectedSlug(srv.slug)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedSlug === srv.slug
                    ? 'bg-[#1B6B4A] text-white dark:bg-[#8BC53F] dark:text-[#182C61]'
                    : 'bg-white dark:bg-[#11261E] text-[#29332F] dark:text-[#DCECE3] border border-neutral-200 dark:border-[#224738] hover:border-[#1E7E54] dark:hover:border-[#7FD1A8]'
                }`}
              >
                {srv.code}. {srv.title.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Service Sections */}
      <section className="py-16 bg-white dark:bg-[#081410]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <DynamicHeading
            as="h2"
            kicker={t('Catálogo Técnico Especializado', 'Specialized Technical Catalog')}
            title={t('Áreas de Actuação & Metodologia', 'Practice Areas & Methodology')}
            alternates={[
              t(
                'Soluções Estruturadas para Conformidade Ambiental',
                'Structured Solutions for Environmental Compliance'
              ),
            ]}
            subtitle={t(
              'Seleccione uma área técnica acima para filtrar ou consulte em detalhe os objectivos, benefícios e metodologia de cada serviço.',
              'Select a technical area above to filter or review the objectives, benefits, and methodology for each service.'
            )}
            className="max-w-3xl"
            titleClassName="!text-2xl sm:!text-3xl"
          />

          {visibleServices.map((srv) => (
            <article
              key={srv.id}
              id={srv.slug}
              className="group scroll-mt-40 rounded-2xl border border-neutral-200 dark:border-[#224738] bg-white dark:bg-[#11261E] overflow-hidden hover:border-[#7FD1A8] dark:hover:border-[#8BC53F]/60 transition-colors duration-300"
            >
              <div id={srv.id} className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-4 min-h-[260px] overflow-hidden bg-[#1B6B4A]/10 dark:bg-[#163127]">
                  <SafeImage
                    src={srv.imageUrl}
                    alt={srv.title}
                    className="w-full h-full object-cover object-[50%_18%]"
                    zoomOnHover
                  />
                </div>

                <div className="lg:col-span-8 p-6 sm:p-8 lg:p-10 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 dark:border-[#224738] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F4F7F5] dark:bg-[#163127] text-[#1B6B4A] dark:text-[#7FD1A8] flex items-center justify-center shrink-0">
                        <ServiceIcon name={srv.iconName} className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-mono font-medium text-[#1E7E54] dark:text-[#BCE87D]">
                          {t(`Área Técnica ${srv.code}`, `Technical Area ${srv.code}`)}
                        </span>
                        <DynamicHeading
                          as="h2"
                          title={srv.title}
                          titleClassName="!text-xl sm:!text-2xl"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openProposalModal(srv.title)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>{t('Solicitar Orçamento', 'Request Quote')}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  <p className="text-base text-[#29332F]/85 dark:text-[#DCECE3] leading-relaxed">
                    {srv.fullDescription}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div className="bg-[#F4F7F5] dark:bg-[#163127] rounded-xl p-5">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1B6B4A] dark:text-[#7FD1A8] mb-3">
                        {t('Objectivos e Âmbito', 'Objectives & Scope')}
                      </h3>
                      <ul className="space-y-2">
                        {srv.objectives.map((obj) => (
                          <li
                            key={obj}
                            className="flex items-start gap-2 text-xs text-[#29332F]/85 dark:text-[#DCECE3]"
                          >
                            <CheckCircle2
                              className="w-3.5 h-3.5 text-[#1E7E54] dark:text-[#8BC53F] shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#F4F7F5] dark:bg-[#163127] rounded-xl p-5">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1B6B4A] dark:text-[#7FD1A8] mb-3">
                        {t('Benefícios para o Cliente', 'Client Benefits')}
                      </h3>
                      <ul className="space-y-2">
                        {srv.benefits.map((ben) => (
                          <li
                            key={ben}
                            className="flex items-start gap-2 text-xs text-[#29332F]/85 dark:text-[#DCECE3]"
                          >
                            <CheckCircle2
                              className="w-3.5 h-3.5 text-[#1E7E54] dark:text-[#8BC53F] shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{ben}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#F4F7F5] dark:bg-[#163127] rounded-xl p-5">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1B6B4A] dark:text-[#7FD1A8] mb-3">
                        {t('Metodologia de Trabalho', 'Work Methodology')}
                      </h3>
                      <ol className="space-y-2">
                        {srv.methodology.map((step, i) => (
                          <li
                            key={step}
                            className="flex items-start gap-2 text-xs text-[#29332F]/85 dark:text-[#DCECE3]"
                          >
                            <span className="font-mono text-[#1E7E54] dark:text-[#BCE87D] font-semibold tabular-nums">
                              {String(i + 1).padStart(2, '0')}.
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {visibleServices.length === 0 && (
            <div className="text-center py-16 bg-[#F4F7F5] dark:bg-[#11261E] rounded-xl border border-neutral-200 dark:border-[#224738]">
              <Layers className="w-8 h-8 text-[#1B6B4A] dark:text-[#7FD1A8] mx-auto mb-3" />
              <p className="text-sm text-[#29332F]/80 dark:text-[#C5DFD1]">
                {t(
                  'Nenhum serviço encontrado com este filtro.',
                  'No services found matching this filter.'
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <ServicesFaq />
    </>
  );
};
