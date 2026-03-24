import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BRAND } from '../constants';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { sanityService, JournalPost } from '../services/sanityService';

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

  if (loading) return <div className="p-20 text-center mono-meta">LOADING JOURNAL...</div>;

  return (
    <div className="px-6 space-y-32">
      {/* Editorial Intro */}
      <section className="min-h-[50vh] flex flex-col justify-center">
        <div className="editorial-grid">
          <div className="col-span-12 md:col-span-8">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mono-meta mb-4"
            >
              THE JOURNAL
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[12vw] md:text-[10vw] leading-[0.82] mb-12"
            >
              SPOTLIGHTING <br />
              <span className="serif-italic ml-[10vw]">VISIONARIES</span>
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl text-xl md:text-2xl font-light opacity-80 leading-relaxed"
            >
              We spotlight photographers, filmmakers, and digital creators. At ROSSE, we honor talent early, inspire voices, and pay homage to legends. Dive in and connect with the creativity that drives us.
            </motion.div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="editorial-grid gap-y-32">
        {posts.map((post, idx) => (
          <div 
            key={post.id}
            className={`col-span-12 ${idx % 3 === 0 ? 'md:col-span-12' : 'md:col-span-6'}`}
          >
            <Link to={`/journal/${post.id}`} className="group block">
              <div className={`relative overflow-hidden rounded-2xl ${idx % 3 === 0 ? 'aspect-[21/9]' : 'aspect-[4/5]'}`}>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-white">
                  <p className="mono-meta text-white/60 mb-2">{post.date} — {post.category}</p>
                  <h3 className="text-4xl">{post.title}</h3>
                </div>
              </div>
              <div className="mt-8 flex flex-col md:flex-row justify-between gap-8">
                <div className="max-w-2xl">
                  <h3 className="text-4xl md:text-5xl group-hover:text-accent transition-colors mb-6">
                    {post.title}
                  </h3>
                  <p className="opacity-60 text-lg leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex items-end">
                  <span className="mono-meta flex items-center gap-2 group-hover:text-accent transition-colors">
                    READ STORY <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </section>

      {/* Newsletter CTA */}
      <section className="bg-accent text-white -mx-6 px-6 py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-6xl md:text-8xl mb-12">SUBSCRIBE <br /> TO THE HUB.</h2>
          <p className="text-xl md:text-2xl font-light opacity-80 mb-12 max-w-2xl mx-auto">
            Enter your email below to receive updates on new stories, creative grants, and community events.
          </p>
          <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="TYPE YOUR EMAIL..." 
              className="flex-grow px-8 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors"
            />
            <button className="px-8 py-4 bg-white text-accent rounded-full font-display text-xl hover:scale-105 transition-transform">
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
