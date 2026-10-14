import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata = {
  title: 'Grievance Redressal Officer | SellAnyBus.in',
  description: 'Designated Grievance Officer details under the Digital Personal Data Protection Act, 2023.',
};

export default function GrievancePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">Statutory Notice</span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Grievance Redressal Mechanism</h1>
            <p className="text-xs text-slate-500 mt-1">In compliance with Section 13 of the DPDP Act 2023</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
            <p>
              In accordance with the Digital Personal Data Protection Act, 2023 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the designated Grievance Officer for SellAnyBus.in is:
            </p>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="font-black text-slate-900 text-base">Mr. Priyadarshan Mohanty</div>
              <div className="text-xs text-slate-600">Lead Compliance & Data Protection Officer</div>
              <div className="pt-2 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#0B3C8C]" />
                  <span>Email: <strong>grievance@sellanybus.in</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0B3C8C]" />
                  <span>Phone: <strong>+91 98765 43219</strong> (Working days 10:00 AM - 5:00 PM)</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#0B3C8C] shrink-0 mt-0.5" />
                  <span>Address: SellAnyBus India Pvt. Ltd., Tower 3, Infocity IT Park, Patia, Bhubaneswar, Odisha 751024</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-900">Escalation & Timelines</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                <li>Every grievance or data deletion request will be formally acknowledged within <strong>24 hours</strong> with a unique ticket number.</li>
                <li>Investigations and formal resolution will be completed within <strong>15 business days</strong>.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
