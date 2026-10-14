'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { ShieldCheck, Phone, KeyRound, ArrowRight, CheckCircle2, User, Building, MapPin } from 'lucide-react';

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

export default function LoginPage() {
  const [tab, setTab] = useState<'otp' | 'staff'>('otp');

  // OTP State
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [name, setName] = useState('');
  const [isSeller, setIsSeller] = useState(false);
  const [sellerType, setSellerType] = useState('FLEET_OPERATOR');
  const [businessName, setBusinessName] = useState('');
  const [district, setDistrict] = useState('Khordha');
  const [consent, setConsent] = useState(true);

  // Staff State
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to send OTP');
      setOtpSent(true);
      // Auto-fill dev OTP 123456 for convenience
      setOtpCode('123456');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          code: otpCode,
          name: name || undefined,
          sellerType: isSeller ? sellerType : undefined,
          businessName: isSeller ? businessName : undefined,
          district: isSeller ? district : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Verification failed');

      if (data.user?.role === 'SELLER') {
        window.location.href = '/seller';
      } else {
        window.location.href = '/';
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: staffEmail, password: staffPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Staff login failed');

      window.location.href = '/admin';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Staff login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-block bg-white p-3 rounded-2xl shadow-sm mb-4">
          <Logo />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Welcome to SellAnyBus.in
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Odisha&apos;s Verified Commercial Bus Marketplace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-slate-200">
          {/* Tab selector */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6 text-xs font-bold">
            <button
              onClick={() => {
                setTab('otp');
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                tab === 'otp' ? 'bg-white text-[#0B3C8C] shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Mobile OTP Login
            </button>
            <button
              onClick={() => {
                setTab('staff');
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                tab === 'staff' ? 'bg-white text-[#0B3C8C] shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Staff Portal
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {tab === 'otp' ? (
            !otpSent ? (
              /* Step 1: Mobile Input */
              <form onSubmit={handleRequestOtp} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Mobile Number (+91)
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3.5 py-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-700 font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter 10-digit mobile"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-r-xl font-bold text-slate-900 focus:outline-none focus:border-[#0B3C8C]"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Demo OTP is <strong>123456</strong> in development mode.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#0B3C8C] hover:bg-[#082a63] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <Phone className="w-4 h-4" />
                  <span>{loading ? 'Sending OTP...' : 'Send OTP via SMS'}</span>
                </button>
              </form>
            ) : (
              /* Step 2: OTP Verification & Profile Info */
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[#0B3C8C] font-semibold flex items-center justify-between">
                  <span>OTP sent to +91 {phone}</span>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-xs text-blue-700 underline font-bold"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center tracking-widest text-lg font-black px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3C8C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Full Name (If new user)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra Dash"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3C8C]"
                  />
                </div>

                {/* Seller profile toggle */}
                <div className="pt-2 border-t border-slate-200">
                  <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSeller}
                      onChange={(e) => setIsSeller(e.target.checked)}
                      className="rounded text-[#0B3C8C] w-4 h-4"
                    />
                    <span>I want to sell buses / fleet vehicles</span>
                  </label>
                </div>

                {isSeller && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Seller Type</label>
                      <select
                        value={sellerType}
                        onChange={(e) => setSellerType(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      >
                        <option value="INDIVIDUAL_OWNER">Individual Bus Owner</option>
                        <option value="FLEET_OPERATOR">Fleet / Tour Operator</option>
                        <option value="DEALER">Commercial Vehicle Dealer</option>
                        <option value="TOURISM_COMPANY">Tourism / Travel Agency</option>
                        <option value="SCHOOL_INSTITUTION">School / College Trust</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Business Name</label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Kalinga Deluxe Travels"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Operating District</label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      >
                        {ODISHA_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{loading ? 'Verifying...' : 'Verify OTP & Continue'}</span>
                </button>
              </form>
            )
          ) : (
            /* Staff Login Form */
            <form onSubmit={handleStaffLogin} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px]">
                Demo Admin: <strong>admin@sellanybus.in</strong> / <strong>Admin@SellAnyBus2026!</strong>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Staff Email</label>
                <input
                  type="email"
                  required
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="admin@sellanybus.in"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3C8C]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Staff Password</label>
                <input
                  type="password"
                  required
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3C8C]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#0B3C8C] hover:bg-[#082a63] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? 'Authenticating...' : 'Sign In to Staff Console'}</span>
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-[#0B3C8C] font-semibold">
              ← Return to Marketplace Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
