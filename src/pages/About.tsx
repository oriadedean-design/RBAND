import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BRAND } from '../constants';
import { Mail, MapPin, Instagram, Linkedin } from 'lucide-react';
import { sanityService, AboutInfo } from '../services/sanityService';

export const About: React.FC = () => {
  const [about, setAbout] = useState<AboutInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await sanityService.getAboutInfo();
        setAbout(data);
      } catch (error) {
        console.error('Error fetching about info:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) return <div className="p-20 text-center mono-meta">LOADING ABOUT INFO...</div>;
  if (!about) return <div className="p-20 text-center text-4xl">ABOUT INFO NOT FOUND</div>;

  return (
    <div className="px-6 space-y-32">
      {/* About Intro */}
      <section className="min-h-[60vh] flex flex-col justify-center">
        <div className="editorial-grid">
          <div className="col-span-12 md:col-span-10">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mono-meta mb-4"
            >
              ABOUT ROSSE HUB
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[12vw] md:text-[10vw] leading-[0.82] mb-12 uppercase"
            >
              {about.title.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  {word} {i === 1 ? <br /> : i === 4 ? <><span className="serif-italic ml-[10vw]">{word}</span> <br /></> : i === 6 ? <><span className="ml-[20vw]">{word}</span></> : ''}
                </React.Fragment>
              ))}
              {/* Fallback if split logic is too complex for dynamic title */}
              {!about.title.includes('NEBULA') && about.title}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl text-xl md:text-2xl font-light opacity-80 leading-relaxed"
            >
              {about.description}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="editorial-grid gap-y-24">
        <div className="col-span-12 md:col-span-6 space-y-12">
          <h2 className="text-6xl md:text-8xl uppercase">OUR <br /> MISSION.</h2>
          <p className="text-xl md:text-2xl font-light opacity-60 leading-relaxed">
            {about.mission}
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 space-y-12 md:mt-32">
          <h2 className="text-6xl md:text-8xl uppercase">OUR <br /> VISION.</h2>
          <p className="text-xl md:text-2xl font-light opacity-60 leading-relaxed">
            {about.vision}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-ink text-bg -mx-6 px-6 py-32">
        <div className="editorial-grid">
          <div className="col-span-12 md:col-span-6">
            <h2 className="text-6xl md:text-8xl mb-12 uppercase">GET IN <br /> TOUCH.</h2>
            <p className="text-xl md:text-2xl font-light opacity-60 mb-12 max-w-md">
              Whether you’re a creator, a brand, or a fan, we’d love to hear from you. Let’s build something historic.
            </p>
          </div>
          <div className="col-span-12 md:col-span-6 flex flex-col justify-end space-y-8">
            <div className="flex items-center gap-6 group cursor-pointer">
              <div className="p-4 glass rounded-full group-hover:bg-accent transition-colors">
                <Mail size={24} />
              </div>
              <div>
                <p className="mono-meta">EMAIL US</p>
                <p className="text-2xl font-display uppercase">{about.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 group cursor-pointer">
              <div className="p-4 glass rounded-full group-hover:bg-accent transition-colors">
                <MapPin size={24} />
              </div>
              <div>
                <p className="mono-meta">LOCATION</p>
                <p className="text-2xl font-display uppercase">{about.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 group cursor-pointer">
              <div className="p-4 glass rounded-full group-hover:bg-accent transition-colors">
                <Instagram size={24} />
              </div>
              <div>
                <p className="mono-meta">INSTAGRAM</p>
                <p className="text-2xl font-display uppercase">{about.instagram}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
