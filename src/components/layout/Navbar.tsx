"use client";
import Link from 'next/link';
import { Search, Heart, User, Accessibility, PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';

export default function Navbar() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const { bookmarks } = useBookmarks();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleHighContrast = () => {
    const next = !isHighContrast;
    setIsHighContrast(next);
    document.body.classList.toggle('high-contrast', next);
    localStorage.setItem('high-contrast', String(next));
  };

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('high-contrast') === 'true';
    setIsHighContrast(saved);
    document.body.classList.toggle('high-contrast', saved);
  }, []);

  return (
    <nav aria-label="Main navigation" role="navigation" className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-2' : 'py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`glass rounded-2xl px-6 h-16 flex justify-between items-center shadow-xl border-white/40 transition-all ${
          scrolled ? 'shadow-primary-500/10' : ''
        }`}>
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center group">
              <div className="w-10 h-10 glossy-gradient rounded-xl flex items-center justify-center text-white mr-3 shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                <span className="font-black text-xl">A</span>
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter hidden sm:block">
                Access<span className="text-primary-600">Health</span>
              </span>
            </Link>
            
            <div className="hidden lg:flex items-center bg-slate-100/80 backdrop-blur-sm rounded-2xl px-5 py-2.5 w-80 border border-slate-200/50 group focus-within:ring-2 focus-within:ring-primary-400 transition-all">
              <Search className="text-slate-400 mr-2 group-focus-within:text-primary-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Find accessible healthcare..." 
                className="bg-transparent border-none focus:outline-none w-full text-sm font-medium text-slate-700"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={toggleHighContrast}
                aria-pressed={isHighContrast}
                aria-label="Toggle high contrast mode"
                title={isHighContrast ? 'Disable high contrast' : 'Enable high contrast'}
                className={`p-2.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  isHighContrast
                    ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/30'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Accessibility size={20} aria-hidden="true" />
              </button>
              
              <Link href="/dashboard" aria-label={`Saved facilities${bookmarks.length > 0 ? `, ${bookmarks.length} saved` : ''}`} className="p-2.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl transition-all relative focus:outline-none focus:ring-2 focus:ring-primary-500">
                <Heart size={20} aria-hidden="true" className={bookmarks.length > 0 ? 'fill-red-500 text-red-500' : ''} />
                {bookmarks.length > 0 && (
                  <span aria-hidden="true" className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-[10px] flex items-center justify-center rounded-full font-black">
                    {bookmarks.length}
                  </span>
                )}
              </Link>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <div className="flex items-center gap-4">
              <Link href="/submit" className="glossy-gradient text-white px-5 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-primary-500/20 hover:brightness-110 flex items-center gap-2 transition-all">
                <PlusCircle size={18} />
                <span className="hidden md:inline text-xs uppercase tracking-widest">Add Facility</span>
              </Link>
              
              <Link href="/dashboard" className="p-1 rounded-full border-2 border-primary-100 hover:border-primary-300 transition-all overflow-hidden shrink-0">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Pratik" 
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
