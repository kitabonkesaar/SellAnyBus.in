import React from 'react';
import { ShieldCheck, FileCheck, Wrench, Ban, Award } from 'lucide-react';

export function BuyerProtectionGrid() {
  const protections = [
    {
      icon: FileCheck,
      title: '100% RTO Clear Title Guarantee',
      badge: 'Zero Loan Liability',
      description:
        'Every RC, fitness certificate, road tax token, stage carriage / contract permit, and national green permit is physically cross-verified with Odisha RTO records to guarantee no pending bank hypothecation disputes or unpaid challans.',
    },
    {
      icon: Wrench,
      title: '14-Point Diagnostic Scorecard',
      badge: 'Certified Mechanics',
      description:
        'No guesswork. Our heavy commercial engineers test turbo health, engine blow-by under load, full air brake dual-chamber pressure build time (< 3 mins), leaf spring suspension, and front tyre tread depth before approval.',
    },
    {
      icon: Ban,
      title: 'Strict Zero Brokerage Policy',
      badge: 'Direct Pricing',
      description:
        'Traditional agents inflate bus prices by ₹1,00,000 to ₹3,00,000 for secret cuts. SellAnyBus connects verified buyers directly to verified sellers with transparent, seller-approved valuation pricing and ₹0 buyer commission.',
    },
    {
      icon: Award,
      title: 'Odisha RTO NOC & Transfer Desk',
      badge: 'End-to-End Handholding',
      description:
        'Whether shifting registration from Berhampur (OD-07) to Sambalpur (OD-15) or interstate transfer to West Bengal, Andhra Pradesh, or Jharkhand, our compliance team assists with Form 28/29/30 filing and permit endorsement.',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0B3C8C] text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Commercial Buyer Peace of Mind</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            The SellAnyBus 4-Way Commercial Guarantee
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Never risk lakhs of rupees on unverified online classifieds. Here is how we protect fleet operators, school boards, and bus entrepreneurs.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Odisha Transport Association Trusted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {protections.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 hover:border-blue-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0B3C8C] flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-black text-slate-700 shadow-2xs">
                    {p.badge}
                  </span>
                </div>
                <h4 className="font-bold text-base text-slate-900 mb-2">{p.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
