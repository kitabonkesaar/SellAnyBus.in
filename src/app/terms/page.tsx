import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Terms of Use | SellAnyBus.in',
  description: 'Terms of service and listing conditions for commercial bus buyers and sellers on SellAnyBus.in.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">Platform Agreement</span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Terms of Use</h1>
            <p className="text-xs text-slate-500 mt-1">Effective Date: October 2026</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Nature of Platform</h2>
              <p>
                SellAnyBus.in is a managed commercial marketplace. We provide verification, mechanical inspection, and marketing services. We do not act as the direct legal owner of vehicles listed on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. Mandatory Seller Price Approval</h2>
              <p>
                A vehicle listing is only published upon explicit recorded approval of the recommended asking price by the registered seller. Sellers retain the right to suspend or withdraw listings prior to execution of formal sale agreements.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. RTO Ownership Transfer Guidance Disclaimer</h2>
              <p>
                SellAnyBus guides parties through standard Motor Vehicles Act documentation procedures (such as Form 29, Form 30, RTO NOC issuance, and commercial permit transfers). SellAnyBus does not replace or supersede the official statutory authority of Regional Transport Offices (RTOs) in Odisha or other Indian states.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. Fraud & Misrepresentation</h2>
              <p>
                Any intentional tampering of chassis numbers, odometer readings, or submission of forged permits will result in immediate permanent banning, listing deletion, and formal escalation to Odisha transport enforcement authorities.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
