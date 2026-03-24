import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Link } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { Layout } from './components/Layout';
import { motion } from 'motion/react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { sanityService, JournalPost } from './services/sanityService';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { SmartImage } from './components/SmartImage';
import { Seo } from './components/Seo';
import { VideoEmbed } from './components/VideoEmbed';
import { urlFor } from './lib/sanity';

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Journal = lazy(() => import('./pages/Journal').then((m) => ({ default: m.Journal })));
const Gallery = lazy(() => import('./pages/Gallery').then((m) => ({ default: m.Gallery })));
const Grant = lazy(() => import('./pages/Grant').then((m) => ({ default: m.Grant })));
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));

const RouteLoading: React.FC = () => (
  <div className="p-20 text-center mono-meta">LOADING PAGE...</div>
);

const journalPortableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: any) => {
      const imageUrl = value?.asset ? urlFor(value).width(1600).quality(80).auto('format').url() : null;
      if (!imageUrl) return null;

      return (
        <figure className="my-10 space-y-3">
          <SmartImage
            src={imageUrl}
            alt={value?.alt || 'Journal image'}
            className="w-full rounded-xl object-cover"
          />
          {value?.caption ? (
            <figcaption className="mono-meta opacity-60">{value.caption}</figcaption>
          ) : null}
        </figure>
      );
    },
    youtube: ({ value }: any) => value?.url ? <VideoEmbed url={value.url} title={value.title || 'YouTube video'} /> : null,
    vimeo: ({ value }: any) => value?.url ? <VideoEmbed url={value.url} title={value.title || 'Vimeo video'} /> : null,
    videoEmbed: ({ value }: any) => value?.url ? <VideoEmbed url={value.url} title={value.title || 'Embedded video'} /> : null,
  },
};

const JournalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<JournalPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const [data, allPosts] = await Promise.all([
          sanityService.getJournalPost(id),
          sanityService.getJournalPosts(),
        ]);
        setPost(data);
        setRelatedPosts(allPosts.filter((p) => p.id !== id).slice(0, 4));
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const articleSchema = useMemo(() => {
    if (!post || !id) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      author: {
        '@type': 'Person',
        name: post.author,
      },
      image: post.image,
      datePublished: post.date,
      dateModified: post.date,
      mainEntityOfPage: `https://rossehub.com/journal/${id}`,
      articleSection: post.category,
      keywords: [post.category, 'journal', 'magazine', 'creative'],
      publisher: {
        '@type': 'Organization',
        name: 'ROSSE HUB',
      },
    };
  }, [post, id]);

  if (loading) return <div className="p-20 text-center mono-meta">LOADING POST...</div>;
  if (!post || !id) return <div className="p-20 text-center text-4xl">POST NOT FOUND</div>;

  return (
    <div className="px-6 max-w-6xl mx-auto space-y-14 pb-32">
      <Seo
        title={post.title}
        description={post.excerpt}
        image={post.image}
        url={`/journal/${id}`}
        type="article"
      />
      {articleSchema ? (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      ) : null}

      <Link to="/journal" className="mono-meta flex items-center gap-2 hover:text-accent transition-colors">
        <ArrowLeft size={12} /> BACK TO JOURNAL
      </Link>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-line pt-10">
        <aside className="lg:col-span-2 space-y-6">
          <div>
            <p className="mono-meta opacity-60">DATE</p>
            <p className="font-display text-xl">{post.date}</p>
          </div>
          <div>
            <p className="mono-meta opacity-60">CATEGORY</p>
            <p className="font-display text-xl">{post.category}</p>
          </div>
          <div>
            <p className="mono-meta opacity-60">AUTHOR</p>
            <p className="font-display text-xl">{post.author}</p>
          </div>
          <button className="inline-flex items-center gap-2 mono-meta hover:text-accent transition-colors">
            <Share2 size={12} /> SHARE
          </button>
        </aside>

        <article className="lg:col-span-10 space-y-10">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl leading-[0.95] uppercase"
          >
            {post.title}
          </motion.h1>

          <div className="aspect-[16/9] overflow-hidden rounded-xl">
            <SmartImage
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              eager
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 prose prose-xl max-w-none text-ink/80 leading-relaxed space-y-8">
              <p className="text-2xl font-light">{post.excerpt}</p>
              {post.content ? (
                <PortableText value={post.content} components={journalPortableTextComponents} />
              ) : (
                <p>
                  Add rich body copy in Sanity for full editorial storytelling, including text blocks, inline images, and media embeds.
                </p>
              )}
            </div>
            <aside className="md:col-span-4 bg-ink text-bg p-6 rounded-xl h-fit">
              <p className="mono-meta text-bg/70 mb-2">EDITOR NOTE</p>
              <p className="text-xl mb-4">{post.author}</p>
              <p className="text-sm text-bg/70 leading-relaxed">
                This panel is ideal for pull quotes, editor bios, or campaign-side messaging and can be mapped to Sanity fields.
              </p>
            </aside>
          </div>
        </article>
      </section>

      {relatedPosts.length ? (
        <section className="space-y-8 border-t border-line pt-12">
          <h2 className="text-[14vw] leading-[0.85] uppercase tracking-tight">RELATED NEWS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedPosts.map((related) => (
              <Link key={related.id} to={`/journal/${related.id}`} className="group block">
                <div className="aspect-[4/5] rounded-xl overflow-hidden">
                  <SmartImage
                    src={related.image}
                    alt={related.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mono-meta mt-3">{related.category}</p>
                <p className="mt-1 font-semibold leading-tight group-hover:text-accent transition-colors">{related.title}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/journal/:id" element={<JournalDetail />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/grant" element={<Grant />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
