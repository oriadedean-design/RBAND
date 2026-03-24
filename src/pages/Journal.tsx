import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { sanityService, JournalPost } from '../services/sanityService';
import { SmartImage } from '../components/SmartImage';
import { Seo } from '../components/Seo';

const formatDateLabel = (dateValue: string) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const Journal: React.FC = () => {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await sanityService.getJournalPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const featuredPosts = useMemo(() => posts.slice(0, 3), [posts]);

  if (loading) return <div className="p-20 text-center mono-meta">LOADING JOURNAL...</div>;

  return (
    <div className="px-6 pb-32 space-y-24">
      <Seo
        title="Journal Magazine"
        description="A blog + magazine feed for interviews, creator stories, and editorial drops from ROSSE HUB."
        url="/journal"
      />

      <section className="pt-8 border-b border-line pb-16">
        <div className="flex justify-between items-start gap-8 mb-10">
          <button className="mono-meta underline underline-offset-4">LOAD MORE</button>
          <div className="max-w-xl grid grid-cols-2 gap-10 text-sm">
            {featuredPosts.slice(0, 2).map((post) => (
              <Link key={post.id} to={`/journal/${post.id}`} className="space-y-2 group">
                <p className="mono-meta opacity-60">{formatDateLabel(post.date)}</p>
                <p className="font-semibold leading-tight group-hover:text-accent transition-colors">{post.title}</p>
              </Link>
            ))}
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[18vw] leading-[0.8] tracking-tighter uppercase"
        >
          MAGAZINE
        </motion.h1>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {featuredPosts.map((post) => (
            <Link key={post.id} to={`/journal/${post.id}`} className="group">
              <div className="relative overflow-hidden rounded-xl aspect-[4/5]">
                <SmartImage
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="mono-meta text-white/70 mb-2">{post.category}</p>
                  <h2 className="text-2xl leading-tight">{post.title}</h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="text-center max-w-4xl mx-auto py-6">
        <p className="text-4xl md:text-6xl leading-tight font-semibold">Numéro-style editorials meet modern creator interviews.</p>
        <p className="mt-6 text-xl md:text-2xl opacity-70">
          Stay close to the culture —
          {' '}
          <span className="underline underline-offset-4">subscribe to our instagram</span>
        </p>
      </section>

      <section className="space-y-10">
        <div className="flex items-end justify-between gap-4 border-b border-line pb-6">
          <h2 className="text-5xl md:text-7xl tracking-tight lowercase">last interview</h2>
          <Link to="/journal" className="mono-meta underline underline-offset-4">SEE MORE</Link>
        </div>

        <div className="space-y-2">
          {posts.map((post) => (
            <article
              key={post.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 py-7 border-b border-line"
            >
              <div className="md:col-span-2">
                <p className="text-2xl md:text-3xl font-display">{formatDateLabel(post.date)}</p>
              </div>

              <Link to={`/journal/${post.id}`} className="md:col-span-4 block group">
                <div className="aspect-[16/10] overflow-hidden rounded-xl">
                  <SmartImage
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </Link>

              <div className="md:col-span-6 flex flex-col justify-between">
                <div>
                  <p className="mono-meta mb-3">{post.category}</p>
                  <h3 className="text-3xl md:text-4xl leading-tight mb-4">{post.title}</h3>
                  <p className="opacity-65 text-lg line-clamp-3">{post.excerpt}</p>
                </div>
                <Link
                  to={`/journal/${post.id}`}
                  className="mt-7 inline-flex items-center gap-2 mono-meta underline underline-offset-4 hover:text-accent transition-colors"
                >
                  READ
                  <ArrowRight size={12} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
