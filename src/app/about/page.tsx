import Navbar from '@/components/layout/Navbar';
import { Info, Target, Users, HelpCircle, ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const faqs = [
    { q: "How is the Accessibility Score calculated?", a: "The score is a percentage based on 10 key features. Each feature (like wheelchair ramps or braille signage) contributes 10% to the total score. Verified features weigh more than unverified ones." },
    { q: "How can I contribute to AccessHealth?", a: "You can sign up and click 'Add Facility' or 'Update' on any existing facility page. Uploading photos is the best way to help our verifiers confirm the features." },
    { q: "Is the data verified by medical professionals?", a: "Data is crowdsourced and verified by community 'Super Contributors' and our internal team. Always call the facility to confirm critical requirements before visiting." },
    { q: "Does AccessHealth support languages other than English?", a: "Yes, we are rolling out Hindi support! You can find the language toggle in your user settings (coming soon)." }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Mission Section */}
        <section className="bg-primary-50 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm text-primary-600 mb-6">
              <Target size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 italic">Making Healthcare Accessible for <span className="text-primary-600">Everyone.</span></h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              AccessHealth was born out of a simple realization: for many, finding a hospital isn't just about the quality of care, but whether they can even enter the building. Our mission is to map every healthcare facility's accessibility intelligence.
            </p>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center text-accent-600 mx-auto">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-bold">Community Driven</h3>
              <p className="text-slate-500">Built by and for persons with disabilities, ensuring the data that matters is collected.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mx-auto">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold">Verified Data</h3>
              <p className="text-slate-500">Every submission undergoes a multi-layer verification process before going live.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-bold">Fully Inclusive</h3>
              <p className="text-slate-500">From high-contrast modes to screen reader support, we design for every user.</p>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-20 px-4 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black mb-12 flex items-center gap-4">
              <Info size={32} className="text-accent-400" />
              Scoring Methodology
            </h2>
            <div className="space-y-8">
              <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                <h3 className="text-xl font-bold mb-4">The Base 10 Framework</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  We track exactly 10 high-impact accessibility features for every facility. Each feature is binary (Available/Not Available).
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {['Ramps', 'Elevators', 'Restrooms', 'Braille', 'Tactile', 'Doors', 'Tables', 'Signing', 'Queues', 'Parking'].map(f => (
                    <div key={f} className="text-center p-3 bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest">{f}</div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 border border-white/10 rounded-3xl">
                  <h4 className="font-bold mb-2">Verified Weighting</h4>
                  <p className="text-sm text-slate-400">Features verified by multiple users or photographic evidence receive a 1.2x multiplier in the score calculation.</p>
                </div>
                <div className="p-6 border border-white/10 rounded-3xl">
                  <h4 className="font-bold mb-2">User Sentiment</h4>
                  <p className="text-sm text-slate-400">Reviews specifically mentioning accessibility adjust the score +/- 5% dynamically based on sentiment.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-center mb-16 flex items-center justify-center gap-4">
              <HelpCircle size={32} className="text-primary-600" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <h4 className="text-lg font-black text-slate-900 mb-2">{faq.q}</h4>
                  <p className="text-slate-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 py-12 border-t mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <span className="text-xl font-black text-primary-600">Access<span className="text-accent-600">Health</span></span>
          <p className="mt-4 text-slate-500 text-sm">© 2026 AccessHealth Platform. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-6 text-sm font-bold text-slate-400">
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-slate-900 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
