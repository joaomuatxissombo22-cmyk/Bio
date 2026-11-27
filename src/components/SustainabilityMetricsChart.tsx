import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DynamicHeading } from './DynamicHeading';
import { useLanguage, type SiteLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

type MetricView = 'waste' | 'environmental';
type PeriodRange = '4q' | '8q';

interface QuarterlyMetricPoint {
  id: string;
  quarterPt: string;
  quarterEn: string;
  quarterZh: string;
  recycledTons: number;
  specialTreatedTons: number;
  landfillTons: number;
  recoveryRatePct: number;
  compliancePct: number;
  waterEfficiencyPct: number;
  emissionsReductionPct: number;
}

const QUARTERLY_METRICS: QuarterlyMetricPoint[] = [
  {
    id: '2025-q1',
    quarterPt: '1.º T 2025',
    quarterEn: 'Q1 2025',
    quarterZh: '2025 Q1',
    recycledTons: 142,
    specialTreatedTons: 48,
    landfillTons: 120,
    recoveryRatePct: 61,
    compliancePct: 87,
    waterEfficiencyPct: 60,
    emissionsReductionPct: 14,
  },
  {
    id: '2025-q2',
    quarterPt: '2.º T 2025',
    quarterEn: 'Q2 2025',
    quarterZh: '2025 Q2',
    recycledTons: 164,
    specialTreatedTons: 54,
    landfillTons: 112,
    recoveryRatePct: 66,
    compliancePct: 89,
    waterEfficiencyPct: 64,
    emissionsReductionPct: 18,
  },
  {
    id: '2025-q3',
    quarterPt: '3.º T 2025',
    quarterEn: 'Q3 2025',
    quarterZh: '2025 Q3',
    recycledTons: 188,
    specialTreatedTons: 58,
    landfillTons: 101,
    recoveryRatePct: 71,
    compliancePct: 91,
    waterEfficiencyPct: 68,
    emissionsReductionPct: 22,
  },
  {
    id: '2025-q4',
    quarterPt: '4.º T 2025',
    quarterEn: 'Q4 2025',
    quarterZh: '2025 Q4',
    recycledTons: 210,
    specialTreatedTons: 62,
    landfillTons: 92,
    recoveryRatePct: 75,
    compliancePct: 93,
    waterEfficiencyPct: 72,
    emissionsReductionPct: 26,
  },
  {
    id: '2026-q1',
    quarterPt: '1.º T 2026',
    quarterEn: 'Q1 2026',
    quarterZh: '2026 Q1',
    recycledTons: 232,
    specialTreatedTons: 66,
    landfillTons: 84,
    recoveryRatePct: 78,
    compliancePct: 95,
    waterEfficiencyPct: 76,
    emissionsReductionPct: 30,
  },
  {
    id: '2026-q2',
    quarterPt: '2.º T 2026',
    quarterEn: 'Q2 2026',
    quarterZh: '2026 Q2',
    recycledTons: 254,
    specialTreatedTons: 70,
    landfillTons: 76,
    recoveryRatePct: 81,
    compliancePct: 96,
    waterEfficiencyPct: 79,
    emissionsReductionPct: 34,
  },
  {
    id: '2026-q3',
    quarterPt: '3.º T 2026',
    quarterEn: 'Q3 2026',
    quarterZh: '2026 Q3',
    recycledTons: 278,
    specialTreatedTons: 74,
    landfillTons: 69,
    recoveryRatePct: 84,
    compliancePct: 97,
    waterEfficiencyPct: 82,
    emissionsReductionPct: 37,
  },
  {
    id: '2026-q4',
    quarterPt: '4.º T 2026',
    quarterEn: 'Q4 2026',
    quarterZh: '2026 Q4',
    recycledTons: 302,
    specialTreatedTons: 78,
    landfillTons: 62,
    recoveryRatePct: 86,
    compliancePct: 98,
    waterEfficiencyPct: 85,
    emissionsReductionPct: 41,
  },
];

interface ChartTooltipEntry {
  name?: string;
  value?: number;
  color?: string;
  dataKey?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: ChartTooltipEntry[];
  label?: string;
  isDark: boolean;
  lang: SiteLanguage;
}

const MetricsTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  isDark,
  lang,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const formatValue = (entry: ChartTooltipEntry) => {
    const val = typeof entry.value === 'number' ? entry.value : 0;
    const isPercent =
      entry.dataKey === 'recoveryRatePct' ||
      entry.dataKey === 'compliancePct' ||
      entry.dataKey === 'waterEfficiencyPct' ||
      entry.dataKey === 'emissionsReductionPct';

    if (isPercent) return `${val}%`;
    const unit = lang === 'en' ? 't' : lang === 'zh' ? '公噸' : 't';
    return `${val.toLocaleString(lang === 'en' ? 'en-US' : 'pt-PT')} ${unit}`;
  };

  return (
    <div
      className={`rounded-xl border px-4 py-3 shadow-lg text-xs min-w-[210px] ${
        isDark
          ? 'bg-[#0B1C16] border-[#2B5946] text-[#ECF5F0]'
          : 'bg-white border-neutral-200 text-[#29332F]'
      }`}
    >
      <p
        className={`font-display font-bold text-sm pb-2 mb-2 border-b ${
          isDark
            ? 'text-[#7FD1A8] border-[#224738]'
            : 'text-[#1B6B4A] border-neutral-200'
        }`}
      >
        {label}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div
            key={String(entry.dataKey || entry.name)}
            className="flex items-center justify-between gap-4"
          >
            <span className="flex items-center gap-2 text-xs opacity-90">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: entry.color || '#1B6B4A' }}
                aria-hidden="true"
              />
              <span>{entry.name}</span>
            </span>
            <span className="font-mono font-semibold tabular-nums">
              {formatValue(entry)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SustainabilityMetricsChart: React.FC = () => {
  const { lang, t } = useLanguage();
  const { isDark } = useTheme();
  const [view, setView] = useState<MetricView>('waste');
  const [period, setPeriod] = useState<PeriodRange>('8q');

  const chartData = useMemo(() => {
    const slice = period === '4q' ? QUARTERLY_METRICS.slice(-4) : QUARTERLY_METRICS;
    return slice.map((item) => ({
      ...item,
      quarterLabel:
        lang === 'en'
          ? item.quarterEn
          : lang === 'zh'
            ? item.quarterZh
            : item.quarterPt,
    }));
  }, [lang, period]);

  const summary = useMemo(() => {
    const totalTons = chartData.reduce(
      (acc, d) => acc + d.recycledTons + d.specialTreatedTons + d.landfillTons,
      0
    );
    const totalRecovered = chartData.reduce(
      (acc, d) => acc + d.recycledTons + d.specialTreatedTons,
      0
    );
    const latest = chartData[chartData.length - 1];
    const first = chartData[0];
    const avgRecoveryPct = Math.round((totalRecovered / Math.max(1, totalTons)) * 100);
    const landfillDeltaPct = Math.round(
      ((latest.landfillTons - first.landfillTons) / Math.max(1, first.landfillTons)) * 100
    );

    return {
      totalTons,
      avgRecoveryPct,
      latestCompliancePct: latest.compliancePct,
      latestWaterEfficiencyPct: latest.waterEfficiencyPct,
      latestEmissionsReductionPct: latest.emissionsReductionPct,
      landfillDeltaPct,
    };
  }, [chartData]);

  const colors = useMemo(
    () => ({
      grid: isDark ? '#1E3F32' : '#E5EAE7',
      axis: isDark ? '#9FC3B2' : '#52605A',
      recycled: isDark ? '#4CC38A' : '#1B6B4A',
      special: '#8BC53F',
      landfill: isDark ? '#64748B' : '#94A3B8',
      recoveryLine: isDark ? '#F2D16B' : '#182C61',
      compliance: isDark ? '#4CC38A' : '#1B6B4A',
      water: isDark ? '#38BDF8' : '#0284C7',
      emissions: '#8BC53F',
    }),
    [isDark]
  );

  const legendItems =
    view === 'waste'
      ? [
          {
            label: t('Reciclados e Valorizados (t)', 'Recycled & Recovered (t)', '回收與資源化（公噸）'),
            color: colors.recycled,
          },
          {
            label: t('Tratamento Especial / Hospitalar (t)', 'Hazardous & Medical Treated (t)', '特殊與醫療無害化處理（公噸）'),
            color: colors.special,
          },
          {
            label: t('Encaminhados a Aterro (t)', 'Sent to Licensed Landfill (t)', '合法掩埋處置（公噸）'),
            color: colors.landfill,
          },
          {
            label: t('Taxa de Valorização (%)', 'Recovery Rate (%)', '資源化利用率（%）'),
            color: colors.recoveryLine,
          },
        ]
      : [
          {
            label: t('Conformidade Ambiental (%)', 'Environmental Compliance (%)', '環境法規合規率（%）'),
            color: colors.compliance,
          },
          {
            label: t('Eficiência Hídrica (%)', 'Water Efficiency (%)', '水資源循環效率（%）'),
            color: colors.water,
          },
          {
            label: t('Redução de Emissões (%)', 'Emissions Reduction (%)', '碳排放強度降幅（%）'),
            color: colors.emissions,
          },
        ];

  return (
    <section
      id="metricas-ambientais"
      className="py-16 bg-[#F4F7F5] dark:bg-[#0D1E18] border-y border-neutral-200 dark:border-[#224738]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <DynamicHeading
              as="h2"
              kicker={t('Indicadores Trimestrais Consolidados', 'Consolidated Quarterly Indicators', '季度整合環境指標')}
              title={t(
                'Evolução da Gestão de Resíduos e Métricas Ambientais',
                'Waste Management & Environmental Performance Evolution',
                '廢棄物管理與環境績效季度演變'
              )}
              titleClassName="!text-2xl sm:!text-3xl"
            />
            <p className="text-sm sm:text-base text-[#29332F]/80 dark:text-[#C5DFD1] leading-relaxed">
              {t(
                'Acompanhamento trimestral dos volumes encaminhados segundo Planos de Gestão de Resíduos (PGR) e da evolução de conformidade, eficiência hídrica e mitigação de emissões nos projectos monitorizados pela BIOSFERA.',
                'Quarterly tracking of waste streams handled under Environmental Waste Management Plans (PGR) alongside regulatory compliance, water efficiency, and emissions mitigation across BIOSFERA-monitored projects.',
                '按季度追蹤依循廢棄物管理計畫 (PGR) 處理之廢棄物量，以及 BIOSFERA 監測專案中的法規合規率、水資源效率與減碳成果。'
              )}
            </p>
          </div>

          {/* Interactive view & period controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div
              role="tablist"
              aria-label={t('Tipo de visualização ambiental', 'Environmental chart view', '環境圖表檢視模式')}
              className="inline-flex items-center p-1 rounded-xl bg-white dark:bg-[#11261E] border border-neutral-200 dark:border-[#224738]"
            >
              <button
                type="button"
                role="tab"
                aria-selected={view === 'waste'}
                onClick={() => setView('waste')}
                className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B6B4A] ${
                  view === 'waste'
                    ? 'bg-[#1B6B4A] text-white dark:bg-[#8BC53F] dark:text-[#182C61]'
                    : 'text-[#29332F]/80 dark:text-[#C5DFD1] hover:text-[#1B6B4A] dark:hover:text-white'
                }`}
              >
                {t('Gestão de Resíduos', 'Waste Management', '廢棄物管理')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === 'environmental'}
                onClick={() => setView('environmental')}
                className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B6B4A] ${
                  view === 'environmental'
                    ? 'bg-[#1B6B4A] text-white dark:bg-[#8BC53F] dark:text-[#182C61]'
                    : 'text-[#29332F]/80 dark:text-[#C5DFD1] hover:text-[#1B6B4A] dark:hover:text-white'
                }`}
              >
                {t('Métricas Ambientais', 'Environmental Metrics', '環境績效指標')}
              </button>
            </div>

            <div
              role="group"
              aria-label={t('Período analisado', 'Analysis period', '統計期間')}
              className="inline-flex items-center p-1 rounded-xl bg-white dark:bg-[#11261E] border border-neutral-200 dark:border-[#224738]"
            >
              <button
                type="button"
                onClick={() => setPeriod('4q')}
                aria-pressed={period === '4q'}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B6B4A] ${
                  period === '4q'
                    ? 'bg-[#182C61] text-white dark:bg-[#1B6B4A] dark:text-white'
                    : 'text-[#29332F]/75 dark:text-[#A8CBB9] hover:text-[#1B6B4A] dark:hover:text-white'
                }`}
              >
                {t('4 Trimestres', '4 Quarters', '近 4 季')}
              </button>
              <button
                type="button"
                onClick={() => setPeriod('8q')}
                aria-pressed={period === '8q'}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B6B4A] ${
                  period === '8q'
                    ? 'bg-[#182C61] text-white dark:bg-[#1B6B4A] dark:text-white'
                    : 'text-[#29332F]/75 dark:text-[#A8CBB9] hover:text-[#1B6B4A] dark:hover:text-white'
                }`}
              >
                {t('8 Trimestres', '8 Quarters', '近 8 季')}
              </button>
            </div>
          </div>
        </div>

        {/* Unified single-elevation analytics panel */}
        <div className="bg-white dark:bg-[#11261E] rounded-2xl border border-neutral-200 dark:border-[#224738] overflow-hidden">
          {/* Top KPI strip separated by hairline borders */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200/80 dark:divide-[#224738] border-b border-neutral-200/80 dark:border-[#224738]">
            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium text-[#29332F]/70 dark:text-[#A8CBB9]">
                {t('Volume Total Gerido', 'Total Waste Managed', '累計處理總量')}
              </p>
              <p className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-[#1B6B4A] dark:text-[#ECF5F0] tabular-nums">
                {summary.totalTons.toLocaleString(lang === 'en' ? 'en-US' : 'pt-PT')}{' '}
                <span className="text-sm font-semibold text-[#29332F]/65 dark:text-[#A8CBB9]">
                  {t('ton', 't', '公噸')}
                </span>
              </p>
              <p className="mt-1 text-xs text-[#29332F]/65 dark:text-[#9FC3B2]">
                {period === '8q'
                  ? t('Acumulado · 2025–2026', 'Cumulative · 2025–2026', '累計期間 · 2025–2026')
                  : t('Acumulado · 2026', 'Cumulative · 2026', '累計期間 · 2026')}
              </p>
            </div>

            <div className="p-5 sm:p-6 border-l lg:border-l-0 border-neutral-200/80 dark:border-[#224738]">
              <p className="text-xs font-medium text-[#29332F]/70 dark:text-[#A8CBB9]">
                {t('Valorização e Tratamento', 'Recovery & Treatment Rate', '資源化與無害化比率')}
              </p>
              <p className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-[#1B6B4A] dark:text-[#8BC53F] tabular-nums">
                {summary.avgRecoveryPct}%
              </p>
              <p className="mt-1 text-xs text-[#29332F]/65 dark:text-[#9FC3B2] tabular-nums">
                {t(
                  `Aterro reduzido em ${Math.abs(summary.landfillDeltaPct)}% no período`,
                  `Landfill reduced by ${Math.abs(summary.landfillDeltaPct)}% in period`,
                  `期間掩埋量減少 ${Math.abs(summary.landfillDeltaPct)}%`
                )}
              </p>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium text-[#29332F]/70 dark:text-[#A8CBB9]">
                {t('Conformidade Ambiental', 'Environmental Compliance', '最新季度法規合規率')}
              </p>
              <p className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-[#182C61] dark:text-[#ECF5F0] tabular-nums">
                {summary.latestCompliancePct}%
              </p>
              <p className="mt-1 text-xs text-[#29332F]/65 dark:text-[#9FC3B2]">
                {t('Último trimestre · RMA auditados', 'Latest quarter · Audited EMRs', '最新季度 · 經稽核之監測報告')}
              </p>
            </div>

            <div className="p-5 sm:p-6 border-l lg:border-l-0 border-neutral-200/80 dark:border-[#224738]">
              <p className="text-xs font-medium text-[#29332F]/70 dark:text-[#A8CBB9]">
                {t('Eficiência Hídrica / Emissões', 'Water Efficiency / Emissions', '水效與減排進展')}
              </p>
              <p className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-[#1B6B4A] dark:text-[#7FD1A8] tabular-nums">
                {summary.latestWaterEfficiencyPct}%
                <span className="mx-1.5 text-base font-normal text-[#29332F]/40 dark:text-[#5B8A75]">/</span>
                <span className="text-xl sm:text-2xl">-{summary.latestEmissionsReductionPct}%</span>
              </p>
              <p className="mt-1 text-xs text-[#29332F]/65 dark:text-[#9FC3B2]">
                {t('Reaproveitamento hídrico · CO₂e', 'Water reuse · CO₂e intensity', '水循環利用率 · 碳排降幅')}
              </p>
            </div>
          </div>

          {/* Chart canvas */}
          <div className="p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#1B6B4A] dark:text-[#ECF5F0]">
                  {view === 'waste'
                    ? t(
                        'Distribuição Trimestral de Resíduos (Toneladas) e Taxa de Valorização (%)',
                        'Quarterly Waste Distribution (Tonnes) & Recovery Rate (%)',
                        '季度廢棄物處置分布（公噸）與資源化比率（%）'
                      )
                    : t(
                        'Evolução de Conformidade, Eficiência Hídrica e Redução de Emissões (%)',
                        'Compliance, Water Efficiency & Emissions Reduction Trajectory (%)',
                        '法規合規、水資源效率與減排幅度趨勢（%）'
                      )}
                </h3>
                <p className="text-xs text-[#29332F]/65 dark:text-[#A8CBB9] mt-0.5">
                  {view === 'waste'
                    ? t(
                        'Barras empilhadas por destino final · Linha contínua para percentagem valorizada',
                        'Stacked bars by treatment pathway · Solid line tracks overall recovery percentage',
                        '堆疊長條代表各類處置途徑 · 折線顯示整體資源化比率'
                      )
                    : t(
                        'Indicadores percentuais consolidados em campanhas trimestrais de monitorização',
                        'Consolidated percentage benchmarks across quarterly monitoring campaigns',
                        '季度環境監測計畫彙整之百分比績效指標'
                      )}
                </p>
              </div>

              {/* Clean unboxed inline legend */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#29332F]/80 dark:text-[#C5DFD1]">
                {legendItems.map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full h-[330px] sm:h-[380px] min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                {view === 'waste' ? (
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 10, right: 12, left: -6, bottom: 4 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke={colors.grid}
                    />
                    <XAxis
                      dataKey="quarterLabel"
                      tick={{ fill: colors.axis, fontSize: 12 }}
                      axisLine={{ stroke: colors.grid }}
                      tickLine={false}
                      dy={6}
                    />
                    <YAxis
                      yAxisId="tons"
                      tick={{ fill: colors.axis, fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      unit=" t"
                    />
                    <YAxis
                      yAxisId="pct"
                      orientation="right"
                      domain={[40, 100]}
                      tick={{ fill: colors.axis, fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      unit="%"
                    />
                    <Tooltip
                      content={<MetricsTooltip isDark={isDark} lang={lang} />}
                      cursor={{
                        fill: isDark ? 'rgba(127, 209, 168, 0.08)' : 'rgba(27, 107, 74, 0.06)',
                      }}
                    />
                    <Bar
                      yAxisId="tons"
                      dataKey="recycledTons"
                      stackId="waste"
                      name={t('Reciclados e Valorizados', 'Recycled & Recovered', '回收與資源化')}
                      fill={colors.recycled}
                      radius={[0, 0, 0, 0]}
                      maxBarSize={44}
                    />
                    <Bar
                      yAxisId="tons"
                      dataKey="specialTreatedTons"
                      stackId="waste"
                      name={t('Tratamento Especial / Hospitalar', 'Hazardous & Medical Treated', '特殊與醫療無害化處理')}
                      fill={colors.special}
                      radius={[0, 0, 0, 0]}
                      maxBarSize={44}
                    />
                    <Bar
                      yAxisId="tons"
                      dataKey="landfillTons"
                      stackId="waste"
                      name={t('Aterro Licenciado', 'Licensed Landfill', '合法掩埋處置')}
                      fill={colors.landfill}
                      radius={[6, 6, 0, 0]}
                      maxBarSize={44}
                    />
                    <Line
                      yAxisId="pct"
                      type="monotone"
                      dataKey="recoveryRatePct"
                      name={t('Taxa de Valorização', 'Recovery Rate', '資源化利用率')}
                      stroke={colors.recoveryLine}
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: colors.recoveryLine, strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </ComposedChart>
                ) : (
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 12, left: -6, bottom: 4 }}
                  >
                    <defs>
                      <linearGradient id="biosferaComplianceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.compliance} stopOpacity={0.28} />
                        <stop offset="95%" stopColor={colors.compliance} stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="biosferaWaterGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.water} stopOpacity={0.24} />
                        <stop offset="95%" stopColor={colors.water} stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="biosferaEmissionsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.emissions} stopOpacity={0.26} />
                        <stop offset="95%" stopColor={colors.emissions} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke={colors.grid}
                    />
                    <XAxis
                      dataKey="quarterLabel"
                      tick={{ fill: colors.axis, fontSize: 12 }}
                      axisLine={{ stroke: colors.grid }}
                      tickLine={false}
                      dy={6}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: colors.axis, fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      unit="%"
                    />
                    <Tooltip content={<MetricsTooltip isDark={isDark} lang={lang} />} />
                    <Area
                      type="monotone"
                      dataKey="compliancePct"
                      name={t('Conformidade Ambiental', 'Environmental Compliance', '環境法規合規率')}
                      stroke={colors.compliance}
                      strokeWidth={2.5}
                      fill="url(#biosferaComplianceGrad)"
                      dot={{ r: 3.5, fill: colors.compliance, strokeWidth: 0 }}
                      activeDot={{ r: 5.5 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="waterEfficiencyPct"
                      name={t('Eficiência Hídrica', 'Water Efficiency', '水資源循環效率')}
                      stroke={colors.water}
                      strokeWidth={2.5}
                      fill="url(#biosferaWaterGrad)"
                      dot={{ r: 3.5, fill: colors.water, strokeWidth: 0 }}
                      activeDot={{ r: 5.5 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="emissionsReductionPct"
                      name={t('Redução de Emissões', 'Emissions Reduction', '碳排放強度降幅')}
                      stroke={colors.emissions}
                      strokeWidth={2.5}
                      fill="url(#biosferaEmissionsGrad)"
                      dot={{ r: 3.5, fill: colors.emissions, strokeWidth: 0 }}
                      activeDot={{ r: 5.5 }}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-200/80 dark:border-[#224738] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#29332F]/65 dark:text-[#9FC3B2]">
              <span>
                {t(
                  'Fonte: Indicadores trimestrais consolidados de PGR e Relatórios de Monitorização Ambiental (RMA) acompanhados pela BIOSFERA.',
                  'Source: Consolidated quarterly PGR and Environmental Monitoring Report (EMR) benchmarks tracked by BIOSFERA.',
                  '資料來源：BIOSFERA 季度彙整之廢棄物管理計畫 (PGR) 與環境監測報告 (RMA) 基準數據。'
                )}
              </span>
              <span className="tabular-nums shrink-0">
                {t('Actualização · T4 2026', 'Updated · Q4 2026', '更新週期 · 2026 Q4')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
