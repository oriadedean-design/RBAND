import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BRAND } from '../constants';
import { ArrowRight, DollarSign, Users, Rocket } from 'lucide-react';
import { sanityService, GrantInfo } from '../services/sanityService';

export const Grant: React.FC = () => {
  const [grant, setGrant] = useState<GrantInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrant = async () => {
      try {
        const data = await sanityService.getGrantInfo();
        setGrant(data);
      } catch (error) {
        console.error('Error fetching grant info:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrant();
  }, []);

  if (loading) return <div className="p-20 text-center mono-meta">LOADING GRANT INFO...</div>;
  if (!grant) return <div className="p-20 text-center text-4xl">GRANT INFO NOT FOUND</div>;

  return (
    <div className="px-6 space-y-32">
      {/* Grant Intro */}
      <section className="min-h-[60vh] flex flex-col justify-center">
        <div className="editorial-grid">
          <div className="col-span-12 md:col-span-10">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mono-meta mb-4"
            >
              CREATIVE GRANT PROGRAM
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[12vw] md:text-[10vw] leading-[0.82] mb-12 uppercase"
            >
              {grant.title.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  {i === 1 ? <><span className="serif-italic ml-[10vw]">{word}</span> <br /></> : word + ' '}
                </React.Fragment>
              ))}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl text-xl md:text-2xl font-light opacity-80 leading-relaxed"
            >
              {grant.description}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Grant Details */}
      <section className="editorial-grid gap-y-24">
        <div className="col-span-12 md:col-span-4 p-12 glass rounded-3xl space-y-8">
          <DollarSign size={48} className="text-accent" />
          <h3 className="text-4xl uppercase">DIRECT <br /> FUNDING</h3>
          <p className="opacity-60 text-lg">{grant.fundingAmount}</p>
        </div>
        <div className="col-span-12 md:col-span-4 p-12 glass rounded-3xl space-y-8 md:mt-12">
          <Users size={48} className="text-accent" />
          <h3 className="text-4xl uppercase">EXPERT <br /> MENTORSHIP</h3>
          <p className="opacity-60 text-lg">{grant.mentorshipDetails}</p>
        </div>
        <div className="col-span-12 md:col-span-4 p-12 glass rounded-3xl space-y-8 md:mt-24">
          <Rocket size={48} className="text-accent" />
          <h3 className="text-4xl uppercase">GLOBAL <br /> EXPOSURE</h3>
          <p className="opacity-60 text-lg">{grant.exposureDetails}</p>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-32 text-center relative overflow-hidden rounded-3xl bg-nebula text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,_#00FF00_0%,_transparent_70%)]" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <h2 className="text-6xl md:text-8xl mb-12 uppercase">{grant.status.split(' ').map((word, i) => (
            <React.Fragment key={i}>
              {word} {i === 1 ? <br /> : ''}
            </React.Fragment>
          ))}</h2>
          <p className="text-xl md:text-2xl font-light opacity-80 mb-12 max-w-2xl mx-auto">
            We are currently finalizing the grant criteria and selection committee. Sign up for the waitlist to be the first to know when applications open.
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="TYPE YOUR EMAIL..." 
              className="flex-grow px-8 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors"
            />
            <button className="px-8 py-4 bg-accent text-white rounded-full font-display text-xl hover:scale-105 transition-transform">
              JOIN WAITLIST
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
