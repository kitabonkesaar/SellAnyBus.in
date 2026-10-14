'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatINR, formatDate } from '@/modules/i18n';
import {
  Bus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  Send,
  Eye,
  Filter,
} from 'lucide-react';

interface AdminListing {
  id: string;
  slug: string;
  askingPrice: number;
  publicationStatus: string;
  sellerApprovedPrice: number | null;
  sellerApprovedAt: string | null;
  featured: boolean;
  viewsCount: number;
  createdAt: string;
  vehicle: {
    id: string;
    make: string;
    model: string;
    manufactureYear: number;
    registrationNumber: string;
    category: string;
    district: string;
    city: string;
    status: string;
    seller: { name: string; phone: string };
    documents: { status: string; docType: string }[];
    inspections: { status: string; overallScore: number | null }[];
  };
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionMessage, setActionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchListings = () => {
    fetch('/api/v1/vehicles?admin=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setListings(data.listings);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handlePublish = async (listingId: string) => {
    setActionMessage('');
    setErrorMessage('');
    try {
      const res = await fetch(`/api/v1/admin/listings/${listingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Publishing failed');
      }
      setActionMessage('Listing published to marketplace successfully!');
      fetchListings();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error publishing');
    }
  };

  const handleToggleFeatured = async (listingId: string, currentFeatured: boolean) => {
    try {
      await fetch(`/api/v1/admin/listings/${listingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      });
      fetchListings();
    } catch {
      // Ignore
    }
  };

  const handleStatusChange = async (listingId: string, newStatus: string) => {
    try {
      await fetch(`/api/v1/admin/listings/${listingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchListings();
    } catch {
      // Ignore
    }
  };

  const filtered =
    statusFilter === 'ALL'
      ? listings
      : listings.filter((l) => l.publicationStatus === statusFilter);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Listing Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit documents, view inspection scores, and enforce 3-gate publishing rules.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 text-xs font-semibold">
          {['ALL', 'DRAFT', 'PUBLISHED', 'SOLD', 'SUSPENDED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === st ? 'bg-[#0B3C8C] text-white' : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Listings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="p-4">Bus & Specs</th>
                <th className="p-4">Registration</th>
                <th className="p-4">Seller Info</th>
                <th className="p-4">3-Gate Readiness</th>
                <th className="p-4">Asking Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((l) => {
                const verifiedDocsCount = l.vehicle.documents.filter((d) => d.status === 'VERIFIED').length;
                const insp = l.vehicle.inspections[0];
                const inspApproved = insp?.status === 'APPROVED';
                const priceApproved = Boolean(l.sellerApprovedAt && l.sellerApprovedPrice);
                const canPublish = verifiedDocsCount >= 4 && inspApproved && priceApproved;

                return (
                  <tr key={l.id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">
                        {l.vehicle.manufactureYear} {l.vehicle.make} {l.vehicle.model}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {l.vehicle.category} • {l.vehicle.city}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-slate-800">{l.vehicle.registrationNumber}</td>

                    <td className="p-4">
                      <span className="font-semibold text-slate-900 block">{l.vehicle.seller.name}</span>
                      <span className="text-[11px] text-slate-500">+91 {l.vehicle.seller.phone}</span>
                    </td>

                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className={`w-2 h-2 rounded-full ${verifiedDocsCount >= 4 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span>Docs: {verifiedDocsCount} Verified</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className={`w-2 h-2 rounded-full ${inspApproved ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span>Inspection: {inspApproved ? 'Approved' : 'Pending'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className={`w-2 h-2 rounded-full ${priceApproved ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span>Seller Price: {priceApproved ? 'Approved' : 'Pending'}</span>
                      </div>
                    </td>

                    <td className="p-4 font-black text-[#0B3C8C]">{formatINR(l.askingPrice)}</td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          l.publicationStatus === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : l.publicationStatus === 'SOLD'
                            ? 'bg-purple-100 text-purple-800'
                            : l.publicationStatus === 'SUSPENDED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {l.publicationStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {l.publicationStatus !== 'PUBLISHED' && l.publicationStatus !== 'SOLD' && (
                          <button
                            onClick={() => handlePublish(l.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm"
                            title="Enforces verified docs, approved inspection, and seller price approval"
                          >
                            Publish
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleFeatured(l.id, l.featured)}
                          className={`p-1.5 rounded-lg border text-xs ${
                            l.featured
                              ? 'bg-amber-100 border-amber-300 text-amber-800'
                              : 'bg-white border-slate-200 text-slate-500 hover:text-amber-500'
                          }`}
                          title={l.featured ? 'Remove featured' : 'Make featured'}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>

                        {l.publicationStatus === 'PUBLISHED' && (
                          <button
                            onClick={() => handleStatusChange(l.id, 'SUSPENDED')}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 font-semibold text-[10px]"
                          >
                            Suspend
                          </button>
                        )}

                        <Link
                          href={`/buses/${l.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-[#0B3C8C]"
                          title="View detail page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
