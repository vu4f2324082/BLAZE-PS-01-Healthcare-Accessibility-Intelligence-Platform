"use client";
import { useState, useEffect, use } from 'react';
import { Facility, Review } from '@/types';
import { generateMockFacilities } from '@/lib/mockData';
import Navbar from '@/components/layout/Navbar';
import { MapPin, Phone, Globe, Clock, ShieldCheck, Star, Heart, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useBookmarks } from '@/hooks/useBookmarks';

export default function FacilityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const hospitals = generateMockFacilities(50);
  const facility: Facility = hospitals.find(h => h.id === id) || hospitals[0];
  const { toggleBookmark, isBookmarked } = useBookmarks();
  
  // Live reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', user_name: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    // Fetch real reviews from API
    fetch(`/api/facilities/${facility.id}/reviews`)
      .then(r => r.ok ? r.json() : [])
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [facility.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) { setReviewError('Comment is required.'); return; }
    setReviewLoading(true); setReviewError('');
    try {
      const res = await fetch(`/api/facilities/${facility.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });
      if (!res.ok) { const d = await res.json(); setReviewError(d.error || 'Failed to submit.'); return; }
      const newReview = await res.json();
      setReviews(prev => [{ ...newReview, date: newReview.date }, ...prev]);
      setReviewSuccess(true);
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '', user_name: '' });
    } catch { setReviewError('Network error. Please try again.'); }
    finally { setReviewLoading(false); }
  };

  const handleDirections = () => {
    const query = encodeURIComponent(`${facility.name}, ${facility.address}`);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Gallery Area */}
      <div className="relative h-[400px] bg-slate-900 overflow-hidden">
        <img src={facility.photos[0]} alt={facility.name} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">{facility.type}</span>
                {facility.verified && (
                  <span className="bg-accent-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white">{facility.name}</h1>
              <div className="flex items-center gap-4 text-blue-100">
                <div className="flex items-center gap-1"><MapPin size={18} className="text-accent-400" /><span>{facility.address}</span></div>
                <div className="flex items-center gap-1"><Star size={18} className="text-yellow-400 fill-yellow-400" /><span className="font-bold">{facility.rating} / 5</span></div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 text-center min-w-[200px]">
              <div className="text-sm font-bold text-blue-200 uppercase tracking-widest mb-1">Accessibility Score</div>
              <div className={`text-6xl font-black ${facility.accessibility_score > 80 ? 'text-green-400' : facility.accessibility_score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {facility.accessibility_score}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* Accessibility Checklist */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              Accessibility Features <span className="h-1 flex-grow bg-slate-100 rounded-full" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(facility.accessibility_features).map(([key, value]) => (
                <div key={key} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${value ? 'bg-accent-50 border-accent-100 text-accent-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'}`}>
                  <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                  {value ? <ShieldCheck className="text-accent-600" size={20} /> : <span className="text-xs uppercase tracking-tighter">Not Available</span>}
                </div>
              ))}
            </div>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">Services Offered <span className="h-1 flex-grow bg-slate-100 rounded-full" /></h2>
            <div className="flex flex-wrap gap-3">
              {facility.services.map(service => (
                <span key={service} className="bg-slate-100 text-slate-700 px-6 py-2 rounded-xl font-bold border border-slate-200">{service}</span>
              ))}
            </div>
          </section>

          {/* Reviews Section */}
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                Reviews ({reviews.length}) <span className="h-1 w-24 bg-slate-100 rounded-full" />
              </h2>
              <button onClick={() => setShowReviewForm(!showReviewForm)} className="text-primary-600 font-bold hover:underline">
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-slate-50 rounded-3xl p-6 mb-8 space-y-4 border border-slate-200">
                {reviewError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm" role="alert">{reviewError}</div>}
                <div className="flex gap-2 items-center">
                  <label className="text-sm font-bold text-slate-700">Rating:</label>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setReviewForm(f => ({...f, rating: n}))}
                      className={`p-1 transition-all ${reviewForm.rating >= n ? 'text-yellow-500' : 'text-slate-300'}`}>
                      <Star size={20} className={reviewForm.rating >= n ? 'fill-current' : ''} />
                    </button>
                  ))}
                </div>
                <input type="text" placeholder="Your name (optional)" value={reviewForm.user_name}
                  onChange={e => setReviewForm(f => ({...f, user_name: e.target.value}))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                <textarea placeholder="Share your experience..." rows={3} value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({...f, comment: e.target.value}))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                <button type="submit" disabled={reviewLoading}
                  className="bg-primary-600 text-white px-8 py-2 rounded-xl font-bold text-sm hover:bg-primary-700 transition-all disabled:opacity-60">
                  {reviewLoading ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            )}

            {reviewSuccess && (
              <div className="bg-accent-50 border border-accent-200 text-accent-800 px-5 py-3 rounded-xl text-sm font-medium mb-4">
                ✅ Review submitted! Thank you for your contribution.
              </div>
            )}

            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-slate-400 italic text-center py-8">No reviews yet. Be the first to review!</p>
              ) : reviews.map(review => (
                <div key={review.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
                        {(review.user_name || 'A')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{review.user_name || 'Anonymous'}</div>
                        <div className="text-xs text-slate-500">{new Date(review.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                      </div>
                    </div>
                    <div className="flex text-yellow-500">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} size={14} className={review.rating >= star ? 'fill-current' : 'text-slate-200'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 italic">&quot;{review.comment}&quot;</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl sticky top-24">
            <h3 className="text-xl font-bold mb-6">Contact &amp; Visiting</h3>
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <Phone className="text-accent-400 mt-1" size={20} />
                <div><div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Call Center</div>
                  <div className="text-lg font-bold">{facility.contact}</div></div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="text-accent-400 mt-1" size={20} />
                <div><div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Hours</div>
                  <div className="text-lg font-bold">Open 24 Hours</div></div>
              </div>
              <div className="flex items-start gap-4">
                <Globe className="text-accent-400 mt-1" size={20} />
                <div><div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Website</div>
                  <div className="text-lg font-bold">hospital.gov.in</div></div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button onClick={handleDirections}
                className="bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-primary-900/40 flex items-center justify-center gap-2">
                <MapPin size={20} /> Get Directions
              </button>
              <button onClick={() => toggleBookmark(facility.id)}
                className={`py-4 rounded-2xl font-black transition-all border flex items-center justify-center gap-2 ${
                  isBookmarked(facility.id)
                    ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-900/30'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}>
                <Heart size={20} className={isBookmarked(facility.id) ? 'fill-current' : ''} />
                {isBookmarked(facility.id) ? 'Saved' : 'Save Facility'}
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 text-center">
              <p className="text-sm text-slate-400 mb-4">Help us keep this data accurate</p>
              <Link href={`/report?facility_id=${facility.id}`} className="text-accent-400 font-bold hover:underline flex items-center justify-center gap-2">
                <AlertCircle size={16} /> Report inaccuracy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
