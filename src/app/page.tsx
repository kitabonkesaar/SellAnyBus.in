import React from 'react';
import Link from 'next/link';
import prisma from '@/modules/core/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BusCard } from '@/components/marketplace/BusCard';
import { CategoryIcon } from '@/components/brand/CategoryIcons';
import { BusCategory, PublicationStatus } from '@prisma/client';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  Wrench,
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
} from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'SellAnyBus.in | Verified Used Commercial Buses & Trucks in Odisha',
  description:
    'Buy and sell verified used buses, trucks, and commercial vehicles in Odisha with 14-point mechanical inspection, RTO document checks, and seller-approved pricing across all 30 districts.',
  openGraph: {
    title: 'SellAnyBus.in - Odisha Verified Commercial Bus & Truck Marketplace',
    description: 'Verified AC Sleepers, Route Seaters, School Buses, Cargo Trucks, and Pickups in Odisha.',
    locale: 'en_IN',
    type: 'website',
  },
};

const BUS_CATEGORIES = [
  {
    key: 'AC_SLEEPER',
    name: 'AC Sleeper Coach',
    desc: 'Interstate multi-axle luxury sleepers with 2+1 berths',
    count: '6 Available',
  },
  {
    key: 'SEATER',
    name: 'Express Route Seater',
    desc: '32 to 55 seat stage carriage & express route buses',
    count: '8 Available',
  },
  {
    key: 'SCHOOL_BUS',
    name: 'School & College Bus',
    desc: 'Supreme Court guideline compliant student transit',
    count: '4 Available',
  },
  {
    key: 'STAFF_BUS',
    name: 'Staff & Industrial Bus',
    desc: 'Corporate & worker executive transport buses',
    count: '3 Available',
  },
  {
    key: 'TOURIST_COACH',
    name: 'Luxury Tourist Coach',
    desc: 'Air-suspended coaches with AITP national permits',
    count: '4 Available',
  },
  {
    key: 'MINI_BUS',
    name: 'Mini Bus / Traveller',
    desc: '17 to 26 seater commercial passenger vans',
    count: '5 Available',
  },
];

const TRUCK_CATEGORIES = [
  {
    key: 'TRUCK',
    name: 'Heavy Haulage Trucks',
    desc: 'Multi-axle cargo freight & container haulage trucks',
    count: '2 Available',
  },
  {
    key: 'PICKUP_VAN',
    name: 'Pickups & Mini Trucks',
    desc: 'Commercial 1.2T to 2T pickup vans and mini trucks',
    count: '2 Available',
  },
  {
    key: 'TIPPER',
    name: 'Mining & Heavy Tippers',
    desc: 'Construction dumpers and 16-cum box tippers',
    count: '1 Available',
  },
];

