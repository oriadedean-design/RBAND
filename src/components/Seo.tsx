import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

const SITE_NAME = 'ROSSE HUB';
const SITE_URL = 'https://rossehub.com';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1539109136881-3be0610acf4b?auto=format&fit=crop&q=80&w=1600';

const upsertMetaTag = (key: 'name' | 'property', value: string, content: string) => {
  const selector = `meta[${key}="${value}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(key, value);
    document.head.appendChild(el);
  }

  el.setAttribute('content', content);
};

const upsertCanonical = (href: string) => {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  link.setAttribute('href', href);
};

export const Seo: React.FC<SeoProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
}) => {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const absoluteUrl = url ? `${SITE_URL}${url}` : SITE_URL;
    const ogImage = image || DEFAULT_IMAGE;

    document.title = fullTitle;

    upsertCanonical(absoluteUrl);
    upsertMetaTag('name', 'description', description);
    upsertMetaTag('property', 'og:type', type);
    upsertMetaTag('property', 'og:site_name', SITE_NAME);
    upsertMetaTag('property', 'og:title', fullTitle);
    upsertMetaTag('property', 'og:description', description);
    upsertMetaTag('property', 'og:url', absoluteUrl);
    upsertMetaTag('property', 'og:image', ogImage);
    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', fullTitle);
    upsertMetaTag('name', 'twitter:description', description);
    upsertMetaTag('name', 'twitter:image', ogImage);
  }, [title, description, image, url, type]);

  return null;
};
