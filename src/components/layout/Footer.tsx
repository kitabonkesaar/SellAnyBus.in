import React from 'react';
import Link from 'next/link';
import { Logo } from '../brand/Logo';
import { Phone, Mail, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-2.5 rounded-lg inline-block">
              <Logo />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              SellAnyBus.in is Odisha&apos;s dedicated verified marketplace for commercial buses and coaches. We bring complete transparency through mandatory RTO document verification, certified 14-point mechanical inspections, and seller-approved market pricing across all 30 districts.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Registered commercial platform • Odisha RTO Compliance Verified</span>
            </div>
            <div className="pt-2 text-xs text-slate-500">
              Disclaimer: SellAnyBus facilitates verified commercial vehicle transactions and provides RTO ownership transfer guidance (Form 29/30). We do not provide final statutory government transfer certifications.
            </div>
          </div>

          {/* Col 3: Bus Categories */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Bus Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/buses?category=AC_SLEEPER" className="hover:text-amber-400 transition-colors">
                  AC Sleeper Coaches
                </Link>
              </li>
              <li>
                <Link href="/buses?category=SEATER" className="hover:text-amber-400 transition-colors">
                  Route Passenger Seaters
                </Link>
              </li>
              <li>
                <Link href="/buses?category=SCHOOL_BUS" className="hover:text-amber-400 transition-colors">
                  School & College Buses
                </Link>
              </li>
              <li>
                <Link href="/buses?category=STAFF_BUS" className="hover:text-amber-400 transition-colors">
                  Corporate Staff Buses
                </Link>
              </li>
              <li>
                <Link href="/buses?category=TOURIST_COACH" className="hover:text-amber-400 transition-colors">
                  Luxury Tourist Coaches
                </Link>
              </li>
              <li>
                <Link href="/buses?category=MINI_BUS" className="hover:text-amber-400 transition-colors">
                  Mini Buses & Travellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Top Odisha Districts */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Odisha Hubs
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/buses/in/Khordha" className="hover:text-amber-400 transition-colors">
                  Buses in Bhubaneswar
                </Link>
              </li>
              <li>
                <Link href="/buses/in/Cuttack" className="hover:text-amber-400 transition-colors">
                  Buses in Cuttack
                </Link>
              </li>
              <li>
                <Link href="/buses/in/Puri" className="hover:text-amber-400 transition-colors">
                  Buses in Puri
                </Link>
              </li>
              <li>
                <Link href="/buses/in/Sambalpur" className="hover:text-amber-400 transition-colors">
                  Buses in Sambalpur
                </Link>
              </li>
              <li>
                <Link href="/buses/in/Sundargarh" className="hover:text-amber-400 transition-colors">
                  Buses in Rourkela
                </Link>
              </li>
              <li>
                <Link href="/buses/in/Ganjam" className="hover:text-amber-400 transition-colors">
                  Buses in Berhampur
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Help & Support */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Help & Grievance
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-slate-400">Toll-Free Helpline</span>
                  <a href="tel:+919876543210" className="text-white font-semibold hover:text-amber-400">
                    +91 98765 43210
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-slate-400">Direct Support</span>
                  <a href="mailto:support@sellanybus.in" className="hover:text-amber-400">
                    support@sellanybus.in
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-400">
                  Infocity Commercial Hub, Patia, Bhubaneswar, Odisha 751024
                </span>
              </li>
              <li className="pt-2">
                <Link href="/grievance" className="text-xs text-amber-400 hover:underline">
                  Grievance Officer Details (DPDP Act)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 SellAnyBus.in. All rights reserved. Managed Commercial Bus Platform for Odisha.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300">
              Terms of Use
            </Link>
            <Link href="/grievance" className="hover:text-slate-300">
              Grievance Redressal
            </Link>
            <Link href="/how-it-works" className="hover:text-slate-300">
              How It Works
            </Link>
            <Link href="/faq" className="hover:text-slate-300">
              FAQs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
