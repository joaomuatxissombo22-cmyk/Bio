import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  Compass,
  Newspaper,
  Search,
  Wrench,
  X,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import {
  localizeCategory,
  localizeNewsArticle,
  localizeService,
} from '../i18n/translations';

type SearchScope = 'all' | 'service' | 'article' | 'project' | 'page';

interface SearchEntry {
  id: string;
  type: Exclude<SearchScope, 'all'>;
  title: string;
  subtitle: string;
  meta: string;
  to: string;
  searchText: string;
}

interface PortalSearchModalProps {
  open: boolean;
  onClose: () => void;
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function highlightMatch(text: string, query: string): React.ReactNode {
  const cleanQuery = query.trim();
  if (!cleanQuery || cleanQuery.length < 2) return text;

  const normText = normalizeText(text);
  const normQuery = normalizeText(cleanQuery);
  const matchIdx = normText.indexOf(normQuery);
  if (matchIdx === -1) return text;

  const endIdx = matchIdx + normQuery.length;
  return (
    <>
      {text.slice(0, matchIdx)}
      <mark className="bg-[#BCE87D]/55 dark:bg-[#8BC53F]/35 text-inherit rounded-xs px-0.5">
        {text.slice(matchIdx, endIdx)}
      </mark>
      {text.slice(endIdx)}
    </>
  );
}

export const PortalSearchModal: React.FC<PortalSearchModalProps> = ({
  open,
  onClose,
}) => {
  const { services: rawServices, news: rawNews, projects, openProposalModal } = useSite();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<SearchScope>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Build unified localized local search index
  const entries = useMemo<SearchEntry[]>(() => {
    const serviceEntries: SearchEntry[] = rawServices.map((raw) => {
      const srv = localizeService(raw, lang);
      const combined = [
        srv.title,
        srv.code,
        srv.slug,
        srv.shortDescription,
        srv.fullDescription,
        ...(srv.objectives ?? []),
        ...(srv.benefits ?? []),
        ...(srv.methodology ?? []),
      ].join(' ');

      return {
        id: `srv-${srv.id}`,
        type: 'service',
        title: srv.title,
        subtitle: srv.shortDescription,
        meta: `${t('Serviço', 'Service', '服務')} · ${t('Área', 'Area', '領域')} ${srv.code}`,
        to: `/servicos#${srv.slug}`,
        searchText: normalizeText(combined),
      };
    });

    const articleEntries: SearchEntry[] = rawNews.map((raw) => {
      const art = localizeNewsArticle(raw, lang);
      const combined = [
        art.title,
        art.category,
        art.summary,
        art.content,
        art.publishedDate,
      ].join(' ');

      return {
        id: `art-${art.id}`,
        type: 'article',
        title: art.title,
        subtitle: art.summary,
        meta: `${t('Artigo & Notícia', 'News & Article', '新聞與文章')} · ${art.category} · ${art.publishedDate}`,
        to: `/noticias?artigo=${encodeURIComponent(art.id)}`,
        searchText: normalizeText(combined),
      };
    });

    const projectEntries: SearchEntry[] = projects
      .filter((p) => p.confirmed !== false)
      .map((proj) => {
        const cat = localizeCategory(proj.category, lang);
        const combined = [
          proj.title,
          proj.client,
          proj.location,
          proj.sector,
          cat,
          proj.description,
          ...(proj.servicesProvided ?? []),
          proj.results,
        ].join(' ');

        return {
          id: `proj-${proj.id}`,
          type: 'project',
          title: proj.title,
          subtitle: proj.description,
          meta: `${t('Projecto', 'Project', '專案')} · ${cat} · ${proj.location}`,
          to: '/projectos',
          searchText: normalizeText(combined),
        };
      });

    const pageEntries: SearchEntry[] = [
      {
        id: 'page-sustentabilidade',
        type: 'page',
        title: t(
          'Sustentabilidade, Métricas Ambientais e FAQ',
          'Sustainability, Environmental Metrics & FAQ',
          '永續發展、環境指標與常見問題'
        ),
        subtitle: t(
          'Gráfico trimestral de gestão de resíduos, pilares ecológicos, boas práticas e perguntas frequentes.',
          'Quarterly waste management chart, ecological pillars, best practices, and sustainability FAQ.',
          '季度廢棄物管理圖表、永續支柱、最佳實務與常見問答。'
        ),
        meta: `${t('Secção do Portal', 'Portal Section', '網站頁面')} · /sustentabilidade`,
        to: '/sustentabilidade',
        searchText: normalizeText(
          'sustentabilidade metricas graficos residuos recharts faq perguntas frequentes economia circular esg boas praticas'
        ),
      },
      {
        id: 'page-quem-somos',
        type: 'page',
        title: t(
          'Quem Somos — História e Equipa BIOSFERA',
          'About Us — BIOSFERA History & Team',
          '關於我們 — BIOSFERA 歷程與團隊'
        ),
        subtitle: t(
          'Mais de 10 anos de consultoria ambiental em Angola, missão, visão, valores e linha do tempo.',
          'Over 10 years of environmental consultancy in Angola, mission, vision, values, and timeline.',
          '深耕安哥拉逾十年的環境顧問歷程、使命、願景與團隊。'
        ),
        meta: `${t('Secção do Portal', 'Portal Section', '網站頁面')} · /quem-somos`,
        to: '/quem-somos',
        searchText: normalizeText(
          'quem somos historia missao visao valores equipa biosfera angola luanda kilamba'
        ),
      },
      {
        id: 'page-galeria',
        type: 'page',
        title: t(
          'Galeria Técnica e Registos de Campo',
          'Technical Gallery & Field Records',
          '技術相簿與現場紀實'
        ),
        subtitle: t(
          'Fotografias reais de campanhas de monitorização, recolha de amostras, auditorias e visitas técnicas.',
          'Authentic field photos of monitoring campaigns, sampling, audits, and technical site visits.',
          '環境監測採樣、工業稽核與實地勘查紀實影像。'
        ),
        meta: `${t('Secção do Portal', 'Portal Section', '網站頁面')} · /galeria`,
        to: '/galeria',
        searchText: normalizeText(
          'galeria fotos fotografias campo amostras monitorizacao auditorias drone'
        ),
      },
      {
        id: 'page-contactos',
        type: 'page',
        title: t(
          'Contactos, Localização e Pedido de Proposta',
          'Contacts, Location & Proposal Request',
          '聯絡我們、據點位置與方案洽詢'
        ),
        subtitle: t(
          'Sede na Centralidade do Kilamba, Luanda, telefones directos, e-mails institucionais e mapa.',
          'Kilamba headquarters in Luanda, direct phone lines, institutional emails, and interactive map.',
          '羅安達基蘭巴總部地址、專線電話、電子郵件與互動地圖。'
        ),
        meta: `${t('Secção do Portal', 'Portal Section', '網站頁面')} · /contactos`,
        to: '/contactos',
        searchText: normalizeText(
          'contactos telefone email endereco mapa kilamba luanda proposta orcamento recrutamento'
        ),
      },
    ];

    return [...serviceEntries, ...articleEntries, ...projectEntries, ...pageEntries];
  }, [rawServices, rawNews, projects, lang, t]);

  // Dynamic filtering with multi-token scoring
  const results = useMemo(() => {
    const tokens = normalizeText(query)
      .split(/\s+/)
      .filter((token) => token.length > 0);

    const scoped =
      scope === 'all' ? entries : entries.filter((entry) => entry.type === scope);

    if (tokens.length === 0) {
      return scoped.slice(0, 8);
    }

    const scored = scoped
      .map((entry) => {
        const allMatch = tokens.every((tk) => entry.searchText.includes(tk));
        if (!allMatch) return null;

        const normTitle = normalizeText(entry.title);
        let score = 0;
        for (const tk of tokens) {
          if (normTitle.startsWith(tk)) score += 6;
          else if (normTitle.includes(tk)) score += 4;
          else score += 1;
        }
        if (entry.type === 'service') score += 1.5;
        if (entry.type === 'article') score += 1.2;

        return { entry, score };
      })
      .filter((item): item is { entry: SearchEntry; score: number } => item !== null)
      .sort((a, b) => b.score - a.score);

    return scored.map((item) => item.entry);
  }, [entries, query, scope]);

  // Live per-type match counts for current query
  const counts = useMemo(() => {
    const tokens = normalizeText(query)
      .split(/\s+/)
      .filter((token) => token.length > 0);

    const matched =
      tokens.length === 0
        ? entries
        : entries.filter((entry) =>
            tokens.every((tk) => entry.searchText.includes(tk))
          );

    return {
      all: matched.length,
      service: matched.filter((e) => e.type === 'service').length,
      article: matched.filter((e) => e.type === 'article').length,
      project: matched.filter((e) => e.type === 'project').length,
    };
  }, [entries, query]);

  // Reset focus and lock scroll when opened
  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 30);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, scope]);

  const handleSelect = (entry: SearchEntry) => {
    onClose();
    setQuery('');
    navigate(entry.to);
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (results.length === 0) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (event.key === 'Enter' && results[activeIndex]) {
        event.preventDefault();
        handleSelect(results[activeIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, results, activeIndex]);

  if (!open) return null;

  const quickSuggestions = [
    t('EIA', 'EIA', '環評'),
    t('Licenciamento', 'Permitting', '環境許可'),
    t('Resíduos', 'Waste', '廢棄物'),
    t('Decreto 117/20', 'Decree 117/20', '117/20'),
    t('Monitorização', 'Monitoring', '監測'),
    t('Auditoria', 'Audit', '稽核'),
  ];

  const getTypeIcon = (type: SearchEntry['type']) => {
    switch (type) {
      case 'service':
        return Wrench;
      case 'article':
        return Newspaper;
      case 'project':
        return Briefcase;
      default:
        return Compass;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('Pesquisa no Portal BIOSFERA', 'Search BIOSFERA Portal', '搜尋 BIOSFERA 網站')}
      className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:pt-16 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#11261E] border border-neutral-200 dark:border-[#2B5946] shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-neutral-200 dark:border-[#224738] flex items-center gap-3">
          <Search
            className="w-5 h-5 text-[#1B6B4A] dark:text-[#7FD1A8] shrink-0"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              'Pesquisar serviços, notícias, artigos técnicos ou legislação...',
              'Search services, news, technical articles, or legislation...',
              '搜尋專業服務、新聞動態、技術文章或環保法規...'
            )}
            aria-label={t(
              'Termo de pesquisa no portal',
              'Portal search query',
              '網站搜尋關鍵字'
            )}
            className="flex-1 bg-transparent text-sm sm:text-base text-[#29332F] dark:text-[#ECF5F0] placeholder:text-[#29332F]/50 dark:placeholder:text-[#9FC3B2]/70 focus:outline-none min-w-0"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label={t('Limpar pesquisa', 'Clear search', '清除搜尋')}
              className="px-2 py-1 text-xs font-medium text-[#29332F]/70 dark:text-[#A8CBB9] hover:text-[#1B6B4A] dark:hover:text-white rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              {t('Limpar', 'Clear', '清除')}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label={t('Fechar pesquisa', 'Close search', '關閉搜尋')}
            className="w-9 h-9 rounded-lg border border-neutral-200 dark:border-[#2B5946] flex items-center justify-center text-[#29332F]/80 dark:text-[#C5DFD1] hover:bg-[#F4F7F5] dark:hover:bg-[#163127] transition-colors shrink-0"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Interactive Category Tabs */}
        <div className="px-4 sm:px-5 py-2.5 bg-[#F4F7F5] dark:bg-[#0D1E18] border-b border-neutral-200 dark:border-[#224738] overflow-x-auto">
          <div
            role="tablist"
            aria-label={t('Filtrar resultados por tipo', 'Filter results by type', '依類別篩選搜尋結果')}
            className="flex items-center gap-1.5 min-w-max"
          >
            {(
              [
                { id: 'all', label: t('Tudo', 'All', '全部'), count: counts.all },
                { id: 'service', label: t('Serviços', 'Services', '服務'), count: counts.service },
                {
                  id: 'article',
                  label: t('Notícias e Artigos', 'News & Articles', '新聞與文章'),
                  count: counts.article,
                },
                { id: 'project', label: t('Projectos', 'Projects', '專案'), count: counts.project },
              ] as const
            ).map((tab) => {
              const active = scope === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setScope(tab.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                    active
                      ? 'bg-[#1B6B4A] text-white dark:bg-[#8BC53F] dark:text-[#182C61]'
                      : 'bg-white dark:bg-[#11261E] text-[#29332F]/80 dark:text-[#C5DFD1] border border-neutral-200/90 dark:border-[#224738] hover:border-[#1B6B4A]/50'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Suggested Queries (when empty) */}
        {query.trim().length === 0 && (
          <div className="px-4 sm:px-5 py-3 border-b border-neutral-200/80 dark:border-[#224738] flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#29332F]/65 dark:text-[#9FC3B2] mr-1">
              {t('Sugestões:', 'Suggestions:', '熱門搜尋：')}
            </span>
            {quickSuggestions.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQuery(term);
                  inputRef.current?.focus();
                }}
                className="px-2.5 py-1 text-xs font-medium rounded-md border border-neutral-200 dark:border-[#2B5946] bg-[#F4F7F5] dark:bg-[#163127] text-[#1B6B4A] dark:text-[#BCE87D] hover:border-[#1B6B4A] dark:hover:border-[#8BC53F] transition-colors whitespace-nowrap"
              >
                {term}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Results List */}
        <div
          className="flex-1 overflow-y-auto divide-y divide-neutral-200/70 dark:divide-[#224738]"
          aria-live="polite"
        >
          {results.length > 0 ? (
            results.map((item, idx) => {
              const Icon = getTypeIcon(item.type);
              const isSelected = idx === activeIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left px-4 sm:px-5 py-3.5 flex items-start gap-3.5 transition-colors ${
                    isSelected
                      ? 'bg-[#F4F7F5] dark:bg-[#163127]'
                      : 'hover:bg-[#F4F7F5]/65 dark:hover:bg-[#163127]/65'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-[#F4F7F5] dark:bg-[#0D1E18] border border-neutral-200/80 dark:border-[#224738] text-[#1B6B4A] dark:text-[#7FD1A8] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-[#1E7E54] dark:text-[#BCE87D] truncate">
                      {item.meta}
                    </p>
                    <p className="font-display text-sm sm:text-[15px] font-bold text-[#1B6B4A] dark:text-[#ECF5F0] mt-0.5 leading-snug">
                      {highlightMatch(item.title, query)}
                    </p>
                    <p className="text-xs sm:text-[13px] text-[#29332F]/75 dark:text-[#C5DFD1] mt-1 line-clamp-2 leading-relaxed">
                      {highlightMatch(item.subtitle, query)}
                    </p>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 mt-3 transition-transform ${
                      isSelected
                        ? 'text-[#1B6B4A] dark:text-[#8BC53F] translate-x-0.5'
                        : 'text-[#29332F]/35 dark:text-[#6B9784]'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })
          ) : (
            <div className="px-6 py-12 text-center space-y-3">
              <p className="font-display text-base font-bold text-[#1B6B4A] dark:text-[#ECF5F0]">
                {t(
                  `Sem resultados para “${query.trim()}”`,
                  `No results found for “${query.trim()}”`,
                  `找不到與「${query.trim()}」相符的結果`
                )}
              </p>
              <p className="text-xs sm:text-sm text-[#29332F]/75 dark:text-[#A8CBB9] max-w-md mx-auto">
                {t(
                  'Tente outro termo (ex.: EIA, Licenciamento, Resíduos, Auditoria) ou fale directamente com a nossa equipa técnica.',
                  'Try another keyword (e.g., EIA, Permitting, Waste, Audit) or speak directly with our technical team.',
                  '請嘗試其他關鍵字（如環評、環境許可、廢棄物、稽核），或直接聯繫我們的技術團隊。'
                )}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setScope('all');
                    inputRef.current?.focus();
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-[#2B5946] text-[#29332F] dark:text-[#ECF5F0] hover:bg-[#F4F7F5] dark:hover:bg-[#163127] transition-colors"
                >
                  {t('Limpar Pesquisa', 'Reset Search', '重設搜尋')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openProposalModal();
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1B6B4A] text-white hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] transition-colors"
                >
                  {t('Solicitar Proposta Técnica', 'Request Technical Proposal', '索取技術方案')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Keyboard Hints Footer */}
        <div className="px-4 sm:px-5 py-2.5 bg-[#F4F7F5] dark:bg-[#0D1E18] border-t border-neutral-200 dark:border-[#224738] flex items-center justify-between gap-3 text-[11px] text-[#29332F]/65 dark:text-[#9FC3B2]">
          <span className="tabular-nums">
            {query.trim()
              ? t(
                  `${results.length} resultado(s) encontrado(s)`,
                  `${results.length} result(s) found`,
                  `找到 ${results.length} 筆結果`
                )
              : t(
                  'Destaques do portal · Comece a escrever para filtrar',
                  'Portal highlights · Start typing to filter',
                  '精選內容 · 輸入關鍵字即時篩選'
                )}
          </span>
          <span className="hidden sm:inline font-mono">
            {t('↑↓ Navegar · Enter Abrir · Esc Fechar', '↑↓ Navigate · Enter Open · Esc Close', '↑↓ 選擇 · Enter 開啟 · Esc 關閉')}
          </span>
        </div>
      </div>
    </div>
  );
};
