'use client';

import React, { useState, useEffect } from 'react';
import { formatINR, formatDate } from '@/modules/i18n';
import { Receipt, CheckCircle2, AlertTriangle, ShieldCheck, FileCheck, Plus } from 'lucide-react';

interface TransactionItem {
  id: string;
  agreedPrice: number;
  feeAmount: number;
  paymentStatus: string;
  transferStatus: string;
  confirmedAt: string | null;
  evidenceKeys: string[] | null;
  createdAt: string;
  listing: {
    vehicle: { make: string; model: string; registrationNumber: string; city: string };
  };
  lead?: {
    enquiry?: { name: string; phone: string };
  } | null;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = () => {
    fetch('/api/v1/admin/transactions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTransactions(data.transactions);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Transactions & Commission Settlement
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-logged transaction settlements. Hard rule: Payment cannot be marked settled without confirmed evidence upload.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="p-4">Bus & Registration</th>
                <th className="p-4">Buyer Party</th>
                <th className="p-4">Agreed Sale Price</th>
                <th className="p-4">Platform Fee</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4">RTO Transfer</th>
                <th className="p-4">Evidence & Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">
                      {t.listing.vehicle.make} {t.listing.vehicle.model}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Reg: {t.listing.vehicle.registrationNumber}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">
                      {t.lead?.enquiry?.name || 'Verified Buyer'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      +91 {t.lead?.enquiry?.phone || '98765*****'}
                    </span>
                  </td>

                  <td className="p-4 font-black text-slate-900 text-sm">{formatINR(t.agreedPrice)}</td>

                  <td className="p-4 font-bold text-emerald-600">{formatINR(t.feeAmount)}</td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        t.paymentStatus === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.paymentStatus}
                    </span>
                    {t.confirmedAt && (
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Settled on {formatDate(t.confirmedAt)}
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0B3C8C] text-[10px] font-bold">
                      {t.transferStatus}
                    </span>
                  </td>

                  <td className="p-4">
                    {t.evidenceKeys && t.evidenceKeys.length > 0 ? (
                      <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Evidence Verified</span>
                      </div>
                    ) : (
                      <span className="text-amber-600 text-[11px] font-semibold">Pending Evidence</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
