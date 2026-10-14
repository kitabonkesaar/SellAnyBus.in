import React from 'react';
import Link from 'next/link';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="w-10 h-10 rounded-lg bg-[#0B3C8C] flex items-center justify-center text-white shadow-sm group-hover:bg-[#082a63] transition-colors">
        {/* Stylized Bus Glyph */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 text-amber-400"
        >
          <path d="M8 6v6" />
          <path d="M16 6v6" />
          <path d="M2 12h20" />
          <rect width="20" height="15" x="2" y="3" rx="3" />
          <path d="M7 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
          <path d="M17 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
        </svg>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center leading-none">
          <span className="text-xl font-black tracking-tight text-[#0B3C8C]">SellAnyBus</span>
          <span className="text-xl font-black text-amber-500">.in</span>
        </div>
        <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
          Verified Buses Odisha
        </span>
      </div>
    </Link>
  );
}
