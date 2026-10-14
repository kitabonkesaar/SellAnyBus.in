'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Wrench, FileCheck, Gauge, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CheckItem {
  name: string;
  desc: string;
  standard: string;
}

const INSPECTION_MODULES = [
  {
    id: 'engine',
    title: 'Engine & Powertrain',
    icon: Wrench,
    score: '96% Avg Pass',
    checks: [
      {
        name: 'Engine Compression & Blow-by',
        desc: 'Testing crankcase blow-by pressure, cylinder balance, and cold-start smoke density.',
        standard: 'Zero blow-by under load; clean exhaust emission within BS-IV/BS-VI limits.',
      },
      {
        name: 'Turbocharger & Intercooler',
        desc: 'Checking axial shaft play, impeller blade condition, and boost pressure under rpm.',
        standard: 'Zero oil leakage in intake duct; instant boost response.',
      },
      {
        name: 'Clutch & Transmission Mesh',
        desc: 'Assessing clutch bite point, synchromesh engagement across all gears, and gear rattle.',
        standard: 'Smooth clutch pedal travel; no gear slippage under incline load.',
      },
    ],
  },
  {
    id: 'brakes',
    title: 'Dual Air Brakes & Safety',
    icon: Gauge,
    score: '98% Safety Compliance',
    checks: [
      {
        name: 'Air Tank Dual Circuit Pressure',
        desc: 'Testing pneumatic reservoir compressor cut-in/cut-out pressures and brake chamber hold.',
        standard: 'Full dual circuit holds 8.5 bar without leakage for 15+ minutes.',
      },
      {
        name: 'Hydrodynamic Retarder & ABS',
        desc: 'Electronic diagnostic scan of ABS sensors on all wheel hubs and electromagnetic retarder.',
        standard: 'All ABS wheel speed sensors active; multi-stage retarder decelerates reliably.',
      },
      {
        name: 'Emergency Exits & Break-Glass Hammers',
        desc: 'Testing rear emergency door latch mechanism and verifying presence of safety hammers.',
        standard: 'Immediate unhindered exit latch release; Supreme Court safety compliance.',
      },
    ],
  },
  {
    id: 'chassis',
    title: 'Chassis & Suspension',
    icon: ShieldCheck,
    score: '100% Structural Check',
    checks: [
      {
        name: 'Heavy Duty Ladder Frame Welds',
        desc: 'Ultrasonic and visual inspection of chassis side members for fractures, bend, or rust.',
        standard: 'Factory straight chassis; zero non-authorized chassis cutting or weld defects.',
      },
      {
        name: 'Air Bellows & Leaf Springs',
        desc: 'Checking pneumatic air spring bellows for deflation and parabolic leaf spring shackle bushes.',
        standard: 'Even ride height across both axles; zero cracked spring leaves.',
      },
      {
        name: 'Commercial Radial Tyre Tread',
        desc: 'Laser depth measurement across all 6 to 10 tyres including twin rear axles.',
        standard: 'Minimum 5mm legal tread depth on steering and drive axles.',
      },
    ],
  },
  {
    id: 'rto',
    title: 'RTO & Legal Documents',
    icon: FileCheck,
    score: '100% Verified Only',
    checks: [
      {
        name: 'Registration Certificate (RC) & Engine No.',
        desc: 'Physical verification of engine number and chassis stamp against Odisha Vahan RTO database.',
        standard: 'Exact chassis engraving match; genuine registered ownership confirmed.',
      },
      {
        name: 'Permit & Commercial Fitness Certificate',
        desc: 'Validation of stage carriage, contract carriage, or school bus permit validity.',
        standard: 'Active fitness certificate issued by Odisha MVI; valid MV tax token receipt.',
      },
      {
        name: 'Bank Hypothecation & NOC Status',
        desc: 'Checking financier lien on Vahan portal to ensure clear title or bank NOC availability.',
        standard: 'Clear title or verified bank NOC ready for instant RTO ownership transfer.',
      },
    ],
  },
];

export function InspectionExplorer() {
  const [activeTab, setActiveTab] = useState(INSPECTION_MODULES[0].id);
  const activeModule = INSPECTION_MODULES.find((m) => m.id === activeTab) || INSPECTION_MODULES[0];

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Zero-Compromise Vehicle Quality
          </span>
          <h3 className="text-2xl sm:text-3xl font-black mt-1 text-white">
            Inside the 14-Point Mechanical Inspection
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
            Every vehicle on SellAnyBus must pass physical inspection by our certified commercial vehicle engineers. Click the modules below to review standard checks.
          </p>
        </div>

        <Link
          href="/inspection-services"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors shrink-0"
        >
          <span>Full Checklist Doc</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* MODULE SELECTOR TABS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {INSPECTION_MODULES.map((m) => {
          const Icon = m.icon;
          const isSelected = m.id === activeTab;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveTab(m.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-600/30 border-blue-500 shadow-lg text-white'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {m.score}
                </span>
              </div>
              <div className="font-bold text-xs sm:text-sm text-white">{m.title}</div>
            </button>
          );
        })}
      </div>

      {/* DETAILED CHECKLIST CARD */}
      <div className="bg-slate-950/70 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-base text-white">{activeModule.title} Inspection Checklist</h4>
          </div>
          <span className="text-xs text-slate-400 font-medium">Standardized Odisha MVI Protocol</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeModule.checks.map((check, idx) => (
            <div
              key={check.name}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800/80 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-blue-900/60 text-blue-300 font-black text-[11px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-200">{check.name}</h5>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{check.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[11px]">
                <span className="text-amber-400 font-bold block mb-0.5">Required Standard:</span>
                <span className="text-slate-300">{check.standard}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
