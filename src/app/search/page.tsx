"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import FacilityCard from '@/components/facility/FacilityCard';
import { Facility, AccessibilityFeature } from '@/types';
import { List, Map as MapIcon, Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';

// Dynamic import prevents SSR crash for Leaflet
const LeafletMap = dynamic(() => import('@/components/facility/Map'), { ssr: false });

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
  disabled_parking: 'Disabled Parking',
};

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lat, lng } = useGeolocation();

  // TASK-15/21: Initialise from URL params (supports voice search → /search?q=...)
  const [searchQuery, setSearchQuery]  = useState(searchParams.get('q') || '');
  const [activeFilters, setActiveFilters] = useState<AccessibilityFeature[]>(
    searchParams.get('features') ? (searchParams.get('features')!.split(',') as AccessibilityFeature[]) : []
  );
  const [viewMode, setViewMode]        = useState<'list' | 'map'>('list');
  const [facilities, setFacilities]    = useState<Facility[]>([]);
  const [loading, setLoading]          = useState(false);

  // Fetch from API whenever filters change
  useEffect(() => {
    fetchFacilities();
  }, [searchQuery, activeFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync when URL changes (e.g. voice assistant pushes new ?q=)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const feats = searchParams.get('features');
    setSearchQuery(q);
    if (feats) setActiveFilters(feats.split(',') as AccessibilityFeature[]);
  }, [searchParams]);

  async function fetchFacilities() {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (activeFilters.length) params.set('features', activeFilters.join(','));

    try {
      const res  = await fetch(`/api/facilities?${params.toString()}`);
      const data = await res.json();
      setFacilities(Array.isArray(data) ? data : []);
    } catch { setFacilities([]); }
    finally { setLoading(false); }
  }

  const toggleFilter = (filter: AccessibilityFeature) => {
    setActiveFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-grow flex overflow-hidden relative">
        {/* Sidebar Filters */}
        <aside aria-label="Search filters" className="w-80 bg-white/70 backdrop-blur-xl border-r border-white/20 overflow-y-auto hidden md:block z-20 shadow-2xl shadow-slate-200/50">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                <SlidersHorizontal size={24} className="text-primary-600" /> Filters
              </h2>
              <button onClick={() => setActiveFilters([])} className="text-xs text-primary-600 font-extrabold hover:text-primary-700 uppercase tracking-widest transition-colors">
                Reset
              </button>
            </div>

            <div className="space-y-3">
              <h3 id="acc-filters-label" className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">Accessibility Needs</h3>
              <fieldset aria-labelledby="acc-filters-label">
                {(Object.keys(ACCESSIBILITY_LABELS) as AccessibilityFeature[]).map(key => (
                  <label key={key} className="flex items-center gap-4 cursor-pointer group p-2 rounded-xl hover:bg-slate-50 transition-all mb-1">
                    <input
                      type="checkbox"
                      checked={activeFilters.includes(key)}
                      onChange={() => toggleFilter(key)}
                      aria-label={ACCESSIBILITY_LABELS[key]}
                      className="w-5 h-5 rounded-lg border-slate-200 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <span className={`text-sm tracking-tight transition-colors ${activeFilters.includes(key) ? 'text-primary-700 font-black' : 'text-slate-600 font-bold'}`}>
                      {ACCESSIBILITY_LABELS[key]}
                    </span>
                  </label>
                ))}
              </fieldset>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main id="main-content" className="flex-grow flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-slate-50/50">
          {/* Search bar + view toggle */}
          <div className="px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-100 bg-white">
            <form onSubmit={handleSearch} className="flex-grow max-w-lg flex gap-2" role="search">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-4 top-3 text-slate-400" size={18} />
                <input
                  type="search"
                  aria-label="Search for accessible healthcare facilities"
                  placeholder="Search facilities, areas, features..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button type="submit" className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-700 transition-all">
                Search
              </button>
            </form>

            <div className="flex items-center gap-1 glass p-1.5 rounded-2xl shadow-sm border-white/60" role="tablist" aria-label="View mode">
              {(['list', 'map'] as const).map(mode => (
                <button key={mode} role="tab" aria-selected={viewMode === mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === mode ? 'bg-primary-600 shadow-lg shadow-primary-500/30 text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                  {mode === 'list' ? <List size={15} /> : <MapIcon size={15} />}
                  {mode === 'list' ? 'List' : 'Map'}
                </button>
              ))}
            </div>
          </div>

          <div className="px-8 py-3 bg-white border-b border-slate-50">
            <p className="text-sm text-slate-500 font-bold" aria-live="polite" aria-atomic="true">
              {loading ? 'Searching...' : <><span className="text-primary-600">{facilities.length}</span> facilities found</>}
            </p>
          </div>

          {/* Results */}
          <div className="flex-grow overflow-y-auto p-4 md:p-8">
            {viewMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-56 bg-white rounded-3xl animate-pulse border border-slate-100" />
                  ))
                ) : facilities.length === 0 ? (
                  <div className="col-span-full py-20 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <SearchIcon size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No facilities found</h3>
                    <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  facilities.map((f, i) => <FacilityCard key={f.id} facility={f} index={i} />)
                )}
              </div>
            ) : (
              <div className="w-full h-[calc(100vh-260px)] min-h-[400px]">
                <LeafletMap facilities={facilities} centerLat={lat} centerLng={lng} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
