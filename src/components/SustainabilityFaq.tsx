import React, { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DynamicHeading } from './DynamicHeading';
import { useLanguage, type SiteLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';

type FaqCategory = 'all' | 'licensing' | 'waste' | 'monitoring';

interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, 'all'>;
  question: Record<SiteLanguage, string>;
  answer: Record<SiteLanguage, string>;
}

const SUSTAINABILITY_FAQS: FaqItem[] = [
  {
    id: 'faq-licenciamento-117-20',
    category: 'licensing',
    question: {
      pt: 'Que empresas em Angola precisam de licenciamento ambiental segundo o Decreto Presidencial n.º 117/20?',
      en: 'Which companies in Angola require environmental permitting under Presidential Decree No. 117/20?',
      zh: '依安哥拉第 117/20 號總統令，哪些企業必須申辦環境許可？',
    },
    answer: {
      pt: 'Todos os projectos públicos ou privados com potencial de impacte ambiental — abrangendo indústria transformadora, construção civil, logística, energia, mineração, agricultura intensiva, unidades hospitalares e hotelaria — devem enquadrar-se nas categorias A, B, C ou D do Decreto Presidencial n.º 117/20 antes da instalação e operação.',
      en: 'All public or private undertakings with potential environmental impact — spanning manufacturing, civil construction, logistics, energy, mining, commercial agriculture, healthcare facilities, and hospitality — must be classified under Categories A, B, C, or D of Presidential Decree No. 117/20 prior to construction and operation.',
      zh: '所有具潛在環境影響之公私部門專案（包含製造業、營建工程、物流、能源、採礦、集約農業、醫療院所及旅宿業），均須於動工與營運前依第 117/20 號總統令完成 A、B、C 或 D 類環境許可申請。',
    },
  },
  {
    id: 'faq-pgr-obrigatorio',
    category: 'waste',
    question: {
      pt: 'O que inclui um Plano de Gestão de Resíduos (PGR) elaborado pela BIOSFERA?',
      en: 'What is included in a Waste Management Plan (PGR) prepared by BIOSFERA?',
      zh: 'BIOSFERA 編製的廢棄物管理計畫 (PGR) 包含哪些核心內容？',
    },
    answer: {
      pt: 'O PGR integra a caracterização e classificação dos resíduos produzidos (comuns, industriais, perigosos e hospitalares), regras de segregação na origem, dimensionamento de áreas de armazenamento temporário, protocolos de transporte e encaminhamento para operadores licenciados, além de indicadores trimestrais de rastreabilidade e valorização.',
      en: 'Our PGR covers waste inventory and classification (municipal, industrial, hazardous, and clinical), source-segregation procedures, temporary storage sizing, licensed transport and treatment pathways, and quarterly traceability and recovery KPIs.',
      zh: 'PGR 涵蓋一般、工業、有害及醫療廢棄物之清查與分類、源頭分類規範、暫存區規劃、合法清運與處置路徑，以及季度可追溯與資源化績效指標。',
    },
  },
  {
    id: 'faq-residuos-perigosos',
    category: 'waste',
    question: {
      pt: 'Como garantir o encaminhamento seguro de resíduos perigosos e hospitalares?',
      en: 'How can organizations ensure safe handling of hazardous and medical waste?',
      zh: '企業與醫院如何確保有害及醫療廢棄物的安全處置？',
    },
    answer: {
      pt: 'É essencial separar estes fluxos na fonte com contentores identificados e estanques, manter registos de manifestos de entrega com operadores devidamente licenciados e realizar auditorias periódicas aos pontos de armazenamento. A BIOSFERA acompanha todo o ciclo documental para garantir conformidade perante as autoridades.',
      en: 'These streams must be segregated at source using labeled, sealed containment, backed by chain-of-custody manifests with licensed operators and periodic storage inspections. BIOSFERA oversees the full documentation trail to guarantee regulatory compliance.',
      zh: '須於產生源頭使用標示清晰之密閉容器分類收集，並透過合格清運業者保存完整交接聯單及定期稽核暫存設施。BIOSFERA 全程協助建立合規文件紀錄。',
    },
  },
  {
    id: 'faq-frequencia-rma',
    category: 'monitoring',
    question: {
      pt: 'Com que frequência devem ser apresentados os Relatórios de Monitorização Ambiental (RMA)?',
      en: 'How often must Environmental Monitoring Reports (EMR) be submitted?',
      zh: '環境監測報告 (RMA) 應以何種頻率提交？',
    },
    answer: {
      pt: 'A periodicidade — geralmente trimestral, semestral ou anual — é definida nas condicionantes da Licença Ambiental e no Plano de Gestão Ambiental (PGA) do empreendimento. Os RMA consolidam análises de qualidade do ar, águas superficiais e subterrâneas, solos, ruído ambiente e conformidade operacional.',
      en: 'Submission frequency — typically quarterly, semi-annual, or annual — is stipulated by the Environmental License conditions and the project’s Environmental Management Plan (EMP). EMRs consolidate air quality, surface/groundwater, soil, ambient noise, and operational compliance analyses.',
      zh: '提報頻率（通常為每季、每半年或每年）依環境許可證附帶條件及環境管理計畫 (PGA) 規定執行，報告彙整空氣品質、水質、土壤、環境噪音及營運合規實測數據。',
    },
  },
  {
    id: 'faq-auditoria-diagnostico',
    category: 'monitoring',
    question: {
      pt: 'Qual a diferença entre um Diagnóstico Ambiental e uma Auditoria Ambiental?',
      en: 'What is the difference between an Environmental Assessment and an Environmental Audit?',
      zh: '環境現況診斷與環境稽核有何區別？',
    },
    answer: {
      pt: 'O Diagnóstico Ambiental avalia a situação inicial de um local ou operação para identificar passivos, riscos e requisitos legais aplicáveis. Já a Auditoria Ambiental verifica de forma sistemática e independente o grau de cumprimento das obrigações da licença, do PGA e das normas ambientais em operações activas.',
      en: 'An Environmental Assessment establishes the initial baseline of a site or facility to identify liabilities, risks, and applicable legal requirements. An Environmental Audit systematically and independently verifies ongoing compliance with permit conditions, EMP commitments, and environmental standards in active operations.',
      zh: '環境現況診斷著重於評估場址初期環境基線、潛在風險與適用法規；環境稽核則係針對營運中設施進行系統化、獨立的法規與許可條件遵循查核。',
    },
  },
  {
    id: 'faq-esg-financiamento',
    category: 'licensing',
    question: {
      pt: 'Como os programas de sustentabilidade apoiam o acesso a financiamento e critérios ESG?',
      en: 'How do structured sustainability programs support financing access and ESG standards?',
      zh: '永續管理計畫如何協助企業符合 ESG 標準並取得國際融資？',
    },
    answer: {
      pt: 'Instituições financeiras e parceiros internacionais exigem evidências auditáveis de conformidade ambiental, gestão de resíduos, segurança ocupacional e mitigação de riscos climáticos. Relatórios técnicos consistentes e indicadores trimestrais reduzem o risco percebido e aceleram processos de due diligence.',
      en: 'Financial institutions and international partners require auditable proof of environmental compliance, waste traceability, occupational safety, and climate risk mitigation. Consistent technical reports and quarterly KPIs lower perceived risk and accelerate due diligence.',
      zh: '金融機構與國際夥伴均要求可稽核的環境合規、廢棄物追溯、職業安全與氣候風險減緩證據。完善的技術報告與季度指標可顯著降低專案風險並加速盡職調查。',
    },
  },
  {
    id: 'faq-prazos-implementacao',
    category: 'licensing',
    question: {
      pt: 'Quanto tempo leva para estruturar um PGA ou PGR numa empresa já em funcionamento?',
      en: 'How long does it take to structure an EMP or PGR for an operating company?',
      zh: '已營運企業導入環境管理計畫 (PGA) 或廢棄物管理計畫 (PGR) 約需多久？',
    },
    answer: {
      pt: 'Dependendo da dimensão e complexidade das instalações, o levantamento técnico de campo, a caracterização de aspectos ambientais e a entrega do documento técnico completo decorrem normalmente entre 3 e 6 semanas, seguidos de formação à equipa interna e acompanhamento da implementação.',
      en: 'Depending on facility scale and operational complexity, field surveys, environmental aspect mapping, and delivery of the complete technical plan typically take 3 to 6 weeks, followed by staff training and implementation follow-up.',
      zh: '視廠區規模與製程複雜度而定，現場技術勘查、環境考量面盤點至完整報告交付通常需時 3 至 6 週，後續並提供內部人員培訓與追蹤輔導。',
    },
  },
];

