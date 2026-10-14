'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CategoryIcon } from '@/components/brand/CategoryIcons';
import { ArrowRight, Bus, Truck, Sparkles } from 'lucide-react';

interface CategoryItem {
  key: string;
  name: string;
  desc: string;
  count: string;
  type: 'BUS' | 'TRUCK';
}

const ALL_CATEGORIES: CategoryItem[] = [
  // Commercial Buses
  {
    key: 'AC_SLEEPER',
    name: 'AC Sleeper Coach',
    desc: 'Interstate multi-axle luxury sleepers with 2+1 berths',
    count: '6 Available',
    type: 'BUS',
  },
  {
    key: 'SEATER',
    name: 'Express Route Seater',
    desc: '32 to 55 seat stage carriage & express route buses',
    count: '8 Available',
    type: 'BUS',
  },
  {
    key: 'SCHOOL_BUS',
    name: 'School & College Bus',
    desc: 'Supreme Court guideline compliant student transit',
    count: '4 Available',
    type: 'BUS',
  },
  {
    key: 'STAFF_BUS',
    name: 'Staff & Industrial Bus',
    desc: 'Corporate & worker executive transport buses',
    count: '3 Available',
    type: 'BUS',
  },
  {
    key: 'TOURIST_COACH',
    name: 'Luxury Tourist Coach',
    desc: 'Air-suspended coaches with AITP national permits',
    count: '4 Available',
    type: 'BUS',
  },
  {
    key: 'MINI_BUS',
    name: 'Mini Bus / Traveller',
    desc: '17 to 26 seater commercial passenger vans',
    count: '5 Available',
    type: 'BUS',
  },
  // Commercial Trucks
  {
    key: 'TRUCK',
    name: 'Heavy Haulage Trucks',
    desc: 'Multi-axle cargo freight & container haulage trucks',
    count: '2 Available',
    type: 'TRUCK',
  },
  {
    key: 'PICKUP_VAN',
    name: 'Pickups & Mini Trucks',
    desc: 'Commercial 1.2T to 2T pickup vans and mini trucks',
    count: '2 Available',
    type: 'TRUCK',
  },
  {
    key: 'TIPPER',
    name: 'Mining & Heavy Tippers',
    desc: 'Construction dumpers and 16-cum box tippers',
    count: '1 Available',
    type: 'TRUCK',
  },
];

export function CategoryExplorer() {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'BUS' | 'TRUCK'>('ALL');

  const filtered =
    activeFilter === 'ALL'
      ? ALL_CATEGORIES
      : ALL_CATEGORIES.filter((c) => c.type === activeFilter);

  return (
    <div>
      {/* FILTER TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'ALL'
                ? 'bg-[#0B3C8C] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Commercial Fleet ({ALL_CATEGORIES.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('BUS')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'BUS'
                ? 'bg-[#0B3C8C] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Buses & Coaches (6)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('TRUCK')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'TRUCK'
                ? 'bg-[#0B3C8C] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Trucks & Pickups (3)</span>
          </button>
        </div>

        <Link
          href="/buses"
          className="text-xs font-bold text-[#0B3C8C] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>View All Available Fleet</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* CATEGORY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((cat) => (
          <Link
            key={cat.key}
            href={`/buses?category=${cat.key}`}
            className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#0B3C8C] hover:shadow-xl transition-all duration-300 flex items-start gap-4"
          >
            {/* Custom Theme Icon */}
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0B3C8C] border border-blue-100 group-hover:bg-[#0B3C8C] group-hover:text-amber-400 group-hover:border-[#0B3C8C] flex items-center justify-center shrink-0 transition-all duration-300 shadow-xs">
              <CategoryIcon category={cat.key} className="w-7 h-7" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#0B3C8C] transition-colors truncate">
                  {cat.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
                  {cat.count}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {cat.desc}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#0B3C8C]">
                <span>Browse Category</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
