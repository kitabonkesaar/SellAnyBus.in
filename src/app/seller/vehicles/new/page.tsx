'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Bus,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  ShieldCheck,
  FileText,
  AlertCircle,
  Camera,
  Save,
} from 'lucide-react';

const ODISHA_DISTRICTS = [
  'Khordha',
  'Cuttack',
  'Puri',
  'Balasore',
  'Sundargarh',
  'Sambalpur',
  'Ganjam',
  'Jharsuguda',
  'Mayurbhanj',
  'Angul',
  'Bargarh',
  'Bhadrak',
  'Bolangir',
  'Jajpur',
  'Kalahandi',
  'Keonjhar',
  'Koraput',
];

export default function NewVehiclePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Category & Identification
    category: 'AC_SLEEPER',
    bodyType: 'Luxury Sleeper Coach',
    registrationNumber: '',
    chassisNumber: '',

    // Step 2: Make, Model & Year
    make: 'Tata',
    model: '',
    manufactureYear: 2021,
    registrationYear: 2021,
    sleeperConfig: '',

    // Step 3: Specs & Condition
    seatingCapacity: 36,
    fuelType: 'DIESEL',
    transmission: 'MANUAL',
    odometerKm: 150000,
    acType: 'AC',
    colour: 'White & Blue',
    conditionSummary: '',
    disclosedDefects: '',
    serviceHistory: '',

    // Step 4: Ownership & Registration
    ownersCount: 1,
    district: 'Khordha',
    city: 'Bhubaneswar',
    permitType: 'Odisha State Carriage Permit',
    hypothecated: false,
    insuranceValidTill: '',

    // Step 5: Asking Price
    askingPrice: 3200000,
    reasonForSale: 'Fleet modernization upgrade',
  });

  // Uploaded media & documents tracking
  const [uploadedPhotos, setUploadedPhotos] = useState<{ id: string; url: string }[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<{ docType: string; status: string }[]>([]);

  // Compute required docs dynamically from step 4 answers
  const requiredDocList = [
    { type: 'RC', label: 'Registration Certificate (RC)' },
    { type: 'OWNER_ID', label: 'Registered Owner ID Proof' },
    { type: 'FITNESS', label: 'Valid Fitness Certificate' },
    { type: 'TAX', label: 'Odisha Road Tax Token' },
    { type: 'INSURANCE', label: 'Commercial Vehicle Insurance' },
  ];

  if (formData.permitType) {
    requiredDocList.push({ type: 'PERMIT', label: 'Commercial Permit Copy' });
  }

  if (formData.hypothecated) {
    requiredDocList.push({ type: 'NOC_HYPOTHECATION', label: 'Bank Lien Release / NOC' });
  }

  // Autosave function
  const saveDraft = async (stepNum = currentStep) => {
    setAutoSaving(true);
    try {
      const res = await fetch('/api/v1/seller/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: vehicleId || undefined,
          ...formData,
        }),
      });

      const data = await res.json();
      if (res.ok && data.vehicle) {
        setVehicleId(data.vehicle.id);
        setLastSaved(new Date());
      }
    } catch {
      // Ignore background autosave errors
    } finally {
      setAutoSaving(false);
    }
  };

  // Step change with validation & autosave
  const nextStep = async () => {
    setError('');

    // Step 1 Validation
    if (currentStep === 1) {
      const cleanReg = formData.registrationNumber.toUpperCase().replace(/[-\s]/g, '');
      if (!/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/.test(cleanReg)) {
        setError('Please enter a valid Indian vehicle registration number (e.g. OD02AB1234)');
        return;
      }
    }

    // Step 2 Validation
    if (currentStep === 2) {
      if (!formData.model.trim()) {
        setError('Please enter the bus model (e.g. LPO 1618 or 9600 Multi-Axle)');
        return;
      }
    }

    // Step 3 Validation
    if (currentStep === 3) {
      if (!formData.conditionSummary.trim() || formData.conditionSummary.length < 10) {
        setError('Please provide a brief condition summary (minimum 10 characters)');
        return;
      }
    }

    await saveDraft(currentStep + 1);
    setCurrentStep((prev) => Math.min(prev + 1, 7));
  };

  const prevStep = () => {
    setError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Photo upload handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !vehicleId) {
      setError('Please advance from step 1 first to create draft ID');
      return;
    }
    const files = Array.from(e.target.files);
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('isPrimary', String(uploadedPhotos.length === 0));

      const res = await fetch(`/api/v1/seller/vehicles/${vehicleId}/media`, {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.media) {
        setUploadedPhotos((prev) => [...prev, { id: data.media.id, url: data.media.url }]);
      }
    }
  };

  // Document upload handler
  const handleDocUpload = async (docType: string, file: File) => {
    if (!vehicleId) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('docType', docType);

    const res = await fetch(`/api/v1/seller/vehicles/${vehicleId}/documents`, {
      method: 'POST',
      body: fd,
    });
    const data = await res.json();
    if (res.ok && data.document) {
      setUploadedDocs((prev) => [
        ...prev.filter((d) => d.docType !== docType),
        { docType, status: 'PENDING' },
      ]);
    }
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    if (!vehicleId) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/v1/seller/vehicles/${vehicleId}/submit`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to submit vehicle');
      }

      setSubmitSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header & Autosave status */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              List Your Commercial Bus
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Step {currentStep} of 7 • Multi-Step Verified Vehicle Onboarding
            </p>
          </div>

          <div className="text-right text-xs">
            {autoSaving ? (
              <span className="text-amber-600 font-semibold flex items-center gap-1">
                <Save className="w-3.5 h-3.5 animate-spin" /> Saving draft...
              </span>
            ) : lastSaved ? (
              <span className="text-slate-400">
                Draft saved at {lastSaved.toLocaleTimeString()}
              </span>
            ) : null}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-200 h-2 rounded-full overflow-hidden mb-8">
          <div
            className="bg-[#0B3C8C] h-full transition-all duration-300"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>

        {/* Step Indicator Pills */}
        <div className="hidden sm:flex items-center justify-between text-[11px] font-bold text-slate-400 mb-8 border-b border-slate-200 pb-3">
          <span className={currentStep >= 1 ? 'text-[#0B3C8C]' : ''}>1. Identification</span>
          <span className={currentStep >= 2 ? 'text-[#0B3C8C]' : ''}>2. Make & Year</span>
          <span className={currentStep >= 3 ? 'text-[#0B3C8C]' : ''}>3. Specs & AC</span>
          <span className={currentStep >= 4 ? 'text-[#0B3C8C]' : ''}>4. Ownership & RTO</span>
          <span className={currentStep >= 5 ? 'text-[#0B3C8C]' : ''}>5. Price Expectation</span>
          <span className={currentStep >= 6 ? 'text-[#0B3C8C]' : ''}>6. Media & Docs</span>
          <span className={currentStep >= 7 ? 'text-[#0B3C8C]' : ''}>7. Submit</span>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitSuccess ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-md text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto font-black text-2xl">
              ✓
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Vehicle Submitted for Verification!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Our Odisha compliance desk is reviewing your uploaded documents. Our team will contact you to schedule the 14-point mechanical inspection appointment.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link
                href="/seller"
                className="px-6 py-3 rounded-xl bg-[#0B3C8C] text-white font-bold text-xs shadow-md"
              >
                Go to Seller Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {/* STEP 1: Identification */}
            {currentStep === 1 && (
              <div className="space-y-4 text-xs">
                <h3 className="text-base font-black text-slate-900 pb-2 border-b border-slate-100">
                  Step 1: Category & Identification
                </h3>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Commercial Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <optgroup label="Commercial Buses & Coaches">
                      <option value="AC_SLEEPER">AC Sleeper Coach</option>
                      <option value="SEATER">Express Route Seater</option>
                      <option value="SCHOOL_BUS">School & College Bus</option>
                      <option value="STAFF_BUS">Staff & Corporate Bus</option>
                      <option value="TOURIST_COACH">Luxury Tourist Coach</option>
                      <option value="MINI_BUS">Mini Bus / Traveller</option>
                    </optgroup>
                    <optgroup label="Commercial Trucks & Vehicles">
                      <option value="TRUCK">Heavy Cargo Haulage Truck</option>
                      <option value="PICKUP_VAN">Commercial Pickup Van / Mini Truck</option>
                      <option value="TIPPER">Mining & Construction Tipper</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Body Style / Coach Type *</label>
                  <input
                    type="text"
                    required
                    value={formData.bodyType}
                    onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                    placeholder="e.g. 2+1 Luxury Sleeper or High Deck Seater"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Odisha Vehicle Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })}
                    placeholder="OD02AB1234"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold tracking-wider"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Format: State code (OD) + RTO code + series + 4 digits (e.g. OD02AB1234)
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chassis Number (Optional)</label>
                  <input
                    type="text"
                    value={formData.chassisNumber}
                    onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                    placeholder="Engraved chassis stamp"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Encrypted at rest using AES-256; never exposed publicly.
                  </span>
                </div>
              </div>
            )}

            {/* STEP 2: Make & Model */}
            {currentStep === 2 && (
              <div className="space-y-4 text-xs">
                <h3 className="text-base font-black text-slate-900 pb-2 border-b border-slate-100">
                  Step 2: Make, Model & Year
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Make / Manufacturer *</label>
                    <select
                      value={formData.make}
                      onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    >
                      <option value="Tata">Tata Motors</option>
                      <option value="Ashok Leyland">Ashok Leyland</option>
                      <option value="Eicher">Eicher Trucks & Buses</option>
                      <option value="Volvo">Volvo Buses</option>
                      <option value="Bharat Benz">BharatBenz</option>
                      <option value="Scania">Scania</option>
                      <option value="Force">Force Motors</option>
                      <option value="Mahindra">Mahindra & Mahindra</option>
                      <option value="Swaraj Mazda">Swaraj Mazda</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Model Variant *</label>
                    <input
                      type="text"
                      required
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="e.g. LPO 1618 or 9600 Multi-Axle"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Manufacture Year *</label>
                    <input
                      type="number"
                      required
                      min={2000}
                      max={new Date().getFullYear()}
                      value={formData.manufactureYear}
                      onChange={(e) => setFormData({ ...formData, manufactureYear: parseInt(e.target.value, 10) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Registration Year *</label>
                    <input
                      type="number"
                      required
                      min={2000}
                      max={new Date().getFullYear()}
                      value={formData.registrationYear}
                      onChange={(e) => setFormData({ ...formData, registrationYear: parseInt(e.target.value, 10) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Sleeper Layout / Configuration (If applicable)
                  </label>
                  <input
                    type="text"
                    value={formData.sleeperConfig}
                    onChange={(e) => setFormData({ ...formData, sleeperConfig: e.target.value })}
                    placeholder="e.g. 36 Berths (2+1 Upper/Lower Sleeper)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Specs & Condition */}
            {currentStep === 3 && (
              <div className="space-y-4 text-xs">
                <h3 className="text-base font-black text-slate-900 pb-2 border-b border-slate-100">
                  Step 3: Specifications & Mechanical Condition
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Seating Capacity *</label>
                    <input
                      type="number"
                      required
                      value={formData.seatingCapacity}
                      onChange={(e) => setFormData({ ...formData, seatingCapacity: parseInt(e.target.value, 10) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">AC Specification *</label>
                    <select
                      value={formData.acType}
                      onChange={(e) => setFormData({ ...formData, acType: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    >
                      <option value="AC">Air Conditioned (AC)</option>
                      <option value="NON_AC">Non-AC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Odometer (km) *</label>
                    <input
                      type="number"
                      required
                      value={formData.odometerKm}
                      onChange={(e) => setFormData({ ...formData, odometerKm: parseInt(e.target.value, 10) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fuel Type</label>
                    <select
                      value={formData.fuelType}
                      onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    >
                      <option value="DIESEL">Diesel</option>
                      <option value="CNG">CNG</option>
                      <option value="ELECTRIC">Electric</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Exterior Colour</label>
                    <input
                      type="text"
                      value={formData.colour}
                      onChange={(e) => setFormData({ ...formData, colour: e.target.value })}
                      placeholder="e.g. Royal Blue & White"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Condition Summary *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.conditionSummary}
                    onChange={(e) => setFormData({ ...formData, conditionSummary: e.target.value })}
                    placeholder="Summarize overall engine health, tyre life, and routes operated..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Disclosed Defects (Optional)</label>
                  <input
                    type="text"
                    value={formData.disclosedDefects}
                    onChange={(e) => setFormData({ ...formData, disclosedDefects: e.target.value })}
                    placeholder="e.g. Minor scratches on left lower skirt panel"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Ownership & RTO */}
            {currentStep === 4 && (
              <div className="space-y-4 text-xs">
                <h3 className="text-base font-black text-slate-900 pb-2 border-b border-slate-100">
                  Step 4: Ownership, Permit & Hypothecation
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Odisha RTO District *</label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    >
                      {ODISHA_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City / Town *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Bhubaneswar"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Owner Count on RC *</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={formData.ownersCount}
                      onChange={(e) => setFormData({ ...formData, ownersCount: parseInt(e.target.value, 10) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Commercial Permit Type</label>
                    <input
                      type="text"
                      value={formData.permitType}
                      onChange={(e) => setFormData({ ...formData, permitType: e.target.value })}
                      placeholder="e.g. All India Tourist Permit (AITP) or State Carriage"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Hypothecation / Loan Checkbox */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hypothecated}
                      onChange={(e) => setFormData({ ...formData, hypothecated: e.target.checked })}
                      className="rounded text-[#0B3C8C] w-4 h-4"
                    />
                    <span>Is this bus currently financed / hypothecated to a bank?</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mt-1 pl-6">
                    If checked, a Bank NOC / Lien Release document will be required in Step 6.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 5: Price Expectation */}
            {currentStep === 5 && (
              <div className="space-y-4 text-xs">
                <h3 className="text-base font-black text-slate-900 pb-2 border-b border-slate-100">
                  Step 5: Expected Asking Price
                </h3>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Your Expected Asking Price (₹) *
                  </label>
                  <input
                    type="number"
                    step={10000}
                    required
                    value={formData.askingPrice}
                    onChange={(e) => setFormData({ ...formData, askingPrice: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-lg font-black text-[#0B3C8C]"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Our team will conduct an indicative valuation and recommend an optimal asking price range. You will retain full authority to approve the final published price.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reason for Sale (Optional)</label>
                  <input
                    type="text"
                    value={formData.reasonForSale}
                    onChange={(e) => setFormData({ ...formData, reasonForSale: e.target.value })}
                    placeholder="e.g. Route permit change or fleet upgrade"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* STEP 6: Photos & Document Uploads */}
            {currentStep === 6 && (
              <div className="space-y-6 text-xs">
                <h3 className="text-base font-black text-slate-900 pb-2 border-b border-slate-100">
                  Step 6: Photos & Required Documents
                </h3>

                {/* Photos Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">
                        Vehicle Photos (Min 6, Max 30) *
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Include front, rear, both sides, interior, dashboard/odometer, engine, and tyres.
                      </span>
                    </div>
                    <span className="font-black text-slate-700">{uploadedPhotos.length} / 6 minimum</span>
                  </div>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="w-full p-3 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 text-center"
                  />

                  {uploadedPhotos.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {uploadedPhotos.map((p, idx) => (
                        <div key={p.id} className="aspect-[4/3] rounded-lg bg-slate-100 overflow-hidden relative">
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${p.url})` }}
                          />
                          <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Documents Section (Dynamic) */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Required Compliance Documents (Private & Secure) *
                    </span>
                    <span className="text-[11px] text-slate-500">
                      These documents are never shared publicly or exposed to buyers.
                    </span>
                  </div>

                  <div className="space-y-2">
                    {requiredDocList.map((doc) => {
                      const isUploaded = uploadedDocs.some((ud) => ud.docType === doc.type);
                      return (
                        <div
                          key={doc.type}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-slate-800">{doc.label}</span>
                            {isUploaded && (
                              <span className="text-[10px] text-emerald-600 block font-semibold">
                                ✓ Uploaded (Pending Admin Verification)
                              </span>
                            )}
                          </div>

                          <label className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-[#0B3C8C] text-[#0B3C8C] font-bold text-xs cursor-pointer shadow-sm">
                            <span>{isUploaded ? 'Replace' : 'Upload PDF/JPG'}</span>
                            <input
                              type="file"
                              accept=".pdf,image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleDocUpload(doc.type, e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Review & Submit */}
            {currentStep === 7 && (
              <div className="space-y-4 text-xs">
                <h3 className="text-base font-black text-slate-900 pb-2 border-b border-slate-100">
                  Step 7: Final Review & Submission
                </h3>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between font-bold text-slate-900 text-sm">
                    <span>{formData.manufactureYear} {formData.make} {formData.model}</span>
                    <span className="text-[#0B3C8C]">₹{formData.askingPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-slate-600">
                    Registration: <strong>{formData.registrationNumber}</strong> • District: <strong>{formData.district}</strong>
                  </div>
                  <div className="text-slate-600">
                    Category: <strong>{formData.category}</strong> • AC: <strong>{formData.acType}</strong> • Seats: <strong>{formData.seatingCapacity}</strong>
                  </div>
                  <div className="text-slate-600">
                    Photos: <strong>{uploadedPhotos.length} uploaded</strong> • Documents: <strong>{uploadedDocs.length} uploaded</strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-[#0B3C8C] space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Next Steps in the Verification Process:</span>
                  </div>
                  <ol className="list-decimal pl-5 space-y-0.5 text-[11px] text-blue-900">
                    <li>Compliance desk verifies RC, fitness, permit & tax records.</li>
                    <li>Inspector contacts you to perform 14-point mechanical check.</li>
                    <li>Valuation recommendation is submitted to your Seller Dashboard.</li>
                    <li>You review and approve the final asking price before publishing.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Wizard Navigation Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous Step</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 7 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2.5 rounded-xl bg-[#0B3C8C] hover:bg-[#082a63] text-white font-bold text-xs flex items-center gap-1.5 shadow-md min-h-[44px]"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleFinalSubmit}
                  className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg min-h-[44px]"
                >
                  <span>{submitting ? 'Submitting...' : 'Submit Vehicle for Verification'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
