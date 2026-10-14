'use client';

import React, { useState } from 'react';
import { Share2, Flag, Check, AlertCircle } from 'lucide-react';

export function ShareButton({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : `https://sellanybus.in/buses/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out this verified commercial bus on SellAnyBus.in: ${title}`,
          url,
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <button
      onClick={handleShare}
      type="button"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm min-h-[36px]"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-700">Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Bus</span>
        </>
      )}
    </button>
  );
}

export function ReportListingButton({ listingId }: { listingId: string }) {
  const [reported, setReported] = useState(false);

  const handleReport = () => {
    const reason = window.prompt('Please specify the reason for reporting this listing (e.g. incorrect specs, suspected fraud):');
    if (reason) {
      fetch('/api/v1/listings/' + listingId + '/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      }).catch(() => {});
      setReported(true);
      alert('Thank you. Our compliance team will review this listing within 24 hours.');
    }
  };

  return (
    <button
      onClick={handleReport}
      type="button"
      className="text-red-600 font-bold hover:underline flex items-center gap-1"
    >
      <Flag className="w-3.5 h-3.5" />
      <span>{reported ? 'Reported' : 'Report Listing'}</span>
    </button>
  );
}
