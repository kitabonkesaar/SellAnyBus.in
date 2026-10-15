import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, FileCheck2, Wrench, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'How It Works | Verified Bus Marketplace in Odisha | SellAnyBus.in',
  description:
    'Learn how SellAnyBus verifies commercial buses, executes 14-point mechanical diagnostic inspections, audits RTO papers, and mediates zero-brokerage deals across Odisha.',
  keywords: [
    'how to buy used bus odisha',
    'commercial bus inspection odisha',
    'bus rto verification process',
    'sellanybus process',
  ],
  alternates: {
    canonical: 'https://sellanybus.in/how-it-works',
  },
  openGraph: {
    title: 'How SellAnyBus.in Works | Verified Used Bus Buying & Selling in Odisha',
    description: 'Managed commercial bus marketplace process: RTO document check, 14-point mechanical inspection, seller-approved pricing, and guided handoff.',
    locale: 'en_IN',
    type: 'website',
    url: 'https://sellanybus.in/how-it-works',
  },
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">
              Transparent Process
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
              How SellAnyBus Works
            </h1>
            <p className="text-slate-600 text-sm mt-3">
              We operate as a managed marketplace, guaranteeing trust between commercial fleet operators and bus buyers.
            </p>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0B3C8C] flex items-center justify-center font-black text-xl shrink-0">
                1
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Vehicle Onboarding & Document Audit</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Sellers submit basic specifications, minimum 6 high-resolution photos, and required compliance documents (Registration Certificate, Commercial Permit, Fitness Certificate, Odisha Road Tax Token, Insurance Policy). Our compliance desk cross-checks all records with RTO databases.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xl shrink-0">
                2
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">14-Point Physical Inspection</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A certified commercial vehicle inspector conducts a hands-on technical check of the bus covering engine blow-by, turbocharger, air brake pressure build time, suspension leaf/air springs, radial tyre tread depth, and chassis alignment.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-xl shrink-0">
                3
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Valuation & Mandatory Seller Price Approval</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our commercial pricing engine analyzes recent transactions in Odisha to generate an indicative price range. The seller reviews the recommendation and must explicitly approve the final asking price before the vehicle can be published.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-black text-xl shrink-0">
                4
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Qualified Enquiries & Mediated Transaction</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Qualified buyers submit formal purchase enquiries. Dedicated sales advisors coordinate physical viewings, mediate fair negotiations, and provide guidance for RTO Form 29/30 transfer filings and NOC issuance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
