import React from 'react';
import Link from 'next/link';
import prisma from '@/modules/core/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BusCard } from '@/components/marketplace/BusCard';
import { HeroSearch } from '@/components/marketplace/HeroSearch';
import { CategoryExplorer } from '@/components/marketplace/CategoryExplorer';
import { InspectionExplorer } from '@/components/marketplace/InspectionExplorer';
import { WhySellAnyBusComparison } from '@/components/marketplace/WhySellAnyBusComparison';
import { QuickValuationTeaser } from '@/components/marketplace/QuickValuationTeaser';
import { PublicationStatus } from '@prisma/client';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  PhoneCall,
  MessageSquare,
  HelpCircle,
  Truck,
  Bus,
  Sparkles,
  MapPin,
  Clock,
  ThumbsUp,
} from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'SellAnyBus.in | Odisha’s #1 Verified Used Commercial Bus & Truck Marketplace',
  description:
    'Buy and sell verified used buses, trucks, and commercial vehicles in Odisha. 14-point mechanical inspection, RTO document checks, and seller-approved pricing across all 30 districts.',
  openGraph: {
    title: 'SellAnyBus.in - Verified Commercial Buses & Trucks in Odisha',
    description: 'Verified AC Sleepers, Route Seaters, School Buses, Cargo Trucks, and Pickups in Odisha.',
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function HomePage() {
  // Fetch featured listings
  const featuredListings = await prisma.listing.findMany({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
      featured: true,
    },
    take: 6,
    orderBy: { publishedAt: 'desc' },
    include: {
      vehicle: {
        include: {
          media: { where: { isPrimary: true }, take: 1 },
        },
      },
    },
  });

  // Fetch recently listed vehicles
  const recentListings = await prisma.listing.findMany({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
    },
    take: 6,
    orderBy: { publishedAt: 'desc' },
    include: {
      vehicle: {
        include: {
          media: { where: { isPrimary: true }, take: 1 },
        },
      },
    },
  });

  // Fetch testimonials & FAQs from ContentItem table sequentially
  const testimonials = await prisma.contentItem.findMany({
    where: { type: 'TESTIMONIAL', active: true },
    orderBy: { order: 'asc' },
    take: 3,
  });
  const faqs = await prisma.contentItem.findMany({
    where: { type: 'FAQ', active: true },
    orderBy: { order: 'asc' },
    take: 5,
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 space-y-16 lg:space-y-24">
        {/* 1. HERO SECTION WITH INTERACTIVE SEARCH */}
        <section className="relative bg-gradient-to-br from-[#061e47] via-[#0B3C8C] to-[#123977] text-white pt-14 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          {/* Glowing ambient light */}
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 -left-20 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl">
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300 mb-6 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Odisha’s Premier Managed Commercial Fleet Marketplace</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-5 text-white">
                Buy & Sell Verified Commercial Buses & Trucks in Odisha
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-blue-100/90 mb-8 leading-relaxed max-w-2xl font-normal">
                Every vehicle comes with verified RTO documents, a certified 14-point physical inspection report, and seller-approved pricing across all 30 districts.
              </p>

              {/* Interactive Hero Search Component */}
              <HeroSearch />

              {/* Trust Indicators Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/15 text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">100%</div>
                  <div className="text-xs text-blue-200 mt-0.5">RTO Verified Papers</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">14-Point</div>
                  <div className="text-xs text-blue-200 mt-0.5">Mechanical Inspection</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">₹0</div>
                  <div className="text-xs text-blue-200 mt-0.5">Buyer Brokerage Fee</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">30</div>
                  <div className="text-xs text-blue-200 mt-0.5">Odisha Districts Covered</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. FLEET CATEGORY EXPLORER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">
              Commercial Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Explore Commercial Inventory by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              From interstate luxury AC sleepers and city route buses to multi-axle freight trucks and delivery pickups.
            </p>
          </div>

          <CategoryExplorer />
        </section>

        {/* 3. FEATURED VERIFIED INVENTORY */}
        {featuredListings.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Inspected & Certified</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Featured Commercial Vehicles
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Ready-to-operate commercial fleet with verified documentation and recent service logs.
                </p>
              </div>

              <Link
                href="/buses"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0"
              >
                <span>Browse All 29 Vehicles</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((item) => (
                <BusCard
                  key={item.id}
                  id={item.id}
                  slug={item.slug}
                  make={item.vehicle.make}
                  model={item.vehicle.model}
                  manufactureYear={item.vehicle.manufactureYear}
                  askingPrice={item.askingPrice}
                  odometerKm={item.vehicle.odometerKm}
                  seatingCapacity={item.vehicle.seatingCapacity}
                  sleeperConfig={item.vehicle.sleeperConfig}
                  fuelType={item.vehicle.fuelType}
                  acType={item.vehicle.acType}
                  district={item.vehicle.district}
                  city={item.vehicle.city}
                  featured={item.featured}
                  primaryImageUrl={
                    item.vehicle.media[0]
                      ? `/uploads/${item.vehicle.media[0].storageKey}`
                      : undefined
                  }
                />
              ))}
            </div>
          </section>
        )}

        {/* 4. INSTANT VEHICLE VALUATION TEASER FOR SELLERS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuickValuationTeaser />
        </section>

        {/* 5. INTERACTIVE 14-POINT INSPECTION EXPLORER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InspectionExplorer />
        </section>

        {/* 6. COMPARISON: WHY SELLANYBUS VS UNORGANIZED CLASSIFIEDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WhySellAnyBusComparison />
        </section>

        {/* 7. HOW IT WORKS - DUAL TRACK (BUYER & SELLER) */}
        <section className="bg-slate-100/80 py-16 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">
                Step-by-Step Transparency
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                How SellAnyBus.in Works
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                A simple, guided experience designed to eliminate friction and eliminate intermediary fraud.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Buyer Steps */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#0B3C8C] flex items-center justify-center font-black text-sm">
                      1
                    </span>
                    <h3 className="font-black text-base text-slate-900">For Fleet Buyers</h3>
                  </div>
                  <span className="text-xs font-bold text-[#0B3C8C] bg-blue-50 px-2.5 py-1 rounded-full">
                    Zero Brokerage
                  </span>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">1. Filter Verified Stock:</strong>
                      Search by category, sleeper/seater configuration, fuel type, or district.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">2. Check Inspection Scores:</strong>
                      Review certified ratings for engine, transmission, air brakes, and chassis.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">3. Guided Viewing & Transfer:</strong>
                      Meet the seller at our designated Odisha inspection hub for viewing and paperwork.
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/buses"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B3C8C] hover:underline"
                  >
                    <span>Browse All Vehicles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Seller Steps */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-sm">
                      2
                    </span>
                    <h3 className="font-black text-base text-slate-900">For Bus & Truck Sellers</h3>
                  </div>
                  <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full">
                    Guaranteed Fair Price
                  </span>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">1. 5-Minute OTP Listing:</strong>
                      Enter registration number and basic specifications via mobile OTP login.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">2. On-Site Inspection:</strong>
                      Our qualified Odisha field engineers evaluate vehicle condition and RTO validity.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">3. You Approve the Price:</strong>
                      Vehicle is only published after you explicitly consent to the recommended valuation.
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/seller/vehicles/new"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:underline"
                  >
                    <span>List Vehicle Free</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. TESTIMONIALS & FAQ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Operator Feedback */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">
                Real Operator Feedback
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-6">
                What Odisha Fleet Owners Say
              </h2>
              <div className="space-y-4">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs sm:text-sm text-slate-700 leading-relaxed"
                  >
                    <div className="flex items-center gap-1 text-amber-400 mb-2">
                      {'★'.repeat(5)}
                    </div>
                    <p className="italic text-slate-800 mb-3">&ldquo;{t.body}&rdquo;</p>
                    <div className="font-bold text-slate-900">{t.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Accordion */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">
                Help & Clarifications
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {faqs.map((f) => (
                  <div
                    key={f.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs text-xs"
                  >
                    <h4 className="font-bold text-slate-900 text-sm mb-1.5">{f.title}</h4>
                    <p className="text-slate-600 leading-relaxed">{f.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between text-xs text-[#0B3C8C]">
                <span>Have a specific RTO permit or vehicle valuation query?</span>
                <Link href="/contact" className="font-bold hover:underline">
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
