import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | SellAnyBus.in',
  description: 'SellAnyBus.in privacy policy complying with the Indian Digital Personal Data Protection Act, 2023.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">Legal & Compliance</span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Privacy Policy & Notice</h1>
            <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026 (Version 1.0)</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Compliance Commitment</h2>
              <p>
                SellAnyBus India Pvt. Ltd. (&quot;SellAnyBus&quot;, &quot;we&quot;, &quot;us&quot;) operates SellAnyBus.in in strict compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000 of India. This Privacy Notice informs you about how we handle vehicular, personal, and identity data.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Seller Data:</strong> Mobile number, full name, business entity name, district of operation, vehicle registration numbers, and uploaded compliance documents (RC, Insurance, Fitness, Commercial Permit, Tax receipts).</li>
                <li><strong>Buyer Data:</strong> Mobile number, full name, intended bus commercial use, and purchase timeline.</li>
                <li><strong>Sensitive Identifiers:</strong> Vehicle chassis numbers and engine numbers are encrypted at rest using AES-256-GCM and never displayed publicly.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. Never Publicly Exposed</h2>
              <p>
                Under no circumstances do we publish seller mobile numbers, identity proof documents, or private RTO paperwork on public listings or public APIs. All buyer-seller contact is mediated through our verified sales advisory desk.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. Rights of Data Principals</h2>
              <p>
                You retain full rights to request an export of your personal information, request corrections, or request deletion of your account. For inquiries, email our designated Grievance Officer at{' '}
                <a href="mailto:grievance@sellanybus.in" className="text-[#0B3C8C] font-semibold underline">
                  grievance@sellanybus.in
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
