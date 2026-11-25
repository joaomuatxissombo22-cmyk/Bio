import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  Sun,
  Moon,
  Languages,
  ChevronDown,
  Check,
} from 'lucide-react';
import { BIOSFERA_LOGO_GIF_URL, BIOSFERA_LOGO_URL } from '../data/defaults';
import { useSite } from '../context/SiteContext';
import { useTheme } from '../context/ThemeContext';
import { SiteLanguage, useLanguage } from '../context/LanguageContext';
import { NAV_LABELS } from '../i18n/translations';
import { ChristmasNotice } from './ChristmasNotice';
import { NotificationBar } from './NotificationBar';

const LANGUAGE_OPTIONS: {
  code: SiteLanguage;
  badge: string;
  label: string;
  sublabel: string;
}[] = [
  { code: 'pt', badge: 'PT', label: 'Português', sublabel: 'Angola' },
  { code: 'en', badge: 'EN', label: 'English', sublabel: 'International' },
  { code: 'zh', badge: '繁中', label: '繁體中文', sublabel: 'Traditional Chinese' },
];

export const Layout: React.FC<{
  children: React.ReactNode;
  quotaExceeded?: boolean;
}> = ({ children, quotaExceeded = false }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [christmasOpenSignal, setChristmasOpenSignal] = useState(0);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  const { settings, openProposalModal } = useSite();
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/acesso/');

  useEffect(() => {
    if (!langMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLangMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [langMenuOpen]);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  const activeLangOption =
    LANGUAGE_OPTIONS.find((opt) => opt.code === lang) ?? LANGUAGE_OPTIONS[0];

  const getNavLabel = (item: (typeof NAV_LABELS)[number]) =>
    lang === 'en' ? item.en : lang === 'zh' ? item.zh : item.pt;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#081410] text-[#29332F] dark:text-[#EAF4EE] transition-colors duration-200">
      {quotaExceeded && (
        <div className="bg-[#EEF3FA] dark:bg-[#182C61] border-b border-[#1D5E9C]/30 dark:border-[#7FD1A8]/25 text-[#182C61] dark:text-[#EAF4EE] px-4 py-2.5 text-xs md:text-sm text-center z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-[#182C61] dark:text-[#BCE87D] hover:text-[#1D5E9C]"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Always-On Screen Notification Bar: Christmas Greeting + Live National ANR/MINAMB News */}
      <NotificationBar onOpenChristmas={() => setChristmasOpenSignal((prev) => prev + 1)} />

      {/* Sticky 3-Zone Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0F211B]/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-[#224738]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 h-[90px] flex items-center justify-between gap-3 sm:gap-5">
          {/* Zone 1: Crisp Minimalist Dynamic Brand Mark */}
          <Link
            to="/"
            aria-label={t('BIOSFERA – Página Inicial', 'BIOSFERA – Home Page', 'BIOSFERA – 首頁')}
            className="flex items-center whitespace-nowrap shrink-0 px-2.5 sm:px-3 py-1 rounded-xl bg-white border border-neutral-200/90 shadow-xs dark:border-[#8BC53F]/65 focus-visible:outline-2 focus-visible:outline-[#1E7E54] transition-all hover:border-[#1E7E54]/50 dark:hover:border-[#BCE87D]"
          >
            <img
              src={BIOSFERA_LOGO_GIF_URL}
              onError={(e) => {
                e.currentTarget.src = BIOSFERA_LOGO_URL;
              }}
              alt="Logótipo BIOSFERA – Consultoria Ambiental"
              className="h-[60px] sm:h-[68px] w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
            />
          </Link>

          {/* Zone 2: Center Navigation */}
          <nav
            aria-label={t('Navegação Principal', 'Main Navigation', '主導覽列')}
            className="hidden xl:flex items-center gap-4 text-[13.5px] font-medium text-[#29332F]/85 dark:text-[#DCECE3]"
          >
            {NAV_LABELS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 ${
                    isActive
                      ? 'text-[#1B6B4A] dark:text-[#BCE87D] font-semibold border-[#1E7E54] dark:border-[#8BC53F]'
                      : 'border-transparent hover:text-[#1B6B4A] dark:hover:text-[#7FD1A8] hover:border-[#7FD1A8]'
                  }`
                }
              >
                {getNavLabel(item)}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Language Switcher (PT / EN / 繁體中文) + Theme Toggle + Primary CTA + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen((prev) => !prev)}
                aria-expanded={langMenuOpen}
                aria-haspopup="listbox"
                aria-label={t(
                  'Seleccionar idioma do site (PT, EN, 繁體中文)',
                  'Select site language (PT, EN, 繁體中文)',
                  '切換網站語言（PT / EN / 繁體中文）'
                )}
                title={t(
                  'Idioma: Português / English / 繁體中文',
                  'Language: Português / English / 繁體中文',
                  '語言：Português / English / 繁體中文'
                )}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg border border-neutral-200 dark:border-[#2B5946] bg-[#F4F7F5] dark:bg-[#163127] text-[#182C61] dark:text-[#BCE87D] hover:border-[#1E7E54] dark:hover:border-[#8BC53F] transition-colors min-h-[42px] whitespace-nowrap shrink-0"
              >
                <Languages className="w-4 h-4 shrink-0 text-[#1B6B4A] dark:text-[#7FD1A8]" aria-hidden="true" />
                <span className="font-mono text-xs font-bold tracking-wide">
                  {activeLangOption.badge}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#29332F]/60 dark:text-[#A8CBB9] transition-transform duration-150 ${
                    langMenuOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {langMenuOpen && (
                <div
                  role="listbox"
                  aria-label={t('Opções de idioma', 'Language options', '語言選項')}
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-[#11261E] border border-neutral-200 dark:border-[#2B5946] shadow-xl py-1.5 z-50"
                >
                  {LANGUAGE_OPTIONS.map((option) => {
                    const selected = lang === option.code;
                    return (
                      <button
                        key={option.code}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => {
                          setLang(option.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 flex items-center justify-between gap-2 text-left transition-colors ${
                          selected
                            ? 'bg-[#F4F7F5] dark:bg-[#163127] text-[#1B6B4A] dark:text-[#BCE87D]'
                            : 'text-[#29332F] dark:text-[#DCECE3] hover:bg-[#F4F7F5]/70 dark:hover:bg-[#163127]/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="inline-flex items-center justify-center w-8 h-6 rounded border border-neutral-200 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] font-mono text-[11px] font-bold text-[#182C61] dark:text-[#BCE87D] shrink-0">
                            {option.badge}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">{option.label}</p>
                            <p className="text-[11px] text-[#29332F]/60 dark:text-[#A8CBB9] truncate">
                              {option.sublabel}
                            </p>
                          </div>
                        </div>
                        {selected && (
                          <Check className="w-4 h-4 text-[#1E7E54] dark:text-[#8BC53F] shrink-0" aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                isDark
                  ? t('Mudar para modo claro', 'Switch to light mode', '切換至淺色模式')
                  : t('Mudar para modo escuro', 'Switch to dark mode', '切換至深色模式')
              }
              aria-pressed={isDark}
              title={
                isDark
                  ? t('Modo Claro', 'Light Mode', '淺色模式')
                  : t('Modo Escuro Sustentável', 'Sustainable Dark Mode', '永續深色模式')
              }
              className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg border border-neutral-200 dark:border-[#2B5946] bg-[#F4F7F5] dark:bg-[#163127] text-[#1B6B4A] dark:text-[#BCE87D] hover:border-[#1E7E54] dark:hover:border-[#8BC53F] transition-colors min-h-[42px] min-w-[42px] whitespace-nowrap shrink-0"
            >
              {isDark ? (
                <Sun className="w-4 h-4 shrink-0" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
              <span className="hidden md:inline text-xs font-semibold whitespace-nowrap">
                {isDark
                  ? t('Claro', 'Light', '淺色')
                  : t('Escuro', 'Dark', '深色')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => openProposalModal()}
              className="hidden sm:inline-flex items-center justify-center px-4 lg:px-5 py-2.5 text-sm font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B6B4A]"
            >
              {t('Solicitar Proposta', 'Request Proposal', '索取技術方案')}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={
                mobileOpen
                  ? t('Fechar menu', 'Close menu', '關閉選單')
                  : t('Abrir menu', 'Open menu', '開啟選單')
              }
              aria-expanded={mobileOpen}
              className="xl:hidden p-2.5 rounded-lg border border-neutral-200 dark:border-[#2B5946] text-[#29332F] dark:text-[#EAF4EE] hover:bg-[#F4F7F5] dark:hover:bg-[#163127] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Navigation Drawer */}
        {mobileOpen && (
          <div className="xl:hidden border-t border-neutral-200 dark:border-[#224738] bg-white dark:bg-[#0F211B] px-4 py-4">
            <nav className="flex flex-col gap-1" aria-label={t('Menu Móvel', 'Mobile Menu', '行動版選單')}>
              {NAV_LABELS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                      isActive
                        ? 'bg-[#F4F7F5] dark:bg-[#163127] text-[#1B6B4A] dark:text-[#BCE87D] font-semibold'
                        : 'text-[#29332F] dark:text-[#DCECE3] hover:bg-[#F4F7F5] dark:hover:bg-[#163127]'
                    }`
                  }
                >
                  {getNavLabel(item)}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openProposalModal();
                }}
                className="mt-3 w-full px-5 py-3 text-sm font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] rounded-lg transition-colors min-h-[44px]"
              >
                {t('Solicitar Proposta', 'Request Proposal', '索取技術方案')}
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Institutional Footer */}
      <footer className="bg-[#1B6B4A] dark:bg-[#06100D] dark:border-t dark:border-[#224738] text-white mt-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/15">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="bg-white rounded-xl px-2.5 py-1.5 border border-white/80 dark:border-[#8BC53F]/65 inline-flex items-center justify-center shadow-xs">
                  <img
                    src={BIOSFERA_LOGO_GIF_URL}
                    onError={(e) => {
                      e.currentTarget.src = BIOSFERA_LOGO_URL;
                    }}
                    alt="BIOSFERA – Consultoria Ambiental, Lda."
                    className="h-14 w-auto object-contain"
                  />
                </div>
                <div>
                  <p className="font-display font-bold text-base tracking-tight text-white">
                    BIOSFERA
                  </p>
                  <p className="text-xs text-[#7FD1A8]">
                    {t('Consultoria Ambiental, Lda.', 'Environmental Consultancy, Ltd.', '環境顧問有限公司')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-white/85 leading-relaxed max-w-sm">
                {t(
                  'Empresa angolana especializada em consultoria ambiental, estudos de impacte, licenciamento, auditorias, gestão de resíduos e monitorização em todo o território nacional.',
                  'Angolan consultancy specializing in environmental impact assessments, permitting, audits, waste management, and environmental monitoring across the country.'
                )}
              </p>
              <button
                type="button"
                onClick={() => openProposalModal()}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#8BC53F] text-[#182C61] hover:bg-[#9FD354] rounded-lg transition-colors"
              >
                <span>{t('Solicitar Proposta Técnica', 'Request Technical Proposal')}</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Institutional Links */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xs font-semibold tracking-wider text-[#BCE87D] uppercase">
                {t('Institucional', 'Institutional')}
              </h3>
              <ul className="space-y-2.5 text-sm text-white/85">
                <li>
                  <Link to="/quem-somos" className="hover:text-white transition-colors">
                    {t('Quem Somos', 'About Us')}
                  </Link>
                </li>
                <li>
                  <Link to="/sustentabilidade" className="hover:text-white transition-colors">
                    {t('Sustentabilidade', 'Sustainability')}
                  </Link>
                </li>
                <li>
                  <Link to="/projectos" className="hover:text-white transition-colors">
                    {t('Projectos e Portfólio', 'Projects & Portfolio')}
                  </Link>
                </li>
                <li>
                  <Link to="/galeria" className="hover:text-white transition-colors">
                    {t('Galeria Técnica', 'Technical Gallery')}
                  </Link>
                </li>
                <li>
                  <Link to="/noticias" className="hover:text-white transition-colors">
                    {t('Notícias e Publicações', 'News & Publications')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services Links */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="text-xs font-semibold tracking-wider text-[#BCE87D] uppercase">
                {t('Áreas de Actuação', 'Practice Areas')}
              </h3>
              <ul className="space-y-2.5 text-sm text-white/85">
                <li>
                  <Link to="/servicos#eia" className="hover:text-white transition-colors">
                    {t('Estudos de Impacte Ambiental (EIA)', 'Environmental Impact Assessments (EIA)')}
                  </Link>
                </li>
                <li>
                  <Link to="/servicos#licenciamento" className="hover:text-white transition-colors">
                    {t('Licenciamento Ambiental', 'Environmental Permitting')}
                  </Link>
                </li>
                <li>
                  <Link to="/servicos#auditorias" className="hover:text-white transition-colors">
                    {t('Auditorias e Monitorização (RMA)', 'Audits & Monitoring (EMR)')}
                  </Link>
                </li>
                <li>
                  <Link to="/servicos#pgr" className="hover:text-white transition-colors">
                    {t('Planos de Gestão de Resíduos (PGR)', 'Waste Management Plans (WMP)')}
                  </Link>
                </li>
                <li>
                  <Link to="/servicos#phst" className="hover:text-white transition-colors">
                    {t('Higiene, Saúde e Segurança (PHST)', 'Occupational Health & Safety (OHSP)')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacts */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="text-xs font-semibold tracking-wider text-[#BCE87D] uppercase">
                {t('Contactos Oficiais', 'Official Contacts')}
              </h3>
              <ul className="space-y-3 text-sm text-white/90">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#7FD1A8] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="leading-snug">{settings.address}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#7FD1A8] shrink-0" aria-hidden="true" />
                  <div className="flex flex-col font-mono text-xs tabular-nums">
                    <a href={`tel:${settings.phonePrimary.replace(/\s+/g, '')}`} className="hover:text-white">
                      {settings.phonePrimary}
                    </a>
                    {settings.phoneSecondary && (
                      <a href={`tel:${settings.phoneSecondary.replace(/\s+/g, '')}`} className="hover:text-white mt-0.5">
                        {settings.phoneSecondary}
                      </a>
                    )}
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#7FD1A8] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex flex-col text-xs space-y-1">
                    <a href={`mailto:${settings.generalEmail}`} className="hover:text-white break-all">
                      {settings.generalEmail}
                    </a>
                    <a href={`mailto:${settings.recruitmentEmail}`} className="hover:text-white/85 break-all">
                      {settings.recruitmentEmail}
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
            <p>
              © {new Date().getFullYear()} BIOSFERA – Consultoria Ambiental, Lda.{' '}
              {t('Todos os direitos reservados. Luanda, Angola.', 'All rights reserved. Luanda, Angola.')}
            </p>
            <div className="flex items-center gap-6">
              <Link to="/contactos" className="hover:text-white transition-colors">
                {t('Solicitar Consultoria', 'Request Consultancy')}
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <ChristmasNotice openSignal={christmasOpenSignal} />
    </div>
  );
};
