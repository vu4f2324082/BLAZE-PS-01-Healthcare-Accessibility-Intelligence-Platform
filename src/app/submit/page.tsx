"use client";
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Upload, Check, ChevronRight, MapPin, Building2, Phone, CheckCircle } from 'lucide-react';
import { AccessibilityFeature } from '@/types';

const ACCESSIBILITY_FEATURES_LIST: { id: AccessibilityFeature; label: string }[] = [
  { id: 'wheelchair_ramp', label: 'Wheelchair Ramp' },
  { id: 'elevator', label: 'Elevator' },
  { id: 'accessible_restroom', label: 'Accessible Restroom' },
  { id: 'braille_signage', label: 'Braille Signage' },
  { id: 'tactile_path', label: 'Tactile Path' },
  { id: 'wide_doorway', label: 'Wide Doorway' },
  { id: 'adjustable_exam_table', label: 'Adjustable Exam Table' },
  { id: 'sign_language_interpreter', label: 'Sign Language Interpreter' },
  { id: 'priority_queue', label: 'Priority Queue' },
  { id: 'disabled_parking', label: 'Disabled Parking' }
];

export default function SubmitFacilityPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'Hospital',
    address: '',
    contact: '',
    features: {} as Record<AccessibilityFeature, boolean>
  });

  const toggleFeature = (id: AccessibilityFeature) =>
    setFormData(prev => ({ ...prev, features: { ...prev.features, [id]: !prev.features[id] } }));

  const handleNextStep = () => {
    if (step === 1 && !formData.name.trim()) { setError('Facility name is required.'); return; }
    if (step === 1 && !formData.address.trim()) { setError('Address is required.'); return; }
    setError('');
    setStep((s: number) => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, type: formData.type, address: formData.address, contact: formData.contact, accessibility: formData.features }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Submission failed.'); return; }
      setSubmitted(true);
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  if (submitted) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-md">
          <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6 text-accent-600">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-3">Submitted!</h2>
          <p className="text-slate-500 mb-8">Thank you! Your facility has been submitted for community verification.</p>
          <a href="/search" className="bg-primary-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-700 transition-all">Back to Search</a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-slate-900 p-10 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-20"><Building2 size={120} /></div>
            <h1 className="text-3xl font-black mb-2 relative z-10">Submit Healthcare Facility</h1>
            <p className="text-slate-400 max-w-md relative z-10">Help millions find accessible healthcare by contributing verified facility information.</p>
            <div className="mt-8 flex gap-2">
              {[1, 2, 3].map(i => <div key={i} className={`h-1.5 rounded-full transition-all ${step >= i ? 'w-12 bg-accent-500' : 'w-6 bg-white/20'}`} />)}
            </div>
          </div>

          <form className="p-10 space-y-8" onSubmit={handleSubmit}>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm font-medium" role="alert">{error}</div>}

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-primary-500 pl-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold text-slate-700">Facility Name *</label>
                    <input id="name" type="text" placeholder="e.g. City Life Hospital"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="type" className="text-sm font-bold text-slate-700">Facility Type</label>
                    <select id="type" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                      <option>Hospital</option><option>Clinic</option><option>Diagnostic Center</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="address" className="text-sm font-bold text-slate-700">Full Address *</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
                      <input id="address" type="text" placeholder="Street, Locality, City, State, PIN"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact" className="text-sm font-bold text-slate-700">Contact Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                      <input id="contact" type="text" placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-primary-500 pl-4">Accessibility Features</h2>
                <p className="text-slate-500 text-sm">Check all features available and verified at this facility.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ACCESSIBILITY_FEATURES_LIST.map(f => (
                    <button key={f.id} type="button" onClick={() => toggleFeature(f.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${formData.features[f.id] ? 'bg-primary-50 border-primary-200 text-primary-900 ring-2 ring-primary-500' : 'bg-white border-slate-200 text-slate-600 hover:border-primary-300'}`}>
                      <span className="font-medium">{f.label}</span>
                      {formData.features[f.id] && <Check className="text-primary-600" size={20} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 text-center py-10">
                <div className="w-24 h-24 bg-accent-100 rounded-full flex items-center justify-center mx-auto text-accent-600"><Upload size={48} /></div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Review & Submit</h2>
                  <p className="text-slate-500">Double-check your details before submitting.</p>
                </div>
                <div className="text-left bg-slate-50 rounded-2xl p-6 space-y-2 max-w-sm mx-auto">
                  <p><strong>Name:</strong> {formData.name}</p>
                  <p><strong>Type:</strong> {formData.type}</p>
                  <p><strong>Address:</strong> {formData.address}</p>
                  <p><strong>Contact:</strong> {formData.contact || 'Not provided'}</p>
                  <p><strong>Features:</strong> {Object.entries(formData.features).filter(([, v]) => v).map(([k]) => k.replace(/_/g, ' ')).join(', ') || 'None selected'}</p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-10 border-t border-slate-100">
              <button type="button" onClick={() => { setError(''); setStep((s: number) => Math.max(1, s - 1)); }}
                className={`px-8 py-3 rounded-xl font-bold transition-all ${step === 1 ? 'invisible' : 'text-slate-500 hover:bg-slate-100'}`}>
                Previous
              </button>
              {step < 3 ? (
                <button type="button" onClick={handleNextStep}
                  className="bg-primary-600 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                  Next Step <ChevronRight size={20} />
                </button>
              ) : (
                <button type="submit" disabled={loading}
                  className="bg-accent-600 text-white px-12 py-3 rounded-xl font-black text-lg hover:bg-accent-700 transition-all shadow-lg shadow-accent-200 disabled:opacity-60">
                  {loading ? 'Submitting...' : 'Submit for Verification'}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
