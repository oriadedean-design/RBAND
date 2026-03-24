import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BRAND } from '../constants';
import { ArrowRight, ExternalLink, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sanityService, Creator, JournalPost } from '../services/sanityService';

export const Home: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [creatorsData, postsData] = await Promise.all([
          sanityService.getCreators(),
          sanityService.getJournalPosts()
        ]);
        setCreators(creatorsData);
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching data from Sanity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-4xl font-display"
        >
          ROSSE HUB
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-6 space-y-24 pb-24">
      {/* Hero Section - Inspired by "DESIGN & FREEDOM" */}
      <section className="relative min-h-[90vh] flex flex-col justify-end overflow-hidden rounded-[2rem] border border-line">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1539109136881-3be0610acf4b?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 p-8 md:p-16 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="max-w-4xl">
              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[12vw] md:text-[8vw] leading-[0.85] mb-6"
              >
                DESIGN <br />
                <span className="serif-italic ml-[5vw] md:ml-[10vw]">& FREEDOM</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl opacity-60 max-w-xl"
              >
                Explore independent style by embracing uniqueness with our exclusive creator hub. Finally, you made it home.
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-end gap-4"
            >
              <button className="pill-btn flex items-center gap-2">
                LEARN MORE <ArrowRight size={12} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'CREATORS', value: '150+' },
          { label: 'CLIENTS', value: '500+' },
          { label: 'MASTERPIECES', value: '20K+' },
          { label: 'EVENTS', value: '50+' },
        ].map((stat, idx) => (
          <div key={idx} className="bento-card text-center space-y-2">
            <p className="mono-meta">{stat.label}</p>
            <p className="text-4xl md:text-5xl font-display">{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Top Creators - Inspired by "TOP DESIGNERS" */}
      <section className="space-y-12">
        <div className="flex justify-between items-end">
          <h2 className="text-4xl md:text-6xl">TOP CREATORS</h2>
          <Link to="/gallery" className="pill-btn">SEE ALL</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creators.slice(0, 3).map((creator) => (
            <div key={creator.id} className="bento-card group cursor-pointer">
              <div className="aspect-square overflow-hidden rounded-xl mb-6 relative">
                <img 
                  src={creator.image} 
                  alt={creator.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full flex items-center">
                  <span className="status-dot" />
                  <span className="text-[10px] mono-meta opacity-100">ONLINE</span>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl mb-1">{creator.name}</h3>
                  <p className="mono-meta">{creator.location}</p>
                </div>
                <div className="p-2 border border-line rounded-full group-hover:bg-accent transition-colors">
                  <Plus size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advantages Bento Grid */}
      <section className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-8 bento-card flex flex-col justify-between min-h-[400px]">
          <h2 className="text-5xl md:text-7xl max-w-md">WHERE CREATIVITY MEETS FREEDOM</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <p className="opacity-60 leading-relaxed">
              We believe that creativity should be an expression of individuality. We encourage originality in every item we offer, providing customers with exclusive collections from independent designers.
            </p>
            <p className="opacity-60 leading-relaxed">
              We strive to connect designers with fashion enthusiasts who appreciate the artistry and individuality behind each piece. Driven by our dedication to authenticity, we curate each collection with a keen eye.
            </p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 bento-card overflow-hidden p-0">
          <img 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1000" 
            alt="Advantage" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Latest News - Inspired by "LATEST NEWS" */}
      <section className="space-y-12">
        <div className="flex justify-between items-end">
          <h2 className="text-4xl md:text-6xl">LATEST NEWS</h2>
          <Link to="/journal" className="pill-btn">SEE ALL</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.slice(0, 2).map((post) => (
            <Link key={post.id} to={`/journal/${post.id}`} className="bento-card group flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-48 aspect-square overflow-hidden rounded-xl shrink-0">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-between py-2">
                <div>
                  <p className="mono-meta mb-4">{post.category}</p>
                  <h3 className="text-2xl md:text-3xl group-hover:text-accent transition-colors">{post.title}</h3>
                </div>
                <div className="flex items-center gap-2 mt-6 text-xs mono-meta group-hover:text-accent transition-colors">
                  EXPLORE <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter - Inspired by "STAY IN THE LOOP" */}
      <section className="bento-card bg-accent text-white flex flex-col md:flex-row justify-between items-center gap-12 py-16">
        <div className="max-w-md text-center md:text-left">
          <h2 className="text-5xl md:text-6xl mb-4">STAY IN THE LOOP</h2>
          <p className="opacity-80">Subscribe to our newsletter to receive updates on new creators, events, and exclusive grants.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <input 
            type="email" 
            placeholder="YOUR EMAIL" 
            className="px-8 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors min-w-[300px]"
          />
          <button className="px-12 py-4 bg-white text-accent rounded-full font-display text-xl hover:scale-105 transition-transform">
            SUBSCRIBE
          </button>
        </div>
      </section>
    </div>
  );
};
