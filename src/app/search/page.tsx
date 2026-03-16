"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import FacilityCard from '@/components/facility/FacilityCard';
import { generateMockFacilities } from '@/lib/mockData';
import { Facility, AccessibilityFeature } from '@/types';
import { Filter, Map as MapIcon, List, Search as SearchIcon, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { calculateDistance } from '@/lib/utils';

const ACCESSIBILITY_LABELS: Record<AccessibilityFeature, string> = {
  wheelchair_ramp: 'Wheelchair Ramp',
  elevator: 'Elevator',
  accessible_restroom: 'Accessible Restroom',
  braille_signage: 'Braille Signage',
  tactile_path: 'Tactile Path',
  wide_doorway: 'Wide Doorway',
  adjustable_exam_table: 'Adjustable Exam Table',
  sign_language_interpreter: 'Sign Language Interpreter',
  priority_queue: 'Priority Queue',
  disabled_parking: 'Disabled Parking'
};

export default function SearchPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<AccessibilityFeature[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { lat, lng, loading: geoLoading } = useGeolocation();

  useEffect(() => {
    try {
      const data = generateMockFacilities(50);
      setFacilities(data);
      setFilteredFacilities(data);
    } catch (err) {
      console.error("Failed to generate facilities:", err);
    }
  }, []);

  useEffect(() => {
    let result = [...facilities];

    // Calculate distances if GPS is available
    if (lat && lng) {
      result = result.map(f => ({
        ...f,
        distance: calculateDistance(lat, lng, f.lat, f.lng)
      }));

      // Sort by distance by default if location is available
      result.sort((a, b) => ((a as any).distance || 0) - ((b as any).distance || 0));
    }

    if (searchQuery) {
      result = result.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilters.length > 0) {
      result = result.filter(f => 
        activeFilters.every(filter => f.accessibility_features[filter])
      );
    }

    setFilteredFacilities(result);
  }, [searchQuery, activeFilters, facilities, lat, lng]);

  const toggleFilter = (filter: AccessibilityFeature) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex overflow-hidden relative">
        {/* Sidebar Filters */}
        <aside className={`${isSidebarOpen ? 'w-80' : 'w-0'} bg-white/70 backdrop-blur-xl border-r border-white/20 transition-all duration-500 overflow-y-auto hidden md:block z-20 shadow-2xl shadow-slate-200/50`}>
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                <SlidersHorizontal size={24} className="text-primary-600" />
                Filters
              </h2>
              <button 
                onClick={() => setActiveFilters([])}
                className="text-xs text-primary-600 font-extrabold hover:text-primary-700 uppercase tracking-widest transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.2em]">Accessibility Needs</h3>
                <div className="space-y-3">
                  {(Object.keys(ACCESSIBILITY_LABELS) as AccessibilityFeature[]).map(key => (
                    <label key={key} className="flex items-center gap-4 cursor-pointer group p-2 rounded-xl hover:bg-slate-50 transition-all">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          checked={activeFilters.includes(key)}
                          onChange={() => toggleFilter(key)}
                          className="w-6 h-6 rounded-lg border-slate-200 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
                        />
                      </div>
                      <span className={`text-sm tracking-tight transition-colors ${activeFilters.includes(key) ? 'text-primary-700 font-black' : 'text-slate-600 font-bold'}`}>
                        {ACCESSIBILITY_LABELS[key]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.2em]">Discovery Radius</h3>
                <div className="glass p-1 rounded-2xl">
                  <select className="w-full bg-transparent border-none rounded-xl px-4 py-3 text-sm font-black text-slate-700 focus:outline-none">
                    <option>Within 5 km</option>
                    <option>Within 10 km</option>
                    <option>Within 25 km</option>
                    <option>Anywhere</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-slate-50/50">
          {/* Top Bar Tooling */}
          <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">Explore Facilities</h1>
              <p className="text-sm text-slate-500 font-bold">
                Showing <span className="text-primary-600">{filteredFacilities.length}</span> results in <span className="text-slate-900">Greater Mumbai Area</span>
              </p>
            </div>
            
            <div className="flex items-center glass p-1.5 rounded-2xl shadow-lg border-white/60">
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-primary-600 shadow-lg shadow-primary-500/30 text-white' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <List size={16} />
                List View
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-primary-600 shadow-lg shadow-primary-500/30 text-white' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <MapIcon size={16} />
                Map View
              </button>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-grow overflow-y-auto p-4 md:p-8">
            {viewMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {filteredFacilities.map((f, i) => (
                  <FacilityCard 
                    key={f.id} 
                    facility={f} 
                    index={i} 
                    distance={(f as any).distance} 
                  />
                ))}
                
                {filteredFacilities.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <SearchIcon size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No facilities found</h3>
                    <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/72.87,19.07,11,0/1200x800?access_token=pk.placeholder')] bg-cover opacity-50"></div>
                <div className="relative z-10 text-center p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl max-w-sm">
                  <MapIcon size={48} className="mx-auto text-primary-500 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Interactive Map</h3>
                  <p className="text-sm text-slate-600 mb-6">
                    In a production environment, this would initialize a Leaflet or Google Maps instance with {filteredFacilities.length} markers.
                  </p>
                  <button className="bg-primary-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-primary-700">
                    Enable High Accuracy GPS
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
