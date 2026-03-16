import { Facility } from '@/types';
import { generateMockFacilities } from '@/lib/mockData';
import Navbar from '@/components/layout/Navbar';
import { MapPin, Phone, Globe, Clock, ChevronRight, ShieldCheck, Star } from 'lucide-react';
import Link from 'next/link';

// Since we're in a server component mock environment for Next.js 13+, 
// we'll simulate fetching a facility by ID.
export default function FacilityDetailPage({ params }: { params: { id: string } }) {
  // In a real app, this would be a database call
  const hospitals = generateMockFacilities(50);
  const facility = hospitals.find(h => h.id === params.id) || hospitals[0];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Gallery Area */}
      <div className="relative h-[400px] bg-slate-900 overflow-hidden">
        <img 
          src={facility.photos[0]} 
          alt={facility.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  {facility.type}
                </span>
                {facility.verified && (
                  <span className="bg-accent-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white">{facility.name}</h1>
              <div className="flex items-center gap-4 text-blue-100">
                <div className="flex items-center gap-1">
                  <MapPin size={18} className="text-accent-400" />
                  <span>{facility.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-bold">{facility.rating} / 5</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 text-center min-w-[200px]">
              <div className="text-sm font-bold text-blue-200 uppercase tracking-widest mb-1">Accessibility Score</div>
              <div className={`text-6xl font-black ${
                facility.accessibility_score > 80 ? 'text-green-400' : 
                facility.accessibility_score > 50 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {facility.accessibility_score}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          {/* Accessibility Checklist */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              Accessibility Features
              <span className="h-1 flex-grow bg-slate-100 rounded-full"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(facility.accessibility_features).map(([key, value]) => (
                <div 
                  key={key} 
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    value 
                      ? 'bg-accent-50 border-accent-100 text-accent-900 font-bold' 
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                  {value ? (
                    <ShieldCheck className="text-accent-600" size={20} />
                  ) : (
                    <span className="text-xs uppercase tracking-tighter">Not Available</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              Services Offered
              <span className="h-1 flex-grow bg-slate-100 rounded-full"></span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {facility.services.map(service => (
                <span key={service} className="bg-slate-100 text-slate-700 px-6 py-2 rounded-xl font-bold border border-slate-200">
                  {service}
                </span>
              ))}
            </div>
          </section>

          {/* User Reviews Placeholder */}
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                Reviews
                <span className="h-1 w-24 bg-slate-100 rounded-full"></span>
              </h2>
              <button className="text-primary-600 font-bold hover:underline">Write a Review</button>
            </div>
            
            <div className="space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
                        JD
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">John Doe</div>
                        <div className="text-xs text-slate-500">2 weeks ago</div>
                      </div>
                    </div>
                    <div className="flex text-yellow-500">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={14} className="fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 italic">
                    "The hospital has excellent wheelchair ramps and the staff was very helpful with sign language interpretation. Highly recommended for patients with special needs."
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar Action */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl sticky top-24">
            <h3 className="text-xl font-bold mb-6">Contact & Visiting</h3>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <Phone className="text-accent-400 mt-1" size={20} />
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Call Center</div>
                  <div className="text-lg font-bold">{facility.contact}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="text-accent-400 mt-1" size={20} />
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Hours</div>
                  <div className="text-lg font-bold">Open 24 Hours</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Globe className="text-accent-400 mt-1" size={20} />
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Website</div>
                  <div className="text-lg font-bold hover:text-accent-400 cursor-pointer">hospital.gov.in</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button className="bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-primary-900/40">
                Get Directions
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-black transition-all border border-white/20">
                Update Facility Data
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 text-center">
              <p className="text-sm text-slate-400 mb-4">Help us keep this data accurate for the community</p>
              <Link href="/report" className="text-accent-400 font-bold hover:underline">Report inaccuracy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
