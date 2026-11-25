import { useEffect } from 'react';

interface SeoHeadProps {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  path = '/',
  noIndex = false,
}) => {
  useEffect(() => {
    const fullTitle = title.includes('BIOSFERA')
      ? title
      : `${title} | BIOSFERA – Consultoria Ambiental, Lda.`;
    document.title = fullTitle;

    const updateMeta = (selector: string, attr: 'name' | 'property', key: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = value;
    };

    updateMeta('meta[name="description"]', 'name', 'description', description);
    updateMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    updateMeta('meta[property="og:description"]', 'property', 'og:description', description);
    updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    updateMeta('meta[name="robots"]', 'name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      const origin =
        window.location.hostname === 'www.biosfera.ao' || window.location.hostname === 'biosfera.ao'
          ? 'https://www.biosfera.ao'
          : window.location.origin;
      canonical.href = `${origin}${path}`;
    }
  }, [title, description, path, noIndex]);

  return null;
};
