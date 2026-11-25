import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface DynamicHeadingProps {
  as?: 'h1' | 'h2' | 'h3';
  kicker?: string;
  title: string;
  alternates?: string[];
  subtitle?: string;
  variant?: 'default' | 'banner' | 'inverted';
  align?: 'left' | 'center';
  className?: string;
  titleClassName?: string;
  cycleMs?: number;
}

export const DynamicHeading: React.FC<DynamicHeadingProps> = ({
  as = 'h2',
  kicker,
  title,
  alternates,
  subtitle,
  variant = 'default',
  align = 'left',
  className = '',
  titleClassName = '',
  cycleMs = 5400,
}) => {
  const { lang } = useLanguage();
  const phrases = alternates && alternates.length > 0 ? [title, ...alternates] : [title];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [lang, title]);

  useEffect(() => {
    if (phrases.length <= 1) return;
    const timer = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % phrases.length);
    }, cycleMs);
    return () => window.clearInterval(timer);
  }, [phrases.length, cycleMs]);

  const activeTitle = phrases[idx % phrases.length] || title;

  const isLightOnDark = variant === 'banner' || variant === 'inverted';
  const kickerColor = isLightOnDark
    ? 'text-[#BCE87D]'
    : 'text-[#1E7E54] dark:text-[#BCE87D]';
  const subtitleColor = isLightOnDark
    ? 'text-white/90'
    : 'text-[#29332F]/80 dark:text-[#C5DFD1]';
  const headingStyleClass = isLightOnDark
    ? 'dynamic-title-sheen-light'
    : 'dynamic-title-sheen';

  const defaultSizes =
    as === 'h1'
      ? 'text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1]'
      : as === 'h2'
      ? 'text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight'
      : 'text-xl sm:text-2xl font-bold leading-snug';

  const Tag = motion[as];

  return (
    <div
      className={`${align === 'center' ? 'text-center mx-auto' : ''} ${className}`}
    >
      {kicker && (
        <motion.div
          key={`kicker-${lang}-${kicker}`}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`inline-flex items-center gap-2.5 text-xs font-semibold tracking-wider uppercase mb-2.5 ${kickerColor}`}
        >
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'left' }}
            className={`h-[2px] w-6 rounded-full ${
              isLightOnDark ? 'bg-[#8BC53F]' : 'bg-[#1E7E54] dark:bg-[#8BC53F]'
            }`}
            aria-hidden="true"
          />
          <span>{kicker}</span>
        </motion.div>
      )}

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <Tag
            key={`${lang}-${idx}-${activeTitle}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`font-display tracking-tight ${defaultSizes} ${headingStyleClass} ${titleClassName}`}
          >
            {activeTitle}
          </Tag>
        </AnimatePresence>
      </div>

      {subtitle && (
        <motion.p
          key={`sub-${lang}-${subtitle.slice(0, 24)}`}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className={`mt-3 text-sm sm:text-base leading-relaxed ${
            align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'
          } ${subtitleColor}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
