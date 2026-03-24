import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sun, Moon, Sparkles, Search, Instagram, Linkedin } from 'lucide-react';
import { SITEMAP, BRAND } from '../constants';
import { useTheme } from '../ThemeContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-bg text-ink">
      {/* Navigation - Minimal Pill Style */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center">
        <Link to="/" className="z-50">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-display tracking-tighter"
          >
            {BRAND.name}
          </motion.h1>
        </Link>

        <div className="hidden md:flex items-center gap-2 glass p-1 rounded-full">
          {SITEMAP.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "px-6 py-2 rounded-full text-[10px] mono-meta transition-all duration-300",
                location.pathname === item.path ? "bg-accent text-white" : "hover:bg-white/10"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:text-accent transition-colors">
            <Search size={18} />
          </button>
          
          <div className="flex gap-1 p-1 glass rounded-full">
            <button 
              onClick={() => setTheme('light')}
              className={cn("p-2 rounded-full transition-all", theme === 'light' && "bg-white text-black shadow-lg")}
            >
              <Sun size={12} />
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={cn("p-2 rounded-full transition-all", theme === 'dark' && "bg-black text-white shadow-lg")}
            >
              <Moon size={12} />
            </button>
            <button 
              onClick={() => setTheme('nebula')}
              className={cn("p-2 rounded-full transition-all", theme === 'nebula' && "bg-green-500 text-black shadow-lg")}
            >
              <Sparkles size={12} />
            </button>
          </div>

          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 glass rounded-full"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Fullscreen Menu (Mobile) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-40 bg-bg flex flex-col items-center justify-center"
          >
            <div className="flex flex-col gap-8 text-center">
              {SITEMAP.map((item, idx) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="group relative"
                >
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className={cn(
                      "text-6xl font-display uppercase transition-all duration-500",
                      location.pathname === item.path ? "opacity-100" : "opacity-30 group-hover:opacity-100"
                    )}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer - Inspired by "STAY IN THE LOOP" footer area */}
      <footer className="px-6 py-12 border-t border-line">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-display">{BRAND.name}</h2>
            <p className="opacity-60 text-sm max-w-xs">{BRAND.description}</p>
            <div className="flex gap-4">
              <a href="#" className="p-2 border border-line rounded-full hover:bg-accent hover:text-white transition-all"><Instagram size={16} /></a>
              <a href="#" className="p-2 border border-line rounded-full hover:bg-accent hover:text-white transition-all"><Linkedin size={16} /></a>
            </div>
          </div>
          
          <div>
            <p className="mono-meta mb-6">MENU</p>
            <ul className="space-y-4">
              {SITEMAP.map(item => (
                <li key={item.path}>
                  <Link to={item.path} className="text-sm opacity-60 hover:opacity-100 hover:text-accent transition-all">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mono-meta mb-6">SUPPORT</p>
            <ul className="space-y-4 text-sm opacity-60">
              <li><a href="#" className="hover:text-accent">HELP CENTER</a></li>
              <li><a href="#" className="hover:text-accent">CONTACT US</a></li>
              <li><a href="#" className="hover:text-accent">FAQ</a></li>
            </ul>
          </div>

          <div>
            <p className="mono-meta mb-6">INFO</p>
            <ul className="space-y-4 text-sm opacity-60">
              <li><a href="#" className="hover:text-accent">PRIVACY POLICY</a></li>
              <li><a href="#" className="hover:text-accent">TERMS OF SERVICE</a></li>
              <li><a href="#" className="hover:text-accent">COOKIE POLICY</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-line flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="mono-meta">© 2026 ROSSE HUB. ALL RIGHTS RESERVED.</p>
          <p className="mono-meta">DESIGNED FOR CREATIVES BY CREATIVES</p>
        </div>
      </footer>
    </div>
  );
};
