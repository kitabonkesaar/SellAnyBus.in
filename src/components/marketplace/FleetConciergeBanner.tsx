import React from 'react';
import { PhoneCall, MessageSquare, CheckCircle2, Building } from 'lucide-react';

export function FleetConciergeBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 rounded-3xl p-8 sm:p-12 shadow-lg border border-amber-300 relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 text-white text-xs font-bold uppercase tracking-wider">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span>Fleet Owners & Institutional Operators</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-black text-slate-950 leading-tight">
            Selling 2 or More Buses? Get Dedicated Fleet Liquidation Concierge
          </h3>

          <p className="text-sm sm:text-base text-slate-900 font-medium max-w-2xl leading-relaxed">
            School trusts, tour & travel companies, and industrial mining contractors: sell your entire fleet without managing individual buyer calls. We send certified engineers directly to your garage/depot for free bulk valuations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-bold text-slate-950">
            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-xs px-3.5 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>Depot Inspection in 48 Hrs</span>
            </div>
            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-xs px-3.5 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>Bulk Institutional Buyers</span>
            </div>
            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-xs px-3.5 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>Single Cheque / Escrow Payout</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
          <div className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            Direct Odisha Fleet Desk
          </div>
          <div className="text-xl font-black text-white">
            Speak to Our Head of Transport Acquisitions
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Mon–Sat, 9:00 AM – 7:30 PM IST. Same-day confidential consultation across Odisha.
          </p>

          <div className="space-y-2.5 pt-2">
            <a
              href="tel:+919876543210"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call +91 98765 43210</span>
            </a>

            <a
              href="https://wa.me/919876543210?text=Hello%20SellAnyBus%20Team%2C%20I%20want%20to%20sell%20commercial%20buses%20in%20Odisha."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Fleet Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
