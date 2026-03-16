"use client";
import Link from 'next/link';
import { Search, MapPin, CheckCircle, Info, ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="flex-grow bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-primary-200/50 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2] 
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/2 -right-24 w-[400px] h-[400px] bg-accent-200/40 rounded-full blur-[100px]" 
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedContainer>
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest mb-8 shadow-sm border border-primary-200">
                <Sparkles size={14} />
                Next Generation Accessibility
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tighter">
                Find Healthcare <br />
                <span className="text-transparent bg-clip-text glossy-gradient pb-2 inline-block">Without Limits</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-xl font-medium">
                The world's most detailed accessibility intelligence platform for hospitals, clinics, and diagnostic centers.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                <Link 
                  href="/search"
                  className="glossy-gradient text-white font-black py-5 px-10 rounded-3xl shadow-2xl shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all text-xl flex items-center justify-center gap-3 group"
                >
                  <Search size={24} />
                  Start Discovery
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/about"
                  className="bg-white font-black py-5 px-10 rounded-3xl shadow-xl shadow-slate-200/50 hover:bg-slate-50 transition-all text-xl flex items-center justify-center gap-3 text-slate-700 border border-slate-200"
                >
                  <Info size={24} />
                  Our Mission
                </Link>
              </div>

              <div className="mt-16 flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <img 
                      key={i}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} 
                      className="w-12 h-12 rounded-full border-4 border-white shadow-md"
                      alt="User"
                    />
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-white shadow-md bg-slate-900 flex items-center justify-center text-white text-[10px] font-black">
                    +500
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                  Community Verified Data
                </p>
              </div>
            </AnimatedContainer>

            <AnimatedContainer delay={0.2} className="hidden lg:block relative">
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="glass p-8 rounded-[40px] shadow-2xl border-white/60 relative z-20"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 glossy-gradient rounded-3xl flex items-center justify-center text-white shadow-xl">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-900">Verified Facility</h4>
                      <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Mumbai Central</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { label: "Wheelchair Ramp", color: "bg-accent-500" },
                      { label: "Sign Language Interpreter", color: "bg-primary-500" },
                      { label: "Braille Signage", color: "bg-accent-400" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-white/40">
                        <div className={`w-3 h-3 rounded-full ${item.color} shadow-lg`} />
                        <span className="font-bold text-slate-700">{item.label}</span>
                        <CheckCircle className="ml-auto text-accent-500" size={20} />
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-200/50 flex justify-between items-center text-slate-900 font-black">
                    <span>Accessibility Score</span>
                    <span className="text-primary-600 text-3xl tracking-tight">98%</span>
                  </div>
                </motion.div>
                
                {/* Decorative floating cards */}
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -bottom-10 -right-10 glass p-6 rounded-3xl shadow-2xl border-white/60 z-30 w-52"
                >
                  <Heart className="text-red-500 fill-red-500 mb-2" size={24} />
                  <p className="text-sm font-black text-slate-800">Saved to Favorites</p>
                </motion.div>
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </section>

      {/* Stats Section with Glassmorphism */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Facilities Mapped', value: '50+', color: 'text-primary-600' },
              { label: 'Features Verified', value: '1,200+', color: 'text-accent-600' },
              { label: 'Active Contributors', value: '500+', color: 'text-primary-600' }
            ].map((stat, i) => (
              <AnimatedContainer key={i} delay={i * 0.1}>
                <div className="glass p-10 rounded-[32px] text-center border-white/50 hover-glow transition-all">
                  <div className={`text-5xl font-black mb-3 tracking-tighter ${stat.color}`}>{stat.value}</div>
                  <div className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">{stat.label}</div>
                </div>
              </AnimatedContainer>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Features */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedContainer className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Designing for a World <br /> <span className="text-primary-600">Without Barriers</span></h2>
            <div className="w-24 h-2 glossy-gradient mx-auto rounded-full" />
          </AnimatedContainer>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[
              {
                title: 'Inclusive Discovery',
                desc: 'Intelligent search algorithms that prioritize facilities matching your specific mobility or sensory needs.',
                icon: <Search size={32} />,
                color: 'bg-primary-100 text-primary-600'
              },
              {
                title: 'Data Integrity',
                desc: 'Every feature is cross-verified by actual users and high-accuracy GPS logs to ensure reliability.',
                icon: <ShieldCheck size={32} />,
                color: 'bg-accent-100 text-accent-600'
              },
              {
                title: 'Community First',
                desc: 'A platform built by the people, for the people. Your feedback shapes the future of medical accessibility.',
                icon: <Sparkles size={32} />,
                color: 'bg-primary-100 text-primary-600'
              }
            ].map((feature, i) => (
              <AnimatedContainer key={i} delay={i * 0.15} className="group cursor-default">
                <div className="p-10 rounded-[40px] bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-primary-500/10 transition-all duration-500 h-full">
                  <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center mb-10 shadow-lg ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-6">{feature.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </AnimatedContainer>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
