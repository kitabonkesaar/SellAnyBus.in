'use client';

import React, { useState, useEffect } from 'react';
import { formatINR, formatDate } from '@/modules/i18n';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldAlert,
  Clock,
  AlertTriangle,
  Eye,
} from 'lucide-react';

interface VerificationDoc {
  id: string;
  docType: string;
  status: string;
  expiresAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  vehicle: {
    id: string;
    make: string;
    model: string;
    registrationNumber: string;
    district: string;
    seller: { name: string; phone: string };
  };
}

export default function DocumentQueuePage() {
  const [documents, setDocuments] = useState<VerificationDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [viewingDocUrl, setViewingDocUrl] = useState<string | null>(null);

  const fetchDocs = () => {
    fetch('/api/v1/admin/verifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDocuments(data.documents);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleVerify = async (docId: string) => {
    try {
      const res = await fetch(`/api/v1/admin/documents/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'VERIFIED' }),
      });
      if (res.ok) fetchDocs();
    } catch {
      // Ignore
    }
  };

  const handleReject = async (docId: string) => {
    if (!rejectionReason.trim()) {
      alert('Rejection reason is required');
      return;
    }
    try {
      const res = await fetch(`/api/v1/admin/documents/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED', rejectionReason }),
      });
      if (res.ok) {
        setRejectingId(null);
        setRejectionReason('');
        fetchDocs();
      }
    } catch {
      // Ignore
    }
  };

  const handleViewPrivateDoc = async (docId: string) => {
    try {
      const res = await fetch(`/api/v1/admin/documents/${docId}/signed-url`);
      const data = await res.json();
      if (res.ok && data.signedUrl) {
        setViewingDocUrl(data.signedUrl);
      } else {
        alert('Failed to generate secure signed URL');
      }
    } catch {
      alert('Error accessing private document');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Document Verification Queue
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Audited RTO compliance desk. Private files are viewed via short-lived HMAC signed URLs (≤ 5 mins) and logged to the audit trail.
        </p>
      </div>

      {/* Verification Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="p-4">Vehicle & Registration</th>
                <th className="p-4">Seller Details</th>
                <th className="p-4">Document Type</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Secure Viewer</th>
                <th className="p-4">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {documents.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50">
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">
                      {d.vehicle.make} {d.vehicle.model}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Reg: {d.vehicle.registrationNumber} ({d.vehicle.district})
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{d.vehicle.seller.name}</span>
                    <span className="text-[11px] text-slate-400">+91 {d.vehicle.seller.phone}</span>
                  </td>

                  <td className="p-4 font-bold text-slate-800">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0B3C8C] text-[11px]">
                      {d.docType.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="p-4">
                    {d.expiresAt ? (
                      <span className="text-slate-600 font-semibold">{formatDate(d.expiresAt)}</span>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        d.status === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : d.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {d.status}
                    </span>
                    {d.rejectionReason && (
                      <span className="text-[10px] text-red-600 block mt-1 italic">
                        Reason: {d.rejectionReason}
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleViewPrivateDoc(d.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0B3C8C] font-semibold text-xs border border-slate-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View (Signed)</span>
                    </button>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerify(d.id)}
                        disabled={d.status === 'VERIFIED'}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-[11px] shadow-sm"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => setRejectingId(d.id)}
                        disabled={d.status === 'REJECTED'}
                        className="px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 disabled:opacity-40 text-red-800 font-bold text-[11px]"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">Reject Document with Reason</h3>
            <p className="text-xs text-slate-500">
              Please specify the reason for rejecting this document (e.g. Expired fitness certificate, mismatched engine number, or unreadable scan). This will notify the seller.
            </p>
            <textarea
              rows={3}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter specific rejection reason..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectingId)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewingDocUrl && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-4xl w-full h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                Secure Document Stream (Audited Short-Lived URL)
              </span>
              <button
                onClick={() => setViewingDocUrl(null)}
                className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
            <div className="flex-1 mt-4 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <iframe src={viewingDocUrl} className="w-full h-full" title="Private Document" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
