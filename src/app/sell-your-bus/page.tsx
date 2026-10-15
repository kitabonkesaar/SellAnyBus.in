import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { QuickValuationTeaser } from '@/components/marketplace/QuickValuationTeaser';
import { FleetConciergeBanner } from '@/components/marketplace/FleetConciergeBanner';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Wrench,
  FileCheck2,
  Clock,
  Sparkles,
  HelpCircle,
  PhoneCall,
  Bus,
} from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sell Your Bus or Coach in Odisha | Free Valuation & Direct Buyers | SellAnyBus.in',
  description:
    'Sell your used commercial bus, school bus, route seater, or AC sleeper in Odisha. 100% fair seller-approved pricing, certified 14-point inspection, and zero spam calls across all 30 districts.',
  keywords: [
    'sell bus in odisha',
    'sell commercial bus odisha',
    'used bus buyers bhubaneswar',
    'sell school bus cuttack',
    'sell ashok leyland bus odisha',
    'sell tata bus odisha',
    'used bus price valuation',
    'commercial bus rto transfer odisha',
    'sell fleet buses',
  ],
  alternates: {
    canonical: 'https://sellanybus.in/sell-your-bus',
  },
  openGraph: {
    title: 'Sell Your Commercial Bus in Odisha | SellAnyBus.in',
    description:
      'Skip lowball brokers. Get certified 14-point inspections, fair seller-approved pricing, and verified fleet buyers across Odisha.',
    locale: 'en_IN',
    type: 'website',
    url: 'https://sellanybus.in/sell-your-bus',
  },
};

