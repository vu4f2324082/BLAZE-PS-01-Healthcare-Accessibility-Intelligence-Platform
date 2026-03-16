"use client";
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { AlertTriangle, Send, CheckCircle2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReportPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-20">
        {!submitted ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Link href="/search" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-primary-600">
              <ChevronLeft size={20} /> Back to Search
            </Link>

            <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-900">Report Inaccuracy</h1>
              <p className="text-lg text-slate-500">Help us keep the accessibility data accurate. What's wrong with this facility's information?</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest">Type of Issue</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Wrong Address', 'Closed Facility', 'Incorrect Features', 'Phone Number Issue', 'Other'].map(type => (
                    <button key={type} className="p-4 rounded-2xl border border-slate-200 text-left font-bold text-slate-700 hover:border-primary-400 hover:bg-primary-50 transition-all">
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest">Additional Details</label>
                <textarea 
                  rows={6}
                  placeholder="Please describe the correct information or the issue in detail..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-3xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-3xl flex items-start gap-4">
                <AlertTriangle className="text-yellow-600 shrink-0" size={24} />
                <p className="text-sm text-yellow-800 leading-relaxed font-medium">
                  Reports are reviewed by our community within 24-48 hours. Providing clear details helps us verify faster.
                </p>
              </div>

              <button 
                onClick={() => setSubmitted(true)}
                className="w-full bg-slate-900 text-white py-4 rounded-3xl font-black text-xl hover:bg-primary-600 transition-all flex items-center justify-center gap-3 shadow-2xl"
              >
                Submit Report
                <Send size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 space-y-6 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={56} />
            </div>
            <h2 className="text-4xl font-black text-slate-900">Thank You!</h2>
            <p className="text-xl text-slate-500 max-w-sm mx-auto">
              Your report has been received. You've earned 50 Impact Points for helping the community.
            </p>
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
