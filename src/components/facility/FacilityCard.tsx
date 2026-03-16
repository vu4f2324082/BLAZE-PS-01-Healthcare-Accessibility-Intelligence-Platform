"use client";
import { Facility } from '@/types';
import { MapPin, Star, CheckCircle2, Phone, ArrowUpRight, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useBookmarks } from '@/hooks/useBookmarks';
import { cn } from '@/lib/utils';

interface FacilityCardProps {
  facility: Facility;
  index?: number;
  distance?: number | null;
}

export default function FacilityCard({ facility, index = 0, distance }: FacilityCardProps) {
  const { toggleBookmark, isBookmarked } = useBookmarks();
  
  const activeFeatures = Object.entries(facility.accessibility_features)
    .filter(([_, value]) => value)
    .slice(0, 3);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: facility.name,
        text: `Check out ${facility.name} on AccessHealth - it has great accessibility features!`,
        url: window.location.origin + `/facilities/${facility.id}`,
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-3xl border border-white/30 overflow-hidden hover-glow transition-all group flex flex-col h-full"
    >
      <div className="relative h-52 overflow-hidden">
        <img 
          src={facility.photos[0]} 
          alt={facility.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={(e) => { e.preventDefault(); toggleBookmark(facility.id); }}
            className={cn(
              "p-2.5 rounded-full backdrop-blur-md transition-all",
              isBookmarked(facility.id) 
                ? "bg-red-500 text-white shadow-lg shadow-red-500/30" 
                : "bg-white/90 text-slate-600 hover:bg-white"
            )}
          >
            <Heart size={18} className={isBookmarked(facility.id) ? "fill-current" : ""} />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 flex gap-2">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider text-primary-700 shadow-sm border border-white/50">
            {facility.type}
          </div>
          <div className="bg-primary-600/90 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider text-white shadow-sm border border-white/20">
            Score: {facility.accessibility_score}%
          </div>
        </div>

        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center shadow-sm border border-white/50">
          <Star className="text-yellow-500 mr-1 fill-yellow-500" size={14} />
          {facility.rating}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors tracking-tight">
            {facility.name}
          </h3>
          {facility.verified && (
            <div className="bg-accent-50 p-1 rounded-full border border-accent-100">
              <CheckCircle2 className="text-accent-600 shrink-0" size={16} aria-label="Verified Facility" />
            </div>
          )}
        </div>

        <div className="flex items-start gap-1 text-slate-500 text-sm mb-5">
          <MapPin size={14} className="mt-0.5 shrink-0 text-primary-500" />
          <div className="flex flex-col">
            <span className="line-clamp-1 opacity-80">{facility.address}</span>
            {distance !== undefined && distance !== null && (
              <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-1 bg-primary-50 px-2 py-0.5 rounded-md inline-block w-fit">
                {distance} km away
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-8 flex-grow">
          {activeFeatures.map(([key, _]) => (
            <div key={key} className="flex items-center gap-3 text-xs text-slate-700 font-medium py-1.5 border-b border-slate-50 last:border-0 opacity-80">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-500" />
              <span className="capitalize">{key.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-4">
          <Link 
            href={`/facilities/${facility.id}`}
            className="flex-grow glossy-gradient text-white text-center py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 hover:brightness-110 transition-all flex items-center justify-center gap-2 group/btn"
          >
            Explore Facility
            <ArrowUpRight size={18} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
          <button 
            onClick={handleShare}
            className="p-3.5 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 transition-all border border-slate-200"
            aria-label="Share facility"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
