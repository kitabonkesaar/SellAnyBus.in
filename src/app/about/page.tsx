import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, Target, HeartHandshake } from 'lucide-react';

export const metadata = {
  title: 'About SellAnyBus.in | Odisha’s #1 Commercial Bus Marketplace',
  description:
    'Learn about SellAnyBus.in: our mission to organize pre-owned commercial passenger transport in Odisha through certified 14-point mechanical audits, RTO paper clearance, and zero-brokerage trading.',
  keywords: [
    'about sellanybus',
    'commercial bus marketplace odisha',
    'used bus company bhubaneswar',
    'odisha fleet operators platform',
  ],
  alternates: {
    canonical: 'https://sellanybus.in/about',
  },
  openGraph: {
    title: 'About SellAnyBus.in | Odisha’s Managed Commercial Bus Marketplace',
    description: 'Eliminating broker fraud and odometer tampering in Odisha commercial bus trading through engineering inspections and legal title verification.',
    locale: 'en_IN',
    type: 'website',
    url: 'https://sellanybus.in/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">Our Story</span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
              Building India&apos;s Most Trusted Bus Marketplace
            </h1>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              Founded in Odisha, SellAnyBus was created to solve the rampant opacity, inaccurate meter readings, forged RTO certificates, and unverified broker networks in the used bus sector.
            </p>
          </div>

          <div className="space-y-8 text-sm text-slate-700 leading-relaxed bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Our Mission</h2>
              <p>
                To organize the pre-owned commercial passenger vehicle ecosystem in Odisha and across India by establishing standardized document verification, certified mechanical health grading, and fair pricing mechanisms.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Why Odisha First?</h2>
              <p>
                With 30 districts connecting coastal routes, tribal hubs, mining belts, and pilgrim corridors (Puri, Bhubaneswar, Konark), Odisha has one of India&apos;s most active intercity and staff bus networks. Fleet operators require genuine vehicles without travelling across state borders on blind faith.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Our Core Operating Values</h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li><strong>No Uninspected Listings:</strong> No vehicle is ever published without physical verification.</li>
                <li><strong>Strict Privacy:</strong> Seller contact numbers and sensitive identity documents are never published.</li>
                <li><strong>Seller Price Consent:</strong> Pricing is transparent and only finalized upon explicit seller confirmation.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
