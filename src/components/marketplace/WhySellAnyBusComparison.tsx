import React from 'react';
import { Check, X, ShieldCheck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const COMPARISON_ROWS = [
  {
    feature: 'RTO Document Verification',
    unorganized: 'Unverified. High risk of expired tax, fake permits, or hidden bank loan hypothecation.',
    sellAnyBus: '100% physically and digitally cross-referenced with Odisha RTO database before publication.',
  },
  {
    feature: 'Mechanical Condition Inspection',
    unorganized: 'None. Buyers must gamble on engine blowby, faulty air brakes, or concealed chassis damage.',
    sellAnyBus: 'Certified 14-Point mechanical report with engine, transmission, brakes & tyre ratings.',
  },
  {
    feature: 'Fair Pricing & Transparency',
    unorganized: 'Inflated broker markups (2% to 5% commission loaded onto both sides).',
    sellAnyBus: 'Direct seller-approved pricing based on Odisha market transaction comparables.',
  },
  {
    feature: 'Buyer & Seller Privacy',
    unorganized: 'Direct mobile numbers plastered on open internet; endless unsolicited scam calls.',
    sellAnyBus: 'Strict privacy. Direct contact masked until verified inspection appointment is scheduled.',
  },
  {
    feature: 'RTO Ownership Transfer Support',
    unorganized: 'Zero assistance after payment; buyers stranded with pending NOC or clearance tasks.',
    sellAnyBus: 'Step-by-step guidance for Form 29/30 submission, RTO tax clearance, and permit transfer.',
  },
];

export function WhySellAnyBusComparison() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">
          The Trusted Difference
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
          Why Odisha Fleets Choose SellAnyBus.in
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          We are a managed trust-and-transaction platform, not an unverified classifieds directory.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider">
              <th className="py-4 px-4 font-bold text-slate-500 w-1/4">Key Standard</th>
              <th className="py-4 px-4 font-bold text-red-700 bg-red-50/50 rounded-t-xl w-3/8">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span>Unorganized Classifieds & Brokers</span>
                </div>
              </th>
              <th className="py-4 px-4 font-bold text-[#0B3C8C] bg-blue-50/70 rounded-t-xl w-3/8">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0B3C8C]" />
                  <span>SellAnyBus Managed Marketplace</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {COMPARISON_ROWS.map((row, idx) => (
              <tr key={row.feature} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900">{row.feature}</td>
                <td className="py-4 px-4 bg-red-50/30 text-slate-600 align-top leading-relaxed">
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{row.unorganized}</span>
                  </div>
                </td>
                <td className="py-4 px-4 bg-blue-50/40 text-slate-800 font-medium align-top leading-relaxed">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{row.sellAnyBus}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          Ready to experience safe commercial vehicle buying and selling in Odisha?
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/buses"
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Explore Verified Inventory
          </Link>
          <Link
            href="/seller/vehicles/new"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            List Your Vehicle
          </Link>
        </div>
      </div>
    </div>
  );
}
