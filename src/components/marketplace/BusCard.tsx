'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatINR, formatIndianNumber } from '@/modules/i18n';
import { ShieldCheck, Heart, Fuel, Users, Gauge, MapPin, Sparkles } from 'lucide-react';

export interface BusCardProps {
  id: string;
  slug: string;
  make: string;
  model: string;
  manufactureYear: number;
  askingPrice: number;
  odometerKm: number;
  seatingCapacity: number;
  sleeperConfig?: string | null;
  fuelType: string;
  acType: string;
  district: string;
  city: string;
  primaryImageUrl?: string;
  featured?: boolean;
  isFavourite?: boolean;
  onEnquireClick?: (slug: string) => void;
}

export function BusCard({
  slug,
  make,
  model,
  manufactureYear,
  askingPrice,
  odometerKm,
  seatingCapacity,
  sleeperConfig,
  fuelType,
  acType,
  district,
  city,
  primaryImageUrl,
  featured = false,
  isFavourite: initialFav = false,
  onEnquireClick,
}: BusCardProps) {
  const [favourite, setFavourite] = useState(initialFav);
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleFavourite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavourite(!favourite);
    try {
      await fetch('/api/v1/me/favourites', {
        method: favourite ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
    } catch {
      // Revert on error
      setFavourite(favourite);
    }
  };

  const displayTitle = `${manufactureYear} ${make} ${model}`;

  return (
    <div className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col h-full">
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        {/* Placeholder / Image */}
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: primaryImageUrl
              ? `url(${primaryImageUrl})`
              : `linear-gradient(135deg, #0B3C8C 0%, #1e40af 100%)`,
          }}
        >
          {!primaryImageUrl && (
            <div className="w-full h-full flex items-center justify-center text-white/30 font-black text-2xl tracking-wider uppercase">
              {make}
            </div>
          )}
        </div>

        {/* Featured Tag */}
        {featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] shadow-md uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            Featured
          </div>
        )}

        {/* Verified Badge with Tooltip */}
        <div
          className="absolute bottom-3 left-3 z-10"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-600/95 backdrop-blur-sm text-white font-bold text-xs shadow-md cursor-help">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span>Verified Bus</span>
          </div>

          {showTooltip && (
            <div className="absolute bottom-full left-0 mb-2 w-64 p-2.5 rounded-lg bg-slate-900 text-white text-[11px] shadow-xl z-30 pointer-events-none">
              <p className="font-bold text-emerald-400 mb-1">SellAnyBus Verified Guarantee:</p>
              <ul className="space-y-0.5 text-slate-300">
                <li>• RTO RC, permit, fitness, tax verified</li>
                <li>• 14-Point mechanical check completed</li>
                <li>• Seller confirmed fair market pricing</li>
              </ul>
            </div>
          )}
        </div>

        {/* Favourite Button */}
        <button
          onClick={toggleFavourite}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 hover:text-red-600 shadow-sm transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center z-10"
          aria-label={favourite ? 'Remove from favourites' : 'Save to favourites'}
        >
          <Heart className={`w-4 h-4 ${favourite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* District & AC Badge */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1.5">
          <span className="flex items-center gap-1 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {city}, {district}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
            {acType === 'AC' ? 'AC Coach' : 'Non-AC'}
          </span>
        </div>

        {/* Title */}
        <Link href={`/buses/${slug}`} className="block">
          <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0B3C8C] transition-colors line-clamp-1">
            {displayTitle}
          </h3>
        </Link>

        {/* Asking Price */}
        <div className="mt-2 text-xl font-extrabold text-[#0B3C8C]">
          {formatINR(askingPrice)}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{sleeperConfig ? `${seatingCapacity} Sleeper` : `${seatingCapacity} Seats`}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{formatIndianNumber(odometerKm)} km</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate capitalize">{fuelType.toLowerCase()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
          <Link
            href={`/buses/${slug}`}
            className="w-full py-2.5 px-3 rounded-lg border border-slate-300 hover:border-[#0B3C8C] hover:text-[#0B3C8C] text-slate-700 font-bold text-xs text-center transition-colors min-h-[40px] flex items-center justify-center"
          >
            View Details
          </Link>
          <button
            onClick={() => onEnquireClick?.(slug) || (window.location.href = `/buses/${slug}#enquiry`)}
            className="w-full py-2.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs text-center transition-colors min-h-[40px] flex items-center justify-center shadow-sm"
          >
            Enquire Now
          </button>
        </div>
      </div>
    </div>
  );
}
