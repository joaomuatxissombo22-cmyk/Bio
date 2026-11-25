import React, { useMemo, useState } from 'react';
import { ArrowRight, Building2, CheckCircle2, MapPin, ShieldCheck, X } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { SafeImage } from '../components/SafeImage';
import { PageBanner } from '../components/PageBanner';
import { DynamicHeading } from '../components/DynamicHeading';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { IMG_BANNER_PROJECTS, PROJECT_CATEGORIES } from '../data/defaults';
import { localizeCategory } from '../i18n/translations';
import type { ProjectItem } from '../types';

export const ProjectsPage: React.FC = () => {
  const { projects, openProposalModal } = useSite();
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'Todos') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  const localizedSelectedLabel =
    selectedCategory === 'Todos'
      ? t('Todas as Categorias', 'All Categories')
      : localizeCategory(selectedCategory, lang);

  return (
    <>
      <SeoHead
        title={t('Projectos e Portfólio', 'Projects & Portfolio')}
        description={t(
          'Consulte os projectos ambientais confirmados e as áreas de actuação técnica da BIOSFERA em estudos ambientais, licenciamento, auditorias e sustentabilidade.',
          'Browse BIOSFERA’s verified environmental projects and technical practice areas across EIA, permitting, audits, and sustainability.'
        )}
        path="/projectos"
      />

      <PageBanner
        kicker={t('Portfólio Técnico', 'Technical Portfolio')}
        title={t('Projectos e Experiência Sectorial', 'Projects & Sector Experience')}
        alternates={[
          t(
            'Experiência Comprovada em Indústria, Portos e Energia',
            'Proven Track Record in Industry, Ports & Energy'
          ),
        ]}
        subtitle={t(
          'Apresentação organizada de projectos ambientais confirmados e autorizados pelos clientes, estruturados por área técnica e sector económico.',
          'Structured presentation of verified client-authorized environmental projects organized by technical area and economic sector.'
        )}
        imageUrl={IMG_BANNER_PROJECTS}
        imageAlt={t(
          'Infra-estrutura portuária e energética acompanhada por consultoria ambiental',
          'Port and energy infrastructure supported by environmental consultancy'
        )}
      />

      {/* Category Filter Bar */}
      <section className="bg-[#F4F7F5] dark:bg-[#0D1E18] border-b border-neutral-200 dark:border-[#224738]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <button
              type="button"
              onClick={() => setSelectedCategory('Todos')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'Todos'
                  ? 'bg-[#1B6B4A] text-white dark:bg-[#8BC53F] dark:text-[#182C61]'
                  : 'bg-white dark:bg-[#11261E] text-[#29332F] dark:text-[#DCECE3] border border-neutral-200 dark:border-[#224738] hover:border-[#1E7E54] dark:hover:border-[#7FD1A8]'
              }`}
            >
              {t(`Todas as Categorias (${projects.length})`, `All Categories (${projects.length})`)}
            </button>
            {PROJECT_CATEGORIES.map((cat) => (
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

      {/* Projects Grid or Verified Institutional Policy Notice */}
      <section className="py-16 bg-white dark:bg-[#081410]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length > 0 ? (
            <div className="space-y-8">
              <DynamicHeading
                as="h2"
                kicker={t('Registo de Intervenções', 'Project Records')}
                title={t('Projectos Publicados', 'Published Projects')}
                subtitle={t(
                  'Consulte o âmbito, localização e resultados técnicos alcançados em cada empreendimento.',
                  'Review the scope, location, and technical outcomes delivered in each engagement.'
                )}
                titleClassName="!text-2xl sm:!text-3xl"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredProjects.map((project) => (
                  <article
                    key={project.id}
                    className="group bg-white dark:bg-[#11261E] rounded-xl border border-neutral-200 dark:border-[#224738] overflow-hidden flex flex-col hover:border-[#7FD1A8] dark:hover:border-[#8BC53F]/60 transition-colors duration-300"
                  >
                    <div className="h-52 overflow-hidden bg-[#1B6B4A]/10 dark:bg-[#163127]">
                      <SafeImage
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        zoomOnHover
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <p className="text-xs font-medium text-[#1E7E54] dark:text-[#BCE87D]">
                        {localizeCategory(project.category, lang)} · {project.sector}
                      </p>
                      <h3 className="font-display text-lg font-bold text-[#1B6B4A] dark:text-[#ECF5F0] mt-1.5">
                        {project.title}
                      </h3>
                      <div className="mt-2 space-y-1 text-xs text-[#29332F]/70 dark:text-[#A8CBB9]">
                        {project.client && (
                          <p className="flex items-center gap-1.5">
                            <Building2
                              className="w-3.5 h-3.5 text-[#1B6B4A] dark:text-[#7FD1A8]"
                              aria-hidden="true"
                            />
                            <span>
                              {t('Cliente', 'Client')}: {project.client}
                            </span>
                          </p>
                        )}
                        <p className="flex items-center gap-1.5">
                          <MapPin
                            className="w-3.5 h-3.5 text-[#1B6B4A] dark:text-[#7FD1A8]"
                            aria-hidden="true"
                          />
                          <span>{project.location}</span>
                        </p>
                      </div>
                      <p className="mt-3 text-sm text-[#29332F]/80 dark:text-[#C5DFD1] leading-relaxed flex-1 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-[#1B3A2E] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setActiveProject(project)}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B6B4A] dark:text-[#7FD1A8] hover:text-[#1E7E54] dark:hover:text-[#BCE87D]"
                        >
                          <span>{t('Ver Ficha Técnica', 'View Technical Sheet')}</span>
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="rounded-2xl bg-[#F4F7F5] dark:bg-[#0D1E18] border border-neutral-200 dark:border-[#224738] p-8 sm:p-10">
                <div className="flex items-start gap-4 max-w-3xl">
                  <div className="w-11 h-11 rounded-xl bg-white dark:bg-[#11261E] border border-neutral-200 dark:border-[#224738] text-[#1B6B4A] dark:text-[#7FD1A8] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <DynamicHeading
                      as="h2"
                      title={
                        selectedCategory === 'Todos'
                          ? t(
                              'Publicação Rigorosa de Projectos Autorizados',
                              'Rigorous Disclosure of Authorized Projects'
                            )
                          : t(
                              `Sem projectos publicados na categoria "${localizedSelectedLabel}"`,
                              `No published projects in category "${localizedSelectedLabel}"`
                            )
                      }
                      titleClassName="!text-2xl"
                    />
                    <p className="mt-2.5 text-sm sm:text-base text-[#29332F]/80 dark:text-[#DCECE3] leading-relaxed">
                      {t(
                        'Por compromisso de confidencialidade contratual e veracidade institucional, a BIOSFERA apenas divulga nomes de clientes, contratos e resultados após autorização formal e validação através do seu painel administrativo. Para aceder a referências técnicas sectoriais em processo de qualificação ou concurso, contacte a nossa direcção técnica.',
                        'Out of contractual confidentiality and institutional integrity, BIOSFERA only discloses client names, contracts, and outcomes following formal client authorization and validation. To request sector-specific technical references for qualification or tenders, please contact our technical leadership.'
                      )}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => openProposalModal()}
                        className="px-5 py-2.5 text-sm font-semibold bg-[#1B6B4A] text-white hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] rounded-lg transition-colors"
                      >
                        {t(
                          'Solicitar Credenciais de Portfólio',
                          'Request Portfolio Credentials'
                        )}
                      </button>
                      {selectedCategory !== 'Todos' && (
                        <button
                          type="button"
                          onClick={() => setSelectedCategory('Todos')}
                          className="px-5 py-2.5 text-sm font-medium bg-white dark:bg-[#11261E] border border-neutral-300 dark:border-[#2B5946] text-[#29332F] dark:text-[#DCECE3] hover:border-[#1B6B4A] dark:hover:border-[#7FD1A8] rounded-lg transition-colors"
                        >
                          {t('Ver Todas as Categorias', 'View All Categories')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Coverage of the 8 Project Categories */}
              <div>
                <DynamicHeading
                  as="h3"
                  kicker={t('Competência Multidisciplinar', 'Multidisciplinary Reach')}
                  title={t(
                    'Categorias de Intervenção Técnica',
                    'Technical Intervention Categories'
                  )}
                  titleClassName="!text-xl sm:!text-2xl"
                  className="mb-6"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {PROJECT_CATEGORIES.map((category, idx) => (
                    <div
                      key={category}
                      className="p-5 rounded-xl border border-neutral-200 dark:border-[#224738] bg-white dark:bg-[#11261E]"
                    >
                      <span className="text-xs font-mono text-[#1E7E54] dark:text-[#BCE87D] tabular-nums">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <p className="font-display text-base font-bold text-[#1B6B4A] dark:text-[#ECF5F0] mt-1">
                        {localizeCategory(category, lang)}
                      </p>
                      <p className="text-xs text-[#29332F]/70 dark:text-[#A8CBB9] mt-1.5">
                        {t(
                          'Actuação conforme normas ambientais angolanas e padrões internacionais.',
                          'Delivered in compliance with Angolan environmental laws and international standards.'
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      {activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-white dark:bg-[#11261E] rounded-2xl border border-neutral-200 dark:border-[#224738] overflow-hidden my-8">
            <div className="relative h-60 bg-[#1B6B4A] dark:bg-[#0D1E18]">
              <SafeImage
                src={activeProject.imageUrl}
                alt={activeProject.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                aria-label={t('Fechar ficha do projecto', 'Close project sheet')}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/95 dark:bg-[#0D1E18]/90 text-[#1B6B4A] dark:text-[#ECF5F0] hover:bg-white dark:hover:bg-[#163127] shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <p className="text-xs font-medium text-[#1E7E54] dark:text-[#BCE87D]">
                  {localizeCategory(activeProject.category, lang)} · {activeProject.sector} ·{' '}
                  {activeProject.location}
                </p>
                <h2 className="font-display text-2xl font-bold text-[#1B6B4A] dark:text-[#ECF5F0] mt-1">
                  {activeProject.title}
                </h2>
                {activeProject.client && (
                  <p className="text-sm text-[#29332F]/75 dark:text-[#A8CBB9] mt-1">
                    {t('Cliente', 'Client')}:{' '}
                    <span className="font-medium text-[#29332F] dark:text-[#EAF4EE]">
                      {activeProject.client}
                    </span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1B6B4A] dark:text-[#7FD1A8]">
                  {t('Descrição dos Trabalhos', 'Scope of Work')}
                </h3>
                <p className="text-sm text-[#29332F]/85 dark:text-[#DCECE3] leading-relaxed whitespace-pre-line">
                  {activeProject.description}
                </p>
              </div>

              {activeProject.servicesProvided.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1B6B4A] dark:text-[#7FD1A8]">
                    {t('Serviços Prestados', 'Services Delivered')}
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeProject.servicesProvided.map((srv) => (
                      <li
                        key={srv}
                        className="flex items-start gap-2 text-xs text-[#29332F]/85 dark:text-[#DCECE3]"
                      >
                        <CheckCircle2
                          className="w-3.5 h-3.5 text-[#1E7E54] dark:text-[#8BC53F] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{srv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeProject.results && (
                <div className="p-4 rounded-xl bg-[#F4F7F5] dark:bg-[#163127] border border-neutral-200 dark:border-[#224738]">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1B6B4A] dark:text-[#7FD1A8] mb-1">
                    {t('Resultados Alcançados', 'Key Outcomes')}
                  </h3>
                  <p className="text-sm text-[#29332F]/85 dark:text-[#DCECE3]">
                    {activeProject.results}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
