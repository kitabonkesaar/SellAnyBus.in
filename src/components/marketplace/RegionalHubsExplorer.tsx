import React from 'react';
import Link from 'next/link';
import { MapPin, Navigation, Bus, ArrowRight } from 'lucide-react';

export function RegionalHubsExplorer() {
  const hubs = [
    {
      name: 'Bhubaneswar / Khordha',
      code: 'OD-02 / OD-33',
      corridor: 'NH-16 Coastal Capital Hub',
      highlight: 'Major interstate AC Sleeper depot (Baramunda ISBT) & Tourism coaches',
      link: '/buses/in/Khordha',
      count: '9+ Buses',
    },
    {
      name: 'Cuttack',
      code: 'OD-05',
      corridor: 'Central Odisha Route Terminal',
      highlight: 'High-frequency 32 & 42-seater route buses (Badambadi Bus Terminal)',
      link: '/buses/in/Cuttack',
      count: '5+ Buses',
    },
    {
      name: 'Sambalpur & Bargarh',
      code: 'OD-15 / OD-17',
      corridor: 'Western Odisha Gateway',
      highlight: 'Express non-AC & sleeper buses connecting Raipur, Bilaspur, and Rourkela',
      link: '/buses/in/Sambalpur',
      count: '4+ Buses',
    },
    {
      name: 'Rourkela / Sundargarh',
      code: 'OD-14',
      corridor: 'Industrial & Steel City Belt',
      highlight: 'Staff commuter coaches, mining shift carriers & school fleet replacements',
      link: '/buses/in/Sundargarh',
      count: '3+ Buses',
    },
    {
      name: 'Berhampur / Ganjam',
      code: 'OD-07',
      corridor: 'Southern Andhra Border Gateway',
      highlight: 'Long-distance coastal liners & Andhra Pradesh inter-state permit buses',
      link: '/buses/in/Ganjam',
      count: '4+ Buses',
    },
    {
      name: 'Balasore & Bhadrak',
      code: 'OD-01 / OD-22',
      corridor: 'Northern Bengal Link (NH-16)',
      highlight: 'Kolkata-Bhubaneswar highway tourist coaches & heavy delivery freight',
      link: '/buses/in/Balasore',
      count: '3+ Buses',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0B3C8C] text-xs font-bold uppercase tracking-wider mb-2">
            <Navigation className="w-3.5 h-3.5 text-[#0B3C8C]" />
            <span>Statewide Transport Network</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            Odisha Regional Fleet Inspection Hubs
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Inspected vehicles stationed across major transport corridors for same-day inspection and immediate physical trial.
          </p>
        </div>

        <Link
          href="/buses"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#0B3C8C] hover:underline shrink-0"
        >
          <span>View All 30 Districts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hubs.map((hub) => (
          <Link
            key={hub.name}
            href={hub.link}
            className="group p-5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-[#0B3C8C] hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0B3C8C]" />
                  <span className="font-bold text-slate-900 group-hover:text-[#0B3C8C] transition-colors text-sm">
                    {hub.name}
                  </span>
                </div>
                <span className="text-[11px] font-black text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {hub.code}
                </span>
              </div>

              <div className="text-[11px] font-semibold text-blue-700 mb-1.5">
                {hub.corridor}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {hub.highlight}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="text-emerald-700 flex items-center gap-1">
                <Bus className="w-3.5 h-3.5" />
                {hub.count}
              </span>
              <span className="text-[#0B3C8C] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                Explore Inventory &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
