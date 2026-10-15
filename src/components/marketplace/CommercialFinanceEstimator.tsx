'use client';

import React, { useState, useId } from 'react';
import { Calculator, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatINR } from '@/modules/i18n';

export function CommercialFinanceEstimator() {
  const busPriceId = useId();
  const downPaymentId = useId();
  const tenureId = useId();

  const [busPrice, setBusPrice] = useState<number>(1800000); // 18 Lakhs
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20); // 20%
  const [tenureYears, setTenureYears] = useState<number>(4); // 4 years
  const interestRate = 10.5; // 10.5% commercial vehicle rate

  const downPayment = Math.round((busPrice * downPaymentPercent) / 100);
  const loanAmount = busPrice - downPayment;

  // Monthly interest rate
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const emi =
    loanAmount > 0 && monthlyRate > 0
      ? Math.round(
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
            (Math.pow(1 + monthlyRate, totalMonths) - 1)
        )
      : 0;

  const totalInterest = emi * totalMonths - loanAmount;

  // Typical Odisha commercial bus operating metrics
  const estimatedDailyRevenue = Math.round(emi / 22); // Target daily operating margin to cover EMI

  return (
    <div className="bg-gradient-to-br from-slate-900 via-[#0B3C8C] to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-blue-900/40 relative overflow-hidden">
      {/* Background visual elements */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Odisha Commercial Fleet Financing</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Commercial Bus Loan & EMI Calculator
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-2xl">
              Calculate commercial vehicle EMIs with partner banks (SBI, HDFC, IndusInd, Cholamandalam, Sundaram Finance) with fast loan approvals across Odisha.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center bg-white/10 px-4 py-2 rounded-2xl border border-white/15 text-xs text-blue-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Up to 85% On-Road Funding Available</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Bus Price Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <label htmlFor={busPriceId} className="text-blue-200">Vehicle Purchase Price</label>
                <span className="text-amber-300 font-bold text-sm">{formatINR(busPrice)}</span>
              </div>
              <input
                id={busPriceId}
                type="range"
                min={400000}
                max={6000000}
                step={50000}
                value={busPrice}
                onChange={(e) => setBusPrice(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>₹4 Lakhs (Mini Bus / Pickup)</span>
                <span>₹25 Lakhs (Route 42-Seater)</span>
                <span>₹60 Lakhs (Multi-Axle Sleeper)</span>
              </div>
            </div>

            {/* Down Payment & Tenure Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <label htmlFor={downPaymentId} className="text-blue-200">Down Payment ({downPaymentPercent}%)</label>
                  <span className="text-white font-bold">{formatINR(downPayment)}</span>
                </div>
                <input
                  id={downPaymentId}
                  type="range"
                  min={15}
                  max={50}
                  step={5}
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <label htmlFor={tenureId} className="text-blue-200">Tenure ({tenureYears} Years / {totalMonths} M)</label>
                  <span className="text-white font-bold">{tenureYears} Years</span>
                </div>
                <input
                  id={tenureId}
                  type="range"
                  min={2}
                  max={5}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <div className="text-xs text-blue-200 font-semibold mb-2">Popular Fleet Presets:</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'School Bus (32-Seater)', price: 1100000 },
                  { label: 'Odisha Route Bus (42-Seater)', price: 1750000 },
                  { label: 'Interstate AC Sleeper', price: 3400000 },
                  { label: 'Tata 1618 Cargo Truck', price: 1450000 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setBusPrice(preset.price)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      busPrice === preset.price
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {preset.label} ({formatINR(preset.price)})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-5">
            <div>
              <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">
                Estimated Monthly EMI
              </div>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 mt-1">
                {formatINR(emi)}
                <span className="text-xs text-blue-200 font-normal"> / month</span>
              </div>
              <div className="text-xs text-blue-100/70 mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-300" />
                <span>Payable over {totalMonths} monthly installments</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-white/15 text-xs">
              <div className="flex justify-between text-blue-200">
                <span>Principal Loan Amount:</span>
                <span className="font-bold text-white">{formatINR(loanAmount)}</span>
              </div>
              <div className="flex justify-between text-blue-200">
                <span>Total Interest Payable:</span>
                <span className="font-bold text-white">{formatINR(totalInterest)}</span>
              </div>
              <div className="flex justify-between text-blue-200">
                <span>Commercial Interest Benchmark:</span>
                <span className="font-bold text-white">{interestRate}% p.a.</span>
              </div>
              <div className="flex justify-between text-amber-300 font-semibold pt-1 border-t border-white/10">
                <span>Estimated Target Daily Route Profit to cover EMI:</span>
                <span className="font-bold text-white">~{formatINR(estimatedDailyRevenue)} / day</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#enquiry-form"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Finance Assistance Request: Our Odisha transport finance officer will contact you within 2 hours with partner bank quotes.');
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                <span>Check Loan Eligibility for this Vehicle</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <p className="text-[11px] text-center text-blue-200/70 mt-2">
                Fast documentation: RC copy, PAN, Aadhaar, and 6 months bank statement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