export const SustainabilityFaq: React.FC = () => {
  const { lang, t } = useLanguage();
  const { openProposalModal } = useSite();
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('all');
  const [openId, setOpenId] = useState<string | null>(SUSTAINABILITY_FAQS[0].id);

  const categories: { id: FaqCategory; label: string }[] = [
    { id: 'all', label: t('Todas', 'All', '全部問題') },
    {
      id: 'licensing',
      label: t('Licenciamento & ESG', 'Permitting & ESG', '環境許可與 ESG'),
    },
    {
      id: 'waste',
      label: t('Gestão de Resíduos', 'Waste Management', '廢棄物管理'),
    },
    {
      id: 'monitoring',
      label: t('Monitorização & Auditorias', 'Monitoring & Audits', '監測與稽核'),
    },
  ];

  const filteredFaqs = useMemo(() => {
    if (activeCategory === 'all') return SUSTAINABILITY_FAQS;
    return SUSTAINABILITY_FAQS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (next: FaqCategory) => {
    setActiveCategory(next);
    const nextList =
      next === 'all'
        ? SUSTAINABILITY_FAQS
        : SUSTAINABILITY_FAQS.filter((item) => item.category === next);
    setOpenId(nextList[0]?.id ?? null);
  };

  return (
    <section
      id="faq-sustentabilidade"
      className="py-16 bg-white dark:bg-[#081410]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left column: Editorial intro, filter buttons, direct inquiry */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="space-y-3">
              <DynamicHeading
                as="h2"
                kicker={t('Esclarecimentos Técnicos', 'Technical Clarifications', '專業技術問答')}
                title={t(
                  'Perguntas Frequentes sobre Sustentabilidade',
                  'Sustainability Frequently Asked Questions',
                  '永續與環境管理常見問題'
                )}
                titleClassName="!text-2xl sm:!text-3xl"
              />
              <p className="text-sm sm:text-base text-[#29332F]/80 dark:text-[#C5DFD1] leading-relaxed">
                {t(
                  'Respostas objectivas sobre legislação ambiental em Angola, planos de gestão de resíduos, monitorização periódica e critérios ESG.',
                  'Clear answers on Angolan environmental regulations, waste management plans, periodic monitoring, and ESG readiness.',
                  '針對安哥拉環保法規、廢棄物管理計畫、定期監測與 ESG 導入提供明確解答。'
                )}
              </p>
            </div>

            <div
              role="group"
              aria-label={t('Filtrar perguntas por tema', 'Filter questions by topic', '依主題篩選常見問題')}
              className="flex flex-wrap gap-2"
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B6B4A] ${
                      isActive
                        ? 'bg-[#1B6B4A] text-white border-[#1B6B4A] dark:bg-[#8BC53F] dark:text-[#182C61] dark:border-[#8BC53F]'
                        : 'bg-white dark:bg-[#11261E] text-[#29332F]/80 dark:text-[#C5DFD1] border-neutral-200 dark:border-[#224738] hover:border-[#1B6B4A]/50 dark:hover:border-[#7FD1A8]/50'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-neutral-200 dark:border-[#224738] space-y-3">
              <p className="text-xs sm:text-sm text-[#29332F]/75 dark:text-[#A8CBB9]">
                {t(
                  'Precisa de enquadramento específico para a sua operação ou projecto?',
                  'Need specific regulatory guidance for your facility or project?',
                  '需要針對貴公司廠區或專案進行專屬法規評估？'
                )}
              </p>
              <button
                type="button"
                onClick={() =>
                  openProposalModal(
                    t('Consultoria e Sustentabilidade Ambiental', 'Environmental Sustainability Advisory', '環境永續顧問諮詢')
                  )
                }
                className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-[#182C61] hover:bg-[#1E377A] text-white dark:bg-[#1B6B4A] dark:hover:bg-[#1E7E54] transition-colors whitespace-nowrap"
              >
                {t('Falar com a Equipa Técnica', 'Speak with Our Technical Team', '聯繫技術顧問團隊')}
              </button>
            </div>
          </div>

          {/* Right column: Clean hairline-separated accordion */}
          <div className="lg:col-span-8 bg-white dark:bg-[#11261E] rounded-2xl border border-neutral-200 dark:border-[#224738] divide-y divide-neutral-200/80 dark:divide-[#224738]">
            {filteredFaqs.map((item, idx) => {
              const isOpen = openId === item.id;
              const panelId = `${item.id}-panel`;
              const buttonId = `${item.id}-button`;

              return (
                <div key={item.id}>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 hover:bg-[#F4F7F5]/60 dark:hover:bg-[#163127]/60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1B6B4A]"
                  >
                    <span className="flex items-baseline gap-3.5 pr-2">
                      <span className="font-mono text-xs font-semibold text-[#1B6B4A]/70 dark:text-[#7FD1A8]/80 tabular-nums shrink-0">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span className="font-display text-base font-bold text-[#1B6B4A] dark:text-[#ECF5F0] leading-snug">
                        {item.question[lang]}
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#1B6B4A] dark:text-[#7FD1A8] shrink-0 mt-0.5 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="px-6 pb-6 pl-[3.65rem] text-sm sm:text-[15px] text-[#29332F]/85 dark:text-[#C5DFD1] leading-relaxed"
                    >
                      {item.answer[lang]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
