import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Wrench, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata = {
  title: '14-Point Commercial Bus Mechanical Inspection Standard | SellAnyBus.in',
  description:
    'Explore our rigorous 14-point mechanical and safety inspection protocol for used commercial buses in Odisha: engine blow-by, turbo, air brake build time, suspension, and chassis integrity.',
  keywords: [
    'commercial bus inspection odisha',
    'bus mechanical test odisha',
    'bus fitness check bhubaneswar',
    'used bus valuation inspection',
  ],
  alternates: {
    canonical: 'https://sellanybus.in/inspection-services',
  },
  openGraph: {
    title: '14-Point Commercial Bus Inspection Standard | SellAnyBus.in',
    description: 'Certified commercial mechanics evaluate engine blow-by, turbo, dual-circuit air brakes, and chassis alignment before publishing any bus.',
    locale: 'en_IN',
    type: 'website',
    url: 'https://sellanybus.in/inspection-services',
  },
};

const CHECKLIST_ITEMS = [
  { title: 'Engine & Oil Pressure', desc: 'Checks cold startup, oil pressure stability, exhaust blow-by, turbocharger operation, and engine mount dampening.' },
  { title: 'Transmission & Gearbox', desc: 'Evaluates synchromesh engagement, gear shifter linkage, reverse gear lock, and abnormal whining or vibration.' },
  { title: 'Clutch & Flywheel', desc: 'Assesses clutch pedal free play, booster air pressure assist, slippage under full load, and thrust bearing noise.' },
  { title: 'Full Air Brake System', desc: 'Measures dual-circuit air tank pressure build time (from 0 to 8 bar), pneumatic valve leaks, brake lining thickness, and slack adjusters.' },
  { title: 'Suspension & Air Bellows', desc: 'Inspects leaf spring leaves, shackle pins, parabolic front springs, rear air suspension bellows, and leveling valves.' },
  { title: 'Steering Mechanism', desc: 'Tests hydraulic power steering pump pressure, drag link ball joints, tie rod ends, and steering box center play.' },
  { title: 'Radial Tyres & Wheels', desc: 'Measures tread depth (mm) across steer, drive, and tag axles; inspects rim cracks, lug nuts, and tyre sidewall bulges.' },
  { title: 'Electrical & Charging', desc: 'Tests 24V alternator charging output under full lighting and AC load, battery health, starter motor, and wiring harnesses.' },
  { title: 'AC System & Compressors', desc: 'Tests roof-mounted unit cooling capacity, cabin temperature pull-down speed, refrigerant lines, condenser fan motors, and duct louvers.' },
  { title: 'Body & Chassis Structure', desc: 'Detailed visual and ultrasonic test for main chassis rail cracks, cross-member twisting, floor corrosion, and underbody skirt damage.' },
  { title: 'Interior & Seating', desc: 'Evaluates pushback recliner mechanisms, armrest sturdiness, seat track anchorages, gangway clearance, and window glasses.' },
  { title: 'Emergency Exits & SC Norms', desc: 'Checks Supreme Court guidelines compliance: emergency door operation, roof hatch release, break-glass hammers, and fire extinguishers.' },
  { title: 'Commercial Lights & Signals', desc: 'Validates all headlights, fog lights, LED marker roof lamps, brake indicators, reversing sirens, and hazard warning flashers.' },
  { title: 'Documents vs Physical Stamping', desc: 'Physical verification matching the engine serial plate and engraved chassis rail numbers with official RTO registration records.' },
];

export default function InspectionServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0B3C8C] text-xs font-bold uppercase tracking-wider mb-4">
              <Wrench className="w-4 h-4" />
              Safety & Mechanical Verification
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Our 14-Point Commercial Bus Inspection Standard
            </h1>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              Every passenger vehicle listed on SellAnyBus undergoes our comprehensive technical evaluation conducted by certified commercial vehicle inspectors in Odisha.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {CHECKLIST_ITEMS.map((item, idx) => (
              <div
                key={item.title}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-start"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-[#072458] to-[#0B3C8C] text-white p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-xl font-bold">Have a Bus to Inspect & Sell?</h3>
              <p className="text-xs text-blue-200 mt-1">
                Our inspector visits your depot or parking yard anywhere across all 30 Odisha districts.
              </p>
            </div>
            <Link
              href="/seller/vehicles/new"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md whitespace-nowrap min-h-[44px] flex items-center justify-center"
            >
              Book Inspection Now
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
