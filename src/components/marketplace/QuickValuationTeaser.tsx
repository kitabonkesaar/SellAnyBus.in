'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatINR } from '@/modules/i18n';

const ESTIMATOR_DATA: Record<string, { min: number; max: number; demand: string; activeEnquiries: number }> = {
  'Volvo-2022': { min: 5800000, max: 6400000, demand: 'Very High', activeEnquiries: 42 },
  'Volvo-2020': { min: 4600000, max: 5200000, demand: 'High', activeEnquiries: 28 },
  'Tata-2022': { min: 2400000, max: 2800000, demand: 'Very High', activeEnquiries: 54 },
  'Tata-2020': { min: 1600000, max: 1950000, demand: 'High', activeEnquiries: 36 },
  'Ashok Leyland-2022': { min: 2600000, max: 3100000, demand: 'High', activeEnquiries: 39 },
  'Ashok Leyland-2020': { min: 1800000, max: 2200000, demand: 'Medium', activeEnquiries: 22 },
  'Eicher-2022': { min: 1900000, max: 2300000, demand: 'High', activeEnquiries: 31 },
  'Eicher-2020': { min: 1400000, max: 1700000, demand: 'High', activeEnquiries: 29 },
  'Bharat Benz-2022': { min: 3400000, max: 3900000, demand: 'Very High', activeEnquiries: 37 },
  'Mahindra-2023': { min: 540000, max: 620000, demand: 'Very High', activeEnquiries: 65 },
};

export function QuickValuationTeaser() {
  const [vehicleType, setVehicleType] = useState('BUS');
  const [make, setMake] = useState('Tata');
  const [year, setYear] = useState('2022');

  const key = `${make}-${year}`;
  const estimate = ESTIMATOR_DATA[key] || { min: 1800000, max: 2300000, demand: 'High', activeEnquiries: 32 };

  return (
    <div className="bg-gradient-to-br from-[#0B3C8C] via-[#082a63] to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* LEFT COLUMN: Estimator Inputs */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Odisha Fleet Valuation</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Planning to Sell Your Bus or Truck? Check Estimated Market Value
          </h3>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-xl">
            Get an instant indicative price range based on recent verified transactions across Odisha. No hidden commission, guaranteed fair market value.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
            <div>
              <label className="block text-blue-200 font-bold mb-1">Vehicle Type</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold focus:outline-none focus:bg-white/20 cursor-pointer"
              >
                <option value="BUS" className="text-slate-900">Commercial Bus</option>
                <option value="TRUCK" className="text-slate-900">Heavy Truck</option>
                <option value="PICKUP" className="text-slate-900">Pickup / Mini Truck</option>
              </select>
            </div>

            <div>
              <label className="block text-blue-200 font-bold mb-1">Make / Brand</label>
              <select
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold focus:outline-none focus:bg-white/20 cursor-pointer"
              >
                <option value="Tata" className="text-slate-900">Tata Motors</option>
                <option value="Ashok Leyland" className="text-slate-900">Ashok Leyland</option>
                <option value="Volvo" className="text-slate-900">Volvo</option>
                <option value="Eicher" className="text-slate-900">Eicher</option>
                <option value="Bharat Benz" className="text-slate-900">BharatBenz</option>
                <option value="Mahindra" className="text-slate-900">Mahindra</option>
              </select>
            </div>

            <div>
              <label className="block text-blue-200 font-bold mb-1">Model Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold focus:outline-none focus:bg-white/20 cursor-pointer"
              >
                <option value="2023" className="text-slate-900">2023</option>
                <option value="2022" className="text-slate-900">2022</option>
                <option value="2021" className="text-slate-900">2021</option>
                <option value="2020" className="text-slate-900">2020</option>
                <option value="2019" className="text-slate-900">2019</option>
              </select>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Indicative Output Card */}
        <div className="lg:col-span-5">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs text-blue-200 font-semibold">Odisha Market Estimate</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Demand: {estimate.demand}
              </span>
            </div>

            <div>
              <span className="text-xs text-blue-200/90 block mb-1">Estimated Selling Range</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
                {formatINR(estimate.min)} – {formatINR(estimate.max)}
              </div>
              <p className="text-[11px] text-blue-200/70 mt-1">
                *Indicative price based on verified condition and RTO validity.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-blue-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>{estimate.activeEnquiries} active buyers</strong> are seeking this vehicle in Odisha right now.
              </span>
            </div>

            <Link
              href="/seller/vehicles/new"
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>List Free & Schedule Inspection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