export default function SellYourBusPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: 'Used Commercial Bus Resale & Valuation Service',
        provider: {
          '@type': 'AutomotiveBusiness',
          name: 'SellAnyBus.in',
          url: 'https://sellanybus.in',
          telephone: '+919876543210',
          areaServed: {
            '@type': 'State',
            name: 'Odisha',
          },
        },
        serviceType: 'Commercial Vehicle Resale',
        description:
          'Managed commercial bus marketplace providing fair indicative valuations, certified 14-point physical inspections, and mediated buyer matching across Odisha.',
      },
      {
        '@type': 'HowTo',
        name: 'How to Sell a Used Commercial Bus in Odisha',
        description: 'Step-by-step process to list, inspect, price, and sell your commercial bus without broker commission.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Create Free Listing via OTP',
            text: 'Enter your 10-digit mobile number, input the vehicle registration number, category, and upload preliminary photos in under 5 minutes.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Physical 14-Point Mechanical Inspection',
            text: 'Our certified Odisha transport engineer evaluates engine blow-by, turbo condition, full air brake pressure build time, and RTO paper validity.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Review & Approve Asking Price',
            text: 'We recommend a data-backed indicative market valuation range. Your vehicle is only published after you explicitly review and approve the final asking price.',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How much does it cost to list a bus on SellAnyBus.in?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Listing your bus on SellAnyBus is 100% free with zero upfront charges. Inspection scheduling and indicative valuation are provided free for verified Odisha sellers.',
            },
          },
          {
            '@type': 'Question',
            name: 'Who decides the final selling price of my bus?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You do. Unlike typical dealers who force distressed sales, SellAnyBus has a mandatory Hard Rule: no vehicle is published until the seller explicitly reviews and signs off on the asking price.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is my phone number visible to the public or buyers?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. To protect you from spam and fraudulent middlemen under the Indian DPDP Act, your mobile number and identity documents are strictly private. All buyer enquiries are mediated and pre-qualified by our sales team.',
            },
          },
          {
            '@type': 'Question',
            name: 'What documents are required to sell a commercial bus in Odisha?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You will need: Original Registration Certificate (RC), valid Commercial Fitness Certificate, Road Tax Token, Commercial Route or Contract Carriage Permit, active Insurance Policy, and Pollution Certificate (PUCC).',
            },
          },
        ],
      },
    ],
  };

  const sellerFaqs = [
    {
      q: 'How much does it cost to list a bus on SellAnyBus.in?',
      a: 'Listing your bus on SellAnyBus is 100% free with zero upfront fees. Our mobile engineers conduct document verification and indicative valuations at no cost to the seller.',
    },
    {
      q: 'Who decides the final selling price of my bus?',
      a: 'You do. Unlike typical middlemen who undercut your price, SellAnyBus enforces a strict Hard Rule: no vehicle listing is published until the seller explicitly reviews and signs off on the asking price.',
    },
    {
      q: 'Is my phone number or vehicle chassis number shown publicly?',
      a: 'Never. Under our strict DPDP Act compliance policy, your mobile number, Aadhaar, and chassis numbers are never displayed on public pages. All buyer enquiries are mediated and pre-qualified by our sales executives.',
    },
    {
      q: 'How long does it typically take to sell a bus in Odisha?',
      a: 'Verified buses priced within our recommended valuation range typically receive serious buyer viewings within 4 to 10 days. Our network covers all 30 Odisha districts plus inter-state buyers from West Bengal, Jharkhand, and Andhra Pradesh.',
    },
    {
      q: 'Do you help with RTO transfer and NOC clearance?',
      a: 'Yes. Our dedicated operations desk assists with Form 28 (NOC), Form 29 & 30 (Transfer of Ownership), tax token clearance, and State Transport Authority (STA) route permit transfer across all Odisha RTO jurisdictions.',
    },
  ];

  const requiredDocuments = [
    { title: 'Registration Certificate (RC)', desc: 'Valid commercial RC book / Smart Card with clear engine & chassis number.' },
    { title: 'Commercial Fitness Certificate', desc: 'Valid fitness issued by the concerned Odisha Regional Transport Office.' },
    { title: 'Road Tax Token', desc: 'Up-to-date Odisha MV Tax / Passenger Tax payment receipt.' },
    { title: 'Route or Contract Permit', desc: 'Valid Stage Carriage, Contract Carriage, or All India Tourist Permit (AITP).' },
    { title: 'Commercial Insurance Policy', desc: 'Comprehensive or Third Party commercial vehicle insurance coverage.' },
    { title: 'Pollution Certificate (PUCC)', desc: 'Valid PUC emission test certificate from an authorized testing centre.' },
  ];

  const acceptedBrands = [
    'Ashok Leyland',
    'Tata Motors',
    'BharatBenz',
    'Eicher Motors',
    'Volvo Buses',
    'Force Motors (Traveller)',
    'SML Isuzu',
    'Mahindra Commercial',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 space-y-16 lg:space-y-24 pb-20">
        {/* 1. HERO SECTION */}
        <section className="relative bg-gradient-to-br from-[#061e47] via-[#0B3C8C] to-[#123977] text-white pt-16 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300 mb-6 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Odisha’s Premier Commercial Fleet Resale Platform</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-6 text-white">
                Sell Your Commercial Bus Faster at Guaranteed Fair Value
              </h1>

              <p className="text-base sm:text-lg text-blue-100/90 mb-8 leading-relaxed font-normal">
                Skip lowball broker offers and endless spam calls. SellAnyBus connects you directly to verified fleet operators, tour companies, and schools across all 30 districts of Odisha.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/seller/vehicles/new"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 min-h-[48px] active:scale-95"
                >
                  <Bus className="w-4 h-4" />
                  <span>List Your Bus Free (5 Mins)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-colors min-h-[48px] flex items-center justify-center"
                >
                  How Seller Protection Works
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/15 text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">100%</div>
                  <div className="text-xs text-blue-200 mt-0.5">Seller-Approved Price</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">₹0</div>
                  <div className="text-xs text-blue-200 mt-0.5">Listing & Inspection Fee</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">4–10 Days</div>
                  <div className="text-xs text-blue-200 mt-0.5">Avg. Liquidation Time</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">Zero Spam</div>
                  <div className="text-xs text-blue-200 mt-0.5">DPDP Phone Masking</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. INSTANT VALUATION CALCULATOR TEASER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuickValuationTeaser />
        </section>

        {/* 3. 3-STEP SELLING PROCESS */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">
              Transparent & Hassle-Free
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              How Selling on SellAnyBus Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              From mobile OTP draft to final handshake and RTO transfer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0B3C8C] flex items-center justify-center font-black text-lg">
                1
              </div>
              <h3 className="font-black text-lg text-slate-900">1. Fast 5-Min OTP Draft</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Log in with your 10-digit mobile number. Enter basic specs, registration number, upload 6+ photos, and your initial expected asking price.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Autosave draft anytime</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
                2
              </div>
              <h3 className="font-black text-lg text-slate-900">2. Free On-Site Inspection</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our certified Odisha transport engineer evaluates engine health, turbo, air brake build time, suspension, and verifies RTO document validity.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Carried out at your garage/depot</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-lg">
                3
              </div>
              <h3 className="font-black text-lg text-slate-900">3. You Approve the Price</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We review market comparables and recommend an indicative valuation. Your vehicle is only published when you explicitly click approve.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Zero publication without seller consent</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. DOCUMENTS CHECKLIST FOR ODISHA COMMERCIAL VEHICLES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">
                  RTO Compliance Guide
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  Required Documents to Sell a Commercial Bus in Odisha
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Having these papers ready ensures same-day approval and faster buyer closing.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                <FileCheck2 className="w-4 h-4" />
                <span>Our Desk Assists with Form 28/29/30</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {requiredDocuments.map((doc) => (
                <div
                  key={doc.title}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#0B3C8C] shrink-0" />
                    <span>{doc.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">
                    {doc.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. BRANDS WE ACCEPT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl bg-slate-100/80 border border-slate-200 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">
              Commercial OEMs Supported
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 mb-6">
              Buses & Coaches Accepted Across All Major Manufacturers
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-3">
              {acceptedBrands.map((brand) => (
                <span
                  key={brand}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs text-slate-800 shadow-2xs"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 6. BULK FLEET CONCIERGE BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FleetConciergeBanner />
        </section>

        {/* 7. SELLER FAQS */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">
              Seller Queries
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Frequently Asked Questions by Bus Sellers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Everything you need to know about listing, pricing, and completing legal transfer.
            </p>
          </div>

          <div className="space-y-4">
            {sellerFaqs.map((faq) => (
              <div
                key={faq.q}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
              >
                <h4 className="font-bold text-slate-900 text-sm flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-[#0B3C8C] shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. FINAL CTA BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0B3C8C] via-[#082d6b] to-slate-950 text-white rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ready to Sell in Odisha?</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                List Your Bus Today & Connect With Genuine Fleet Buyers
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                Zero listing fees, verified RTO guidance, and full control over your final asking price. Start your draft in 5 minutes with mobile OTP login.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/seller/vehicles/new"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Start Free Vehicle Listing</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:+919876543210"
                  className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-white/20 flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Seller Advisor</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
