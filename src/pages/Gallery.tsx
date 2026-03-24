import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { sanityService, GalleryImage } from '../services/sanityService';
import { SmartImage } from '../components/SmartImage';
import { Seo } from '../components/Seo';

export const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await sanityService.getGalleryImages();
        setImages(data);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (loading) return <div className="p-20 text-center mono-meta">LOADING GALLERY...</div>;

  return (
    <div className="px-6 space-y-32">
      <Seo
        title="Gallery"
        description="Browse and share standout visual work from ROSSE HUB creators."
        url="/gallery"
      />
      {/* Gallery Intro */}
      <section className="min-h-[60vh] flex flex-col justify-center">
        <div className="editorial-grid">
          <div className="col-span-12 md:col-span-10">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mono-meta mb-4"
            >
              GALLERY SHOWCASE
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[12vw] md:text-[10vw] leading-[0.82] mb-12"
            >
              BREAKING THE <br />
              <span className="serif-italic ml-[10vw]">GLASS CEILING</span> <br />
              <span className="ml-[20vw]">2.0</span>
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl text-xl md:text-2xl font-light opacity-80 leading-relaxed"
            >
              One day, everything changes. You break that glass ceiling. Your work evolves. You see growth. This showcase celebrates that moment—when your creativity levels up, and you realize how far you’ve come.
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="editorial-grid gap-y-12">
        {images.map((image, idx) => (
          <div 
            key={image.url}
            className={cn(
              "col-span-12 md:col-span-6 lg:col-span-4 group relative",
              idx % 5 === 0 ? "lg:col-span-8 aspect-[21/9]" : "aspect-[4/5]",
              idx % 3 === 1 ? "md:mt-24" : ""
            )}
          >
            <motion.div 
              whileHover={{ scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="w-full h-full overflow-hidden rounded-2xl cursor-pointer"
            >
              <SmartImage
                src={image.url} 
                alt={image.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                data-pin-url={image.url}
                data-pin-description={`${image.title} by ${image.creator} at ROSSE HUB`}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-white">
                <p className="mono-meta text-white/60 mb-2">{image.creator}</p>
                <h3 className="text-3xl">{image.title}</h3>
              </div>
            </motion.div>
          </div>
        ))}
      </section>

      {/* Submission CTA */}
      <section className="py-32 bg-ink text-bg -mx-6 px-6">
        <div className="editorial-grid">
          <div className="col-span-12 md:col-span-6">
            <h2 className="text-6xl md:text-8xl mb-12">SUBMIT <br /> YOUR WORK.</h2>
            <div className="space-y-8 max-w-lg">
              <div className="flex gap-6 items-start">
                <span className="text-accent text-2xl font-display">01</span>
                <p className="opacity-80 text-lg">This is your first showcase. We celebrate emerging talent and first-time gallery experiences.</p>
              </div>
              <div className="flex gap-6 items-start">
                <span className="text-accent text-2xl font-display">02</span>
                <p className="opacity-80 text-lg">High quality submission. We value the technical and emotional depth of your creative vision.</p>
              </div>
              <div className="flex gap-6 items-start">
                <span className="text-accent text-2xl font-display">03</span>
                <p className="opacity-80 text-lg">Make a Video Post Celebrating your acceptance. Community and sharing are core to our mission.</p>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 flex flex-col justify-center items-center md:items-end mt-24 md:mt-0">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-accent blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <button className="relative px-16 py-16 bg-accent text-white rounded-full font-display text-2xl flex flex-col items-center justify-center gap-4 hover:bg-white hover:text-accent transition-colors">
                SUBMIT <ArrowRight size={32} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper for conditional classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
