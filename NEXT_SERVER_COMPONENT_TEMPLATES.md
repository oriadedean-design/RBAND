# Next.js Server Component templates for RBAND migration

The current repository snapshot does not yet contain the expected `src/app` Next.js App Router structure.
These drop-in templates are ready for the branch where your Next migration files exist.

## 1) `src/app/page.tsx` (Home)

```tsx
import type { Metadata } from 'next';
import { client } from '@/lib/sanity';
import HomeClient from './HomeClient';

const homeQuery = `*[_type == "home"][0]{
  title,
  subtitle,
  heroImage,
  seoTitle,
  seoDescription
}`;

export async function generateMetadata(): Promise<Metadata> {
  const home = await client.fetch(homeQuery);

  return {
    title: home?.seoTitle ?? 'Dean Oriade',
    description: home?.seoDescription ?? 'Photographer and filmmaker.',
    openGraph: {
      title: home?.seoTitle ?? 'Dean Oriade',
      description: home?.seoDescription ?? 'Photographer and filmmaker.',
    },
  };
}

export default async function HomePage() {
  const home = await client.fetch(homeQuery);
  return <HomeClient home={home} />;
}
```

## 2) `src/app/work/page.tsx` (Work list)

```tsx
import type { Metadata } from 'next';
import { client } from '@/lib/sanity';
import WorkClient from './WorkClient';

const workQuery = `*[_type == "project"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  coverImage,
  discipline,
  publishedAt,
  seoTitle,
  seoDescription
}`;

export const metadata: Metadata = {
  title: 'Work | Dean Oriade',
  description: 'Selected projects and case studies.',
};

export default async function WorkPage() {
  const projects = await client.fetch(workQuery);
  return <WorkClient projects={projects} />;
}
```

## 3) `src/app/work/project/[slug]/page.tsx` (Project detail)

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '@/lib/sanity';
import ProjectDetailClient from './ProjectDetailClient';

const projectQuery = `*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  seoTitle,
  seoDescription,
  body,
  pullQuote,
  metadataCamera,
  publishedAt,
  coverImage,
  gallery[]
}`;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await client.fetch(projectQuery, { slug });

  if (!project) {
    return {
      title: 'Project not found | Dean Oriade',
    };
  }

  return {
    title: project.seoTitle ?? `${project.title} | Dean Oriade`,
    description: project.seoDescription ?? 'Project details and visual story.',
    openGraph: {
      title: project.seoTitle ?? `${project.title} | Dean Oriade`,
      description: project.seoDescription ?? 'Project details and visual story.',
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await client.fetch(projectQuery, { slug });

  if (!project) notFound();

  return <ProjectDetailClient project={project} />;
}
```

## 4) `src/app/about/page.tsx` (About)

```tsx
import type { Metadata } from 'next';
import { client } from '@/lib/sanity';
import AboutClient from './AboutClient';

const aboutQuery = `*[_type == "about"][0]{
  bio,
  portrait,
  gearList,
  seoTitle,
  seoDescription
}`;

export async function generateMetadata(): Promise<Metadata> {
  const about = await client.fetch(aboutQuery);

  return {
    title: about?.seoTitle ?? 'About | Dean Oriade',
    description: about?.seoDescription ?? 'About Dean Oriade.',
  };
}

export default async function AboutPage() {
  const about = await client.fetch(aboutQuery);
  return <AboutClient about={about} />;
}
```

## 5) `src/app/sitemap.ts` (dynamic sitemap)

```ts
import type { MetadataRoute } from 'next';
import { client } from '@/lib/sanity';

const baseUrl = 'https://deanoriade.ca';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects: Array<{ slug?: { current?: string } }> = await client.fetch(
    `*[_type == "project"]{ slug }`
  );

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/work`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
  ];

  const projectUrls: MetadataRoute.Sitemap = projects
    .filter((p) => p.slug?.current)
    .map((p) => ({
      url: `${baseUrl}/work/project/${p.slug!.current!}`,
      lastModified: new Date(),
    }));

  return [...staticUrls, ...projectUrls];
}
```

## 6) Client/server split rule of thumb

- Keep `"use client"` **only** in components needing interactivity (typing effect, animated filters, on-scroll motion).
- Keep page-level fetching and `generateMetadata()` in **Server Components**.
- Avoid `useEffect` + `client.fetch()` for page-critical SEO content.

## 7) Package version correction

If your Next branch currently has this:

```json
"next": "^16.2.1"
```

replace with a valid version you intend to target (example):

```json
"next": "^15.2.1"
```