const ODISHA_HUBS = [
  { name: 'All Odisha', value: '' },
  { name: 'Bhubaneswar', value: 'Khordha' },
  { name: 'Cuttack', value: 'Cuttack' },
  { name: 'Puri', value: 'Puri' },
  { name: 'Rourkela', value: 'Sundargarh' },
  { name: 'Sambalpur', value: 'Sambalpur' },
  { name: 'Berhampur', value: 'Ganjam' },
  { name: 'Balasore', value: 'Balasore' },
  { name: 'Jharsuguda', value: 'Jharsuguda' },
];

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
    take: 8,
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION - SIMPLIFIED & MODERN */}
        <section className="relative bg-gradient-to-br from-[#061e47] via-[#0B3C8C] to-[#123977] text-white py-14 lg:py-20 overflow-hidden">
          {/* Subtle geometric pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300 mb-5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Odisha’s Verified Commercial Bus & Truck Marketplace</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
                Buy & Sell Verified Commercial Buses & Trucks in Odisha
              </h1>

              <p className="text-base sm:text-lg text-blue-100/90 mb-8 leading-relaxed max-w-2xl">
                Every vehicle features verified RTO documents, a certified 14-point mechanical report, and transparent seller-approved pricing across all 30 districts.
              </p>

              {/* SEARCH PANEL WITH TABS */}
              <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-2xl text-slate-900 max-w-2xl">
                {/* Vehicle Quick Switcher Tabs */}
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 text-xs font-bold">
                  <Link
                    href="/buses"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#0B3C8C] hover:bg-blue-100 transition-colors"
                  >
                    <Bus className="w-3.5 h-3.5" />
                    <span>Commercial Buses</span>
                  </Link>
                  <Link
                    href="/buses?category=TRUCK"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Trucks & Pickups</span>
                  </Link>
                  <Link
                    href="/sell-your-bus"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 ml-auto transition-colors font-extrabold"
                  >
                    <span>Sell Any Vehicle →</span>
                  </Link>
                </div>

                {/* Search Form */}
                <form action="/buses" method="GET" className="flex flex-col sm:flex-row gap-2.5 items-stretch">
                  <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      name="q"
                      placeholder="Search make, model, category, city..."
                      className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <select
                      name="district"
                      className="bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none min-h-[42px]"
                    >
                      {ODISHA_HUBS.map((hub) => (
                        <option key={hub.name} value={hub.value}>
                          {hub.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 min-h-[42px] whitespace-nowrap"
                    >
                      <span>Find Vehicles</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10 text-left max-w-2xl">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400">100% Verified</div>
                  <div className="text-[11px] text-blue-200 mt-0.5">RTO Documents Validated</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400">14-Point</div>
                  <div className="text-[11px] text-blue-200 mt-0.5">Certified Mechanical Report</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400">30 Districts</div>
                  <div className="text-[11px] text-blue-200 mt-0.5">Odisha Fleet Coverage</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 1. COMMERCIAL BUS CATEGORIES - THEME-STYLED WITH CUSTOM SVG ICONS */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-[#0B3C8C] text-[11px] font-black uppercase tracking-wider mb-2">
                Passenger Transport Fleet
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Commercial Bus Categories
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Browse verified AC sleepers, stage carriage route buses, school transit, and coaches.
              </p>
            </div>
            <Link
              href="/buses"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0B3C8C] hover:text-[#082a63]"
            >
              <span>Explore All Buses</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {BUS_CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={`/buses?category=${cat.key}`}
                className="group p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-[#0B3C8C] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Custom Theme Icon Badge */}
                  <div className="w-13 h-13 rounded-xl bg-blue-50 text-[#0B3C8C] border border-blue-100 group-hover:bg-[#0B3C8C] group-hover:text-amber-400 group-hover:border-[#0B3C8C] flex items-center justify-center transition-all duration-300 mb-4 shadow-xs">
                    <CategoryIcon category={cat.key} className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#0B3C8C] transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#0B3C8C]">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-[#0B3C8C] transition-colors">
                    {cat.count}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B3C8C] group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 2. TRUCKS, PICKUPS & COMMERCIAL CARGO CATEGORIES */}
        <section className="py-12 bg-slate-100/70 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black uppercase tracking-wider mb-2">
                  Freight & Commercial Logistics
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Trucks, Pickups & Heavy Commercials
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Verified heavy cargo freight trucks, mini trucks (Chhota Hathi), pickup vans, and mining tippers.
                </p>
              </div>
              <Link
                href="/buses?category=TRUCK"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0B3C8C] hover:text-[#082a63]"
              >
                <span>View All Commercial Trucks</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {TRUCK_CATEGORIES.map((cat) => (
                <Link
                  key={cat.key}
                  href={`/buses?category=${cat.key}`}
                  className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#0B3C8C] hover:shadow-xl transition-all duration-300 flex items-start gap-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#0B3C8C] border border-amber-200/60 group-hover:bg-[#0B3C8C] group-hover:text-amber-400 group-hover:border-[#0B3C8C] flex items-center justify-center shrink-0 transition-all duration-300 shadow-xs">
                    <CategoryIcon category={cat.key} className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0B3C8C] transition-colors">
                        {cat.name}
                      </h3>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {cat.count}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {cat.desc}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#0B3C8C]">
                      <span>Browse Inventory</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED VERIFIED INVENTORY */}
        {featuredListings.length > 0 && (
          <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Inspected & Certified</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Featured Commercial Inventory
                </h2>
              </div>
              <Link
                href="/buses?sort=newest"
                className="text-xs sm:text-sm font-bold text-[#0B3C8C] hover:underline"
              >
                View Full Inventory →
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

        {/* 14-POINT INSPECTION & TRUST STANDARDS - STREAMLINED */}
        <section className="py-16 bg-[#072458] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                The SellAnyBus Guarantee
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mt-2">
                Certified 14-Point Mechanical Inspection
              </h2>
              <p className="text-sm sm:text-base text-blue-200 mt-3 leading-relaxed">
                Before any commercial bus or truck is published, our qualified field inspectors physically evaluate all critical systems on-site.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 text-center">
              {[
                { label: 'Engine & Turbo', note: 'Compression & blowby check' },
                { label: 'Transmission', note: 'Gear mesh & clutch plate' },
                { label: 'Dual Air Brakes', note: 'ABS & retarder test' },
                { label: 'Chassis Frame', note: 'Ladder weld integrity' },
                { label: 'Radial Tyres', note: 'Tread depth measurement' },
                { label: 'AC & Electrical', note: 'Compressor & alternator' },
                { label: 'RTO Documents', note: 'RC, Permit, Tax & Fitness' },
              ].map((item, idx) => (
                <div
                  key={item.label}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mx-auto mb-2 text-xs">
                    ✓
                  </div>
                  <h4 className="font-bold text-xs text-white">{item.label}</h4>
                  <p className="text-[10px] text-blue-200/80 mt-1">{item.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/inspection-services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition-colors"
              >
                <span>Read Full Inspection Standards</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS - BUYER & SELLER SIMPLIFIED */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">
              Transparent Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              How SellAnyBus Works in Odisha
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Buyers */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#0B3C8C] flex items-center justify-center text-sm">
                    1
                  </span>
                  For Fleet Buyers & Operators
                </h3>
                <span className="text-xs font-bold text-[#0B3C8C] bg-blue-50 px-2.5 py-1 rounded-full">
                  Zero Buyer Commission
                </span>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Explore Verified Inventory:</strong> Filter by seating, sleeper configuration, route category, or Odisha district.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Inspect Genuine Reports:</strong> Review verified RTO status (RC, Fitness, Permit, Tax) and mechanical ratings before visiting.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Direct Viewing & Escrow:</strong> Schedule an on-site physical inspection facilitated directly by our local Odisha advisors.
                  </span>
                </li>
              </ul>
              <div className="pt-4">
                <Link
                  href="/buses"
                  className="inline-flex items-center gap-2 text-xs font-black text-[#0B3C8C] hover:underline"
                >
                  Browse Available Commercial Fleet →
                </Link>
              </div>
            </div>

            {/* For Sellers */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-sm">
                    2
                  </span>
                  For Bus & Truck Owners
                </h3>
                <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full">
                  Guaranteed Fair Value
                </span>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Easy OTP Submission:</strong> Upload your bus or truck registration, specifications, and photos in 5 minutes.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Free On-Site Inspection:</strong> Our authorized Odisha inspectors verify engine, chassis, and RTO paperwork.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>You Approve the Price:</strong> The vehicle is only advertised after you approve the recommended valuation.
                  </span>
                </li>
              </ul>
              <div className="pt-4">
                <Link
                  href="/seller/vehicles/new"
                  className="inline-flex items-center gap-2 text-xs font-black text-amber-800 hover:underline"
                >
                  List Your Commercial Vehicle Free →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS & FAQ ACCORDION */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Testimonials */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">
                  Trusted Across Odisha
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-6">
                  What Fleet Operators Say
                </h2>
                <div className="space-y-4">
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed"
                    >
                      <p className="italic text-slate-800 mb-3">&ldquo;{t.body}&rdquo;</p>
                      <div className="font-bold text-slate-900">{t.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">
                  Got Questions?
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {faqs.map((f) => (
                    <div
                      key={f.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                    >
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{f.title}</h4>
                      <p className="text-slate-600 leading-relaxed">{f.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
