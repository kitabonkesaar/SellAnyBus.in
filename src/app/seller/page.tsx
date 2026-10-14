'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { formatINR, formatDate } from '@/modules/i18n';
import {
  PlusCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Eye,
  MessageSquare,
  Sparkles,
  TrendingUp,
  FileCheck2,
  XCircle,
  HelpCircle,
  Building,
} from 'lucide-react';

interface SellerVehicle {
  id: string;
  category: string;
  make: string;
  model: string;
  manufactureYear: number;
  registrationNumber: string;
  district: string;
  city: string;
  status: string;
  missingDocs: string[];
  media: { storageKey: string }[];
  listing?: {
    id: string;
    slug: string;
    askingPrice: number;
    sellerApprovedPrice: number | null;
    sellerApprovedAt: string | null;
    publicationStatus: string;
    viewsCount: number;
    enquiries: {
      id: string;
      name: string;
      phoneMasked: string;
      intendedUse: string;
      timeline: string;
      message: string | null;
      status: string;
      createdAt: string;
    }[];
  } | null;
  inspections: {
    status: string;
    overallScore: number | null;
    summary: string | null;
  }[];
  valuations: {
    rangeMin: number;
    rangeMax: number;
    recommendedPrice: number;
    approvalStatus: string;
  }[];
}

export default function SellerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<SellerVehicle[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState('ALL');
  const [approvingPriceId, setApprovingPriceId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState('');

  const fetchDashboard = () => {
    fetch('/api/v1/seller/vehicles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVehicles(data.vehicles);
          setStatusCounts(data.statusCounts);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleApprovePrice = async (listingId: string) => {
    setApprovingPriceId(listingId);
    setActionMessage('');
    try {
      const res = await fetch(`/api/v1/seller/listings/${listingId}/approve-price`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Price approval failed');
      }
      setActionMessage('Asking price approved! Your vehicle is now approved and ready for publishing.');
      fetchDashboard();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error approving price');
    } finally {
      setApprovingPriceId(null);
    }
  };

  const filteredVehicles =
    activeTab === 'ALL' ? vehicles : vehicles.filter((v) => v.status === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Seller Fleet Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Track verification status, approve recommended valuations, and manage qualified buyer enquiries.
            </p>
          </div>

          <Link
            href="/seller/vehicles/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition-all self-start sm:self-auto min-h-[44px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Another Bus</span>
          </Link>
        </div>

        {actionMessage && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex overflow-x-auto gap-2 py-4 scrollbar-none text-xs font-bold">
          {[
            { key: 'ALL', label: 'All Buses' },
            { key: 'DRAFT', label: 'Draft' },
            { key: 'SUBMITTED', label: 'Submitted' },
            { key: 'UNDER_REVIEW', label: 'Under Review' },
            { key: 'INSPECTION_PENDING', label: 'Inspection Pending' },
            { key: 'AWAITING_SELLER_PRICE_APPROVAL', label: 'Price Approval Required' },
            { key: 'PUBLISHED', label: 'Published' },
            { key: 'SOLD', label: 'Sold' },
            { key: 'REJECTED', label: 'Rejected' },
          ].map((tab) => {
            const count = statusCounts[tab.key] || 0;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#0B3C8C] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Vehicles List */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs font-semibold">
            Loading your fleet dashboard...
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3 mt-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0B3C8C] flex items-center justify-center mx-auto font-bold text-lg">
              🚌
            </div>
            <h3 className="font-bold text-base text-slate-900">No vehicles in this status</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Get started by adding your first commercial bus or coach for verification.
            </p>
            <Link
              href="/seller/vehicles/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Bus</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {filteredVehicles.map((v) => {
              const latestVal = v.valuations[0];
              const latestInsp = v.inspections[0];
              const needsPriceApproval =
                v.status === 'AWAITING_SELLER_PRICE_APPROVAL' ||
                (v.listing && !v.listing.sellerApprovedPrice && latestVal);

              return (
                <div
                  key={v.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex gap-4 items-start">
                      {/* Thumbnail */}
                      <div className="w-24 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        {v.media[0] ? (
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(/uploads/${v.media[0].storageKey})` }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-xs">
                            No Photo
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
                            {v.category.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-500">
                            Reg: <strong className="text-slate-800">{v.registrationNumber}</strong>
                          </span>
                          <span className="text-xs text-slate-500">
                            • {v.city}, {v.district}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-base text-slate-900">
                          {v.manufactureYear} {v.make} {v.model}
                        </h3>

                        {v.listing && (
                          <div className="text-sm font-black text-[#0B3C8C] mt-1">
                            Asking Price: {formatINR(v.listing.askingPrice)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="flex flex-col lg:items-end">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          v.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.status === 'AWAITING_SELLER_PRICE_APPROVAL'
                            ? 'bg-amber-100 text-amber-900'
                            : v.status === 'SOLD'
                            ? 'bg-purple-100 text-purple-900'
                            : v.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {v.status.replace(/_/g, ' ')}
                      </span>

                      {v.listing && (
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {v.listing.viewsCount} Views
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {v.listing.enquiries.length} Enquiries
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PRICE APPROVAL ALERT (CRITICAL WORKFLOW REQUIREMENT) */}
                  {needsPriceApproval && latestVal && v.listing && (
                    <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 font-black text-amber-950 text-sm">
                          <TrendingUp className="w-4 h-4 text-amber-600" />
                          <span>Action Required: Approve Indicative Asking Price</span>
                        </div>
                        <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                          Our commercial team evaluated market demand and recommends asking price of{' '}
                          <strong className="text-amber-950 text-sm">{formatINR(latestVal.recommendedPrice)}</strong>{' '}
                          (Range: {formatINR(latestVal.rangeMin)} - {formatINR(latestVal.rangeMax)}).
                        </p>
                      </div>

                      <button
                        onClick={() => handleApprovePrice(v.listing!.id)}
                        disabled={approvingPriceId === v.listing.id}
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md whitespace-nowrap min-h-[44px] flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {approvingPriceId === v.listing.id ? 'Approving...' : 'Approve Recommended Price'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Missing documents warning */}
                  {v.missingDocs.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>
                        Missing documents for full verification: <strong>{v.missingDocs.join(', ')}</strong>
                      </span>
                    </div>
                  )}

                  {/* ENQUIRIES INBOX (Buyer contact masked) */}
                  {v.listing && v.listing.enquiries.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <h4 className="font-bold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#0B3C8C]" />
                        Recent Buyer Enquiries (Mediated via SellAnyBus)
                      </h4>

                      <div className="space-y-2">
                        {v.listing.enquiries.map((e) => (
                          <div
                            key={e.id}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2 font-bold text-slate-900">
                                <span>{e.name}</span>
                                <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0B3C8C] text-[10px]">
                                  +91 {e.phoneMasked}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 mt-0.5 block">
                                Purpose: {e.intendedUse} • Timeline: {e.timeline}
                              </span>
                              {e.message && (
                                <p className="text-[11px] text-slate-600 mt-1 italic">&quot;{e.message}&quot;</p>
                              )}
                            </div>
                            <span className="px-2 py-1 rounded bg-slate-200 text-slate-700 font-bold text-[10px] self-start sm:self-center">
                              {e.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
