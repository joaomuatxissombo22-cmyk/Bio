import React from 'react';
import { SafeImage } from './SafeImage';
import { DynamicHeading } from './DynamicHeading';

interface PageBannerProps {
  kicker: string;
  title: string;
  alternates?: string[];
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
}

export const PageBanner: React.FC<PageBannerProps> = ({
  kicker,
  title,
  alternates,
  subtitle,
  imageUrl,
  imageAlt,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#182C61] text-white py-16 lg:py-24 border-b border-[#1E7E54]/30 dark:border-[#224738]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-full h-full animate-hero-drift">
          <SafeImage
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover object-[50%_25%]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#182C61]/92 via-[#1B6B4A]/82 to-[#1B6B4A]/52" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <DynamicHeading
          as="h1"
          kicker={kicker}
          title={title}
          alternates={alternates}
          subtitle={subtitle}
          variant="banner"
          className="max-w-3xl"
        />
      </div>
    </section>
  );
};
