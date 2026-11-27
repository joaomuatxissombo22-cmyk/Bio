import React, { useEffect, useRef, useState } from 'react';
import {
  Accessibility,
  Contrast,
  Link2,
  Minus,
  Plus,
  RotateCcw,
  Type,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const STORAGE_KEY = 'biosfera_a11y_v1';
const FONT_SCALE_STEPS = [90, 100, 112.5, 125, 137.5] as const;
type FontScale = (typeof FONT_SCALE_STEPS)[number];

interface AccessibilityPrefs {
  fontScale: FontScale;
  highContrast: boolean;
  underlineLinks: boolean;
}

const DEFAULT_PREFS: AccessibilityPrefs = {
  fontScale: 100,
  highContrast: false,
  underlineLinks: false,
};

function readStoredPrefs(): AccessibilityPrefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<AccessibilityPrefs>;
    const validScale = FONT_SCALE_STEPS.includes(parsed.fontScale as FontScale)
      ? (parsed.fontScale as FontScale)
      : 100;
    return {
      fontScale: validScale,
      highContrast: Boolean(parsed.highContrast),
      underlineLinks: Boolean(parsed.underlineLinks),
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export const AccessibilityMenu: React.FC = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<AccessibilityPrefs>(readStoredPrefs);
  const [announcement, setAnnouncement] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Sync preferences to <html> and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (prefs.fontScale === 100) {
      root.style.removeProperty('font-size');
    } else {
      root.style.fontSize = `${prefs.fontScale}%`;
    }
    root.classList.toggle('high-contrast', prefs.highContrast);
    root.classList.toggle('a11y-underline-links', prefs.underlineLinks);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage restrictions
    }
  }, [prefs]);

  // Close on Escape or click outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const currentStepIdx = FONT_SCALE_STEPS.indexOf(prefs.fontScale);
  const canDecrease = currentStepIdx > 0;
  const canIncrease = currentStepIdx < FONT_SCALE_STEPS.length - 1;
  const hasCustomPrefs =
    prefs.fontScale !== 100 || prefs.highContrast || prefs.underlineLinks;

  const announce = (msg: string) => {
    setAnnouncement('');
    window.setTimeout(() => setAnnouncement(msg), 20);
  };

  const handleDecreaseFont = () => {
    if (!canDecrease) return;
    const next = FONT_SCALE_STEPS[currentStepIdx - 1];
    setPrefs((prev) => ({ ...prev, fontScale: next }));
    announce(
      t(
        `Tamanho do texto ajustado para ${Math.round(next)}%`,
        `Text size set to ${Math.round(next)}%`,
        `文字大小已調整為 ${Math.round(next)}%`
      )
    );
  };

  const handleIncreaseFont = () => {
    if (!canIncrease) return;
    const next = FONT_SCALE_STEPS[currentStepIdx + 1];
    setPrefs((prev) => ({ ...prev, fontScale: next }));
    announce(
      t(
        `Tamanho do texto ajustado para ${Math.round(next)}%`,
        `Text size set to ${Math.round(next)}%`,
        `文字大小已調整為 ${Math.round(next)}%`
      )
    );
  };

  const handleSetFontScale = (scale: FontScale) => {
    setPrefs((prev) => ({ ...prev, fontScale: scale }));
    announce(
      t(
        `Tamanho do texto ajustado para ${Math.round(scale)}%`,
        `Text size set to ${Math.round(scale)}%`,
        `文字大小已調整為 ${Math.round(scale)}%`
      )
    );
  };

  const handleToggleContrast = () => {
    setPrefs((prev) => {
      const next = !prev.highContrast;
      announce(
        next
          ? t('Modo de alto contraste activado', 'High contrast mode enabled', '已啟用高對比模式')
          : t('Modo de alto contraste desactivado', 'High contrast mode disabled', '已關閉高對比模式')
      );
      return { ...prev, highContrast: next };
    });
  };

  const handleToggleUnderline = () => {
    setPrefs((prev) => {
      const next = !prev.underlineLinks;
      announce(
        next
          ? t('Sublinhado de ligações activado', 'Link underlining enabled', '已啟用連結底線')
          : t('Sublinhado de ligações desactivado', 'Link underlining disabled', '已關閉連結底線')
      );
      return { ...prev, underlineLinks: next };
    });
  };

  const handleReset = () => {
    setPrefs(DEFAULT_PREFS);
    announce(
      t(
        'Definições de acessibilidade restauradas',
        'Accessibility settings reset to defaults',
        '已重設無障礙設定'
      )
    );
  };

  return (
    <div
      ref={containerRef}
      className="a11y-widget fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col items-start"
    >
      {/* Screen reader live region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Expandable Floating Accessibility Panel */}
      {open && (
        <div
          id="biosfera-accessibility-panel"
          role="dialog"
          aria-modal="false"
          aria-label={t('Opções de Acessibilidade', 'Accessibility Options', '無障礙閱讀設定')}
          className="mb-3 w-[min(calc(100vw-2rem),320px)] rounded-2xl bg-white dark:bg-[#11261E] border border-neutral-200 dark:border-[#2B5946] shadow-2xl overflow-hidden text-[#29332F] dark:text-[#ECF5F0]"
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-neutral-200/90 dark:border-[#224738] flex items-center justify-between gap-3 bg-[#F4F7F5] dark:bg-[#0D1E18]">
            <div className="flex items-center gap-2.5 min-w-0">
              <Accessibility
                className="w-5 h-5 text-[#1B6B4A] dark:text-[#8BC53F] shrink-0"
                aria-hidden="true"
              />
              <h2 className="font-display text-sm font-bold text-[#1B6B4A] dark:text-[#ECF5F0] truncate">
                {t('Acessibilidade Visual', 'Visual Accessibility', '視覺無障礙設定')}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label={t('Fechar menu de acessibilidade', 'Close accessibility menu', '關閉無障礙選單')}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#29332F]/75 dark:text-[#C5DFD1] hover:bg-neutral-200/70 dark:hover:bg-[#163127] transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B6B4A]"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Controls */}
          <div className="p-4 space-y-4">
            {/* 1. Text Size Controls */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#1B6B4A] dark:text-[#7FD1A8]">
                  <Type className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{t('Tamanho do Texto', 'Text Size', '文字大小')}</span>
                </span>
                <span className="font-mono text-xs font-bold tabular-nums text-[#29332F] dark:text-[#ECF5F0]">
                  {Math.round(prefs.fontScale)}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleDecreaseFont}
                  disabled={!canDecrease}
                  aria-label={t('Diminuir tamanho do texto', 'Decrease text size', '縮小文字')}
                  className="min-h-[42px] px-3 py-2 rounded-lg border border-neutral-200 dark:border-[#2B5946] bg-[#F4F7F5] dark:bg-[#163127] hover:border-[#1B6B4A] dark:hover:border-[#8BC53F] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B6B4A]"
                >
                  <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>A-</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSetFontScale(100)}
                  aria-pressed={prefs.fontScale === 100}
                  className={`min-h-[42px] px-2 py-2 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B6B4A] ${
                    prefs.fontScale === 100
                      ? 'bg-[#1B6B4A] text-white border-[#1B6B4A] dark:bg-[#8BC53F] dark:text-[#182C61] dark:border-[#8BC53F]'
                      : 'border-neutral-200 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] hover:border-[#1B6B4A]'
                  }`}
                >
                  {t('Normal', 'Default', '標準')}
                </button>
                <button
                  type="button"
                  onClick={handleIncreaseFont}
                  disabled={!canIncrease}
                  aria-label={t('Aumentar tamanho do texto', 'Increase text size', '放大文字')}
                  className="min-h-[42px] px-3 py-2 rounded-lg border border-neutral-200 dark:border-[#2B5946] bg-[#F4F7F5] dark:bg-[#163127] hover:border-[#1B6B4A] dark:hover:border-[#8BC53F] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B6B4A]"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>A+</span>
                </button>
              </div>

              {/* Direct size presets for quick one-tap selection */}
              <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                {(
                  [
                    { scale: 100, label: t('Padrão', '100%', '100%') },
                    { scale: 112.5, label: t('Grande', 'Large', '較大') },
                    { scale: 125, label: t('Extra', 'Extra', '特大') },
                  ] as const
                ).map((preset) => {
                  const active = prefs.fontScale === preset.scale;
                  return (
                    <button
                      key={preset.scale}
                      type="button"
                      onClick={() => handleSetFontScale(preset.scale)}
                      aria-pressed={active}
                      className={`py-1.5 px-2 rounded-md text-[11px] font-semibold border transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B6B4A] ${
                        active
                          ? 'border-[#1B6B4A] bg-[#1B6B4A]/10 text-[#1B6B4A] dark:border-[#8BC53F] dark:bg-[#8BC53F]/15 dark:text-[#BCE87D]'
                          : 'border-neutral-200/80 dark:border-[#224738] text-[#29332F]/75 dark:text-[#A8CBB9] hover:border-[#1B6B4A]/50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-neutral-200/80 dark:border-[#224738]" />

            {/* 2. High Contrast Toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={prefs.highContrast}
              onClick={handleToggleContrast}
              className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border flex items-center justify-between gap-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B6B4A] ${
                prefs.highContrast
                  ? 'bg-[#182C61] text-white border-[#182C61] dark:bg-[#8BC53F] dark:text-[#182C61] dark:border-[#8BC53F]'
                  : 'bg-[#F4F7F5] dark:bg-[#163127] border-neutral-200 dark:border-[#2B5946] hover:border-[#1B6B4A] dark:hover:border-[#8BC53F]'
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Contrast className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="text-xs font-semibold">
                  {t('Alto Contraste', 'High Contrast', '高對比模式')}
                </span>
              </span>
              <span className="font-mono text-[11px] font-bold uppercase shrink-0">
                {prefs.highContrast
                  ? t('Activo', 'On', '開啟')
                  : t('Desligado', 'Off', '關閉')}
              </span>
            </button>

            {/* 3. Underline Links Toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={prefs.underlineLinks}
              onClick={handleToggleUnderline}
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border flex items-center justify-between gap-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B6B4A] ${
                prefs.underlineLinks
                  ? 'bg-[#1B6B4A] text-white border-[#1B6B4A] dark:bg-[#8BC53F] dark:text-[#182C61] dark:border-[#8BC53F]'
                  : 'bg-[#F4F7F5] dark:bg-[#163127] border-neutral-200 dark:border-[#2B5946] hover:border-[#1B6B4A] dark:hover:border-[#8BC53F]'
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Link2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="text-xs font-semibold">
                  {t('Sublinhar Ligações', 'Underline Links', '標示連結底線')}
                </span>
              </span>
              <span className="font-mono text-[11px] font-bold uppercase shrink-0">
                {prefs.underlineLinks
                  ? t('Activo', 'On', '開啟')
                  : t('Desligado', 'Off', '關閉')}
              </span>
            </button>

            {/* 4. Reset Button */}
            {hasCustomPrefs && (
              <button
                type="button"
                onClick={handleReset}
                className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-neutral-200 dark:border-[#2B5946] text-xs font-semibold text-[#29332F]/80 dark:text-[#C5DFD1] hover:text-[#1B6B4A] dark:hover:text-white hover:bg-[#F4F7F5] dark:hover:bg-[#163127] inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B6B4A]"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t('Restaurar Padrão', 'Reset to Defaults', '重設預設值')}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Trigger Button (bottom-left to avoid overlapping bottom-right notice button) */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="biosfera-accessibility-panel"
        aria-label={t(
          'Abrir menu de acessibilidade (tamanho do texto e alto contraste)',
          'Open accessibility menu (text size and high contrast)',
          '開啟無障礙設定選單（文字大小與高對比）'
        )}
        title={t('Acessibilidade', 'Accessibility', '無障礙設定')}
        className={`inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] min-w-[44px] rounded-xl shadow-lg border transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B6B4A] ${
          open || hasCustomPrefs
            ? 'bg-[#182C61] text-white border-[#8BC53F] hover:bg-[#1E377A]'
            : 'bg-[#1B6B4A] text-white border-white/25 hover:bg-[#1E7E54] dark:bg-[#11261E] dark:text-[#ECF5F0] dark:border-[#7FD1A8]/55 dark:hover:bg-[#163127]'
        }`}
      >
        <Accessibility className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline text-xs font-semibold tracking-wide">
          {t('Acessibilidade', 'Accessibility', '無障礙')}
        </span>
      </button>
    </div>
  );
};
