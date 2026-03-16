"use client";
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { User, MapPin, Star, History, Award, CheckCircle2, ChevronRight, Settings } from 'lucide-react';
import { generateMockFacilities } from '@/lib/mockData';
import FacilityCard from '@/components/facility/FacilityCard';

export default function UserDashboard() {
  const contributions = generateMockFacilities(3);
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Profiler */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center text-primary-600">
                <User size={48} />
              </div>
              <h2 className="text-xl font-black text-slate-900">Pratik Gopale</h2>
              <p className="text-slate-500 text-sm mb-6">Verified Contributor</p>
              
              <div className="flex justify-center gap-2 mb-8">
                <div className="bg-accent-100 text-accent-700 p-2 rounded-lg" title="Top Contributor">
                  <Award size={20} />
                </div>
                <div className="bg-primary-100 text-primary-700 p-2 rounded-lg" title="Verified Member">
                  <CheckCircle2 size={20} />
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-slate-50 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-between px-4 hover:bg-slate-100">
                  <div className="flex items-center gap-2"><Settings size={18} /> Profile Settings</div>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="bg-primary-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                <Award size={100} />
              </div>
              <h3 className="text-lg font-bold mb-2">Impact Score</h3>
              <div className="text-4xl font-black text-accent-400 mb-1">1,250</div>
              <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Points earned from verification</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
                  <History size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">12</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Saved Facilities</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-50 text-accent-600 rounded-2xl flex items-center justify-center">
                  <Star size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">8</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Reviews Left</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">5</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Features Verified</div>
                </div>
              </div>
            </div>

            {/* Recent Contributions */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-2xl font-black text-slate-900">Your Contributions</h3>
                <button className="text-primary-600 font-bold text-sm hover:underline">View All</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contributions.map(f => (
                  <FacilityCard key={f.id} facility={f} />
                ))}
              </div>
            </section>

            {/* Recent Searches */}
            <section className="bg-white rounded-[2rem] p-8 border border-slate-200">
              <h3 className="text-xl font-black text-slate-900 mb-6">Recent Searches</h3>
              <div className="space-y-4">
                {['General Hospital Dadar', 'Wheelchair Accessible Eye Clinics', 'Mumbai Diagnostic Centers'].map((search, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                        <MapPin size={16} />
                      </div>
                      <span className="text-slate-700 font-medium">{search}</span>
                    </div>
                    <button className="text-slate-400 hover:text-primary-600 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
