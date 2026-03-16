"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Facility } from '@/types';
import Navbar from '@/components/layout/Navbar';
import FacilityCard from '@/components/facility/FacilityCard';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Bookmark, Search } from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookmarks.length === 0) { setLoading(false); return; }

    // TASK-20: Fetch bookmarked facilities by IDs via API
    fetch(`/api/facilities?ids=${bookmarks.join(',')}`)
      .then(r => r.json())
      .then((data: Facility[]) => {
        // Keep only bookmarked IDs (API may return more with mock data, filter client-side)
        setFacilities(data.filter(f => bookmarks.includes(f.id)));
      })
      .catch(() => setFacilities([]))
      .finally(() => setLoading(false));
  }, [bookmarks.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main id="main-content" className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
            <Bookmark size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Saved Facilities</h1>
            <p className="text-slate-500 text-sm font-medium">{bookmarks.length} saved · stored locally in your browser</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-white rounded-3xl animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : facilities.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Bookmark size={36} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-3">No saved facilities yet</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Tap the heart icon on any facility card to save it here for quick access later.</p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 bg-primary-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
            >
              <Search size={20} /> Explore Facilities
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((fac, i) => (
                <FacilityCard key={fac.id} facility={fac} index={i} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/search" className="text-primary-600 font-bold hover:underline text-sm">
                Find more facilities →
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
