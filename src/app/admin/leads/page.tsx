'use client';

import React, { useState, useEffect } from 'react';
import { formatDate } from '@/modules/i18n';
import {
  Users2,
  Phone,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Send,
  Flag,
} from 'lucide-react';

interface LeadItem {
  id: string;
  stage: string;
  qualification: string;
  followUpAt: string | null;
  suspicious: boolean;
  enquiry: {
    id: string;
    name: string;
    phone: string;
    intendedUse: string;
    timeline: string;
    message: string | null;
    createdAt: string;
    listing: {
      askingPrice: number;
      vehicle: {
        make: string;
        model: string;
        manufactureYear: number;
        city: string;
        district: string;
      };
    };
  };
  assignee: { name: string; phone: string } | null;
  activities: { id: string; type: string; content: string; createdAt: string }[];
}

const STAGES = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'INSPECTION_REQUESTED',
  'NEGOTIATION',
  'BOOKING_AGREEMENT',
  'SOLD',
  'LOST',
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [newNote, setNewNote] = useState('');

  const fetchLeads = () => {
    fetch('/api/v1/admin/leads')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLeads(data.leads);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStageChange = async (leadId: string, newStage: string) => {
    try {
      await fetch(`/api/v1/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      fetchLeads();
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, stage: newStage });
      }
    } catch {
      // Ignore
    }
  };

  const handleAddActivity = async (leadId: string) => {
    if (!newNote.trim()) return;
    try {
      await fetch(`/api/v1/admin/leads/${leadId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'NOTE', content: newNote }),
      });
      setNewNote('');
      fetchLeads();
    } catch {
      // Ignore
    }
  };

  const handleToggleSuspicious = async (leadId: string, current: boolean) => {
    try {
      await fetch(`/api/v1/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suspicious: !current }),
      });
      fetchLeads();
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Commercial CRM & Lead Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage buyer enquiries, log commercial advisory calls, and track deals through negotiation to agreement.
          </p>
        </div>
      </div>

      {/* Kanban / Pipeline View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['NEW', 'QUALIFIED', 'NEGOTIATION', 'SOLD'].map((stageKey) => {
          const stageLeads = leads.filter((l) => l.stage === stageKey);
          return (
            <div key={stageKey} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-black text-xs text-slate-700">{stageKey.replace('_', ' ')}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                  {stageLeads.length}
                </span>
              </div>

              <div className="space-y-3">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#0B3C8C] shadow-sm cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-slate-900 text-xs">{lead.enquiry.name}</span>
                      {lead.suspicious && (
                        <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[9px] font-black uppercase">
                          Suspicious
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Bus: <strong>{lead.enquiry.listing.vehicle.make} {lead.enquiry.listing.vehicle.model}</strong>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Phone: <strong className="text-slate-800">+91 {lead.enquiry.phone}</strong>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Timeline: {lead.enquiry.timeline}</span>
                      <span>{formatDate(lead.enquiry.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Lead Activity Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-lg text-slate-900">{selectedLead.enquiry.name}</h3>
                <span className="text-xs text-slate-500 font-semibold">+91 {selectedLead.enquiry.phone}</span>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs"
              >
                Close
              </button>
            </div>

            {/* Stage Selector */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Lead Stage</label>
              <select
                value={selectedLead.stage}
                onChange={(e) => handleStageChange(selectedLead.id, e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Bus Info */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-800">
                Interested Vehicle: {selectedLead.enquiry.listing.vehicle.make} {selectedLead.enquiry.listing.vehicle.model}
              </div>
              <div className="text-slate-500">
                Application: {selectedLead.enquiry.intendedUse} • Timeline: {selectedLead.enquiry.timeline}
              </div>
              {selectedLead.enquiry.message && (
                <div className="text-slate-700 italic pt-1">&quot;{selectedLead.enquiry.message}&quot;</div>
              )}
            </div>

            {/* Activity Log */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-slate-900">Activity & Call Notes</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedLead.activities.map((act) => (
                  <div key={act.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                      {act.type} • {formatDate(act.createdAt)}
                    </span>
                    <p className="text-slate-800">{act.content}</p>
                  </div>
                ))}
              </div>

              {/* Add Note Form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Log client call, viewing date, or offer..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
                <button
                  onClick={() => handleAddActivity(selectedLead.id)}
                  className="px-4 py-2 bg-[#0B3C8C] text-white font-bold text-xs rounded-xl"
                >
                  Log
                </button>
              </div>
            </div>

            {/* Suspicious Lead Flag */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Flag as suspicious / spam:</span>
              <button
                onClick={() => handleToggleSuspicious(selectedLead.id, selectedLead.suspicious)}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  selectedLead.suspicious ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {selectedLead.suspicious ? 'Suspicious Flag Active' : 'Mark Suspicious'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
