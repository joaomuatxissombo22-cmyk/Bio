import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileCheck2,
  MapPin,
  Recycle,
  Scale,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import {
  COMPANY_TIMELINE_BY_LANG,
  type TimelineCategory,
  type TimelineMilestone,
} from '../i18n/translations';
import { DynamicHeading } from './DynamicHeading';

type FilterKey = 'all' | TimelineCategory;

const MILESTONE_ICONS: Record<
  TimelineMilestone['iconName'],
  React.ComponentType<{ className?: string }>
> = {
  Compass,
  FileCheck2,
  Recycle,
  Scale,
  Activity,
  Award,
};

export const CompanyTimeline: React.FC = () => {
  const { lang, t } = useLanguage();
  const { openProposalModal } = useSite();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [activeId, setActiveId] = useState<string>('2015-fundacao');

  const allMilestones = COMPANY_TIMELINE_BY_LANG[lang];

  const visibleMilestones = useMemo(() => {
    if (filter === 'all') return allMilestones;
    return allMilestones.filter((m) => m.category === filter);
  }, [allMilestones, filter]);

  useEffect(() => {
    if (visibleMilestones.length === 0) return;
    const stillVisible = visibleMilestones.some((m) => m.id === activeId);
    if (!stillVisible) {
      setActiveId(visibleMilestones[0].id);
    }
  }, [visibleMilestones, activeId]);

  const activeIndex = Math.max(
    0,
    visibleMilestones.findIndex((m) => m.id === activeId)
  );
  const activeMilestone = visibleMilestones[activeIndex] ?? visibleMilestones[0];

  if (!activeMilestone) return null;

  const ActiveIcon = MILESTONE_ICONS[activeMilestone.iconName] ?? Compass;

  const filterOptions: { key: FilterKey; label: string }[] = [
    {
      key: 'all',
      label: t(
        `Todos os Marcos (${allMilestones.length})`,
        `All Milestones (${allMilestones.length})`,
        `全部里程碑 (${allMilestones.length})`
      ),
    },
    {
      key: 'foundation',
      label: t('Fundação & Estratégia', 'Foundation & Strategy', '創立與策略佈局'),
    },
    {
      key: 'licensing',
      label: t('Estudos & Licenciamento', 'Studies & Permitting', '環評研究與許可'),
    },
    {
      key: 'operations',
      label: t('Resíduos & Monitorização', 'Waste & Monitoring', '廢棄物管理與監測'),
    },
  ];

  const handleStep = (delta: number) => {
    if (visibleMilestones.length <= 1) return;
    const nextIdx =
      (activeIndex + delta + visibleMilestones.length) % visibleMilestones.length;
    setActiveId(visibleMilestones[nextIdx].id);
  };

  const handleTrackKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleStep(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleStep(-1);
    }
  };

  const progressRatio =
    visibleMilestones.length > 1
      ? activeIndex / (visibleMilestones.length - 1)
      : 1;

  return (
    <section
      id="linha-temporal"
      aria-label={t(
        'Linha Temporal Interactiva da BIOSFERA',
        'BIOSFERA Interactive Company Timeline',
        'BIOSFERA 企業發展歷史與里程碑互動時間軸'
      )}
      className="py-16 lg:py-20 bg-[#F4F7F5] dark:bg-[#0D1E18] border-y border-neutral-200 dark:border-[#224738]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header & Interactive Focus Filter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <DynamicHeading
              as="h2"
              kicker={t(
                'Evolução & Conquistas (2015–2026)',
                'Evolution & Achievements (2015–2026)',
                '企業歷程與成就（2015–2026）'
              )}
              title={t(
                'Linha Temporal de Marcos Históricos',
                'Interactive Timeline of Company Milestones',
                '環境顧問重要發展里程碑時間軸'
              )}
              alternates={
                lang === 'zh'
                  ? ['深耕安哥拉逾十年的環境工程與合規演進歷程']
                  : lang === 'en'
                  ? ['Over a Decade of Environmental Consulting Growth in Angola']
                  : ['Mais de Uma Década de Evolução Técnica em Angola']
              }
              subtitle={t(
                'Explore a trajectória institucional da BIOSFERA desde os primeiros diagnósticos ambientais em Luanda até à consolidação nacional com mais de 500 estudos desenvolvidos.',
                'Explore BIOSFERA’s institutional trajectory from early environmental diagnostics in Luanda to nationwide leadership with over 500 studies delivered.',
                '探索 BIOSFERA 自羅安達創立初期的環境現況診斷，逐步發展為全國完成逾 500 份專業研究之指標環境顧問機構的歷程。'
              )}
              titleClassName="!text-2xl sm:!text-3xl"
            />
          </div>

          <div
            role="group"
            aria-label={t('Filtrar marcos por área', 'Filter milestones by area', '依領域篩選里程碑')}
            className="flex flex-wrap items-center gap-1.5 p-1 bg-white dark:bg-[#11261E] border border-neutral-200 dark:border-[#224738] rounded-xl shrink-0"
          >
            {filterOptions.map((opt) => {
              const active = filter === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setFilter(opt.key)}
                  aria-pressed={active}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[38px] ${
                    active
                      ? 'bg-[#1B6B4A] text-white dark:bg-[#8BC53F] dark:text-[#182C61]'
                      : 'text-[#29332F]/80 dark:text-[#C5DFD1] hover:bg-[#F4F7F5] dark:hover:bg-[#163127]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Horizontal Chronology Scrubber */}
        <div
          className="bg-white dark:bg-[#11261E] rounded-2xl border border-neutral-200 dark:border-[#224738] p-5 sm:p-6 space-y-5"
          onKeyDown={handleTrackKeyDown}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs font-mono text-[#1E7E54] dark:text-[#BCE87D] font-semibold tabular-nums">
              {t('Marco', 'Milestone', '里程碑')} {String(activeIndex + 1).padStart(2, '0')} /{' '}
              {String(visibleMilestones.length).padStart(2, '0')} · {activeMilestone.year}
            </p>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleStep(-1)}
                disabled={visibleMilestones.length <= 1}
                aria-label={t('Marco anterior', 'Previous milestone', '上一個里程碑')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-[#2B5946] bg-[#F4F7F5] dark:bg-[#163127] text-[#182C61] dark:text-[#BCE87D] hover:border-[#1E7E54] dark:hover:border-[#8BC53F] disabled:opacity-40 transition-colors min-h-[38px] whitespace-nowrap"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t('Anterior', 'Previous', '上一步')}</span>
              </button>
              <button
                type="button"
                onClick={() => handleStep(1)}
                disabled={visibleMilestones.length <= 1}
                aria-label={t('Próximo marco', 'Next milestone', '下一個里程碑')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-[#2B5946] bg-[#F4F7F5] dark:bg-[#163127] text-[#182C61] dark:text-[#BCE87D] hover:border-[#1E7E54] dark:hover:border-[#8BC53F] disabled:opacity-40 transition-colors min-h-[38px] whitespace-nowrap"
              >
                <span>{t('Seguinte', 'Next', '下一步')}</span>
                <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Year Node Track */}
          <div className="relative overflow-x-auto pb-1">
            <div className="relative min-w-[600px] pt-2">
              {/* Hairline Background Track */}
              <div
                className="absolute left-6 right-6 top-[22px] h-[2px] bg-neutral-200 dark:bg-[#224738]"
                aria-hidden="true"
              />
              {/* Compositor Progress Line */}
              <div
                className="absolute left-6 right-6 top-[22px] h-[2px] bg-gradient-to-r from-[#182C61] via-[#1E7E54] to-[#8BC53F] origin-left transition-transform duration-300 ease-out"
                style={{ transform: `scaleX(${progressRatio})` }}
                aria-hidden="true"
              />

              <div
                role="tablist"
                aria-label={t('Anos dos marcos históricos', 'Milestone years', '里程碑年份')}
                className="relative z-10 grid gap-3"
                style={{
                  gridTemplateColumns: `repeat(${visibleMilestones.length}, minmax(0, 1fr))`,
                }}
              >
                {visibleMilestones.map((item, idx) => {
                  const isActive = item.id === activeMilestone.id;
                  const isCompleted = idx <= activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveId(item.id)}
                      className="group flex flex-col items-center text-center focus-visible:outline-2 focus-visible:outline-[#1E7E54] rounded-lg py-1 px-1"
                    >
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono font-bold tabular-nums transition-transform duration-200 ${
                          isActive
                            ? 'bg-[#182C61] dark:bg-[#8BC53F] text-white dark:text-[#182C61] ring-4 ring-[#7FD1A8]/40 dark:ring-[#8BC53F]/30 scale-110'
                            : isCompleted
                            ? 'bg-[#1E7E54] dark:bg-[#2EA36F] text-white'
                            : 'bg-white dark:bg-[#0D1E18] text-[#29332F]/75 dark:text-[#A8CBB9] border border-neutral-300 dark:border-[#2B5946] group-hover:border-[#1E7E54]'
                        }`}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`mt-2 font-mono text-xs font-bold tabular-nums transition-colors ${
                          isActive
                            ? 'text-[#182C61] dark:text-[#BCE87D]'
                            : 'text-[#29332F]/75 dark:text-[#C5DFD1] group-hover:text-[#1B6B4A]'
                        }`}
                      >
                        {item.year}
                      </span>
                      <span className="mt-0.5 text-[11px] text-[#29332F]/65 dark:text-[#A8CBB9] line-clamp-1 max-w-full">
                        {item.phase}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Interactive Detail Stage & Full Index */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Active Milestone Detailed Spotlight */}
          <div className="lg:col-span-7 flex">
            <AnimatePresence mode="wait">
              <motion.article
                key={`${lang}-${activeMilestone.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="w-full bg-white dark:bg-[#11261E] rounded-2xl border border-neutral-200 dark:border-[#224738] p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-5">
                  {/* Unboxed Metadata Line + Icon */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#1E7E54] dark:text-[#BCE87D]">
                      <span className="font-mono font-bold tabular-nums text-[#182C61] dark:text-[#8BC53F]">
                        {activeMilestone.year}
                      </span>
                      <span className="text-neutral-300 dark:text-[#2B5946]" aria-hidden="true">
                        ·
                      </span>
                      <span>{activeMilestone.categoryLabel}</span>
                      <span className="text-neutral-300 dark:text-[#2B5946]" aria-hidden="true">
                        ·
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#29332F]/70 dark:text-[#A8CBB9]">
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        {activeMilestone.scope}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-[#F4F7F5] dark:bg-[#163127] border border-neutral-200/80 dark:border-[#2B5946] text-[#1B6B4A] dark:text-[#BCE87D] flex items-center justify-center shrink-0">
                      <ActiveIcon className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Title & Narrative */}
                  <div>
                    <h3 className="font-display text-2xl sm:text-[1.65rem] font-bold text-[#1B6B4A] dark:text-[#ECF5F0] leading-snug text-balance">
                      {activeMilestone.title}
                    </h3>
                    <p className="mt-3 text-sm sm:text-base text-[#29332F]/85 dark:text-[#DCECE3] leading-relaxed">
                      {activeMilestone.summary}
                    </p>
                  </div>

                  {/* Quantified Institutional Impact */}
                  <div className="pt-5 border-t border-neutral-200/80 dark:border-[#224738] flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#29332F]/60 dark:text-[#A8CBB9]">
                        {t('Impacto Institucional Alcançado', 'Institutional Impact Achieved', '關鍵里程碑成果')}
                      </p>
                      <p className="text-sm font-medium text-[#29332F]/85 dark:text-[#DCECE3] mt-0.5">
                        {activeMilestone.impactLabel}
                      </p>
                    </div>
                    <span className="font-display text-3xl sm:text-4xl font-extrabold text-[#182C61] dark:text-[#BCE87D] tabular-nums shrink-0">
                      {activeMilestone.impactMetric}
                    </span>
                  </div>

                  {/* Technical Deliverables */}
                  <div className="pt-5 border-t border-neutral-200/80 dark:border-[#224738] space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1B6B4A] dark:text-[#7FD1A8]">
                      {t('Principais Realizações Técnicas', 'Key Technical Deliverables', '主要技術成果與貢獻')}
                    </h4>
                    <ul className="space-y-2.5">
                      {activeMilestone.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm text-[#29332F]/85 dark:text-[#DCECE3]"
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
                </div>

                {/* Footer CTA */}
                <div className="pt-5 border-t border-neutral-200/80 dark:border-[#224738] flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-[#29332F]/65 dark:text-[#A8CBB9]">
                    {t(
                      'Experiência acumulada ao serviço do seu projecto',
                      'Proven experience at the service of your project',
                      '累積十餘年實績，全力支援您的專案'
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => openProposalModal(activeMilestone.title)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>
                      {t(
                        'Solicitar Consultoria Ambiental',
                        'Request Environmental Consultancy',
                        '預約環境顧問諮詢'
                      )}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* Right: Complete Chronological Index Selector */}
          <div className="lg:col-span-5 bg-white dark:bg-[#11261E] rounded-2xl border border-neutral-200 dark:border-[#224738] p-5 sm:p-6 flex flex-col justify-between space-y-3">
            <div className="pb-2 border-b border-neutral-200/80 dark:border-[#224738]">
              <h3 className="font-display text-base font-bold text-[#1B6B4A] dark:text-[#ECF5F0]">
                {t('Cronologia Completa da BIOSFERA', 'Complete BIOSFERA Chronology', 'BIOSFERA 完整大事紀年表')}
              </h3>
              <p className="text-xs text-[#29332F]/70 dark:text-[#A8CBB9] mt-0.5">
                {t(
                  'Seleccione qualquer período para consultar os detalhes',
                  'Select any period to inspect milestone details',
                  '點擊任一時期以查看詳細技術成果'
                )}
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-2.5">
              {visibleMilestones.map((item, idx) => {
                const isSelected = item.id === activeMilestone.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    aria-current={isSelected ? 'step' : undefined}
                    className={`w-full text-left p-3.5 rounded-xl border transition-colors duration-150 flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-[#F4F7F5] dark:bg-[#163127] border-[#1E7E54] dark:border-[#8BC53F]'
                        : 'bg-transparent border-neutral-200/80 dark:border-[#224738] hover:bg-[#F4F7F5]/60 dark:hover:bg-[#163127]/60'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs font-bold tabular-nums px-2 py-1 rounded-md shrink-0 ${
                        isSelected
                          ? 'bg-[#182C61] text-white dark:bg-[#8BC53F] dark:text-[#182C61]'
                          : 'bg-[#F4F7F5] dark:bg-[#0D1E18] text-[#1B6B4A] dark:text-[#7FD1A8]'
                      }`}
                    >
                      {item.year}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-[#1E7E54] dark:text-[#BCE87D] truncate">
                        {String(idx + 1).padStart(2, '0')} · {item.phase}
                      </p>
                      <p className="font-display text-sm font-bold text-[#1B6B4A] dark:text-[#ECF5F0] mt-0.5 line-clamp-1">
                        {item.title}
                      </p>
                    </div>

                    <span
                      className={`font-mono text-xs font-bold tabular-nums shrink-0 mt-0.5 ${
                        isSelected
                          ? 'text-[#182C61] dark:text-[#BCE87D]'
                          : 'text-[#29332F]/55 dark:text-[#A8CBB9]'
                      }`}
                    >
                      {item.impactMetric}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
