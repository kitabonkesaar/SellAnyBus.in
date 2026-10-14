'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, IndianRupee, ArrowRight, Bus, Truck, Sparkles } from 'lucide-react';

const POPULAR_SEARCHES = [
  { label: 'Volvo 9600 Sleeper', q: 'Volvo 9600', category: 'AC_SLEEPER' },
  { label: 'Tata Route Bus', q: 'Tata Starbus', category: 'SEATER' },
  { label: 'Eicher School Bus', q: 'Eicher', category: 'SCHOOL_BUS' },
  { label: 'Bolero Maxi Truck', q: 'Bolero', category: 'PICKUP_VAN' },
  { label: 'Tata Heavy Cargo', q: 'Prima', category: 'TRUCK' },
  { label: 'Bhubaneswar Fleet', q: '', district: 'Khordha' },
];

const ODISHA_DISTRICTS = [
  { name: 'All Odisha (30 Districts)', value: '' },
  { name: 'Bhubaneswar (Khordha)', value: 'Khordha' },
  { name: 'Cuttack', value: 'Cuttack' },
  { name: 'Puri', value: 'Puri' },
  { name: 'Rourkela (Sundargarh)', value: 'Sundargarh' },
  { name: 'Sambalpur', value: 'Sambalpur' },
  { name: 'Berhampur (Ganjam)', value: 'Ganjam' },
  { name: 'Balasore', value: 'Balasore' },
  { name: 'Jharsuguda', value: 'Jharsuguda' },
  { name: 'Angul', value: 'Angul' },
  { name: 'Jajpur', value: 'Jajpur' },
];

export function HeroSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ALL' | 'BUSES' | 'TRUCKS' | 'PICKUPS'>('ALL');
  const [keyword, setKeyword] = useState('');
  const [district, setDistrict] = useState('');
  const [budget, setBudget] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('q', keyword.trim());
    if (district) params.set('district', district);

    if (activeTab === 'BUSES') {
      params.set('category', 'AC_SLEEPER');
    } else if (activeTab === 'TRUCKS') {
      params.set('category', 'TRUCK');
    } else if (activeTab === 'PICKUPS') {
      params.set('category', 'PICKUP_VAN');
    }

    if (budget === 'under_15') params.set('maxPrice', '1500000');
    else if (budget === '15_35') {
      params.set('minPrice', '1500000');
      params.set('maxPrice', '3500000');
    } else if (budget === '35_60') {
      params.set('minPrice', '3500000');
      params.set('maxPrice', '6000000');
    } else if (budget === 'above_60') {
      params.set('minPrice', '6000000');
    }

    router.push(`/buses?${params.toString()}`);
  };

  const applyQuickSearch = (item: typeof POPULAR_SEARCHES[0]) => {
    const params = new URLSearchParams();
    if (item.q) params.set('q', item.q);
    if (item.category) params.set('category', item.category);
    if (item.district) params.set('district', item.district);
    router.push(`/buses?${params.toString()}`);
  };

  return (
    <div className="w-full">
      {/* VEHICLE TYPE TABS */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-amber-400 text-slate-950 shadow-md font-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>All Commercial Vehicles</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('BUSES')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'BUSES'
              ? 'bg-amber-400 text-slate-950 shadow-md font-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Bus className="w-3.5 h-3.5" />
          <span>Buses & Coaches</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('TRUCKS')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'TRUCKS'
              ? 'bg-amber-400 text-slate-950 shadow-md font-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Cargo & Haulage Trucks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PICKUPS')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'PICKUPS'
              ? 'bg-amber-400 text-slate-950 shadow-md font-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Pickups & Mini Trucks</span>
        </button>
      </div>

      {/* SEARCH PANEL CONTAINER */}
      <form
        onSubmit={handleSearch}
        className="bg-white p-3 sm:p-4 rounded-3xl shadow-2xl border border-white/20 flex flex-col md:flex-row gap-3 items-stretch text-slate-900"
      >
        {/* Keywords Input */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/90 transition-colors focus-within:border-[#0B3C8C] focus-within:ring-2 focus-within:ring-blue-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Search Vehicle
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. Tata Starbus, Volvo 9600, Eicher..."
              className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-semibold focus:outline-none"
            />
          </div>
        </div>

        {/* Location Dropdown */}
        <div className="w-full md:w-56 flex items-center gap-2.5 px-4 py-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/90 transition-colors focus-within:border-[#0B3C8C] focus-within:ring-2 focus-within:ring-blue-100">
          <MapPin className="w-5 h-5 text-[#0B3C8C] shrink-0" />
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Odisha Location
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-transparent text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none cursor-pointer"
            >
              {ODISHA_DISTRICTS.map((d) => (
                <option key={d.name} value={d.value}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Budget Dropdown */}
        <div className="w-full md:w-48 flex items-center gap-2.5 px-4 py-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/90 transition-colors focus-within:border-[#0B3C8C] focus-within:ring-2 focus-within:ring-blue-100">
          <IndianRupee className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Budget Range
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-transparent text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none cursor-pointer"
            >
              <option value="">Any Budget</option>
              <option value="under_15">Under ₹15 Lakh</option>
              <option value="15_35">₹15 – ₹35 Lakh</option>
              <option value="35_60">₹35 – ₹60 Lakh</option>
              <option value="above_60">₹60 Lakh+</option>
            </select>
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 shrink-0 cursor-pointer min-h-[48px]"
        >
          <span>Find Vehicles</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* QUICK CHIPS / POPULAR KEYWORDS */}
      <div className="flex items-center flex-wrap gap-2 mt-4 text-xs">
        <span className="text-blue-200 font-semibold text-[11px]">Popular Searches:</span>
        {POPULAR_SEARCHES.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => applyQuickSearch(item)}
            className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors border border-white/10 cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
