import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Link } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { Layout } from './components/Layout';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { sanityService, JournalPost } from './services/sanityService';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { SmartImage } from './components/SmartImage';
import { Seo } from './components/Seo';
import { VideoEmbed } from './components/VideoEmbed';

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
    youtube: ({ value }: any) => value?.url ? <VideoEmbed url={value.url} title={value.title || 'YouTube video'} /> : null,
    vimeo: ({ value }: any) => value?.url ? <VideoEmbed url={value.url} title={value.title || 'Vimeo video'} /> : null,
    videoEmbed: ({ value }: any) => value?.url ? <VideoEmbed url={value.url} title={value.title || 'Embedded video'} /> : null,
  },
};

const JournalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<JournalPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const data = await sanityService.getJournalPost(id);
        setPost(data);
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
      mainEntityOfPage: `https://rossehub.com/journal/${id}`,
      publisher: {
        '@type': 'Organization',
        name: 'ROSSE HUB',
      },
    };
  }, [post, id]);

  if (loading) return <div className="p-20 text-center mono-meta">LOADING POST...</div>;
  if (!post || !id) return <div className="p-20 text-center text-4xl">POST NOT FOUND</div>;

  return (
    <div className="px-6 max-w-5xl mx-auto space-y-12 pb-32">
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

      <Link to="/journal" className="mono-meta flex items-center gap-2 hover:text-accent transition-colors mb-12">
        <ArrowLeft size={12} /> BACK TO JOURNAL
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <p className="mono-meta">{post.date} — {post.category}</p>
        <h1 className="text-6xl md:text-8xl leading-tight">{post.title}</h1>
        <p className="text-2xl font-serif italic opacity-60">By {post.author}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="aspect-video overflow-hidden rounded-3xl"
      >
        <SmartImage
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
          eager
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="prose prose-xl max-w-none text-ink/80 leading-relaxed space-y-8"
      >
        <p className="text-2xl font-light">{post.excerpt}</p>
        {post.content ? (
          <PortableText value={post.content} components={journalPortableTextComponents} />
        ) : (
          <>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.
            </p>
            <h2 className="text-4xl font-display uppercase pt-8">THE CREATIVE PROCESS</h2>
            <p>
              Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque.
            </p>
          </>
        )}
      </motion.div>
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
