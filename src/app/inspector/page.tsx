'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { formatDate } from '@/modules/i18n';
import { Wrench, CheckCircle2, AlertTriangle, ShieldCheck, Camera, Save, ArrowRight } from 'lucide-react';

interface InspectorInspection {
  id: string;
  status: string;
  scheduledAt: string | null;
  location: string | null;
  overallScore: number | null;
  summary: string | null;
  checklistResults: Record<string, { status: string; note: string }> | null;
  vehicle: {
    id: string;
    make: string;
    model: string;
    registrationNumber: string;
    category: string;
    city: string;
    district: string;
  };
}

const CHECKLIST_KEYS = [
  { key: 'engine', label: 'Engine & Turbocharger Blow-by' },
  { key: 'transmission', label: 'Transmission & Gearbox Synchro' },
  { key: 'clutch', label: 'Clutch Free Play & Booster Assist' },
  { key: 'brakes', label: 'Full Air Brake Pressure Build' },
  { key: 'suspension', label: 'Suspension Bellows & Leaf Springs' },
  { key: 'steering', label: 'Steering Linkages & Play' },
  { key: 'tyres', label: 'Radial Tyre Tread Depth (mm)' },
  { key: 'electrical', label: '24V Alternator & Battery Health' },
  { key: 'acSystem', label: 'Cabin AC Cooling Pull-Down' },
  { key: 'bodyChassis', label: 'Chassis Alignment & Rust Test' },
  { key: 'interiorSeats', label: 'Reclining Seats & SC Gangway' },
  { key: 'emergencyExits', label: 'Emergency Door & Roof Hatches' },
  { key: 'lights', label: 'Marker, Fog, & Hazard Warning Lamps' },
  { key: 'documentsMatch', label: 'Chassis Stamp vs RC Plate Match' },
];

export default function InspectorPortalPage() {
  const [inspections, setInspections] = useState<InspectorInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInspection, setSelectedInspection] = useState<InspectorInspection | null>(null);

  // Form State for Checklist Submission
  const [checklist, setChecklist] = useState<Record<string, { status: string; note: string }>>({});
  const [overallScore, setOverallScore] = useState(88);
  const [summary, setSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchInspections = () => {
    fetch('/api/v1/inspector/inspections')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInspections(data.inspections);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  const openChecklistModal = (insp: InspectorInspection) => {
    setSelectedInspection(insp);
    // Initialize checklist
    const initialChecklist: Record<string, { status: string; note: string }> = {};
    CHECKLIST_KEYS.forEach((item) => {
      initialChecklist[item.key] = {
        status: insp.checklistResults?.[item.key]?.status || 'PASSED',
        note: insp.checklistResults?.[item.key]?.note || 'Verified in good operational condition.',
      };
    });
    setChecklist(initialChecklist);
    setOverallScore(insp.overallScore || 90);
    setSummary(insp.summary || 'Vehicle thoroughly inspected at depot yard. All mechanical systems operational.');
  };

  const handleSubmitChecklist = async () => {
    if (!selectedInspection) return;
    setSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/v1/inspector/inspections/${selectedInspection.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checklistResults: checklist,
          overallScore,
          summary,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Submission failed');

      setSuccessMsg('14-Point Inspection submitted successfully for Admin review!');
      fetchInspections();
      setSelectedInspection(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error submitting inspection');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Inspector Field Portal</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Certified technical inspection desk. Evaluate commercial vehicles against the 14-point mechanical standard.
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Inspections Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="p-4">Vehicle & Registration</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Yard Location</th>
                  <th className="p-4">Scheduled Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Inspection Score</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {inspections.map((insp) => (
                  <tr key={insp.id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">
                        {insp.vehicle.make} {insp.vehicle.model}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">
                        Reg: {insp.vehicle.registrationNumber}
                      </span>
                    </td>

                    <td className="p-4">{insp.vehicle.category}</td>

                    <td className="p-4">{insp.location || `${insp.vehicle.city} Depot Yard`}</td>

                    <td className="p-4">{formatDate(insp.scheduledAt || new Date())}</td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          insp.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : insp.status === 'SUBMITTED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {insp.status}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-slate-900">
                      {insp.overallScore ? `${insp.overallScore.toFixed(1)} / 100` : 'Pending'}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => openChecklistModal(insp)}
                        className="px-3 py-1.5 rounded-lg bg-[#0B3C8C] hover:bg-[#082a63] text-white font-bold text-[11px] shadow-sm flex items-center gap-1.5"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>{insp.status === 'APPROVED' ? 'View Report' : 'Fill Checklist'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Checklist Evaluation Modal */}
        {selectedInspection && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-lg text-slate-900">
                    14-Point Technical Evaluation Checklist
                  </h3>
                  <span className="text-xs text-slate-500">
                    {selectedInspection.vehicle.make} {selectedInspection.vehicle.model} • Reg:{' '}
                    <strong>{selectedInspection.vehicle.registrationNumber}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setSelectedInspection(null)}
                  className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg"
                >
                  Close
                </button>
              </div>

              {/* 14 Checklist Items */}
              <div className="space-y-4">
                {CHECKLIST_KEYS.map((item) => {
                  const currentItem = checklist[item.key] || { status: 'PASSED', note: '' };
                  return (
                    <div key={item.key} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800">{item.label}</span>
                        <div className="flex gap-1 text-[11px] font-bold">
                          {['PASSED', 'FAILED', 'NOT_VERIFIED'].map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() =>
                                setChecklist({
                                  ...checklist,
                                  [item.key]: { ...currentItem, status: st },
                                })
                              }
                              className={`px-2.5 py-0.5 rounded ${
                                currentItem.status === st
                                  ? st === 'PASSED'
                                    ? 'bg-emerald-600 text-white'
                                    : st === 'FAILED'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-amber-500 text-slate-950'
                                  : 'bg-white border border-slate-200 text-slate-600'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      <input
                        type="text"
                        value={currentItem.note}
                        onChange={(e) =>
                          setChecklist({
                            ...checklist,
                            [item.key]: { ...currentItem, note: e.target.value },
                          })
                        }
                        placeholder="Inspector observation note..."
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Score and Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Overall Mechanical Health Score (out of 100)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={overallScore}
                    onChange={(e) => setOverallScore(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-base font-black text-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Inspector Recommendation Summary
                  </label>
                  <textarea
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedInspection(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitChecklist}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md"
                >
                  {submitting ? 'Submitting...' : 'Submit Certified Inspection'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
