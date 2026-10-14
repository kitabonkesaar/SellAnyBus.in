import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, ArrowRight, CheckCircle2, TrendingUp, Users, Wrench } from 'lucide-react';

export const metadata = {
  title: 'Sell Your Commercial Bus in Odisha | SellAnyBus.in',
  description: 'Sell your used bus or coach in Odisha with certified inspection, RTO clearance, and zero upfront fees.',
};

export default function SellYourBusPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0B3C8C] text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4" />
              Verified Commercial Platform
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Sell Your Bus Faster at True Market Value
            </h1>
            <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
              Skip endless phone calls from unqualified buyers. SellAnyBus provides certified mechanical inspections, RTO document clearance, and qualified operators looking for genuine buses in Odisha.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/seller/vehicles/new"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px]"
              >
                <span>List Your Bus (Free)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold text-sm transition-colors min-h-[48px] flex items-center justify-center"
              >
                How It Works
              </Link>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B3C8C] flex items-center justify-center mb-4 font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Seller-Approved Pricing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our commercial bus valuation engine calculates an indicative price range. We never publish your bus until you explicitly confirm and approve the final asking price.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 font-bold">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">14-Point Certified Inspection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A physical mechanical inspection builds trust with out-of-district buyers, enabling rapid deals without tedious multiple inspections.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Zero Spam & Direct REACH</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your phone number is never displayed publicly. Our sales advisors qualify all buyer enquiries before bringing serious buyers to you.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
