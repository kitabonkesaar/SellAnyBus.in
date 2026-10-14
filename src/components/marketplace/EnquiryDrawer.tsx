'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface EnquiryDrawerProps {
  listingId: string;
  busTitle: string;
}

export function EnquiryDrawer({ listingId, busTitle }: EnquiryDrawerProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    intendedUse: 'Passenger route operation',
    timeline: 'Immediately',
    message: '',
    consent: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (+91)');
      return;
    }

    if (!formData.consent) {
      setErrorMessage('Please accept the communication consent to proceed');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/vehicles/${listingId}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: cleanPhone,
          intendedUse: formData.intendedUse,
          timeline: formData.timeline,
          message: formData.message,
          consent: formData.consent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to submit enquiry');
      }

      setSuccess(true);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error submitting enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="enquiry" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
          <Send className="w-4 h-4" />
        </div>
        <h3 className="text-lg font-black text-slate-900">Enquire About This Bus</h3>
      </div>
      <p className="text-xs text-slate-500 mb-5">
        Connect with our dedicated commercial vehicle sales advisor for verified pricing, inspection review & viewing arrangements.
      </p>

      {success ? (
        <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h4 className="font-black text-emerald-900 text-sm">Enquiry Received Successfully!</h4>
          <p className="text-xs text-emerald-700">
            Our commercial fleet advisor assigned to <strong className="text-emerald-950">{busTitle}</strong> will contact you on +91 {formData.phone} shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Subrat Mohanty"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0B3C8C] text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mobile Number (+91) *</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-600 font-bold">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="10-digit mobile number"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl focus:outline-none focus:border-[#0B3C8C] text-slate-900 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Intended Bus Application *</label>
              <select
                value={formData.intendedUse}
                onChange={(e) => setFormData({ ...formData, intendedUse: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0B3C8C] text-slate-800"
              >
                <option value="Passenger route operation">Passenger Route Operation</option>
                <option value="Tourism">Tourism / Pilgrimage Contract</option>
                <option value="School/College">School / College Transport</option>
                <option value="Staff transport">Corporate Staff Transport</option>
                <option value="Resale">Commercial Resale / Dealer</option>
                <option value="Other">Other Application</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Purchase Timeline *</label>
              <select
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0B3C8C] text-slate-800"
              >
                <option value="Immediately">Immediately (Within 7 days)</option>
                <option value="within 1 month">Within 1 Month</option>
                <option value="1–3 months">1 to 3 Months</option>
                <option value="Just exploring">Just Exploring / Planning</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Message / Specific Questions (Optional)</label>
            <textarea
              rows={2}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Ask about tyre condition, service records, or viewing date..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0B3C8C] text-slate-900 font-medium"
            />
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="consent"
              required
              checked={formData.consent}
              onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
              className="mt-0.5 rounded text-[#0B3C8C] focus:ring-[#0B3C8C] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="consent" className="text-[11px] text-slate-500 leading-tight cursor-pointer">
              I agree to receive vehicle inspection reports, price updates, and communications from SellAnyBus in accordance with the{' '}
              <a href="/privacy" target="_blank" className="text-[#0B3C8C] underline">
                Privacy Policy
              </a>
              .
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting...' : 'Send Verified Enquiry'}</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Seller contact is mediated by SellAnyBus. Zero spam guarantee.</span>
          </div>
        </form>
      )}
    </div>
  );
}
