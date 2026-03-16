"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { AlertTriangle, Send, CheckCircle2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const ISSUE_TYPES = ['Wrong Address', 'Closed Facility', 'Incorrect Features', 'Phone Number Issue', 'Other'];

function ReportForm() {
  const searchParams = useSearchParams();
  const facilityIdParam = searchParams.get('facility_id') || '';

  const [facilityId, setFacilityId] = useState(facilityIdParam);
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { setFacilityId(facilityIdParam); }, [facilityIdParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) { setError('Please describe the issue.'); return; }
    if (!issueType) { setError('Please select an issue type.'); return; }
    if (!facilityId.trim()) { setError('Facility ID is required.'); return; }

    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/facilities/${facilityId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue_type: issueType, description }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Submission failed.'); return; }
      setSubmitted(true);
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-20">
        {!submitted ? (
          <div className="space-y-8">
            <Link href="/search" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-primary-600">
              <ChevronLeft size={20} /> Back to Search
            </Link>
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-900">Report Inaccuracy</h1>
              <p className="text-lg text-slate-500">Help us keep accessibility data accurate. What&apos;s wrong with this facility?</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm font-medium" role="alert">{error}</div>}

              {/* Facility ID – pre-filled from URL or editable */}
              {!facilityIdParam && (
                <div className="space-y-2">
                  <label htmlFor="facilityId" className="text-sm font-black text-slate-700 uppercase tracking-widest">Facility ID</label>
                  <input id="facilityId" type="text" placeholder="Enter facility ID"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={facilityId} onChange={e => setFacilityId(e.target.value)} />
                </div>
              )}
              {facilityIdParam && (
                <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm text-slate-600">
                  Reporting for facility: <strong>{facilityIdParam}</strong>
                </div>
              )}

              {/* Issue Type Chips */}
              <div className="space-y-4">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest">Type of Issue *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ISSUE_TYPES.map(type => (
                    <button key={type} type="button" onClick={() => setIssueType(type)}
                      className={`p-4 rounded-2xl border text-left font-bold transition-all ${
                        issueType === type
                          ? 'border-primary-500 bg-primary-50 text-primary-900 ring-2 ring-primary-500'
                          : 'border-slate-200 text-slate-700 hover:border-primary-400 hover:bg-primary-50'
                      }`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-black text-slate-700 uppercase tracking-widest">Additional Details *</label>
                <textarea id="description" rows={6}
                  placeholder="Please describe the correct information or the issue in detail..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-3xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-3xl flex items-start gap-4">
                <AlertTriangle className="text-yellow-600 shrink-0" size={24} />
                <p className="text-sm text-yellow-800 leading-relaxed font-medium">
                  Reports are reviewed by our community within 24-48 hours. Providing clear details helps us verify faster.
                </p>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-3xl font-black text-xl hover:bg-primary-600 transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-60">
                {loading ? 'Submitting...' : 'Submit Report'} {!loading && <Send size={24} />}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-20 space-y-6">
            <div className="w-24 h-24 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={56} />
            </div>
            <h2 className="text-4xl font-black text-slate-900">Thank You!</h2>
            <p className="text-xl text-slate-500 max-w-sm mx-auto">Your report has been received. We&apos;ll review it within 24–48 hours.</p>
            <div className="pt-8">
              <Link href="/search" className="bg-slate-900 text-white px-10 py-3 rounded-2xl font-black text-lg hover:bg-primary-600 transition-all">
                Return to Search
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>}>
      <ReportForm />
    </Suspense>
  );
}
